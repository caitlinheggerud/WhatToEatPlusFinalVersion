import { ReceiptIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  onScanClick: () => void;
}

export function HeroSection({ onScanClick }: HeroSectionProps) {
  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient py-10 px-6 sm:py-16 sm:px-12">
      <div className="relative z-10">
        <div className="max-w-2xl">
          <h1 className="text-3xl font-bold text-white sm:text-4xl md:text-5xl">
            Intelligent Receipt Scanner
          </h1>
          <p className="mt-4 text-lg text-white/90 md:text-xl">
            Simply upload your receipt photos and our AI will automatically recognize items and prices.
          </p>
          <div className="mt-8">
            <Button 
              onClick={onScanClick}
              size="lg" 
              className="bg-white text-primary hover:bg-white/90"
            >
              <ReceiptIcon className="mr-2 h-5 w-5" />
              Upload Receipt
            </Button>
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute right-0 top-0 -mt-16 -mr-16 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 -mb-20 -ml-20 h-80 w-80 rounded-full bg-white/10 blur-3xl"></div>
    </div>
  );
}