import React from 'react';

function Inventory() {
  return (
    <div className="py-6 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gradient">Inventory</h1>
          <p className="text-muted-foreground mt-1">
            Manage your food items and ingredients
          </p>
        </div>
      </div>
      <div className="p-4 bg-white/70 rounded-lg border border-border/60 shadow-sm">
        <p className="text-center text-muted-foreground py-12">
          Your inventory management page is coming soon.
        </p>
      </div>
    </div>
  );
}

export default Inventory;
