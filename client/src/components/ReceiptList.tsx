import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBag, ChevronRight, Calendar, ReceiptIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Link } from "wouter";

interface Receipt {
  id: number;
  store: string | null;
  totalAmount: string | null;
  date: string;
  createdAt: string;
}

interface ReceiptListProps {
  receipts: Receipt[];
  loading: boolean;
}

export default function ReceiptList({ receipts, loading }: ReceiptListProps) {
  const [filter, setFilter] = useState<string | null>(null);
  
  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  if (receipts.length === 0) {
    return (
      <Card className="text-center py-8">
        <CardContent>
          <div className="flex flex-col items-center justify-center space-y-4">
            <ReceiptIcon className="h-12 w-12 text-muted-foreground/50" />
            <div>
              <h3 className="text-lg font-medium">No receipts found</h3>
              <p className="text-sm text-muted-foreground">
                Upload a receipt to get started
              </p>
            </div>
            <Link href="/">
              <Button variant="outline">
                Upload Receipt
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {receipts.map((receipt) => {
          const date = new Date(receipt.date);
          return (
            <Card key={receipt.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <ShoppingBag className="mr-2 h-5 w-5 text-muted-foreground" />
                    <span>{receipt.store || "Unknown Store"}</span>
                  </div>
                  <Badge variant="outline">
                    Receipt #{receipt.id}
                  </Badge>
                </CardTitle>
                <CardDescription className="flex items-center">
                  <Calendar className="mr-1 h-3 w-3" />
                  {formatDistanceToNow(date, { addSuffix: true })}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {receipt.totalAmount ? (
                  <div className="text-2xl font-bold">{receipt.totalAmount}</div>
                ) : (
                  <div className="text-lg text-muted-foreground">No total amount</div>
                )}
              </CardContent>
              <CardFooter className="bg-muted/50 p-2">
                <Link href={`/receipt/${receipt.id}`}>
                  <Button variant="ghost" size="sm" className="ml-auto flex items-center">
                    View Items
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}