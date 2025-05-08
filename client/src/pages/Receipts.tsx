import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { getReceipts, getReceiptDetails, addReceiptToInventory } from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusIcon, ShoppingBagIcon, ArrowRightIcon, FileTextIcon, TagIcon, CalendarIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";

// Define Receipt type based on API response
interface Receipt {
  id: number;
  store: string | null;
  totalAmount: string | null;
  date: string; // Will be converted to Date object
  items?: Array<{
    id: number;
    name: string;
    description: string | null;
    price: string;
    category: string | null;
  }>;
}

export default function Receipts() {
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(null);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [addingToInventory, setAddingToInventory] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchReceipts() {
      try {
        setLoading(true);
        const data = await getReceipts();
        
        // Convert date strings to Date objects
        const formattedReceipts = data.map((receipt: any) => ({
          ...receipt,
          date: new Date(receipt.date)
        }));
        
        setReceipts(formattedReceipts);
      } catch (err) {
        console.error("Error fetching receipts:", err);
        toast({
          title: "Error",
          description: "Failed to load receipts",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }

    fetchReceipts();
  }, [toast]);

  async function handleViewReceipt(id: number) {
    try {
      setDetailLoading(true);
      const data = await getReceiptDetails(id);
      
      // Convert date string to Date object
      const receipt = {
        ...data,
        date: new Date(data.date)
      };
      
      setSelectedReceipt(receipt);
    } catch (err) {
      console.error("Error fetching receipt details:", err);
      toast({
        title: "Error",
        description: "Failed to load receipt details",
        variant: "destructive",
      });
    } finally {
      setDetailLoading(false);
    }
  }

  async function handleAddToInventory(id: number) {
    try {
      setAddingToInventory(true);
      await addReceiptToInventory(id);
      
      toast({
        title: "Success",
        description: "Items added to inventory",
        variant: "default",
      });
    } catch (err) {
      console.error("Error adding to inventory:", err);
      toast({
        title: "Error",
        description: "Failed to add items to inventory",
        variant: "destructive",
      });
    } finally {
      setAddingToInventory(false);
    }
  }

  return (
    <div className="py-6 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gradient">Receipts</h1>
          <p className="text-muted-foreground mt-1">
            Browse and manage your shopping receipts
          </p>
        </div>
        <Button className="bg-gradient">
          <PlusIcon className="mr-2 h-4 w-4" />
          Upload Receipt
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Card className="hover-card bg-white/70 shadow-sm border-border/60">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <span className="text-primary mr-2">•</span> Receipt History
              </CardTitle>
              <CardDescription>
                Browse your recent receipts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                </div>
              ) : receipts.length > 0 ? (
                <div className="space-y-3">
                  {receipts.map((receipt) => (
                    <div 
                      key={receipt.id} 
                      className={`p-4 rounded-lg border border-border/60 hover:shadow-sm cursor-pointer transition-all ${selectedReceipt?.id === receipt.id ? 'border-primary/40 bg-primary/5' : 'bg-white'}`}
                      onClick={() => handleViewReceipt(receipt.id)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center">
                          <div className="bg-primary/10 p-2 rounded-md mr-3">
                            <ShoppingBagIcon className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-medium">{receipt.store || "Unknown Store"}</h3>
                            <div className="flex items-center text-xs text-muted-foreground mt-1">
                              <CalendarIcon className="h-3 w-3 mr-1" />
                              {format(new Date(receipt.date), 'MMM d, yyyy')}
                            </div>
                          </div>
                        </div>
                        {receipt.totalAmount && (
                          <Badge variant="outline" className="bg-white">
                            {receipt.totalAmount}
                          </Badge>
                        )}
                      </div>
                      <div className="flex justify-end mt-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewReceipt(receipt.id);
                          }}
                        >
                          <FileTextIcon className="h-4 w-4 mr-1" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <ShoppingBagIcon className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
                  <h3 className="text-lg font-medium">No receipts yet</h3>
                  <p className="text-muted-foreground text-sm mt-1 mb-4">
                    Upload your first shopping receipt to get started
                  </p>
                  <Button className="bg-gradient">
                    <PlusIcon className="mr-2 h-4 w-4" />
                    Upload Receipt
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card className="hover-card bg-white/70 shadow-sm border-border/60 h-full">
            {selectedReceipt ? (
              <>
                <CardHeader className="pb-3 border-b">
                  <div className="flex justify-between">
                    <div>
                      <CardTitle className="text-lg flex items-center">
                        <span className="text-primary mr-2">•</span> Receipt Details
                      </CardTitle>
                      <CardDescription>
                        {selectedReceipt.store || "Unknown Store"} • {format(new Date(selectedReceipt.date), 'MMMM d, yyyy')}
                      </CardDescription>
                    </div>
                    <Button 
                      className="bg-gradient"
                      onClick={() => handleAddToInventory(selectedReceipt.id)}
                      disabled={addingToInventory}
                    >
                      {addingToInventory ? (
                        <div className="flex items-center">
                          <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                          Adding...
                        </div>
                      ) : (
                        <>
                          <ArrowRightIcon className="mr-2 h-4 w-4" />
                          Add to Inventory
                        </>
                      )}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-5">
                  {detailLoading ? (
                    <div className="flex justify-center py-12">
                      <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                    </div>
                  ) : selectedReceipt.items && selectedReceipt.items.length > 0 ? (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center pb-2 border-b">
                        <h3 className="font-medium text-sm text-muted-foreground">RECEIPT ITEMS</h3>
                        {selectedReceipt.totalAmount && (
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">Total Amount</p>
                            <p className="text-lg font-bold">{selectedReceipt.totalAmount}</p>
                          </div>
                        )}
                      </div>
                      
                      <div className="rounded-md border border-border/60 overflow-hidden bg-white shadow-sm">
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b bg-muted/20">
                                <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground">Item</th>
                                <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground">Category</th>
                                <th className="h-10 px-4 text-right align-middle font-medium text-muted-foreground">Price</th>
                              </tr>
                            </thead>
                            <tbody>
                              {selectedReceipt.items.map((item) => {
                                const categoryColor = 
                                  item.category === "Food" ? "#10b981" : 
                                  item.category === "Household" ? "#3b82f6" : "#a855f7";
                                  
                                return (
                                  <tr 
                                    key={item.id} 
                                    className="border-b transition-colors hover:bg-muted/10"
                                  >
                                    <td className="p-4 align-middle">{item.name}</td>
                                    <td className="p-4 align-middle">
                                      {item.category ? (
                                        <Badge 
                                          variant="outline" 
                                          className="bg-white font-normal"
                                          style={{ borderColor: categoryColor, color: categoryColor }}
                                        >
                                          {item.category}
                                        </Badge>
                                      ) : (
                                        <span className="text-muted-foreground text-sm">-</span>
                                      )}
                                    </td>
                                    <td className="p-4 align-middle text-right font-medium">{item.price}</td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <TagIcon className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                      <h3 className="text-lg font-medium">No items found</h3>
                      <p className="text-muted-foreground text-sm mt-1">
                        This receipt doesn't have any items
                      </p>
                    </div>
                  )}
                </CardContent>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full py-16">
                <FileTextIcon className="h-16 w-16 text-muted-foreground/20 mb-4" />
                <h3 className="text-xl font-medium mb-2">Select a Receipt</h3>
                <p className="text-muted-foreground text-center max-w-md mb-6">
                  Choose a receipt from the list to view its details and manage its items
                </p>
                <Button variant="outline" className="bg-white" onClick={() => receipts.length > 0 && handleViewReceipt(receipts[0].id)}>
                  <FileTextIcon className="mr-2 h-4 w-4" />
                  {receipts.length > 0 ? "View Latest Receipt" : "No Receipts Available"}
                </Button>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}