import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { getReceipts, getReceiptItems } from "@/lib/api";
import { DashboardLayout } from "@/components/layout/Dashboard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DownloadIcon, PieChartIcon, BarChartIcon, CalendarIcon, FilterIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { type ReceiptItemResponse } from "@shared/schema";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import ReceiptList from "@/components/ReceiptList";

export default function Dashboard() {
  const [receipts, setReceipts] = useState<any[]>([]);
  const [receiptItems, setReceiptItems] = useState<ReceiptItemResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        // Fetch receipts list
        const receiptsData = await getReceipts();
        setReceipts(receiptsData);
        
        // For backward compatibility, also fetch all receipt items for charts
        const itemsData = await getReceiptItems();
        setReceiptItems(itemsData);
      } catch (err) {
        console.error("Error fetching receipts:", err);
        toast({
          title: "Error",
          description: "Failed to load receipt history",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [toast]);

  // Get unique categories
  const categories = Array.from(new Set(receipts.map(item => item.category)));
  
  // Filter receipts by category if a category is selected
  const filteredReceipts = activeCategory 
    ? receipts.filter(item => item.category === activeCategory)
    : receipts;

  // Calculate total by category
  const categoryTotals = categories.reduce((acc, category) => {
    if (category) { // Make sure category is not undefined
      const total = receipts
        .filter(item => item.category === category)
        .reduce((sum, item) => {
          const price = parseFloat(item.price.replace(/[^0-9.-]+/g, ""));
          return sum + (isNaN(price) ? 0 : price);
        }, 0);
      
      acc[category] = total.toFixed(2);
    }
    return acc;
  }, {} as Record<string, string>);

  // Calculate grand total
  const grandTotal = receipts.reduce((sum, item) => {
    const price = parseFloat(item.price.replace(/[^0-9.-]+/g, ""));
    return sum + (isNaN(price) ? 0 : price);
  }, 0).toFixed(2);

  const handleCategoryClick = (category: string | undefined) => {
    if (category) {
      setActiveCategory(activeCategory === category ? null : category);
    }
  };

  return (
    <DashboardLayout>
      <div className="container py-6 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Receipt History</h1>
            <p className="text-muted-foreground">
              View and analyze your receipt data
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <CalendarIcon className="mr-2 h-4 w-4" />
              Date Range
            </Button>
            <Button variant="outline" size="sm">
              <FilterIcon className="mr-2 h-4 w-4" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <DownloadIcon className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
              <PieChartIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${grandTotal}</div>
              <p className="text-xs text-muted-foreground">
                From {receipts.length} items
              </p>
            </CardContent>
          </Card>
          
          {["Food", "Household", "Other"].map(category => (
            <Card key={category}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{category}</CardTitle>
                <div className={`h-4 w-4 rounded-full ${
                  category === "Food" ? "bg-green-500" : 
                  category === "Household" ? "bg-blue-500" : "bg-purple-500"
                }`}></div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${categoryTotals[category] || "0.00"}
                </div>
                <p className="text-xs text-muted-foreground">
                  {receipts.filter(i => i.category === category).length} items
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList>
            <TabsTrigger value="all">All Items</TabsTrigger>
            <TabsTrigger value="charts">Charts</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="space-y-4">
            <div className="flex flex-wrap gap-2 my-4">
              {categories.map(category => (
                <Badge
                  key={category}
                  variant={category && activeCategory === category ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => handleCategoryClick(category)}
                >
                  {category}
                </Badge>
              ))}
            </div>

            {loading ? (
              <div className="flex justify-center p-8">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
              </div>
            ) : (
              <div className="rounded-md border">
                <div className="p-1">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground">Name</th>
                        <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground">Category</th>
                        <th className="h-10 px-4 text-right align-middle font-medium text-muted-foreground">Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredReceipts.map((item, index) => (
                        <tr key={index} className="border-b transition-colors hover:bg-muted/50">
                          <td className="p-4 align-middle">{item.name}</td>
                          <td className="p-4 align-middle">
                            <Badge variant="outline">{item.category}</Badge>
                          </td>
                          <td className="p-4 align-middle text-right font-medium">{item.price}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="charts" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Expense by Category</CardTitle>
                  <CardDescription>
                    Distribution of expenses across categories
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] w-full">
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
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                            nameKey="name"
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            {categories.filter(c => c).map((category, index) => (
                              <Cell 
                                key={`cell-${index}`} 
                                fill={
                                  category === "Food" ? "#10b981" : 
                                  category === "Household" ? "#3b82f6" : 
                                  category === "Tax" ? "#f43f5e" :
                                  category === "Total" ? "#8b5cf6" :
                                  `#${Math.floor(Math.random() * 16777215).toString(16)}`
                                } 
                              />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => `$${Number(value).toFixed(2)}`} />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex items-center justify-center">
                        <p className="text-muted-foreground">No data available</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Expenses by Category</CardTitle>
                  <CardDescription>
                    Comparison of total spending by category
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] w-full">
                    {categories.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart 
                          data={categories.filter(c => c && c !== "Total").map(category => ({
                            name: category,
                            amount: parseFloat(categoryTotals[category!] || "0")
                          }))}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip formatter={(value) => `$${Number(value).toFixed(2)}`} />
                          <Bar dataKey="amount" fill="#8884d8">
                            {categories.filter(c => c && c !== "Total").map((category, index) => (
                              <Cell 
                                key={`cell-${index}`} 
                                fill={
                                  category === "Food" ? "#10b981" : 
                                  category === "Household" ? "#3b82f6" : 
                                  category === "Tax" ? "#f43f5e" :
                                  `#${Math.floor(Math.random() * 16777215).toString(16)}`
                                } 
                              />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex items-center justify-center">
                        <p className="text-muted-foreground">No data available</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="reports" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Expense Report</CardTitle>
                <CardDescription>
                  Generate and download monthly expense reports
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Report Period</label>
                      <select className="w-full p-2 border rounded-md">
                        <option>May 2025</option>
                        <option>April 2025</option>
                        <option>March 2025</option>
                        <option>Custom Range</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Report Format</label>
                      <select className="w-full p-2 border rounded-md">
                        <option>PDF Document</option>
                        <option>Excel Spreadsheet</option>
                        <option>CSV File</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Include Categories</label>
                    <div className="flex flex-wrap gap-2">
                      {categories.map(category => category && (
                        <div key={category} className="flex items-center space-x-2">
                          <input type="checkbox" id={`cat-${category}`} defaultChecked />
                          <label htmlFor={`cat-${category}`} className="text-sm">{category}</label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Report Options</label>
                    <div className="flex flex-wrap gap-4">
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="include-charts" defaultChecked />
                        <label htmlFor="include-charts" className="text-sm">Include Charts</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="include-summary" defaultChecked />
                        <label htmlFor="include-summary" className="text-sm">Include Summary</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="include-details" defaultChecked />
                        <label htmlFor="include-details" className="text-sm">Include Item Details</label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 flex justify-center">
                    <Button className="w-full md:w-auto">
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
    </DashboardLayout>
  );
}