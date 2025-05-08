import React, { useEffect, useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from '@/hooks/use-toast';
import { getInventoryItems, addInventoryItem, deleteInventoryItem } from '../lib/api';
import { 
  PlusIcon, 
  Trash2Icon, 
  RefreshCwIcon, 
  SearchIcon,
  AlertCircleIcon,
  Loader2Icon,
  PackageIcon,
  CalendarIcon
} from 'lucide-react';
import { format, parseISO, isValid, addDays } from 'date-fns';

type InventoryItem = {
  id: number;
  name: string;
  description: string | null;
  quantity: string;
  category: string;
  expiryDate: string | null;
  isInInventory: boolean;
  createdAt: string;
  updatedAt: string;
  sourceReceiptId: number | null;
};

const categories = [
  "Produce", 
  "Meat", 
  "Seafood", 
  "Dairy", 
  "Bakery", 
  "Pantry", 
  "Frozen", 
  "Beverages", 
  "Snacks", 
  "Other"
];

function Inventory() {
  const { toast } = useToast();
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showNewItemForm, setShowNewItemForm] = useState<boolean>(false);
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    quantity: '1',
    category: 'Other',
    expiryDate: null as string | null
  });

  // Fetch inventory items
  const fetchInventoryItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getInventoryItems();
      setInventoryItems(data);
    } catch (err) {
      console.error("Error fetching inventory items:", err);
      setError("Failed to load inventory items. Please try again.");
      toast({
        title: "Error",
        description: "Failed to load inventory items",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventoryItems();
  }, []);

  // Add new item
  const handleAddItem = async () => {
    if (!newItem.name) {
      toast({
        title: "Error",
        description: "Item name is required",
        variant: "destructive",
      });
      return;
    }

    try {
      await addInventoryItem({
        ...newItem,
        isInInventory: true
      });
      
      setNewItem({
        name: '',
        description: '',
        quantity: '1',
        category: 'Other',
        expiryDate: null
      });
      
      setShowNewItemForm(false);
      
      toast({
        title: "Success",
        description: "Item added to inventory",
        variant: "default",
      });
      
      // Refresh inventory
      fetchInventoryItems();
    } catch (err) {
      console.error("Error adding inventory item:", err);
      toast({
        title: "Error",
        description: "Failed to add item to inventory",
        variant: "destructive",
      });
    }
  };

  // Delete item
  const handleDeleteItem = async (id: number) => {
    try {
      await deleteInventoryItem(id);
      
      toast({
        title: "Success",
        description: "Item removed from inventory",
        variant: "default",
      });
      
      // Refresh inventory
      fetchInventoryItems();
    } catch (err) {
      console.error("Error deleting inventory item:", err);
      toast({
        title: "Error",
        description: "Failed to remove item from inventory",
        variant: "destructive",
      });
    }
  };

  // Filter items based on category and search term
  const filteredItems = inventoryItems.filter(item => {
    const matchesCategory = filter === 'all' || item.category === filter;
    const matchesSearch = searchTerm === '' || 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Group items by category for the "By Category" tab
  const itemsByCategory: Record<string, InventoryItem[]> = {};
  filteredItems.forEach(item => {
    if (!itemsByCategory[item.category]) {
      itemsByCategory[item.category] = [];
    }
    itemsByCategory[item.category].push(item);
  });

  // Check if an item is expiring soon (within 3 days)
  const isExpiringSoon = (expiryDate: string | null): boolean => {
    if (!expiryDate) return false;
    try {
      const date = parseISO(expiryDate);
      if (!isValid(date)) return false;
      
      const today = new Date();
      const threeDaysFromNow = addDays(today, 3);
      
      return date <= threeDaysFromNow && date >= today;
    } catch (err) {
      return false;
    }
  };

  // Format the expiry date
  const formatExpiryDate = (expiryDate: string | null): string => {
    if (!expiryDate) return 'No expiry date';
    try {
      const date = parseISO(expiryDate);
      if (!isValid(date)) return 'Invalid date';
      return format(date, 'MMM d, yyyy');
    } catch (err) {
      return 'Invalid date';
    }
  };

  return (
    <div className="py-6 space-y-8 container mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gradient">Inventory</h1>
          <p className="text-muted-foreground mt-1">
            Manage your food items and ingredients
          </p>
        </div>
        <div className="flex space-x-2">
          <Button 
            onClick={() => setShowNewItemForm(true)} 
            className="bg-gradient"
          >
            <PlusIcon className="mr-2 h-4 w-4" />
            Add Item
          </Button>
          <Button 
            onClick={fetchInventoryItems} 
            variant="outline"
          >
            <RefreshCwIcon className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative md:col-span-2">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            className="pl-10"
            placeholder="Search items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger>
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>{category}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* New Item Form */}
      {showNewItemForm && (
        <Card className="border-primary/20 bg-white/70">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Add New Item</CardTitle>
            <CardDescription>
              Add a new item to your inventory
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Item Name</Label>
                <Input
                  id="name"
                  placeholder="Enter item name"
                  value={newItem.name}
                  onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  placeholder="1"
                  value={newItem.quantity}
                  onChange={(e) => setNewItem({...newItem, quantity: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select 
                  value={newItem.category} 
                  onValueChange={(value) => setNewItem({...newItem, category: value})}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="expiryDate">Expiry Date (Optional)</Label>
                <Input
                  id="expiryDate"
                  type="date"
                  value={newItem.expiryDate || ''}
                  onChange={(e) => setNewItem({...newItem, expiryDate: e.target.value})}
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Input
                  id="description"
                  placeholder="Enter description"
                  value={newItem.description}
                  onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <Button 
                variant="outline" 
                onClick={() => setShowNewItemForm(false)}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleAddItem} 
                className="bg-gradient"
              >
                <PlusIcon className="mr-2 h-4 w-4" />
                Add Item
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2Icon className="h-8 w-8 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Loading inventory items...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-12 text-destructive">
          <AlertCircleIcon className="h-8 w-8 mb-4" />
          <p>{error}</p>
          <Button 
            onClick={fetchInventoryItems} 
            variant="outline"
            className="mt-4"
          >
            <RefreshCwIcon className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        </div>
      ) : (
        <>
          {inventoryItems.length === 0 ? (
            <Card className="bg-white/70 border-border/60">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <PackageIcon className="h-12 w-12 text-muted-foreground opacity-40 mb-4" />
                <h3 className="text-xl font-medium mb-2">Your inventory is empty</h3>
                <p className="text-muted-foreground mb-6 text-center max-w-md">
                  Add items to your inventory by uploading receipts or by adding items manually.
                </p>
                <Button 
                  onClick={() => setShowNewItemForm(true)} 
                  className="bg-gradient"
                >
                  <PlusIcon className="mr-2 h-4 w-4" />
                  Add First Item
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Tabs defaultValue="list" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="list">List View</TabsTrigger>
                <TabsTrigger value="category">By Category</TabsTrigger>
              </TabsList>
              
              <TabsContent value="list">
                <div className="rounded-md border bg-white/70">
                  {filteredItems.length === 0 ? (
                    <div className="py-8 text-center text-muted-foreground">
                      No items match your filter criteria
                    </div>
                  ) : (
                    <div className="relative overflow-x-auto">
                      <table className="w-full text-sm text-left">
                        <thead className="text-xs uppercase bg-muted/30">
                          <tr>
                            <th className="px-6 py-3">Item</th>
                            <th className="px-6 py-3">Category</th>
                            <th className="px-6 py-3">Quantity</th>
                            <th className="px-6 py-3">Expiry</th>
                            <th className="px-6 py-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredItems.map((item) => (
                            <tr key={item.id} className="border-t hover:bg-muted/20">
                              <td className="px-6 py-4 font-medium">
                                {item.name}
                                {item.description && (
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {item.description}
                                  </p>
                                )}
                              </td>
                              <td className="px-6 py-4">
                                <span className="px-2 py-1 rounded-full text-xs bg-primary/10 text-primary">
                                  {item.category}
                                </span>
                              </td>
                              <td className="px-6 py-4">{item.quantity}</td>
                              <td className="px-6 py-4">
                                {item.expiryDate ? (
                                  <div className="flex items-center">
                                    <CalendarIcon className="h-3 w-3 mr-1" />
                                    <span className={isExpiringSoon(item.expiryDate) ? 'text-destructive font-medium' : ''}>
                                      {formatExpiryDate(item.expiryDate)}
                                      {isExpiringSoon(item.expiryDate) && ' (Soon)'}
                                    </span>
                                  </div>
                                ) : (
                                  <span className="text-muted-foreground text-xs">None</span>
                                )}
                              </td>
                              <td className="px-6 py-4 text-right">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteItem(item.id)}
                                  className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                                >
                                  <Trash2Icon className="h-4 w-4" />
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="category">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.keys(itemsByCategory).length === 0 ? (
                    <div className="col-span-full py-8 text-center text-muted-foreground bg-white/70 rounded-md border">
                      No items match your filter criteria
                    </div>
                  ) : (
                    Object.entries(itemsByCategory).map(([category, items]) => (
                      <Card key={category} className="bg-white/70 border-border/60">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg">{category}</CardTitle>
                          <CardDescription>
                            {items.length} item{items.length !== 1 ? 's' : ''}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {items.map((item) => (
                              <li key={item.id} className="flex justify-between items-center p-2 rounded-md hover:bg-muted/20">
                                <div>
                                  <p className="font-medium">{item.name}</p>
                                  <p className="text-xs text-muted-foreground">{item.quantity}</p>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteItem(item.id)}
                                  className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                                >
                                  <Trash2Icon className="h-4 w-4" />
                                </Button>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </TabsContent>
            </Tabs>
          )}
        </>
      )}
    </div>
  );
}

export default Inventory;
