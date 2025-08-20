
'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

const SettingsPage: React.FC = () => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profile, setProfile] = useState({
    name: '',
    email: '',
    avatar: '',
  });

  const [isLoading, setIsLoading] = useState(true);

  // Load data from localStorage on component mount
  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem('userProfile');
      if (savedProfile) {
        setProfile(JSON.parse(savedProfile));
      } else {
        // Set default values if nothing is in localStorage
        setProfile({
            name: 'Operator',
            email: 'operator@example.com',
            avatar: 'https://placehold.co/100x100.png',
        });
      }
    } catch (error) {
        console.error("Failed to parse user profile from localStorage", error);
        // Set default values on error
         setProfile({
            name: 'Operator',
            email: 'operator@example.com',
            avatar: 'https://placehold.co/100x100.png',
        });
    } finally {
        setIsLoading(false);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setProfile(prevProfile => ({
      ...prevProfile,
      [id]: value,
    }));
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile(prevProfile => ({
          ...prevProfile,
          avatar: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = () => {
    localStorage.setItem('userProfile', JSON.stringify(profile));
    toast({
      title: 'Profile Saved',
      description: 'Your profile has been updated successfully.',
    });
  };

  if (isLoading) {
    return (
       <div className="container mx-auto p-4 md:p-8 space-y-8">
         <Skeleton className="h-9 w-1/4" />
         <Card>
            <CardHeader>
                <Skeleton className="h-6 w-1/5" />
                <Skeleton className="h-4 w-2/5" />
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                    <Skeleton className="h-16 w-16 rounded-full" />
                    <Skeleton className="h-10 w-32" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                     <Skeleton className="h-4 w-12" />
                     <Skeleton className="h-10 w-full" />
                  </div>
                   <div className="space-y-2">
                     <Skeleton className="h-4 w-12" />
                     <Skeleton className="h-10 w-full" />
                  </div>
                </div>
                 <Skeleton className="h-10 w-24" />
            </CardContent>
         </Card>
       </div>
    )
  }

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8">
      <h1 className="text-3xl font-bold">Settings</h1>
      
      {/* Profile Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Manage your personal information and profile picture.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={profile.avatar} alt="Operator" data-ai-hint="profile picture" />
                  <AvatarFallback>{profile.name?.substring(0,2).toUpperCase() || 'OP'}</AvatarFallback>
                </Avatar>
                <Input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    className="hidden" 
                    accept="image/*"
                />
                <Button variant="outline" onClick={() => fileInputRef.current?.click()}>Change Picture</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={profile.name} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={profile.email} onChange={handleChange} />
              </div>
          </div>
           <Button onClick={handleSaveProfile}>Save Profile</Button>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Configure how you receive alerts and updates.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg border">
            <div>
              <Label htmlFor="email-notifications" className="font-medium">Email Notifications</Label>
              <p className="text-sm text-muted-foreground">Receive alerts via email for high-priority threats.</p>
            </div>
            <Switch id="email-notifications" defaultChecked />
          </div>
          <div className="flex items-center justify-between p-4 rounded-lg border">
            <div>
              <Label htmlFor="push-notifications" className="font-medium">Push Notifications</Label>
              <p className="text-sm text-muted-foreground">Get real-time push notifications on your devices.</p>
            </div>
            <Switch id="push-notifications" />
          </div>
           <Button>Save Notifications</Button>
        </CardContent>
      </Card>
      
      {/* Security Settings */}
       <Card>
        <CardHeader>
          <CardTitle>Security</CardTitle>
          <CardDescription>Manage your account security settings.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div>
                <Label htmlFor="password">Password</Label>
                <Button variant="outline" className="w-full mt-2">Change Password</Button>
            </div>
            <Separator />
             <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="2fa" className="font-medium">Two-Factor Authentication (2FA)</Label>
                  <p className="text-sm text-muted-foreground">Add an extra layer of security to your account.</p>
                </div>
                <Button variant="outline">Enable 2FA</Button>
            </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;
