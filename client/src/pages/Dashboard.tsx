import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3Icon, PieChartIcon, ReceiptIcon, CalendarIcon } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="space-y-6 pb-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">支出分析</h1>
        <p className="text-muted-foreground">
          查看您的消费趋势和支出分类统计。
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              本月支出
            </CardTitle>
            <ReceiptIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">¥1,254.89</div>
            <p className="text-xs text-muted-foreground">
              较上月 <span className="text-green-500">-12.5%</span>
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              已分析收据
            </CardTitle>
            <BarChart3Icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">
              本月新增 <span className="text-indigo-500">+8</span>
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              最大消费类别
            </CardTitle>
            <PieChartIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">餐饮</div>
            <p className="text-xs text-muted-foreground">
              占总支出 <span className="text-orange-500">38%</span>
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              平均每日支出
            </CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">¥42.46</div>
            <p className="text-xs text-muted-foreground">
              较上月 <span className="text-green-500">-5.2%</span>
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>月度支出趋势</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center">
            <div className="text-muted-foreground text-center p-8">
              <BarChart3Icon className="h-10 w-10 mx-auto mb-3 text-muted" />
              <p>图表将在您添加更多收据后显示</p>
              <p className="text-sm mt-1 text-muted">完成至少5张收据的扫描</p>
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