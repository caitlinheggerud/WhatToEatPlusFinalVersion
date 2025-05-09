import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { getReceipts, getReceiptItems, getInventoryItems } from "@/lib/api";
import { useLocation } from "wouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DownloadIcon, PieChartIcon, BarChartIcon, CalendarIcon, FilterIcon, UploadIcon, ReceiptIcon, XIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { type ReceiptItemResponse } from "@shared/schema";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import InventoryValueChart from '@/components/InventoryValueChart';
import InventoryBarChart from '@/components/InventoryBarChart';
import { format, parseISO, isAfter, isBefore, isValid, startOfDay } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";

// Extended interfaces for our component
interface ReceiptData {
  id: number;
  store: string | null;
  totalAmount: string | null;
  date: string | Date;
  createdAt: string | Date;
}

interface ExtendedReceiptItem extends ReceiptItemResponse {
  receiptId?: number;
}

export default function Dashboard() {
  const [receipts, setReceipts] = useState<ExtendedReceiptItem[]>([]);
  const [allReceipts, setAllReceipts] = useState<ExtendedReceiptItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [isDateFilterActive, setIsDateFilterActive] = useState(false);
  const [isDatePopoverOpen, setIsDatePopoverOpen] = useState(false);
  const { toast } = useToast();

  // Store receipt data with dates
  const [receiptData, setReceiptData] = useState<ReceiptData[]>([]);
  
  // Store inventory data for inventory-based spending tracking
  const [inventoryItems, setInventoryItems] = useState<any[]>([]);
  
  // Apply date filters
  useEffect(() => {
    if (!isDateFilterActive || (!startDate && !endDate)) {
      setReceipts(allReceipts);
      return;
    }

    // First filter receipts by date
    const filteredReceiptIds = receiptData
      .filter(receipt => {
        try {
          // Parse the receipt date - ensure it's a valid date
          let receiptDate;
          
          if (typeof receipt.date === 'string') {
            // Handle various date string formats
            receiptDate = parseISO(receipt.date);
            if (!isValid(receiptDate)) {
              // Try alternative format if needed
              receiptDate = new Date(receipt.date);
            }
          } else {
            receiptDate = new Date(receipt.date);
          }
          
          // Skip invalid dates
          if (!isValid(receiptDate)) {
            console.warn(`Invalid date for receipt ${receipt.id}:`, receipt.date);
            return false;
          }
          
          // Apply start date filter if it exists
          if (startDate) {
            const start = new Date(startDate);
            start.setHours(0, 0, 0, 0); // Set to start of day
            if (isBefore(receiptDate, start)) {
              return false;
            }
          }
          
          // Apply end date filter if it exists
          if (endDate) {
            // Set time to end of day
            const endOfDay = new Date(endDate);
            endOfDay.setHours(23, 59, 59, 999);
            
            if (isAfter(receiptDate, endOfDay)) {
              return false;
            }
          }
          
          return true;
        } catch (error) {
          console.error(`Date filtering error for receipt ${receipt.id}:`, error);
          return false;
        }
      })
      .map(receipt => receipt.id);
    
    // Debug info if filtering isn't working as expected
    if (filteredReceiptIds.length === 0) {
      console.log("No receipts matched the date filter", {
        startDate: startDate?.toISOString(),
        endDate: endDate?.toISOString(),
        receipts: receiptData.map(r => ({
          id: r.id,
          date: r.date,
          type: typeof r.date
        }))
      });
    } else {
      console.log(`Found ${filteredReceiptIds.length} receipts matching date range:`, filteredReceiptIds);
    }
    
    // Then filter receipt items based on the filtered receipt IDs
    const filtered = allReceipts.filter(item => {
      return item.receiptId !== undefined && filteredReceiptIds.includes(item.receiptId);
    });
    
    setReceipts(filtered);
  }, [allReceipts, receiptData, startDate, endDate, isDateFilterActive]);

  // Handle applying date filter
  const applyDateFilter = () => {
    if (!startDate && !endDate) {
      toast({
        title: "Error",
        description: "Please select at least one date for filtering",
        variant: "destructive",
      });
      return;
    }
    
    setIsDateFilterActive(true);
    setIsDatePopoverOpen(false);
    
    toast({
      title: "Date Filter Applied",
      description: `Showing items from ${startDate ? format(startDate, 'PP') : 'the beginning'} to ${endDate ? format(endDate, 'PP') : 'today'}`,
    });
  };
  
  // Handle clearing date filter
  const clearDateFilter = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    setIsDateFilterActive(false);
    setIsDatePopoverOpen(false);
    
    toast({
      title: "Date Filter Cleared",
      description: "Showing all items",
    });
  };

  useEffect(() => {
    async function fetchReceipts() {
      try {
        setLoading(true);
        
        // Get all receipt headers
        const receipts = await getReceipts();
        setReceiptData(receipts || []);
        
        // Get all receipt items directly (simpler approach)
        try {
          // Get all receipt items at once
          const allItems = await getReceiptItems();
          
          if (Array.isArray(allItems) && allItems.length > 0) {
            // Process the items to ensure they have receipt IDs
            const processedItems = await Promise.all(
              allItems.map(async (item) => {
                // If item doesn't have a receiptId, try to find it in receipts
                if (!item.receiptId && item.id) {
                  // Find the receipt that might contain this item
                  const matchingReceipt = receipts.find((receipt: any) => 
                    receipt.items && Array.isArray(receipt.items) && 
                    receipt.items.some((receiptItem: any) => receiptItem.id === item.id)
                  );
                  
                  if (matchingReceipt) {
                    return {
                      ...item,
                      receiptId: matchingReceipt.id
                    };
                  }
                }
                return item;
              })
            );
            
            setAllReceipts(processedItems);
            setReceipts(processedItems);
          } else {
            console.log("No receipt items found");
            setAllReceipts([]);
            setReceipts([]);
          }
        } catch (itemsError) {
          console.error("Error fetching receipt items:", itemsError);
          setAllReceipts([]);
          setReceipts([]);
        }
        
        // Fetch inventory items for inventory-based spending tracking
        try {
          const inventoryData = await getInventoryItems();
          if (Array.isArray(inventoryData) && inventoryData.length > 0) {
            setInventoryItems(inventoryData);
            console.log("Loaded inventory items:", inventoryData.length);
          } else {
            console.log("No inventory items found");
            setInventoryItems([]);
          }
        } catch (inventoryError) {
          console.error("Error fetching inventory items:", inventoryError);
          setInventoryItems([]);
        }
      } catch (err) {
        console.error("Error fetching receipts:", err);
        toast({
          title: "Error",
          description: "Failed to load receipt history",
          variant: "destructive",
        });
        setReceiptData([]);
        setAllReceipts([]);
        setReceipts([]);
      } finally {
        setLoading(false);
      }
    }

    fetchReceipts();
  }, [toast]);

  // Get unique categories from both receipts and inventory
  const receiptCategories = Array.from(new Set(receipts.map(item => item.category)));
  const inventoryCategories = Array.from(new Set(inventoryItems.map(item => item.category)));
  const categories = Array.from(new Set([...receiptCategories, ...inventoryCategories]));
  
  // Filter receipts by category if a category is selected
  const filteredReceipts = activeCategory 
    ? receipts.filter(item => item.category === activeCategory)
    : receipts;

  // Calculate total by category from receipts
  const categoryTotals = categories.reduce((acc, category) => {
    if (category && category !== 'All') { // Make sure category is not undefined and not 'All'
      const total = receipts
        .filter(item => item.category === category)
        .reduce((sum, item) => {
          const price = parseFloat(item.price.replace(/[^0-9.-]+/g, ""));
          return sum + (isNaN(price) ? 0 : price);
        }, 0);
      
      acc[category] = total.toFixed(2);
    }
    return acc;
  }, {
    // Initialize all standard categories with zero
    "Produce": "0.00",
    "Meat": "0.00",
    "Seafood": "0.00",
    "Dairy": "0.00",
    "Bakery": "0.00",
    "Pantry": "0.00",
    "Frozen": "0.00",
    "Beverages": "0.00",
    "Snacks": "0.00",
    "Other": "0.00"
  } as Record<string, string>);

  // Calculate total by category from inventory
  const inventoryCategoryTotals = categories.reduce((acc, category) => {
    if (category && category !== 'All') {
      const total = inventoryItems
        .filter(item => item.category === category)
        .reduce((sum, item) => {
          // Handle various forms of price data
          let price = 0;
          if (item.price) {
            // If price is a string like "$10.99"
            if (typeof item.price === 'string') {
              price = parseFloat(item.price.replace(/[^0-9.-]+/g, ""));
            } 
            // If price is already a number
            else if (typeof item.price === 'number') {
              price = item.price;
            }
          }
          return sum + (isNaN(price) ? 0 : price);
        }, 0);
      
      acc[category] = total.toFixed(2);
    }
    return acc;
  }, {
    // Initialize all standard categories with zero
    "Produce": "0.00",
    "Meat": "0.00",
    "Seafood": "0.00",
    "Dairy": "0.00",
    "Bakery": "0.00",
    "Pantry": "0.00",
    "Frozen": "0.00",
    "Beverages": "0.00",
    "Snacks": "0.00",
    "Other": "0.00"
  } as Record<string, string>);

  // Calculate grand total from receipts
  const grandTotal = receipts.reduce((sum, item) => {
    const price = parseFloat(item.price.replace(/[^0-9.-]+/g, ""));
    return sum + (isNaN(price) ? 0 : price);
  }, 0).toFixed(2);
  
  // Calculate grand total from inventory
  const inventoryGrandTotal = inventoryItems.reduce((sum, item) => {
    let price = 0;
    if (item.price) {
      if (typeof item.price === 'string') {
        price = parseFloat(item.price.replace(/[^0-9.-]+/g, ""));
      } else if (typeof item.price === 'number') {
        price = item.price;
      }
    }
    return sum + (isNaN(price) ? 0 : price);
  }, 0).toFixed(2);

  const handleCategoryClick = (category: string | undefined) => {
    if (category) {
      setActiveCategory(activeCategory === category ? null : category);
    }
  };

  // Simply navigate to home page for upload functionality

  // Import location hook
  const [, navigate] = useLocation();
  
  // Function to navigate to the upload page
  const navigateToUpload = () => {
    navigate('/upload');
  };
  
  return (
      <div className="py-6 space-y-8 container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gradient">Spending Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Track, analyze, and optimize your grocery spending
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Popover open={isDatePopoverOpen} onOpenChange={setIsDatePopoverOpen}>
              <PopoverTrigger asChild>
                <Button 
                  variant={isDateFilterActive ? "default" : "outline"} 
                  size="sm" 
                  className={isDateFilterActive 
                    ? "bg-primary hover:bg-primary/90 transition-colors" 
                    : "bg-white hover:bg-white/80 transition-colors"}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {isDateFilterActive 
                    ? `${startDate ? format(startDate, 'MM/dd/yy') : ''} - ${endDate ? format(endDate, 'MM/dd/yy') : ''}` 
                    : "Date Range"}
                  {isDateFilterActive && (
                    <XIcon 
                      className="ml-2 h-3 w-3 hover:text-destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        clearDateFilter();
                      }}
                    />
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-4" align="end">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold">Date Range</h4>
                    <p className="text-sm text-muted-foreground">
                      Select a date range to filter your receipts.
                    </p>
                  </div>
                  <div className="grid gap-2">
                    <div className="grid gap-1">
                      <Label htmlFor="startDate">Start Date</Label>
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                        className="border rounded-md p-3"
                      />
                    </div>
                    <div className="grid gap-1">
                      <Label htmlFor="endDate">End Date</Label>
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                        className="border rounded-md p-3"
                      />
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearDateFilter}
                    >
                      Clear
                    </Button>
                    <Button
                      size="sm"
                      className="bg-gradient"
                      onClick={applyDateFilter}
                    >
                      Apply Filter
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            <Button 
              variant="outline" 
              size="sm" 
              className="bg-white hover:bg-white/80 transition-colors"
              onClick={() => {
                toast({
                  title: "Filter",
                  description: "Additional filtering options will be available in a future update.",
                  duration: 3000,
                });
              }}
            >
              <FilterIcon className="mr-2 h-4 w-4 text-primary" />
              Filter
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="bg-white hover:bg-white/80 transition-colors"
              onClick={() => {
                // Simple CSV export functionality
                if (receipts.length === 0) {
                  toast({
                    title: "No Data",
                    description: "There are no items to export.",
                    variant: "destructive",
                    duration: 3000,
                  });
                  return;
                }
                
                // Create CSV content
                const headers = ["Name", "Category", "Price"];
                const csvRows = [
                  headers.join(","),
                  ...receipts.map(item => 
                    [
                      `"${item.name.replace(/"/g, '""')}"`, 
                      `"${item.category || 'Other'}"`, 
                      `"${item.price}"`
                    ].join(",")
                  )
                ];
                const csvContent = csvRows.join("\n");
                
                // Create download link
                const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.setAttribute('href', url);
                link.setAttribute('download', 'receipt_items.csv');
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                
                toast({
                  title: "Export Successful",
                  description: "Your receipt items have been exported to CSV.",
                  duration: 3000,
                });
              }}
            >
              <DownloadIcon className="mr-2 h-4 w-4 text-primary" />
              Export
            </Button>
          </div>
        </div>
        
        {/* Centered Upload Button - Always show this for the dashboard */}
        {receipts.length === 0 && !loading && (
          <div className="bg-white/70 shadow-sm border border-border/60 rounded-lg overflow-hidden my-6">
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <div className="text-center max-w-md mx-auto mb-8">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 mb-5">
                  <ReceiptIcon className="h-10 w-10 text-primary" />
                </div>
                <h2 className="text-2xl font-bold mb-3 text-gradient">Upload Your Receipt</h2>
                <p className="text-muted-foreground">
                  Upload a receipt image to track your grocery expenses and get personalized recipe suggestions based on your purchases.
                </p>
              </div>
              
              <Button 
                size="lg" 
                className="bg-gradient hover:shadow-lg transition-all h-14 px-8 text-base"
                onClick={navigateToUpload}
              >
                <UploadIcon className="mr-2 h-5 w-5" />
                Upload Receipt
              </Button>
              
              <div className="mt-4 text-sm text-muted-foreground">
                Supports JPG, PNG, PDF, and HEIC files
              </div>
            </div>
          </div>
        )}
        


        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          <Card className="hover-card overflow-hidden border-border/60 shadow-sm">
            <div className="absolute top-0 h-1 w-full bg-gradient opacity-70"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Receipt Spending</CardTitle>
              <div className="rounded-full bg-primary/10 p-1.5">
                <PieChartIcon className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">${grandTotal}</div>
              <p className="text-sm text-muted-foreground flex items-center mt-1">
                <span className="inline-block w-2 h-2 rounded-full bg-primary mr-2"></span>
                From {receipts.length} items
              </p>
            </CardContent>
          </Card>
          
          <Card className="hover-card overflow-hidden border-border/60 shadow-sm">
            <div className="absolute top-0 h-1 w-full bg-gradient opacity-70"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Inventory Value</CardTitle>
              <div className="rounded-full bg-primary/10 p-1.5">
                <PieChartIcon className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">${inventoryGrandTotal}</div>
              <p className="text-sm text-muted-foreground flex items-center mt-1">
                <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                From {inventoryItems.length} inventory items
              </p>
            </CardContent>
          </Card>
          
          {["Produce", "Meat", "Seafood", "Dairy", "Bakery", "Pantry", "Other"].map(category => {
            const categoryColor = 
              category === "Produce" ? "#10b981" : 
              category === "Meat" ? "#ef4444" : 
              category === "Seafood" ? "#3b82f6" : 
              category === "Dairy" ? "#f59e0b" : 
              category === "Bakery" ? "#8b5cf6" : 
              category === "Pantry" ? "#ec4899" : "#a855f7";
            
            return (
              <Card key={category} className="hover-card overflow-hidden border-border/60 shadow-sm">
                <div className="absolute top-0 h-1 w-full" style={{ backgroundColor: categoryColor }}></div>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{category}</CardTitle>
                  <div className="rounded-full p-1.5" style={{ backgroundColor: `${categoryColor}20` }}>
                    <div className="h-4 w-4 rounded-full" style={{ backgroundColor: categoryColor }}></div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    ${categoryTotals[category] || "0.00"}
                  </div>
                  <p className="text-sm text-muted-foreground flex items-center mt-1">
                    <span className="inline-block w-2 h-2 rounded-full mr-2" style={{ backgroundColor: categoryColor }}></span>
                    {receipts.filter(i => i.category === category).length} items
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Tabs defaultValue="all" className="w-full">
          <div className="border-b mb-6">
            <TabsList className="bg-transparent h-12">
              <TabsTrigger 
                value="all" 
                className="data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm rounded-t-lg rounded-b-none border-b-0 transition-all"
              >
                All Items
              </TabsTrigger>
              <TabsTrigger 
                value="charts"
                className="data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm rounded-t-lg rounded-b-none border-b-0 transition-all"
              >
                Charts
              </TabsTrigger>
              <TabsTrigger 
                value="reports"
                className="data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm rounded-t-lg rounded-b-none border-b-0 transition-all"
              >
                Reports
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="all" className="space-y-5">
            <Card className="hover-card bg-white/70 shadow-sm border-border/60">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <span className="text-primary mr-2">•</span> Receipt Items
                </CardTitle>
                <CardDescription>
                  Filter and browse all your receipt items
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-5">
                  <div className="text-sm font-medium text-muted-foreground mr-2">Filter by:</div>
                  {categories.map(category => (
                    <Badge
                      key={category}
                      variant={category && activeCategory === category ? "default" : "outline"}
                      className={`cursor-pointer py-1.5 px-3 ${
                        category && activeCategory === category 
                          ? "bg-primary hover:bg-primary/90" 
                          : "bg-white hover:bg-white/90 hover:text-primary"
                      }`}
                      onClick={() => handleCategoryClick(category)}
                    >
                      {category}
                    </Badge>
                  ))}
                </div>

                {loading ? (
                  <div className="flex flex-col justify-center items-center py-16">
                    <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
                    <p className="text-muted-foreground">Loading your receipt items...</p>
                  </div>
                ) : filteredReceipts.length > 0 ? (
                  <div className="rounded-md border border-border/60 overflow-hidden bg-white shadow-sm">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b bg-muted/20">
                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Name</th>
                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Category</th>
                            <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Price</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredReceipts.map((item, index) => {
                            const categoryColor = 
                              item.category === "Produce" ? "#10b981" :
                              item.category === "Meat" ? "#ef4444" : 
                              item.category === "Seafood" ? "#3b82f6" : 
                              item.category === "Dairy" ? "#f59e0b" : 
                              item.category === "Bakery" ? "#8b5cf6" : 
                              item.category === "Pantry" ? "#ec4899" :
                              item.category === "Frozen" ? "#0ea5e9" :
                              item.category === "Beverages" ? "#14b8a6" :
                              item.category === "Snacks" ? "#d946ef" :
                              "#a855f7";
                              
                            return (
                              <tr 
                                key={index} 
                                className="border-b transition-colors hover:bg-muted/10"
                              >
                                <td className="p-4 align-middle font-medium text-sm">{item.name}</td>
                                <td className="p-4 align-middle">
                                  <Badge 
                                    variant="outline" 
                                    className="bg-white font-normal"
                                    style={{ borderColor: categoryColor, color: categoryColor }}
                                  >
                                    {item.category}
                                  </Badge>
                                </td>
                                <td className="p-4 align-middle text-right font-medium">{item.price}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-16 bg-muted/20 rounded-lg border border-border/40">
                    <div className="text-muted-foreground/50 mb-3">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="mx-auto">
                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                        <path d="M3.29 7 12 12l8.71-5"></path>
                        <path d="M12 22V12"></path>
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium mb-1">No items found</h3>
                    <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                      {activeCategory ? `No items found in the ${activeCategory} category.` : 'No receipt items have been added yet.'}
                    </p>
                    {activeCategory && (
                      <Button 
                        variant="outline" 
                        className="bg-white hover:bg-white/90"
                        onClick={() => setActiveCategory(null)}
                      >
                        Clear Filter
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="charts" className="space-y-6">
            <Card className="overflow-hidden border-border/60 shadow-sm bg-white/70">
              <CardHeader className="pb-3 border-b">
                <CardTitle className="text-lg flex items-center">
                  <span className="text-primary mr-2">•</span> Spending Insights
                </CardTitle>
                <CardDescription>
                  Visual analysis of your grocery spending patterns
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="bg-white p-5 rounded-lg border border-border/60 shadow-sm transition-all hover:shadow-md">
                    <h3 className="text-base font-medium mb-1 flex items-center text-muted-foreground">
                      <PieChartIcon className="h-4 w-4 text-primary mr-2" />
                      Receipt Expense Distribution
                    </h3>
                    <p className="text-xs text-muted-foreground mb-4">Breakdown of receipt expenses by category</p>
                    
                    <div className="h-[260px] w-full">
                      {categories.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={categories.filter(c => c).map(category => ({
                                name: category,
                                value: parseFloat(categoryTotals[category!] || "0")
                              }))}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={90}
                              innerRadius={40}
                              fill="#8884d8"
                              dataKey="value"
                              nameKey="name"
                              paddingAngle={3}
                              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            >
                              {categories.filter(c => c).map((category, index) => {
                                const colors = {
                                  "Produce": "#10b981",
                                  "Meat": "#ef4444",
                                  "Seafood": "#3b82f6",
                                  "Dairy": "#f59e0b",
                                  "Bakery": "#8b5cf6",
                                  "Pantry": "#ec4899",
                                  "Frozen": "#0ea5e9",
                                  "Beverages": "#14b8a6",
                                  "Snacks": "#d946ef",
                                  "Other": "#a855f7",
                                  "Tax": "#f43f5e",
                                  "Total": "#7c3aed"
                                };
                                return (
                                <Cell 
                                  key={`cell-${index}`} 
                                  fill={category && colors[category as keyof typeof colors] || `#${Math.floor(Math.random() * 16777215).toString(16)}`}
                                  strokeWidth={1}
                                />
                              )})}
                            </Pie>
                            <Tooltip formatter={(value) => `$${Number(value).toFixed(2)}`} />
                            <Legend 
                              iconType="circle" 
                              layout="horizontal" 
                              verticalAlign="bottom" 
                              align="center"
                              wrapperStyle={{ fontSize: "12px", paddingTop: "15px" }}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="h-full flex items-center justify-center">
                          <p className="text-muted-foreground">No data available</p>
                        </div>
                      )}
                    </div>
                    <div className="text-center mt-1 pt-2 border-t border-border/30">
                      <p className="text-xs text-muted-foreground">Total: <span className="font-medium">${grandTotal}</span></p>
                    </div>
                  </div>
                  
                  <div className="bg-white p-5 rounded-lg border border-border/60 shadow-sm transition-all hover:shadow-md">
                    <h3 className="text-base font-medium mb-1 flex items-center text-muted-foreground">
                      <BarChartIcon className="h-4 w-4 text-primary mr-2" />
                      Category Comparison
                    </h3>
                    <p className="text-xs text-muted-foreground mb-4">Side-by-side comparison of spending by category</p>
                    
                    <div className="h-[260px] w-full">
                      {categories.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart 
                            data={categories.filter(c => c && c !== "Total").map(category => ({
                              name: category,
                              amount: parseFloat(categoryTotals[category!] || "0")
                            }))}
                            margin={{ top: 10, right: 5, left: 5, bottom: 30 }}
                          >
                            <XAxis 
                              dataKey="name" 
                              tick={{ fontSize: 12 }}
                              tickLine={false}
                              axisLine={{ stroke: '#e5e7eb', strokeWidth: 1 }}
                            />
                            <YAxis 
                              tick={{ fontSize: 12 }}
                              tickLine={false}
                              axisLine={{ stroke: '#e5e7eb', strokeWidth: 1 }}
                              tickFormatter={(value) => `$${value}`}
                            />
                            <Tooltip formatter={(value) => `$${Number(value).toFixed(2)}`} />
                            <Bar 
                              dataKey="amount" 
                              fill="#8884d8"
                              radius={[4, 4, 0, 0]}
                              barSize={50}
                            >
                              {categories.filter(c => c && c !== "Total").map((category, index) => {
                                const colors = {
                                  "Produce": "#10b981",
                                  "Meat": "#ef4444",
                                  "Seafood": "#3b82f6",
                                  "Dairy": "#f59e0b",
                                  "Bakery": "#8b5cf6",
                                  "Pantry": "#ec4899",
                                  "Frozen": "#0ea5e9",
                                  "Beverages": "#14b8a6",
                                  "Snacks": "#d946ef",
                                  "Other": "#a855f7",
                                  "Tax": "#f43f5e"
                                };
                                return (
                                <Cell 
                                  key={`cell-${index}`} 
                                  fill={category && colors[category as keyof typeof colors] || `#${Math.floor(Math.random() * 16777215).toString(16)}`}
                                />
                              )})}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="h-full flex items-center justify-center">
                          <p className="text-muted-foreground">No data available</p>
                        </div>
                      )}
                    </div>
                    <div className="text-center mt-1 pt-2 border-t border-border/30">
                      <p className="text-xs text-muted-foreground">Based on <span className="font-medium">{receipts.length}</span> items</p>
                    </div>
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold mt-8 mb-4 text-primary">Inventory Value Analysis</h3>
                <div className="grid gap-6 md:grid-cols-2">
                  <InventoryValueChart 
                    inventoryItems={inventoryItems}
                    inventoryCategoryTotals={inventoryCategoryTotals}
                    inventoryGrandTotal={inventoryGrandTotal}
                  />
                  
                  <InventoryBarChart
                    inventoryItems={inventoryItems}
                    inventoryCategoryTotals={inventoryCategoryTotals}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="reports" className="space-y-6">
            <Card className="overflow-hidden border-border/60 shadow-sm bg-white/70">
              <CardHeader className="pb-3 border-b">
                <CardTitle className="text-lg flex items-center">
                  <span className="text-primary mr-2">•</span> Expense Reports
                </CardTitle>
                <CardDescription>
                  Generate comprehensive reports of your spending habits
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid gap-6 md:grid-cols-3">
                  <div className="md:col-span-2 bg-white p-6 rounded-lg border border-border/60 shadow-sm">
                    <h3 className="text-base font-medium mb-4 pb-2 border-b flex items-center">
                      <span className="inline-block w-2 h-2 rounded-full bg-primary mr-2"></span>
                      Report Configuration
                    </h3>
                    
                    <div className="space-y-6">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <label className="text-sm font-medium flex items-center">
                            <CalendarIcon className="h-3.5 w-3.5 mr-1.5 text-primary" />
                            Report Period
                          </label>
                          <select className="w-full p-2 border rounded-md bg-white shadow-sm transition-colors focus:border-primary/50 focus:ring-1 focus:ring-primary/40 outline-none">
                            <option>May 2025</option>
                            <option>April 2025</option>
                            <option>March 2025</option>
                            <option>Custom Range</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium flex items-center">
                            <svg className="h-3.5 w-3.5 mr-1.5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                              <polyline points="14 2 14 8 20 8"></polyline>
                            </svg>
                            Report Format
                          </label>
                          <select className="w-full p-2 border rounded-md bg-white shadow-sm transition-colors focus:border-primary/50 focus:ring-1 focus:ring-primary/40 outline-none">
                            <option>PDF Document</option>
                            <option>Excel Spreadsheet</option>
                            <option>CSV File</option>
                          </select>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <label className="text-sm font-medium flex items-center">
                          <FilterIcon className="h-3.5 w-3.5 mr-1.5 text-primary" />
                          Include Categories
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {categories.map(category => category && (
                            <div key={category} className="flex items-center rounded-md border px-3 py-1.5 bg-white shadow-sm">
                              <input 
                                type="checkbox" 
                                id={`cat-${category}`} 
                                defaultChecked 
                                className="mr-2 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary/40" 
                              />
                              <label htmlFor={`cat-${category}`} className="text-sm">{category}</label>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <label className="text-sm font-medium flex items-center">
                          <svg className="h-3.5 w-3.5 mr-1.5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                          </svg>
                          Report Options
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                          <div className="flex items-center rounded-md border px-3 py-1.5 bg-white shadow-sm">
                            <input 
                              type="checkbox" 
                              id="include-charts" 
                              defaultChecked 
                              className="mr-2 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary/40" 
                            />
                            <label htmlFor="include-charts" className="text-sm">Include Charts</label>
                          </div>
                          <div className="flex items-center rounded-md border px-3 py-1.5 bg-white shadow-sm">
                            <input 
                              type="checkbox" 
                              id="include-summary" 
                              defaultChecked 
                              className="mr-2 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary/40" 
                            />
                            <label htmlFor="include-summary" className="text-sm">Include Summary</label>
                          </div>
                          <div className="flex items-center rounded-md border px-3 py-1.5 bg-white shadow-sm">
                            <input 
                              type="checkbox" 
                              id="include-details" 
                              defaultChecked 
                              className="mr-2 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary/40" 
                            />
                            <label htmlFor="include-details" className="text-sm">Include Details</label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col bg-white p-6 rounded-lg border border-border/60 shadow-sm">
                    <h3 className="text-base font-medium mb-4 pb-2 border-b flex items-center">
                      <span className="inline-block w-2 h-2 rounded-full bg-primary mr-2"></span>
                      Report Preview
                    </h3>
                    
                    <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 py-8">
                      <div className="bg-muted/20 w-24 h-32 rounded-md border flex items-center justify-center mb-2">
                        <svg className="w-12 h-12 text-muted-foreground/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                          <polyline points="14 2 14 8 20 8"></polyline>
                          <line x1="16" y1="13" x2="8" y2="13"></line>
                          <line x1="16" y1="17" x2="8" y2="17"></line>
                          <line x1="10" y1="9" x2="8" y2="9"></line>
                        </svg>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Monthly Expense Report</p>
                        <p className="text-xs text-muted-foreground">May 2025</p>
                        <p className="text-xs text-muted-foreground">Total: ${grandTotal}</p>
                      </div>
                    </div>
                    
                    <Button className="mt-auto bg-gradient">
                      <DownloadIcon className="mr-2 h-4 w-4" />
                      Generate Report
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
  );
}