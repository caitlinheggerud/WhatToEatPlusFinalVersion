interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex-1 flex flex-col bg-slate-50">
      <div className="container mx-auto flex-1 px-4 py-6 md:py-8">
        {children}
      </div>
    </div>
  );
}