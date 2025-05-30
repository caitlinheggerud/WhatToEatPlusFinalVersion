import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { type ReceiptItemResponse } from "@shared/schema";
import { ShoppingBasket } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ResultSectionProps {
  items: ReceiptItemResponse[];
  onNewUpload: () => void;
  onSaveResults: () => void;
  onAddToInventory?: () => void;
}

export default function ResultSection({ 
  items, 
  onNewUpload,
  onSaveResults,
  onAddToInventory
}: ResultSectionProps) {
  // Format currency for display with the same symbol as in the first item
  const currencySymbol = items.length > 0 ? 
    items[0].price.replace(/[\d.-]/g, '').trim() || '$' : 
    '$';
    
  // Filter out GST and TOTAL entries for separate display
  const regularItems = items.filter(item => 
    item.category !== 'Tax' && item.category !== 'Total' && 
    !['GST', 'TAX', 'TOTAL', 'AMOUNT', 'PAYMENT'].includes(item.name.toUpperCase())
  );
  
  // Find GST and Total entries
  const gstItem = items.find(item => 
    item.category === 'Tax' || 
    ['GST', 'TAX', 'VAT'].includes(item.name.toUpperCase())
  );
  
  const totalItem = items.find(item => 
    item.category === 'Total' || 
    ['TOTAL', 'AMOUNT', 'PAYMENT'].includes(item.name.toUpperCase())
  );
  
  // Calculate subtotal of regular items
  const subtotal = regularItems.reduce((sum, item) => {
    const priceValue = parseFloat(item.price.replace(/[^\d.-]/g, ''));
    return sum + (isNaN(priceValue) ? 0 : priceValue);
  }, 0);
  
  // Get GST amount if present
  const gstAmount = gstItem ? 
    parseFloat(gstItem.price.replace(/[^\d.-]/g, '')) : 
    null;
  
  // Get total from totalItem or just show subtotal if no GST
  const displayTotal = totalItem ? 
    parseFloat(totalItem.price.replace(/[^\d.-]/g, '')) : 
    subtotal;
  
  return (
    <div>
      <Card className="shadow-sm border border-gray-200 overflow-hidden">
        <CardHeader className="px-4 py-3 bg-gray-50 border-b border-gray-200">
          <h2 className="font-semibold text-gray-800">Results</h2>
        </CardHeader>
        
        <CardContent className="p-0">
          <div className="divide-y divide-gray-200">
            {regularItems.map((item, index) => (
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
          <div className="w-full">
            <div className="flex justify-between items-center">
              <span className="font-medium">Subtotal</span>
              <span className="font-medium">
                {`${currencySymbol}${subtotal.toFixed(2)}`}
              </span>
            </div>
            
            {/* Show GST only if found in receipt */}
            {gstItem && gstAmount && (
              <div className="flex justify-between items-center mt-2">
                <span className="font-medium text-gray-700">{gstItem.name}</span>
                <span className="font-medium text-gray-700">
                  {`${currencySymbol}${gstAmount.toFixed(2)}`}
                </span>
              </div>
            )}
            
            <div className="flex justify-between items-center mt-3 pt-2 border-t border-gray-200">
              <span className="font-semibold">Total</span>
              <span className="font-semibold text-lg">
                {`${currencySymbol}${displayTotal.toFixed(2)}`}
              </span>
            </div>
          </div>
        </CardFooter>
      </Card>
      
      <div className="mt-6 flex flex-wrap space-x-3 justify-center">
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
        {onAddToInventory && (
          <Button 
            variant="outline"
            className="bg-green-50 border-green-300 text-green-700 hover:bg-green-100 mt-3 sm:mt-0"
            onClick={() => {
              onAddToInventory();
              toast({
                title: "Added to inventory",
                description: "Food items from this receipt have been added to your inventory",
              });
            }}
          >
            <ShoppingBasket className="mr-2 h-4 w-4" />
            Add to Inventory
          </Button>
        )}
      </div>
    </div>
  );
}
