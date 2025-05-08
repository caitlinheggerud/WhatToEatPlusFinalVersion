import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3Icon, PieChartIcon, ReceiptIcon, CalendarIcon } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="space-y-6 pb-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Expense Analysis</h1>
        <p className="text-muted-foreground">
          View your spending trends and expense category statistics.
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Monthly Expenses
            </CardTitle>
            <ReceiptIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$1,254.89</div>
            <p className="text-xs text-muted-foreground">
              vs last month <span className="text-green-500">-12.5%</span>
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Receipts Analyzed
            </CardTitle>
            <BarChart3Icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">
              +8 this month <span className="text-indigo-500">+50%</span>
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Top Expense Category
            </CardTitle>
            <PieChartIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Dining</div>
            <p className="text-xs text-muted-foreground">
              of total expenses <span className="text-orange-500">38%</span>
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Average Daily Spending
            </CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$42.46</div>
            <p className="text-xs text-muted-foreground">
              vs last month <span className="text-green-500">-5.2%</span>
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Monthly Spending Trends</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center">
            <div className="text-muted-foreground text-center p-8">
              <BarChart3Icon className="h-10 w-10 mx-auto mb-3 text-muted" />
              <p>Chart will display after adding more receipts</p>
              <p className="text-sm mt-1 text-muted">Complete at least 5 receipt scans</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>支出分类</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center">
            <div className="text-muted-foreground text-center p-8">
              <PieChartIcon className="h-10 w-10 mx-auto mb-3 text-muted" />
              <p>图表将在您添加更多收据后显示</p>
              <p className="text-sm mt-1 text-muted">完成至少5张收据的扫描</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}