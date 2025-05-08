import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SettingsIcon, BellIcon, ShieldIcon, UserIcon } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

function Settings() {
  const { toast } = useToast();
  
  // Storage keys for settings
  const STORAGE_KEYS = {
    DARK_MODE: 'app-dark-mode',
    HIGH_CONTRAST: 'app-high-contrast',
    EMAIL_NOTIFICATIONS: 'app-email-notifications',
    PUSH_NOTIFICATIONS: 'app-push-notifications',
    DATA_COLLECTION: 'app-data-collection',
    THIRD_PARTY_SHARING: 'app-third-party-sharing'
  };

  // State for different settings
  const [darkMode, setDarkMode] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [dataCollection, setDataCollection] = useState(false);
  const [thirdPartySharing, setThirdPartySharing] = useState(false);

  // Load settings from localStorage
  useEffect(() => {
    // Load settings from localStorage
    const savedDarkMode = localStorage.getItem(STORAGE_KEYS.DARK_MODE) === 'true';
    setDarkMode(savedDarkMode);
    
    // Apply dark mode class if needed
    if (savedDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    setHighContrast(localStorage.getItem(STORAGE_KEYS.HIGH_CONTRAST) === 'true');
    setEmailNotifications(localStorage.getItem(STORAGE_KEYS.EMAIL_NOTIFICATIONS) === 'true');
    setPushNotifications(localStorage.getItem(STORAGE_KEYS.PUSH_NOTIFICATIONS) === 'true');
    setDataCollection(localStorage.getItem(STORAGE_KEYS.DATA_COLLECTION) === 'true');
    setThirdPartySharing(localStorage.getItem(STORAGE_KEYS.THIRD_PARTY_SHARING) === 'true');
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newValue = !darkMode;
    setDarkMode(newValue);
    localStorage.setItem(STORAGE_KEYS.DARK_MODE, String(newValue));
    
    // Apply dark mode class to html element
    if (newValue) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    toast({
      title: newValue ? 'Dark Mode Enabled' : 'Light Mode Enabled',
      description: `Application appearance updated to ${newValue ? 'dark' : 'light'} mode.`,
      duration: 3000,
    });
  };

  // Handle high contrast toggle
  const toggleHighContrast = () => {
    const newValue = !highContrast;
    setHighContrast(newValue);
    localStorage.setItem(STORAGE_KEYS.HIGH_CONTRAST, String(newValue));
    
    // Apply high contrast class to body
    if (newValue) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
    
    toast({
      title: newValue ? 'High Contrast Enabled' : 'High Contrast Disabled',
      description: `Display contrast has been ${newValue ? 'increased' : 'set to normal'}.`,
      duration: 3000,
    });
  };

  // Toggle email notifications
  const toggleEmailNotifications = () => {
    const newValue = !emailNotifications;
    setEmailNotifications(newValue);
    localStorage.setItem(STORAGE_KEYS.EMAIL_NOTIFICATIONS, String(newValue));
    
    toast({
      title: newValue ? 'Email Notifications Enabled' : 'Email Notifications Disabled',
      description: `You will ${newValue ? 'now' : 'no longer'} receive recipe recommendations via email.`,
      duration: 3000,
    });
  };

  // Toggle push notifications
  const togglePushNotifications = () => {
    const newValue = !pushNotifications;
    setPushNotifications(newValue);
    localStorage.setItem(STORAGE_KEYS.PUSH_NOTIFICATIONS, String(newValue));
    
    toast({
      title: newValue ? 'Push Notifications Enabled' : 'Push Notifications Disabled',
      description: `You will ${newValue ? 'now' : 'no longer'} receive push notifications.`,
      duration: 3000,
    });
  };

  // Toggle data collection
  const toggleDataCollection = () => {
    const newValue = !dataCollection;
    setDataCollection(newValue);
    localStorage.setItem(STORAGE_KEYS.DATA_COLLECTION, String(newValue));
    
    toast({
      title: newValue ? 'Data Collection Enabled' : 'Data Collection Disabled',
      description: `Usage data collection has been ${newValue ? 'enabled' : 'disabled'}.`,
      duration: 3000,
    });
  };

  // Toggle third-party sharing
  const toggleThirdPartySharing = () => {
    const newValue = !thirdPartySharing;
    setThirdPartySharing(newValue);
    localStorage.setItem(STORAGE_KEYS.THIRD_PARTY_SHARING, String(newValue));
    
    toast({
      title: newValue ? 'Data Sharing Enabled' : 'Data Sharing Disabled',
      description: `Third-party data sharing has been ${newValue ? 'enabled' : 'disabled'}.`,
      duration: 3000,
    });
  };

  // Don't render until after mounting to prevent hydration mismatch
  if (!mounted) return null;

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

      <Card className="hover-card bg-white/70 shadow-sm border-border/60 dark:bg-gray-800 dark:border-gray-700">
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
                  <Switch 
                    checked={theme === 'dark'} 
                    onCheckedChange={toggleDarkMode} 
                  />
                </div>
                
                <div className="flex items-center justify-between py-3 border-t">
                  <div>
                    <h4 className="font-medium">High Contrast</h4>
                    <p className="text-sm text-muted-foreground">
                      Increase contrast for better visibility
                    </p>
                  </div>
                  <Switch 
                    checked={highContrast} 
                    onCheckedChange={toggleHighContrast} 
                  />
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
                  <Switch 
                    checked={emailNotifications} 
                    onCheckedChange={toggleEmailNotifications} 
                  />
                </div>
                
                <div className="flex items-center justify-between py-3 border-t">
                  <div>
                    <h4 className="font-medium">Push Notifications</h4>
                    <p className="text-sm text-muted-foreground">
                      Get alerts about new features and updates
                    </p>
                  </div>
                  <Switch 
                    checked={pushNotifications} 
                    onCheckedChange={togglePushNotifications} 
                  />
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
                  <Switch 
                    checked={dataCollection} 
                    onCheckedChange={toggleDataCollection} 
                  />
                </div>
                
                <div className="flex items-center justify-between py-3 border-t">
                  <div>
                    <h4 className="font-medium">Third-party Sharing</h4>
                    <p className="text-sm text-muted-foreground">
                      Control data sharing with third-party services
                    </p>
                  </div>
                  <Switch 
                    checked={thirdPartySharing} 
                    onCheckedChange={toggleThirdPartySharing} 
                  />
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