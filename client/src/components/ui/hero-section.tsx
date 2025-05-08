import { BarChart3, ReceiptIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

interface HeroSectionProps {
  onScanClick: () => void;
}

export function HeroSection({ onScanClick }: HeroSectionProps) {
  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient py-10 px-6 sm:py-16 sm:px-12">
      <div className="relative z-10">
        <div className="max-w-2xl">
          <h1 className="text-3xl font-bold text-white sm:text-4xl md:text-5xl">
            智能收据扫描与支出分析
          </h1>
          <p className="mt-4 text-lg text-white/90 md:text-xl">
            简单上传您的收据照片，我们的AI将自动识别商品、价格和分类，
            帮助您追踪和分析消费习惯。
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button 
              onClick={onScanClick}
              size="lg" 
              className="bg-white text-primary hover:bg-white/90"
            >
              <ReceiptIcon className="mr-2 h-5 w-5" />
              开始扫描
            </Button>
            <Link href="/dashboard">
              <div>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-white text-white hover:bg-white/10"
                >
                  <BarChart3 className="mr-2 h-5 w-5" />
                  查看报表
                </Button>
              </div>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute right-0 top-0 -mt-16 -mr-16 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 -mb-20 -ml-20 h-80 w-80 rounded-full bg-white/10 blur-3xl"></div>
    </div>
  );
}