import { X } from "lucide-react";

interface ImagePreviewProps {
  imageUrl: string;
  onRemove: () => void;
  className?: string;
}

export default function ImagePreview({ 
  imageUrl, 
  onRemove,
  className = ""
}: ImagePreviewProps) {
  return (
    <div className={className}>
      <div className="relative">
        <img 
          src={imageUrl} 
          alt="上传的小票" 
          className="w-full h-auto rounded-lg shadow-sm object-contain max-h-64 mx-auto" 
        />
        <button 
          className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-sm text-gray-500 hover:text-gray-700"
          onClick={onRemove}
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
