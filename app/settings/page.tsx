'use client';
import { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/use-auth';
import { useSubscription } from '@/components/subscription-provider';
import { supabase } from '@/lib/supabase';
import { toast } from 'react-hot-toast';
import {
  ChevronLeft,
  Camera,
  User,
  Shield,
  Bell,
  Palette,
  Crown,
  Loader2,
  Check,
  Upload
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function SettingsPage() {
  const { user, loading } = useAuth();
  const { plan: userPlan } = useSubscription();
  const [profile, setProfile] = useState({ name: '', email: '', plan: '' });
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Notification preferences
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);

  const planLabels: { [key: string]: string } = {
    'free': 'Free',
    'pro': 'Pro',
    'plus': 'Plus'
  };

  useEffect(() => {
    if (user) {
      setProfile({
        name: user.user_metadata?.name || '',
        email: user.email || '',
        plan: user.user_metadata?.plan || 'free',
      });
      setAvatarUrl(user.user_metadata?.avatar_url || null);
    }
  }, [user]);

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image size should be less than 2MB');
      return;
    }

    setUploading(true);
    try {
      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${user!.id}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        // If bucket doesn't exist, create a local URL instead
        if (uploadError.message.includes('Bucket not found') || uploadError.message.includes('bucket')) {
          // Fallback: Use base64 data URL
          const reader = new FileReader();
          reader.onload = async (e) => {
            const base64Url = e.target?.result as string;

            // Update user metadata with base64 avatar
            const { error: updateError } = await supabase.auth.updateUser({
              data: { avatar_url: base64Url },
            });

            if (updateError) {
              throw updateError;
            }

            setAvatarUrl(base64Url);
            toast.success('Profile picture updated!');
          };
          reader.readAsDataURL(file);
          return;
        }
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Update user metadata with avatar URL
      const { error: updateError } = await supabase.auth.updateUser({
        data: { avatar_url: publicUrl },
      });

      if (updateError) {
        throw updateError;
      }

      setAvatarUrl(publicUrl);
      toast.success('Profile picture updated!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: { name: profile.name },
      });
      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Profile updated!');
      }
    } catch (err) {
      toast.error('An error occurred');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Password changed successfully!');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      toast.error('An error occurred');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-background/80 backdrop-blur-xl sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Button
            variant="ghost"
            className="text-muted-foreground hover:text-foreground hover:bg-secondary"
            onClick={() => router.back()}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Chat
          </Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Page Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
            <p className="text-muted-foreground">Manage your profile and account settings</p>
          </div>

          <div className="grid gap-6">
            {/* Profile Section */}
            <Card className="bg-card border-border">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-500/10">
                    <User className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <CardTitle className="text-foreground">Profile Information</CardTitle>
                    <CardDescription className="text-muted-foreground">Update your personal details</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileUpdate} className="space-y-6">
                  {/* Avatar Upload */}
                  <div className="flex items-center gap-6">
                    <div className="relative group">
                      <Avatar className="w-24 h-24 ring-4 ring-purple-500/20">
                        <AvatarImage src={avatarUrl || undefined} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-2xl">
                          {profile.name?.[0] || profile.email?.[0] || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        disabled={uploading}
                      >
                        {uploading ? (
                          <Loader2 className="w-6 h-6 text-white animate-spin" />
                        ) : (
                          <Camera className="w-6 h-6 text-white" />
                        )}
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        className="hidden"
                      />
                    </div>
                    <div>
                      <h3 className="text-foreground font-medium mb-1">Profile Picture</h3>
                      <p className="text-sm text-muted-foreground mb-3">Click on the avatar to upload a new photo</p>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="border-border text-muted-foreground hover:text-foreground hover:bg-secondary"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Image
                      </Button>
                    </div>
                  </div>

                  <Separator className="bg-border" />

                  {/* Name Field */}
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-foreground">Full Name</Label>
                    <Input
                      id="name"
                      value={profile.name}
                      onChange={e => setProfile({ ...profile, name: e.target.value })}
                      className="bg-secondary border-border text-foreground placeholder:text-muted-foreground focus:border-purple-500/50"
                      placeholder="Enter your name"
                    />
                  </div>

                  {/* Email Field */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-foreground">Email Address</Label>
                    <Input
                      id="email"
                      value={profile.email}
                      disabled
                      className="bg-secondary border-border text-muted-foreground"
                    />
                    <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Subscription Section */}
            <Card className="bg-card border-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-yellow-500/10">
                      <Crown className="w-5 h-5 text-yellow-500" />
                    </div>
                    <div>
                      <CardTitle className="text-foreground">Subscription</CardTitle>
                      <CardDescription className="text-muted-foreground">Manage your plan</CardDescription>
                    </div>
                  </div>
                  <Badge className={`${userPlan === 'pro'
                    ? 'bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/30'
                    : userPlan === 'ultra'
                      ? 'bg-purple-500/20 text-purple-600 dark:text-purple-400 border-purple-500/30'
                      : 'bg-secondary text-muted-foreground border-border'
                    }`}>
                    {planLabels[userPlan]}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 rounded-lg bg-secondary border border-border">
                  <div>
                    <h3 className="text-foreground font-medium mb-1">Current Plan: {planLabels[userPlan]}</h3>
                    <p className="text-sm text-muted-foreground">
                      {userPlan === 'free'
                        ? 'Upgrade to unlock more features'
                        : 'You have access to all premium features'
                      }
                    </p>
                  </div>
                  <Button
                    variant={userPlan === 'free' ? 'default' : 'outline'}
                    className={userPlan === 'free'
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white'
                      : 'border-border text-muted-foreground hover:text-foreground hover:bg-secondary'
                    }
                    onClick={() => router.push('/upgrade')}
                  >
                    {userPlan === 'free' ? 'Upgrade Now' : 'Manage Plan'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Security Section */}
            <Card className="bg-card border-border">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-red-500/10">
                    <Shield className="w-5 h-5 text-red-500" />
                  </div>
                  <div>
                    <CardTitle className="text-foreground">Security</CardTitle>
                    <CardDescription className="text-muted-foreground">Update your password</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="newPassword" className="text-foreground">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      className="bg-secondary border-border text-foreground placeholder:text-muted-foreground focus:border-purple-500/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-foreground">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      className="bg-secondary border-border text-foreground placeholder:text-muted-foreground focus:border-purple-500/50"
                    />
                  </div>
                  <Button
                    type="submit"
                    variant="outline"
                    className="w-full border-border text-foreground hover:bg-secondary"
                    disabled={saving || !newPassword || !confirmPassword}
                  >
                    {saving ? 'Updating...' : 'Update Password'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Notifications Section */}
            <Card className="bg-card border-border">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/10">
                    <Bell className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <CardTitle className="text-foreground">Notifications</CardTitle>
                    <CardDescription className="text-muted-foreground">Manage your notification preferences</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-secondary">
                  <div>
                    <h3 className="text-foreground font-medium">Email Notifications</h3>
                    <p className="text-sm text-muted-foreground">Receive updates about your conversations</p>
                  </div>
                  <Switch
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                  />
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-secondary">
                  <div>
                    <h3 className="text-foreground font-medium">Marketing Emails</h3>
                    <p className="text-sm text-muted-foreground">Receive news and promotional content</p>
                  </div>
                  <Switch
                    checked={marketingEmails}
                    onCheckedChange={setMarketingEmails}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
}