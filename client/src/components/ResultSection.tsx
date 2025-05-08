import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { type ReceiptItemResponse } from "@shared/schema";

interface ResultSectionProps {
  items: ReceiptItemResponse[];
  onNewUpload: () => void;
  onSaveResults: () => void;
}

export default function ResultSection({ 
  items, 
  onNewUpload,
  onSaveResults
}: ResultSectionProps) {
  // Calculate total
  const total = items.reduce((sum, item) => {
    const priceValue = parseFloat(item.price.replace(/[^\d.-]/g, ''));
    return sum + (isNaN(priceValue) ? 0 : priceValue);
  }, 0);
  
  // Format currency for display with the same symbol as in the first item
  const currencySymbol = items.length > 0 ? 
    items[0].price.replace(/[\d.-]/g, '').trim() || '¥' : 
    '¥';
  
  return (
    <div>
      <Card className="shadow-sm border border-gray-200 overflow-hidden">
        <CardHeader className="px-4 py-3 bg-gray-50 border-b border-gray-200">
          <h2 className="font-semibold text-gray-800">Results</h2>
        </CardHeader>
        
        <CardContent className="p-0">
          <div className="divide-y divide-gray-200">
            {items.map((item, index) => (
              <div key={index} className="p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-800">{item.name}</h3>
                    {item.description && (
                      <p className="text-sm text-gray-500">{item.description}</p>
                    )}
                    {item.category && (
                      <p className="text-xs px-2 py-1 mt-1 inline-block rounded-full bg-indigo-50 text-indigo-700">{item.category}</p>
                    )}
                  </div>
                  <div className="font-medium text-gray-900">{item.price}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        
        <CardFooter className="p-4 bg-gray-50 border-t border-gray-200">
          <div className="flex justify-between items-center w-full">
            <span className="font-medium">Total</span>
            <span className="font-semibold text-lg">
              {`${currencySymbol}${total.toFixed(2)}`}
            </span>
          </div>
        </CardFooter>
      </Card>
      
      <div className="mt-6 flex space-x-3 justify-center">
        <Button 
          variant="outline" 
          className="border-gray-300 text-gray-700" 
          onClick={onNewUpload}
        >
          Upload New
        </Button>
        <Button 
          className="bg-primary hover:bg-indigo-700"
          onClick={onSaveResults}
        >
          Save Results
        </Button>
      </div>
    </div>
  );
}
