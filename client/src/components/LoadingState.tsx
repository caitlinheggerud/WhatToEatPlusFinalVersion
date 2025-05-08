export default function LoadingState() {
  return (
    <div className="text-center py-8">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
      <p className="text-sm font-medium text-gray-600">Analyzing receipt content...</p>
      <p className="text-xs text-gray-500 mt-2">This may take a few seconds</p>
    </div>
  );
}
