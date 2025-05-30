import { useState } from "react";
import UploadSection from "@/components/UploadSection";
import ImagePreview from "@/components/ImagePreview";
import LoadingState from "@/components/LoadingState";
import ErrorState from "@/components/ErrorState";
import ResultSection from "@/components/ResultSection";
import { HeroSection } from "@/components/ui/hero-section";
import { useToast } from "@/hooks/use-toast";
import { analyzeReceipt, saveReceiptItems, addReceiptToInventory } from "@/lib/api";
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
      const receipt = await saveReceiptItems(items);
      setReceiptId(receipt.id);
      toast({
        title: "Saved Successfully",
        description: "Receipt data has been saved",
      });
    } catch (err) {
      console.error("Error saving receipt items:", err);
      toast({
        title: "Save Failed",
        description: err instanceof Error ? err.message : "Failed to save receipt items",
        variant: "destructive",
      });
    }
  };
  
  const [receiptId, setReceiptId] = useState<number | null>(null);
  
  const handleAddToInventory = async () => {
    if (!receiptId) {
      // If receipt isn't saved yet, save it first
      try {
        const receipt = await saveReceiptItems(items);
        setReceiptId(receipt.id);
        
        // Then add to inventory
        await addReceiptToInventory(receipt.id);
      } catch (err) {
        console.error("Error adding receipt to inventory:", err);
        toast({
          title: "Failed to Add to Inventory",
          description: err instanceof Error ? err.message : "An error occurred adding items to inventory",
          variant: "destructive",
        });
      }
    } else {
      // Receipt already saved, just add to inventory
      try {
        await addReceiptToInventory(receiptId);
      } catch (err) {
        console.error("Error adding receipt to inventory:", err);
        toast({
          title: "Failed to Add to Inventory",
          description: err instanceof Error ? err.message : "An error occurred adding items to inventory",
          variant: "destructive",
        });
      }
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
    <div>
      {state === "upload" && (
        <div className="space-y-8 pb-8">
          <div className="container max-w-4xl mx-auto mt-8">
            <div className="rounded-lg border bg-card p-8 shadow">
              <h2 className="text-xl font-semibold mb-4">Upload Receipt</h2>
              <p className="text-muted-foreground mb-6">
                Upload your receipt photo and let AI automatically recognize items and prices.
              </p>
              <UploadSection 
                onFileSelect={handleFileSelect}
                onAnalyze={handleAnalyze}
                showAnalyzeButton={false}
              />
            </div>
          </div>
        </div>
      )}
      
      {/* Preview State */}
      {state === "preview" && (
        <div className="container max-w-md mx-auto px-4 py-8">
          <h2 className="text-xl font-semibold mb-4 text-center">Confirm Receipt Image</h2>
          <ImagePreview 
            imageUrl={imagePreview!} 
            onRemove={handleRemoveImage}
            className="mb-6"
          />
          <div className="flex justify-center">
            <button 
              onClick={handleAnalyze}
              className="bg-gradient py-2 px-4 rounded-md shadow-sm flex items-center justify-center text-white font-medium"
            >
              Analyze Image
            </button>
          </div>
        </div>
      )}

      {/* Loading State */}
      {state === "loading" && (
        <div className="container max-w-md mx-auto px-4 py-8">
          <LoadingState />
        </div>
      )}

      {/* Error State */}
      {state === "error" && (
        <div className="container max-w-md mx-auto px-4 py-8">
          <ErrorState 
            message={error} 
            onRetry={handleRetry} 
          />
        </div>
      )}

      {/* Results Section */}
      {state === "results" && (
        <div className="container max-w-md mx-auto px-4 py-8">
          <ResultSection 
            items={items} 
            onNewUpload={handleRetry}
            onSaveResults={handleSaveResults}
            onAddToInventory={handleAddToInventory}
          />
        </div>
      )}
    </div>
  );
}
