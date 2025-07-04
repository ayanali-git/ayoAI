'use client';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Crown } from 'lucide-react';

export default function UpgradePage() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl mx-auto">
        <Button variant="ghost" className="mb-6" onClick={() => router.back()}>
          <ChevronLeft className="w-4 h-4 mr-1" /> Back to Chat
        </Button>
        <Card className="border-muted shadow-xl">
          <CardHeader className="text-center">
            <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 mb-2">
              <Crown className="w-4 h-4 mr-1" /> Upgrade Your Plan
            </Badge>
            <CardTitle className="text-3xl font-bold mb-2">Unlock More with ayoAI Pro</CardTitle>
            <CardDescription>Choose the plan that fits your needs and boost your productivity.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            {/* Free Plan */}
            <Card className="border-muted">
              <CardHeader>
                <CardTitle className="text-xl">Free</CardTitle>
                <CardDescription>Perfect for trying out ayoAI</CardDescription>
                <div className="text-3xl font-bold">₹0</div>
                <div className="text-sm text-muted-foreground">per month</div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center text-sm">
                  <span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span>
                  10 AI conversations/day
                </div>
                <div className="flex items-center text-sm">
                  <span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span>
                  5 image generations/day
                </div>
                <div className="flex items-center text-sm">
                  <span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span>
                  Basic document analysis
                </div>
                <Button variant="outline" className="w-full mt-4" disabled>Current Plan</Button>
              </CardContent>
            </Card>
            {/* Pro Plan */}
            <Card className="border-primary shadow-lg relative">
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-gradient-to-r from-blue-500 to-purple-600">Most Popular</Badge>
              </div>
              <CardHeader>
                <CardTitle className="text-xl">Pro</CardTitle>
                <CardDescription>For power users and professionals</CardDescription>
                <div className="text-3xl font-bold">₹99</div>
                <div className="text-sm text-muted-foreground">per month</div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center text-sm">
                  <span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span>
                  Unlimited AI conversations
                </div>
                <div className="flex items-center text-sm">
                  <span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span>
                  100 image generations/day
                </div>
                <div className="flex items-center text-sm">
                  <span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span>
                  Advanced document analysis
                </div>
                <div className="flex items-center text-sm">
                  <span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span>
                  Priority support
                </div>
                <Button className="w-full mt-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold">Upgrade to Pro</Button>
              </CardContent>
            </Card>
            {/* Ultra Pro Plan */}
            <Card className="border-muted">
              <CardHeader>
                <CardTitle className="text-xl">Ultra Pro</CardTitle>
                <CardDescription>For teams and heavy users</CardDescription>
                <div className="text-3xl font-bold">₹199</div>
                <div className="text-sm text-muted-foreground">per month</div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center text-sm">
                  <span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span>
                  Everything in Pro
                </div>
                <div className="flex items-center text-sm">
                  <span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span>
                  Unlimited image generations
                </div>
                <div className="flex items-center text-sm">
                  <span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span>
                  Team collaboration
                </div>
                <div className="flex items-center text-sm">
                  <span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span>
                  API access
                </div>
                <Button variant="outline" className="w-full mt-4">Contact Sales</Button>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 