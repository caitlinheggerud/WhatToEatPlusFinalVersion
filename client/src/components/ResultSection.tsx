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
    0;
  
  // Get total value from totalItem
  const totalValue = totalItem ? 
    parseFloat(totalItem.price.replace(/[^\d.-]/g, '')) : 
    0;
  
  // Calculate GST as the difference between total and subtotal, if totalItem exists
  // Otherwise, use provided GST amount or 0
  const calculatedGst = totalItem && totalValue > subtotal
    ? totalValue - subtotal  // Calculate GST as the difference
    : gstAmount || 0;        // Use existing GST or 0
  
  // Calculate total with GST
  const calculatedTotal = subtotal + calculatedGst;
  
  // Display either the total from the receipt or the calculated total
  const displayTotal = totalItem ? totalValue : calculatedTotal;
  
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
            
            {/* Always show GST - calculate from total-subtotal if needed */}
            <div className="flex justify-between items-center mt-2">
              <span className="font-medium text-gray-700">{gstItem ? gstItem.name : "GST"}</span>
              <span className="font-medium text-gray-700">
                {`${currencySymbol}${calculatedGst.toFixed(2)}`}
              </span>
            </div>
            
            <div className="flex justify-between items-center mt-3 pt-2 border-t border-gray-200">
              <span className="font-semibold">Total</span>
              <span className="font-semibold text-lg">
                {`${currencySymbol}${displayTotal.toFixed(2)}`}
              </span>
            </div>
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
