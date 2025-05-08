import { useState } from "react";
import UploadSection from "@/components/UploadSection";
import ImagePreview from "@/components/ImagePreview";
import LoadingState from "@/components/LoadingState";
import ErrorState from "@/components/ErrorState";
import ResultSection from "@/components/ResultSection";
import { useToast } from "@/hooks/use-toast";
import { analyzeReceipt, saveReceiptItems } from "@/lib/api";
import { type ReceiptItemResponse } from "@shared/schema";

type AppState = "upload" | "loading" | "error" | "preview" | "results";

export default function Home() {
  const [state, setState] = useState<AppState>("upload");
  const [file, setFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState<string>("");
  const [items, setItems] = useState<ReceiptItemResponse[]>([]);
  const { toast } = useToast();

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    
    // Create preview URL
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
      setState("preview");
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleAnalyze = async () => {
    if (!file) return;
    
    setState("loading");
    
    try {
      const result = await analyzeReceipt(file);
      setItems(result);
      setState("results");
    } catch (err) {
      console.error("Error analyzing receipt:", err);
      setError(err instanceof Error ? err.message : "Failed to analyze receipt");
      setState("error");
    }
  };

  const handleSaveResults = async () => {
    try {
      await saveReceiptItems(items);
      toast({
        title: "保存成功",
        description: "小票数据已保存",
      });
    } catch (err) {
      console.error("Error saving receipt items:", err);
      toast({
        title: "保存失败",
        description: err instanceof Error ? err.message : "Failed to save receipt items",
        variant: "destructive",
      });
    }
  };

  const handleRetry = () => {
    setState("upload");
    setFile(null);
    setImagePreview(null);
    setError("");
    setItems([]);
  };

  const handleRemoveImage = () => {
    setState("upload");
    setFile(null);
    setImagePreview(null);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="min-h-screen max-w-md mx-auto px-4 py-8">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold text-center">小票识别</h1>
          <p className="text-sm text-gray-500 text-center mt-1">上传小票照片，自动识别消费项目</p>
        </header>

        <main>
          {/* Upload Section - Always visible in upload and preview states */}
          {(state === "upload" || state === "preview") && (
            <UploadSection 
              onFileSelect={handleFileSelect}
              onAnalyze={handleAnalyze}
              showAnalyzeButton={state === "preview"}
            />
          )}

          {/* Loading State */}
          {state === "loading" && (
            <LoadingState />
          )}

          {/* Error State */}
          {state === "error" && (
            <ErrorState 
              message={error} 
              onRetry={handleRetry} 
            />
          )}

          {/* Image Preview - Visible in preview, loading, and results states */}
          {imagePreview && (state === "preview" || state === "loading" || state === "results") && (
            <ImagePreview 
              imageUrl={imagePreview} 
              onRemove={handleRemoveImage}
              className="mb-6"
            />
          )}

          {/* Results Section */}
          {state === "results" && (
            <ResultSection 
              items={items} 
              onNewUpload={handleRetry}
              onSaveResults={handleSaveResults}
            />
          )}
        </main>
      </div>
    </div>
  );
}
