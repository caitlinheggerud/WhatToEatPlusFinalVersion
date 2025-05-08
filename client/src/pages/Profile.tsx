import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserIcon, Settings, Bell, Heart, LogOut } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

function Profile() {
  const { toast } = useToast();
  
  const handleFeatureNotAvailable = (feature: string) => {
    toast({
      title: "Coming Soon",
      description: `${feature} will be available in a future update.`,
      variant: "default"
    });
  };
  
  return (
    <div className="py-6 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gradient">Profile</h1>
          <p className="text-muted-foreground mt-1">
            Manage your account preferences and settings
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        {/* Profile Summary Card */}
        <Card className="md:col-span-1 hover-card bg-white/70 shadow-sm border-border/60">
          <CardHeader className="pb-4">
            <div className="flex justify-center">
              <Avatar className="h-24 w-24">
                <AvatarImage src="" alt="Profile" />
                <AvatarFallback className="bg-gradient text-white text-xl">
                  <UserIcon className="h-10 w-10" />
                </AvatarFallback>
              </Avatar>
            </div>
            <CardTitle className="text-center mt-4">User Account</CardTitle>
            <CardDescription className="text-center">user@example.com</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => handleFeatureNotAvailable("Account Settings")}
              >
                <Settings className="mr-2 h-4 w-4" />
                Account Settings
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => handleFeatureNotAvailable("Notifications")}
              >
                <Bell className="mr-2 h-4 w-4" />
                Notifications
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => handleFeatureNotAvailable("Saved Recipes")}
              >
                <Heart className="mr-2 h-4 w-4" />
                Saved Recipes
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start text-destructive hover:text-destructive"
                onClick={() => handleFeatureNotAvailable("Sign Out")}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="md:col-span-3">
          <Card className="hover-card bg-white/70 shadow-sm border-border/60">
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
              <CardDescription>
                Manage your profile information and preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="account">
                <TabsList className="mb-6">
                  <TabsTrigger value="account">Account</TabsTrigger>
                  <TabsTrigger value="preferences">Food Preferences</TabsTrigger>
                  <TabsTrigger value="privacy">Privacy</TabsTrigger>
                </TabsList>
                
                <TabsContent value="account" className="space-y-4">
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      Account settings will be available in a future update.
                    </p>
                  </div>
                </TabsContent>
                
                <TabsContent value="preferences" className="space-y-4">
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      Food preference settings will be available in a future update.
                    </p>
                  </div>
                </TabsContent>
                
                <TabsContent value="privacy" className="space-y-4">
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      Privacy settings will be available in a future update.
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Profile;