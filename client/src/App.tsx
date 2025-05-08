import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Dashboard from "@/pages/Dashboard";
import Inventory from "@/pages/Inventory";
import Recipes from "@/pages/Recipes";
import Receipts from "@/pages/Receipts";
import { Navbar } from "@/components/ui/navbar";
import { Toaster } from "@/components/ui/toaster";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home}/>
      <Route path="/dashboard" component={Dashboard}/>
      <Route path="/inventory" component={Inventory}/>
      <Route path="/recipes" component={Recipes}/>
      <Route path="/receipts" component={Receipts}/>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="flex min-h-screen flex-col bg-background">
          <Navbar />
          <main className="flex-1 container mx-auto">
            <Router />
          </main>
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
