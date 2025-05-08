export default function LoadingState() {
  return (
    <div className="text-center py-10">
      <div className="inline-block h-14 w-14 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-middle">
        <div className="absolute inset-0 rounded-full bg-primary/10"></div>
      </div>
      <p className="mt-6 text-lg font-medium">Analyzing receipt...</p>
      <p className="mt-2 text-sm text-muted-foreground">Using AI to recognize items and prices</p>
      <div className="mt-4 flex items-center justify-center gap-1">
        <div className="h-2 w-2 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]"></div>
        <div className="h-2 w-2 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]"></div>
        <div className="h-2 w-2 rounded-full bg-primary animate-bounce"></div>
      </div>
    </div>
  );
}
