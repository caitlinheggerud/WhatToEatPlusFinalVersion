import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SettingsIcon, BellIcon, ShieldIcon, UserIcon } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

function Settings() {
  return (
    <div className="py-6 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gradient">Settings</h1>
          <p className="text-muted-foreground mt-1">
            Manage your account settings and preferences
          </p>
        </div>
      </div>

      <Card className="hover-card bg-white/70 shadow-sm border-border/60">
        <CardHeader>
          <div className="flex flex-row items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <SettingsIcon className="h-4 w-4 text-primary" />
            </div>
            <div>
              <CardTitle>Application Settings</CardTitle>
              <CardDescription>
                Manage your application preferences
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="general">
            <TabsList className="mb-6">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="privacy">Privacy</TabsTrigger>
            </TabsList>
            
            <TabsContent value="general" className="space-y-6">
              <div className="flex flex-col gap-5">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Theme Preferences</h3>
                  <p className="text-sm text-muted-foreground">
                    Customize the application appearance
                  </p>
                </div>
                
                <div className="flex items-center justify-between py-3 border-t">
                  <div>
                    <h4 className="font-medium">Dark Mode</h4>
                    <p className="text-sm text-muted-foreground">
                      Toggle between light and dark themes
                    </p>
                  </div>
                  <Switch disabled />
                </div>
                
                <div className="flex items-center justify-between py-3 border-t">
                  <div>
                    <h4 className="font-medium">High Contrast</h4>
                    <p className="text-sm text-muted-foreground">
                      Increase contrast for better visibility
                    </p>
                  </div>
                  <Switch disabled />
                </div>
                
                <div className="mt-4 text-center text-sm text-muted-foreground">
                  This feature will be available in a future update.
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="notifications" className="space-y-6">
              <div className="flex flex-col gap-5">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Notification Settings</h3>
                  <p className="text-sm text-muted-foreground">
                    Configure how and when you receive notifications
                  </p>
                </div>
                
                <div className="flex items-center justify-between py-3 border-t">
                  <div>
                    <h4 className="font-medium">Email Notifications</h4>
                    <p className="text-sm text-muted-foreground">
                      Receive recipe recommendations via email
                    </p>
                  </div>
                  <Switch disabled />
                </div>
                
                <div className="flex items-center justify-between py-3 border-t">
                  <div>
                    <h4 className="font-medium">Push Notifications</h4>
                    <p className="text-sm text-muted-foreground">
                      Get alerts about new features and updates
                    </p>
                  </div>
                  <Switch disabled />
                </div>
                
                <div className="mt-4 text-center text-sm text-muted-foreground">
                  Notification settings will be available in a future update.
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="privacy" className="space-y-6">
              <div className="flex flex-col gap-5">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Privacy Settings</h3>
                  <p className="text-sm text-muted-foreground">
                    Control your data and privacy preferences
                  </p>
                </div>
                
                <div className="flex items-center justify-between py-3 border-t">
                  <div>
                    <h4 className="font-medium">Data Collection</h4>
                    <p className="text-sm text-muted-foreground">
                      Allow app to collect usage data to improve experience
                    </p>
                  </div>
                  <Switch disabled />
                </div>
                
                <div className="flex items-center justify-between py-3 border-t">
                  <div>
                    <h4 className="font-medium">Third-party Sharing</h4>
                    <p className="text-sm text-muted-foreground">
                      Control data sharing with third-party services
                    </p>
                  </div>
                  <Switch disabled />
                </div>
                
                <div className="mt-4 text-center text-sm text-muted-foreground">
                  Privacy settings will be available in a future update.
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

export default Settings;