export default function LoadingState() {
  return (
    <div className="text-center py-8">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
      <p className="text-sm font-medium text-gray-600">正在识别小票内容...</p>
      <p className="text-xs text-gray-500 mt-2">这可能需要几秒钟时间</p>
    </div>
  );
}
