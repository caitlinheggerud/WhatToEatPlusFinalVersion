import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, ImageIcon } from "lucide-react";

interface UploadSectionProps {
  onFileSelect: (file: File) => void;
  onAnalyze: () => void;
  showAnalyzeButton: boolean;
}

export default function UploadSection({ 
  onFileSelect, 
  onAnalyze,
  showAnalyzeButton
}: UploadSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFileSelect(files[0]);
    }
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.add("border-primary", "bg-indigo-50");
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.remove("border-primary", "bg-indigo-50");
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.remove("border-primary", "bg-indigo-50");
    
    if (e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type === "image/jpeg" || file.type === "image/png") {
        onFileSelect(file);
      } else {
        alert("请上传JPG或PNG格式的图片");
      }
    }
  };

  return (
    <div className="mb-8">
      <div 
        className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer bg-white"
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
          <ImageIcon className="h-8 w-8 text-primary" />
        </div>
        <p className="text-lg font-medium mb-2">Upload Receipt Image</p>
        <p className="text-sm text-muted-foreground mb-4">Click or drag & drop to upload</p>
        <Button className="bg-primary hover:bg-primary/90">
          <Upload className="mr-2 h-4 w-4" />
          Select Image
        </Button>
        <input 
          type="file" 
          ref={fileInputRef}
          accept="image/jpeg, image/png" 
          className="hidden" 
          onChange={handleFileChange}
        />
      </div>
      
      <div className="mt-2 text-xs text-muted-foreground text-center">
        Receipts will be processed using Google Gemini API
      </div>
      
      {showAnalyzeButton && (
        <div className="mt-6 text-center">
          <Button 
            className="w-full btn-gradient py-2.5 text-base font-medium"
            onClick={onAnalyze}
          >
            <ImageIcon className="mr-2 h-4 w-4" />
            Analyze Receipt
          </Button>
        </div>
      )}
    </div>
  );
}
