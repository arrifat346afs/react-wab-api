import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Download, CheckCircle2, AlertCircle } from "lucide-react";
import { useAuth } from "../../../supabase/auth";
import { useToast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";

interface WindowsAppDownloadProps {
  hasActiveSubscription?: boolean;
}

export default function WindowsAppDownload({
  hasActiveSubscription = false,
}: WindowsAppDownloadProps) {
  const { user } = useAuth();
  const { toast } = useToast();

  const handleDownload = () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to download the Windows app.",
        variant: "default",
      });
      return;
    }

    if (!hasActiveSubscription) {
      toast({
        title: "Subscription required",
        description:
          "You need an active subscription to download the Windows app.",
        variant: "destructive",
      });
      return;
    }

    // Trigger download
    toast({
      title: "Download started",
      description: "Your download should begin shortly.",
      variant: "default",
    });

    // In a real app, this would be a link to the actual download file
    // For demo purposes, we're just showing the toast
  };

  return (
    <Card className="w-full max-w-md mx-auto border-gray-200 shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <Download className="h-5 w-5 text-blue-600" />
          Desktop App Download
        </CardTitle>
        <CardDescription>
          Generate metadata in batch with our powerful desktop application
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <img
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80"
              alt="Windows App Screenshot"
              className="rounded-md shadow-sm w-full mb-4"
            />
          </div>

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

          {!hasActiveSubscription && user && (
            <div className="bg-amber-50 border border-amber-200 rounded-md p-4 flex items-start">
              <AlertCircle className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-amber-800 font-medium">
                  Subscription required
                </p>
                <p className="text-amber-700 text-sm">
                  You need an active subscription to download the Windows app.
                </p>
                <Link
                  to="/"
                  className="text-blue-600 hover:underline text-sm inline-block mt-2"
                >
                  View subscription plans
                </Link>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleDownload}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          disabled={!hasActiveSubscription || !user}
        >
          <Download className="mr-2 h-4 w-4" />
          {!user
            ? "Sign in to download"
            : !hasActiveSubscription
              ? "Subscription required"
              : "Download Desktop App"}
        </Button>
      </CardFooter>
    </Card>
  );
}
