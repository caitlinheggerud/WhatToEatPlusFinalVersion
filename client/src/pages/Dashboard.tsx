import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { getReceipts, getReceiptItems } from "@/lib/api";
import { DashboardLayout } from "@/components/layout/Dashboard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  DownloadIcon, PieChartIcon, BarChartIcon, CalendarIcon, 
  FilterIcon, TrendingUpIcon, TrendingDownIcon, AlertTriangleIcon, 
  LightbulbIcon, ArrowUpIcon, ArrowDownIcon
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { type ReceiptItemResponse } from "@shared/schema";
import { 
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, 
  ResponsiveContainer, Legend, LineChart, Line, CartesianGrid, Area, 
  AreaChart, ComposedChart 
} from 'recharts';
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

  // Get unique categories from receipt items and add standard ones
  const categories = Array.from(
    new Set([
      ...receiptItems.map(item => item.category),
      // Add standard categories that might not be in the data yet
      "Food", 
      "Beverage", 
      "Household", 
      "Electronics", 
      "Clothing", 
      "Personal Care", 
      "Other"
    ].filter(Boolean))
  ).filter(cat => cat !== "Total" && cat !== "Tax").sort();
  
  // Filter receipt items by category if a category is selected
  const filteredReceiptItems = activeCategory 
    ? receiptItems.filter(item => item.category === activeCategory)
    : receiptItems;

  // Calculate total by category
  const categoryTotals = categories.reduce((acc, category) => {
    if (category) { // Make sure category is not undefined
      const total = receiptItems
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
  const grandTotal = receiptItems.reduce((sum, item) => {
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
                From {receiptItems.length} items
              </p>
            </CardContent>
          </Card>
          
          {["Food", "Beverage", "Household", "Personal Care"].map(category => (
            <Card key={category}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{category}</CardTitle>
                <div className={`h-4 w-4 rounded-full ${
                  category === "Food" ? "bg-green-500" : 
                  category === "Beverage" ? "bg-cyan-500" :
                  category === "Household" ? "bg-blue-500" : 
                  category === "Electronics" ? "bg-violet-500" :
                  category === "Clothing" ? "bg-pink-500" :
                  category === "Personal Care" ? "bg-orange-500" :
                  category === "Other" ? "bg-gray-500" :
                  "bg-purple-500"
                }`}></div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${categoryTotals[category] || "0.00"}
                </div>
                <p className="text-xs text-muted-foreground">
                  {receiptItems.filter(i => i.category === category).length} items
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="receipts" className="w-full">
          <TabsList>
            <TabsTrigger value="receipts">Receipts</TabsTrigger>
            <TabsTrigger value="items">All Items</TabsTrigger>
            <TabsTrigger value="charts">Charts</TabsTrigger>
            <TabsTrigger value="analysis">Spending Analysis</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>
          
          <TabsContent value="receipts" className="space-y-4">
            <ReceiptList receipts={receipts} loading={loading} />
          </TabsContent>
          
          <TabsContent value="items" className="space-y-4">
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
                      {filteredReceiptItems.map((item: ReceiptItemResponse, index: number) => (
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
                                  category === "Beverage" ? "#06b6d4" : 
                                  category === "Household" ? "#3b82f6" : 
                                  category === "Electronics" ? "#8b5cf6" : 
                                  category === "Clothing" ? "#ec4899" : 
                                  category === "Personal Care" ? "#f97316" : 
                                  category === "Tax" ? "#f43f5e" :
                                  category === "Total" ? "#6b7280" :
                                  category === "Other" ? "#a3a3a3" :
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
                                  category === "Beverage" ? "#06b6d4" : 
                                  category === "Household" ? "#3b82f6" : 
                                  category === "Electronics" ? "#8b5cf6" : 
                                  category === "Clothing" ? "#ec4899" : 
                                  category === "Personal Care" ? "#f97316" : 
                                  category === "Tax" ? "#f43f5e" :
                                  category === "Total" ? "#6b7280" :
                                  category === "Other" ? "#a3a3a3" :
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
          
          <TabsContent value="analysis" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Spending Breakdown</CardTitle>
                  <CardDescription>
                    Detailed analysis of your spending habits
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {categories.filter(c => c && c !== "Total").map(category => {
                      const total = parseFloat(categoryTotals[category!] || "0");
                      const percentage = (total / parseFloat(grandTotal)) * 100;
                      return (
                        <div key={category} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className={`h-3 w-3 rounded-full ${
                                category === "Food" ? "bg-green-500" : 
                                category === "Beverage" ? "bg-cyan-500" :
                                category === "Household" ? "bg-blue-500" : 
                                category === "Electronics" ? "bg-violet-500" :
                                category === "Clothing" ? "bg-pink-500" :
                                category === "Personal Care" ? "bg-orange-500" :
                                category === "Other" ? "bg-gray-500" :
                                "bg-purple-500"
                              }`}></div>
                              <span className="text-sm font-medium">{category}</span>
                            </div>
                            <span className="text-sm text-muted-foreground">${total.toFixed(2)} ({percentage.toFixed(1)}%)</span>
                          </div>
                          <div className="h-2 w-full rounded-full bg-muted">
                            <div 
                              className={`h-2 rounded-full ${
                                category === "Food" ? "bg-green-500" : 
                                category === "Beverage" ? "bg-cyan-500" :
                                category === "Household" ? "bg-blue-500" : 
                                category === "Electronics" ? "bg-violet-500" :
                                category === "Clothing" ? "bg-pink-500" :
                                category === "Personal Care" ? "bg-orange-500" :
                                category === "Other" ? "bg-gray-500" :
                                "bg-purple-500"
                              }`} 
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Top Expenses</CardTitle>
                  <CardDescription>
                    Your most significant purchases
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {receiptItems
                      .sort((a, b) => {
                        const priceA = parseFloat(a.price.replace(/[^0-9.-]+/g, ""));
                        const priceB = parseFloat(b.price.replace(/[^0-9.-]+/g, ""));
                        return priceB - priceA;
                      })
                      .slice(0, 5)
                      .map((item, index) => {
                        const price = parseFloat(item.price.replace(/[^0-9.-]+/g, ""));
                        const percentage = (price / parseFloat(grandTotal)) * 100;
                        return (
                          <div key={index} className="flex items-center justify-between">
                            <div>
                              <div className="font-medium">{item.name}</div>
                              <div className="text-sm text-muted-foreground">{item.category}</div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold">{item.price}</div>
                              <div className="text-xs text-muted-foreground">{percentage.toFixed(1)}% of total</div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Spending Insights</CardTitle>
                  <CardDescription>
                    Key observations about your expenses
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {categories.filter(c => c && c !== "Total" && c !== "Other").map(category => {
                      const total = parseFloat(categoryTotals[category!] || "0");
                      const percentage = (total / parseFloat(grandTotal)) * 100;
                      const icon = 
                        percentage > 30 ? 
                          <AlertTriangleIcon className="h-4 w-4 text-amber-500" /> : 
                        percentage > 20 ? 
                          <TrendingUpIcon className="h-4 w-4 text-blue-500" /> : 
                          <TrendingDownIcon className="h-4 w-4 text-green-500" />;
                      
                      let insight = "";
                      if (category === "Food" && percentage > 30) {
                        insight = "High food spending. Consider meal planning or bulk purchases to reduce costs.";
                      } else if (category === "Food") {
                        insight = "Food spending is well managed.";
                      } else if (category === "Personal Care" && percentage > 15) {
                        insight = "Personal care expenses are higher than average.";
                      } else if (category === "Household" && percentage > 25) {
                        insight = "Significant household expenses. Look for bulk deals on essentials.";
                      } else if (percentage > 20) {
                        insight = `${category} spending is high (${percentage.toFixed(1)}% of total).`;
                      } else if (percentage > 10) {
                        insight = `${category} spending is moderate (${percentage.toFixed(1)}% of total).`;
                      } else {
                        insight = `${category} spending is low (${percentage.toFixed(1)}% of total).`;
                      }
                      
                      return total > 0 ? (
                        <div key={category} className="flex items-start gap-2">
                          {icon}
                          <div>
                            <div className="font-medium">{category}</div>
                            <div className="text-sm text-muted-foreground">{insight}</div>
                          </div>
                        </div>
                      ) : null;
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-3">
                <CardHeader>
                  <CardTitle>Spending Trend Analysis</CardTitle>
                  <CardDescription>
                    How your spending has changed over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={[
                          { month: 'Jan', Food: 120, Beverage: 45, Household: 80, 'Personal Care': 30 },
                          { month: 'Feb', Food: 100, Beverage: 50, Household: 70, 'Personal Care': 35 },
                          { month: 'Mar', Food: 130, Beverage: 40, Household: 90, 'Personal Care': 25 },
                          { month: 'Apr', Food: 110, Beverage: 55, Household: 75, 'Personal Care': 40 },
                          { month: 'May', Food: parseFloat(categoryTotals["Food"] || "0"), 
                                          Beverage: parseFloat(categoryTotals["Beverage"] || "0"), 
                                          Household: parseFloat(categoryTotals["Household"] || "0"), 
                                          'Personal Care': parseFloat(categoryTotals["Personal Care"] || "0") }
                        ]}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip formatter={(value) => `$${Number(value).toFixed(2)}`} />
                        <Legend />
                        <Area type="monotone" dataKey="Food" stackId="1" stroke="#10b981" fill="#10b981" />
                        <Area type="monotone" dataKey="Beverage" stackId="1" stroke="#06b6d4" fill="#06b6d4" />
                        <Area type="monotone" dataKey="Household" stackId="1" stroke="#3b82f6" fill="#3b82f6" />
                        <Area type="monotone" dataKey="Personal Care" stackId="1" stroke="#f97316" fill="#f97316" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="recommendations" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <LightbulbIcon className="h-5 w-5 text-yellow-500" />
                    Spending Recommendations
                  </CardTitle>
                  <CardDescription>
                    Personalized suggestions to improve your financial habits
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(categoryTotals).map(([category, total]) => {
                    const totalValue = parseFloat(total);
                    const percentage = (totalValue / parseFloat(grandTotal)) * 100;
                    let recommendation = null;
                    
                    if (category === "Food" && percentage > 30) {
                      recommendation = {
                        title: "High Food Expenses",
                        description: "Your dining expenses are high. Consider meal prepping or cooking at home more often to reduce costs.",
                        icon: <TrendingDownIcon className="h-4 w-4 text-red-500" />
                      };
                    } else if (category === "Beverage" && percentage > 10) {
                      recommendation = {
                        title: "Beverage Spending",
                        description: "Beverage costs are significant. Try using reusable water bottles and making coffee at home.",
                        icon: <TrendingDownIcon className="h-4 w-4 text-amber-500" />
                      };
                    } else if (category === "Personal Care" && percentage > 15) {
                      recommendation = {
                        title: "Personal Care Budget",
                        description: "Personal care spending is above average. Look for sales or bulk purchases on your regular items.",
                        icon: <TrendingDownIcon className="h-4 w-4 text-amber-500" />
                      };
                    }
                    
                    return recommendation ? (
                      <div key={category} className="rounded-lg border p-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold">{recommendation.title}</h4>
                          {recommendation.icon}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{recommendation.description}</p>
                      </div>
                    ) : null;
                  })}
                  
                  <div className="rounded-lg border p-3 bg-blue-50 dark:bg-blue-950">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">Balance Your Categories</h4>
                      <ArrowUpIcon className="h-4 w-4 text-blue-500" />
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">Aim to keep each spending category below 25% of your total budget for better financial health.</p>
                  </div>
                  
                  <div className="rounded-lg border p-3 bg-green-50 dark:bg-green-950">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">Savings Opportunity</h4>
                      <ArrowUpIcon className="h-4 w-4 text-green-500" />
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">Based on your current spending patterns, you could save approximately 15% by adjusting your highest expense categories.</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Recipe Suggestions</CardTitle>
                  <CardDescription>
                    Based on your recent food purchases
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {receiptItems
                      .filter(item => item.category === "Food")
                      .length > 0 ? (
                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <div className="rounded-lg border overflow-hidden">
                          <div className="h-36 bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                            <span className="text-3xl">🥗</span>
                          </div>
                          <div className="p-4">
                            <h3 className="font-medium mb-1">Fresh Garden Salad</h3>
                            <div className="text-sm text-muted-foreground mb-2">Use your fresh vegetables before they expire</div>
                            <div className="flex flex-wrap gap-1">
                              {["Lettuce", "Tomato", "Cucumber", "Bell Pepper"]
                                .map(ing => (
                                  <Badge variant="outline" key={ing} className="text-xs">{ing}</Badge>
                                ))}
                            </div>
                          </div>
                        </div>
                        
                        <div className="rounded-lg border overflow-hidden">
                          <div className="h-36 bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
                            <span className="text-3xl">🍲</span>
                          </div>
                          <div className="p-4">
                            <h3 className="font-medium mb-1">One-Pot Pasta</h3>
                            <div className="text-sm text-muted-foreground mb-2">Quick dinner using pantry staples</div>
                            <div className="flex flex-wrap gap-1">
                              {["Pasta", "Tomato Sauce", "Garlic", "Onion", "Cheese"]
                                .map(ing => (
                                  <Badge variant="outline" key={ing} className="text-xs">{ing}</Badge>
                                ))}
                            </div>
                          </div>
                        </div>
                        
                        <div className="rounded-lg border overflow-hidden">
                          <div className="h-36 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                            <span className="text-3xl">🍚</span>
                          </div>
                          <div className="p-4">
                            <h3 className="font-medium mb-1">Vegetable Stir Fry</h3>
                            <div className="text-sm text-muted-foreground mb-2">Use your vegetables before they expire</div>
                            <div className="flex flex-wrap gap-1">
                              {["Rice", "Bell Pepper", "Carrot", "Broccoli", "Soy Sauce"]
                                .map(ing => (
                                  <Badge variant="outline" key={ing} className="text-xs">{ing}</Badge>
                                ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">No food items found in your receipts to generate recipe suggestions.</p>
                      </div>
                    )}
                    
                    <div className="mt-6">
                      <h3 className="font-medium mb-2">Expiration Tracker</h3>
                      <div className="rounded-md border">
                        <div className="p-1">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b bg-muted/50">
                                <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground">Item</th>
                                <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground">Expires</th>
                                <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              {[
                                { name: "Milk", expiry: "May 10, 2025", status: "expiring-soon" },
                                { name: "Bread", expiry: "May 12, 2025", status: "expiring-soon" },
                                { name: "Tomatoes", expiry: "May 15, 2025", status: "good" },
                                { name: "Chicken", expiry: "May 9, 2025", status: "expiring-soon" },
                                { name: "Lettuce", expiry: "May 11, 2025", status: "expiring-soon" }
                              ].map((item, index) => (
                                <tr key={index} className="border-b transition-colors hover:bg-muted/50">
                                  <td className="p-4 align-middle">{item.name}</td>
                                  <td className="p-4 align-middle">{item.expiry}</td>
                                  <td className="p-4 align-middle">
                                    {item.status === "expired" ? (
                                      <Badge variant="destructive">Expired</Badge>
                                    ) : item.status === "expiring-soon" ? (
                                      <Badge variant="secondary" className="bg-amber-500 hover:bg-amber-600 text-white">Expiring Soon</Badge>
                                    ) : (
                                      <Badge variant="outline" className="bg-green-100 text-green-800">Good</Badge>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
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