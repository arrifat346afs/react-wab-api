import React, { useEffect, useState } from "react";
import TopNavigation from "../dashboard/layout/TopNavigation";
import Sidebar from "../dashboard/layout/Sidebar";
import { UserProfile } from "../dashboard/UserProfile";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, CheckCircle2, AlertCircle, Zap } from "lucide-react";
import { useAuth } from "../../../supabase/auth";
import { supabase } from "../../../supabase/supabase";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";

const Dashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchSubscription();
    }
  }, [user]);

  const fetchSubscription = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1);

      if (error) throw error;

      if (data && data.length > 0) {
        setSubscription(data[0]);
      }
    } catch (error) {
      console.error("Error fetching subscription:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    toast({
      title: "Download started",
      description: "Your download should begin shortly.",
      variant: "default",
    });
    // In a real app, this would trigger the actual download
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const hasActiveSubscription =
    subscription && subscription.status === "active";

  return (
    <div className="min-h-screen bg-background">
      <TopNavigation />
      <Toaster />

      <div className="flex pt-16">
        <Sidebar activeItem="Dashboard" />

        <main className="flex-1 overflow-auto p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Welcome to Your Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your subscription and download the MetaGen desktop app.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Subscription Status Card */}
            <Card className="border border-border shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-blue-500" />
                  Subscription Status
                </CardTitle>
                <CardDescription>
                  Your current subscription details
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="py-4 text-muted-foreground">
                    Loading subscription details...
                  </div>
                ) : hasActiveSubscription ? (
                  <div className="space-y-4">
                    <div className="flex items-start gap-2 bg-green-950/30 p-3 rounded-md">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <p className="font-medium text-green-400">
                          Active Subscription
                        </p>
                        <p className="text-sm text-green-500/80">
                          Your subscription is active and in good standing.
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Plan</p>
                        <p className="font-medium">
                          {subscription.metadata?.plan_name || "Premium"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Status</p>
                        <p className="font-medium capitalize">
                          {subscription.status}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Started</p>
                        <p className="font-medium">
                          {formatDate(subscription.started_at)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Next Billing
                        </p>
                        <p className="font-medium">
                          {formatDate(subscription.current_period_end)}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-start gap-2 bg-amber-950/30 p-3 rounded-md">
                      <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
                      <div>
                        <p className="font-medium text-amber-400">
                          No Active Subscription
                        </p>
                        <p className="text-sm text-amber-500/80">
                          You don't have an active subscription. Subscribe to
                          access the desktop app.
                        </p>
                      </div>
                    </div>
                    <Button
                      className="mt-4 bg-blue-700 hover:bg-blue-600 text-white"
                      onClick={() => (window.location.href = "/")}
                    >
                      View Subscription Plans
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Desktop App Download Card */}
            <Card className="border border-border shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5 text-blue-500" />
                  Desktop App
                </CardTitle>
                <CardDescription>
                  Download the MetaGen AI desktop application
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <img
                    src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80"
                    alt="Desktop App Screenshot"
                    className="rounded-md shadow-sm w-full h-40 object-cover"
                  />

                  <div className="space-y-2">
                    <h3 className="font-medium">App Features:</h3>
                    <ul className="space-y-2">
                      {[
                        "Bulk content processing",
                        "Advanced metadata customization",
                        "Offline processing capability",
                        "Export in multiple formats",
                        "Content performance tracking",
                      ].map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={handleDownload}
                  className="w-full bg-blue-700 hover:bg-blue-600 text-white"
                  disabled={!hasActiveSubscription}
                >
                  <Download className="mr-2 h-4 w-4" />
                  {!hasActiveSubscription
                    ? "Subscription Required"
                    : "Download Desktop App"}
                </Button>
                {!hasActiveSubscription && (
                  <p className="text-sm text-muted-foreground mt-2 text-center w-full">
                    Active subscription required to download the app
                  </p>
                )}
              </CardFooter>
            </Card>

            {/* User Profile Card */}
            <Card className="border border-border shadow-sm md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  User Profile
                </CardTitle>
              </CardHeader>
              <CardContent>
                <UserProfile />
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
