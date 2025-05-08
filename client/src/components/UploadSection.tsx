import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload } from "lucide-react";

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
        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer bg-white"
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="mx-auto w-12 h-12 text-gray-400 mb-3">
          <Upload className="w-full h-full" />
        </div>
        <p className="text-sm font-medium mb-1">点击或拖拽上传小票照片</p>
        <p className="text-xs text-gray-500 mb-3">支持 JPG、PNG 格式</p>
        <Button>选择图片</Button>
        <input 
          type="file" 
          ref={fileInputRef}
          accept="image/jpeg, image/png" 
          className="hidden" 
          onChange={handleFileChange}
        />
      </div>
      
      <div className="mt-2 text-xs text-gray-500 text-center">
        小票将使用 Gemini API 进行识别处理
      </div>
      
      {showAnalyzeButton && (
        <div className="mt-4 text-center">
          <Button 
            className="w-full bg-primary hover:bg-indigo-700"
            onClick={onAnalyze}
          >
            开始识别小票
          </Button>
        </div>
      )}
    </div>
  );
}
