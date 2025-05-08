import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export default function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
      <div className="text-error mb-2">
        <AlertCircle className="w-8 h-8 mx-auto text-red-500" />
      </div>
      <h3 className="font-medium text-red-800 mb-1">Recognition Failed</h3>
      <p className="text-sm text-red-600 mb-3">
        {message || "Unable to recognize receipt content, please try again"}
      </p>
      <Button 
        variant="outline" 
        className="border-red-300 text-red-700 hover:bg-red-50" 
        onClick={onRetry}
      >
        Try Again
      </Button>
    </div>
  );
}
