import { useState, useEffect } from "react";
import { useRoute } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { getReceiptWithItems } from "@/lib/api";
import { type ReceiptWithItems } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, AlertCircle, Calendar, Store, Receipt } from "lucide-react";
import { Link } from "wouter";
import { formatDate } from "date-fns";
import { DashboardLayout } from "@/components/layout/Dashboard";

export default function ReceiptDetail() {
  const [match, params] = useRoute<{ id: string }>("/receipt/:id");
  const [receipt, setReceipt] = useState<ReceiptWithItems | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    async function fetchReceiptDetail() {
      if (!params || !params.id) {
        setError("Missing receipt ID");
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const id = parseInt(params.id);
        const data = await getReceiptWithItems(id);
        setReceipt(data);
      } catch (err) {
        console.error("Error fetching receipt details:", err);
        setError("Failed to load receipt details");
        toast({
          title: "Error",
          description: "Failed to load receipt details",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
    
    fetchReceiptDetail();
  }, [params, toast]);
  
  return (
    <DashboardLayout>
      <div className="container py-6 space-y-6">
        <div className="flex items-center mb-6">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="mr-2">
              <ChevronLeft className="mr-1 h-4 w-4" />
              Back to Receipts
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Receipt Detail</h1>
        </div>
        
        {loading ? (
          <div className="flex justify-center p-8">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : error ? (
          <div className="text-center p-8">
            <div className="flex flex-col items-center justify-center space-y-4">
              <AlertCircle className="h-12 w-12 text-destructive" />
              <div>
                <h3 className="text-lg font-medium">{error}</h3>
                <p className="text-sm text-muted-foreground">
                  There was an error loading the receipt details
                </p>
              </div>
              <Button variant="outline" onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          </div>
        ) : receipt ? (
          <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-1 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Receipt Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Store className="mr-2 h-4 w-4" />
                      <span>Store:</span>
                    </div>
                    <div className="font-medium">
                      {receipt.store || "Unknown Store"}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="mr-2 h-4 w-4" />
                      <span>Date:</span>
                    </div>
                    <div className="font-medium">
                      {formatDate(new Date(receipt.date), "PPP")}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Receipt className="mr-2 h-4 w-4" />
                      <span>Total Amount:</span>
                    </div>
                    <div className="text-2xl font-bold">
                      {receipt.totalAmount || "n/a"}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Items</CardTitle>
                </CardHeader>
                <CardContent>
                  {receipt.items.length > 0 ? (
                    <div className="space-y-2">
                      <div className="rounded-md border">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b bg-muted/50">
                              <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground">Name</th>
                              <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground">Category</th>
                              <th className="h-10 px-4 text-right align-middle font-medium text-muted-foreground">Price</th>
                            </tr>
                          </thead>
                          <tbody>
                            {receipt.items.map((item, index) => (
                              <tr key={index} className="border-b transition-colors hover:bg-muted/50">
                                <td className="p-4 align-middle">{item.name}</td>
                                <td className="p-4 align-middle">
                                  {item.category && (
                                    <Badge variant="outline">{item.category}</Badge>
                                  )}
                                </td>
                                <td className="p-4 align-middle text-right font-medium">{item.price}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No items found for this receipt</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <div className="text-center p-8">
            <p className="text-muted-foreground">Receipt not found</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}