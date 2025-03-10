import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Settings,
  User,
  Zap,
  Shield,
  Database,
  Code,
  CheckCircle2,
  ArrowRight,
  Star,
  ChevronRight,
  Github,
  Loader2,
  Twitter,
  Instagram,
  X,
  Download,
  Server,
  Key,
  Mail,
  FileJson,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../supabase/auth";
import { useEffect, useState } from "react";
import { supabase } from "../../../supabase/supabase";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";

// Define the Plan type
interface Plan {
  createdAt: string;
  modifiedAt: string | null;
  id: string;
  name: string;
  description: string;
  recurringInterval: string;
  isRecurring: boolean;
  isArchived: boolean;
  organizationId: string;
  metadata: Record<string, any>;
  prices: {
    createdAt: string;
    modifiedAt: string | null;
    id: string;
    amountType: string;
    isArchived: boolean;
    productId: string;
    type: string;
    recurringInterval: string;
    priceCurrency: string;
    priceAmount: number;
  }[];
  benefits: any[];
  medias: any[];
  attachedCustomFields: any[];
}

// Testimonial interface
interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  content: string;
  avatar: string;
}

// Feature interface
interface Feature {
  title: string;
  description: string;
  icon: JSX.Element;
}

// API Endpoint interface
interface ApiEndpoint {
  name: string;
  description: string;
  method: string;
  path: string;
  icon: JSX.Element;
}

export default function LandingPage() {
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  const [plans, setPlans] = useState<Plan[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [processingPlanId, setProcessingPlanId] = useState<string | null>(null);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      // Use the Supabase client to call the Edge Function
      const { data, error } = await supabase.functions.invoke(
        "supabase-functions-get-plans",
      );

      if (error) {
        throw error;
      }

      console.log(data);

      // Update to handle the new data structure
      setPlans(data?.items || []);
      setError("");
    } catch (error) {
      console.error("Failed to fetch plans:", error);
      setError("Failed to load plans. Please try again later.");
    }
  };

  // Handle checkout process
  const handleCheckout = async (priceId: string) => {
    if (!user) {
      // Redirect to login if user is not authenticated
      toast({
        title: "Authentication required",
        description: "Please sign in to subscribe to a plan.",
        variant: "default",
      });
      window.location.href = "/login?redirect=pricing";
      return;
    }

    setIsLoading(true);
    setProcessingPlanId(priceId);
    setError("");

    try {
      const { data, error } = await supabase.functions.invoke(
        "supabase-functions-create-checkout",
        {
          body: {
            productPriceId: priceId,
            successUrl: `${window.location.origin}/dashboard`,
            customerEmail: user.email || "",
            metadata: {
              user_id: user.id,
            },
          },
          headers: {
            "X-Customer-Email": user.email || "",
          },
        },
      );

      if (error) {
        throw error;
      }

      // Redirect to Stripe checkout
      if (data?.url) {
        toast({
          title: "Redirecting to checkout",
          description: "You'll be redirected to complete your purchase.",
          variant: "default",
        });
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
      setError("Failed to create checkout session. Please try again.");
      toast({
        title: "Checkout failed",
        description:
          "There was an error creating your checkout session. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setProcessingPlanId(null);
    }
  };

  // Format currency
  const formatCurrency = (amount: number, currency: string) => {
    const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
      minimumFractionDigits: 2,
    });

    // The new data structure provides the amount directly, not in cents
    return formatter.format(amount / 100);
  };

  // Metadata generation features data
  const features: Feature[] = [
    {
      title: "Mistral AI Powered",
      description:
        "Leverage the advanced capabilities of Mistral AI to generate high-quality, contextually relevant metadata for your content.",
      icon: <Zap className="h-10 w-10 text-blue-500" />,
    },
    {
      title: "Batch Processing",
      description:
        "Process multiple content pieces simultaneously with our efficient batch processing system, saving you time and effort.",
      icon: <Database className="h-10 w-10 text-blue-500" />,
    },
    {
      title: "SEO Optimization",
      description:
        "Generate metadata that's optimized for search engines, helping your content rank higher and reach more people.",
      icon: <FileJson className="h-10 w-10 text-blue-500" />,
    },
    {
      title: "Desktop Application",
      description:
        "Subscribers get access to our Electron desktop app for a seamless metadata generation experience with additional features.",
      icon: <Download className="h-10 w-10 text-blue-500" />,
    },
  ];

  // Metadata generation steps
  const apiEndpoints: ApiEndpoint[] = [
    {
      name: "Upload Content",
      description: "Submit your content for metadata generation",
      method: "Step 1",
      path: "Upload text files or paste content directly",
      icon: <FileJson className="h-6 w-6 text-blue-500" />,
    },
    {
      name: "Configure Options",
      description: "Customize your metadata generation settings",
      method: "Step 2",
      path: "Select title, keywords, description options",
      icon: <Settings className="h-6 w-6 text-blue-500" />,
    },
    {
      name: "Generate & Export",
      description: "Process your content and download results",
      method: "Step 3",
      path: "Batch process and export as CSV, JSON, or Excel",
      icon: <Download className="h-6 w-6 text-blue-500" />,
    },
  ];

  // Sample testimonials data
  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Content Manager",
      company: "TechFlow",
      content:
        "MetaGen AI has dramatically improved our SEO workflow. The metadata it generates is consistently high-quality and saves us hours of work each week.",
      avatar: "sarah",
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Marketing Director",
      company: "InnovateCorp",
      content:
        "I've tried many metadata tools, but MetaGen stands out with its accuracy and batch processing capabilities. The desktop app is a game-changer for our team.",
      avatar: "michael",
    },
    {
      id: 3,
      name: "Aisha Patel",
      role: "SEO Specialist",
      company: "DigitalWave",
      content:
        "Our team was able to optimize hundreds of articles in record time. The keywords and descriptions generated by Mistral AI are remarkably effective.",
      avatar: "aisha",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className="font-bold text-xl flex items-center text-foreground"
            >
              <Server className="h-6 w-6 mr-2 text-blue-500" />
              MetaGen AI
            </Link>
          </div>
          <nav className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center gap-4">
                <Link to="/dashboard">
                  <Button
                    variant="ghost"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Dashboard
                  </Button>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="gap-2 text-muted-foreground hover:text-foreground"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`}
                          alt={user.email || ""}
                        />
                        <AvatarFallback>
                          {user.email?.[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="hidden md:inline-block">
                        {user.email}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="bg-card border-border"
                  >
                    <DropdownMenuLabel className="text-foreground">
                      My Account
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-border" />
                    <DropdownMenuItem className="text-muted-foreground hover:text-foreground focus:text-foreground">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-muted-foreground hover:text-foreground focus:text-foreground">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-border" />
                    <DropdownMenuItem
                      onSelect={() => signOut()}
                      className="text-muted-foreground hover:text-foreground focus:text-foreground"
                    >
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <>
                <Link to="/login">
                  <Button
                    variant="ghost"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="bg-blue-700 text-white hover:bg-blue-600">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative pt-24 pb-16 md:pt-32 md:pb-24">
          <div className="container px-4 mx-auto">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="lg:w-1/2 space-y-8">
                <div>
                  <Badge className="mb-4 bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 border-none">
                    AI-Powered Metadata Generation
                  </Badge>
                  <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                    Batch Generate Metadata with Mistral AI
                  </h1>
                </div>
                <p className="text-lg md:text-xl text-muted-foreground">
                  Generate high-quality titles, keywords, and descriptions for
                  your content in batch. Powered by Mistral AI for accurate,
                  SEO-friendly metadata.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to="/signup">
                    <Button
                      size="lg"
                      className="bg-blue-700 text-white hover:bg-blue-600 w-full sm:w-auto"
                    >
                      Start Generating
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link to="#api-docs">
                    <Button
                      variant="outline"
                      size="lg"
                      className="border-border text-muted-foreground hover:border-muted hover:text-foreground w-full sm:w-auto"
                    >
                      <FileJson className="mr-2 h-4 w-4" />
                      How It Works
                    </Button>
                  </Link>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-blue-500" />
                  <span>No credit card required for trial</span>
                  <Separator
                    orientation="vertical"
                    className="h-4 mx-2 bg-border"
                  />
                  <CheckCircle2 className="h-4 w-4 text-blue-500" />
                  <span>Electron app for subscribers</span>
                  <Separator
                    orientation="vertical"
                    className="h-4 mx-2 bg-border"
                  />
                  <CheckCircle2 className="h-4 w-4 text-blue-500" />
                  <span>Batch processing</span>
                </div>
              </div>
              <div className="lg:w-1/2 relative">
                <div className="absolute -z-10 inset-0 bg-gradient-to-tr from-blue-900/60 via-blue-700/40 to-blue-500/10 rounded-3xl blur-2xl transform scale-110" />
                <div className="bg-card/80 backdrop-blur-sm border border-border rounded-xl shadow-xl overflow-hidden">
                  <div className="p-1 bg-gradient-to-r from-blue-700 via-blue-600 to-blue-800 rounded-t-xl">
                    <div className="flex items-center gap-2 px-3 py-1">
                      <div className="h-3 w-3 rounded-full bg-red-500" />
                      <div className="h-3 w-3 rounded-full bg-yellow-500" />
                      <div className="h-3 w-3 rounded-full bg-green-500" />
                      <div className="ml-2 text-xs text-white font-medium">
                        API Request
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <pre className="text-sm text-muted-foreground overflow-x-auto">
                      <code>{`// Example metadata generation request
const response = await fetch('https://api.metagen.ai/v1/generate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: JSON.stringify({
    content: 'This article discusses the benefits of AI in content creation...',
    generate: ['title', 'keywords', 'description'],
    language: 'en',
    maxKeywords: 10
  })
});

const data = await response.json();
// Returns optimized metadata for your content
console.log(data);`}</code>
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Gradient orbs */}
          <div className="absolute top-1/4 left-0 -z-10 h-[300px] w-[300px] rounded-full bg-blue-900/60 blur-[100px]" />
          <div className="absolute bottom-0 right-0 -z-10 h-[300px] w-[300px] rounded-full bg-blue-800/40 blur-[100px]" />
        </section>

        {/* Features Section */}
        <section className="py-16 md:py-24 bg-muted">
          <div className="container px-4 mx-auto">
            <div className="text-center mb-16">
              <Badge className="mb-4 bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 border-none">
                Features
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-foreground">
                Powerful Metadata Generation Features
              </h2>
              <p className="text-muted-foreground max-w-[700px] mx-auto">
                Our AI-powered platform helps you create optimized metadata for
                your content with advanced features designed for efficiency and
                quality.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <Card
                  key={index}
                  className="border-border bg-card shadow-md hover:shadow-lg transition-shadow"
                >
                  <CardHeader>
                    <div className="mb-4">{feature.icon}</div>
                    <CardTitle className="text-foreground">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* API Documentation Preview */}
        <section id="api-docs" className="py-16 md:py-24 bg-background">
          <div className="container px-4 mx-auto">
            <div className="text-center mb-16">
              <Badge className="mb-4 bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 border-none">
                How It Works
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-foreground">
                Simple Metadata Generation Process
              </h2>
              <p className="text-muted-foreground max-w-[700px] mx-auto">
                Our streamlined process makes it easy to generate high-quality
                metadata for all your content needs.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {apiEndpoints.map((endpoint, index) => (
                <Card
                  key={index}
                  className="border-border shadow-md hover:shadow-lg transition-shadow overflow-hidden"
                >
                  <CardHeader className="pb-2 border-b border-border">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {endpoint.icon}
                        <CardTitle className="text-lg">
                          {endpoint.name}
                        </CardTitle>
                      </div>
                      <Badge
                        className={`${endpoint.method === "GET" ? "bg-green-900/30 text-green-400" : "bg-blue-900/30 text-blue-400"}`}
                      >
                        {endpoint.method}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <p className="text-muted-foreground mb-4">
                      {endpoint.description}
                    </p>
                    <div className="bg-muted p-3 rounded-md font-mono text-sm text-muted-foreground overflow-x-auto">
                      {endpoint.path}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-12 text-center">
              <Link to="#">
                <Button
                  variant="outline"
                  className="border-blue-800/20 text-blue-400 hover:bg-blue-950/30"
                >
                  Learn More About Our Process
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Windows App Download Section */}
        <section className="py-16 md:py-24 bg-accent">
          <div className="container px-4 mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="md:w-1/2">
                <Badge className="mb-4 bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 border-none">
                  Electron Desktop App
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6 text-foreground">
                  Batch Process Content with Our Desktop App
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Our Electron desktop application provides a powerful interface
                  for batch processing content and generating metadata using
                  Mistral AI, available exclusively to subscribers.
                </p>
                <ul className="space-y-4 mb-8">
                  {[
                    "Bulk content processing",
                    "Advanced metadata customization",
                    "Offline processing capability",
                    "Export in multiple formats",
                    "Content performance tracking",
                  ].map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button className="bg-blue-700 text-white hover:bg-blue-600 flex items-center gap-2">
                  <Download className="h-5 w-5" />
                  Download Desktop App
                </Button>
                <p className="text-sm text-muted-foreground mt-3">
                  Available for Windows, macOS, and Linux. Requires active
                  subscription.
                </p>
              </div>
              <div className="md:w-1/2">
                <div className="bg-card rounded-xl shadow-xl overflow-hidden border border-border">
                  <div className="p-1 bg-muted">
                    <div className="flex items-center gap-2 px-2">
                      <div className="h-3 w-3 rounded-full bg-red-500" />
                      <div className="h-3 w-3 rounded-full bg-yellow-500" />
                      <div className="h-3 w-3 rounded-full bg-green-500" />
                      <div className="ml-2 text-xs text-muted-foreground">
                        MetaGen Desktop
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <img
                      src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80"
                      alt="API Manager Dashboard"
                      className="rounded-lg shadow-md w-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container px-4 mx-auto">
            <div className="text-center mb-16">
              <Badge className="mb-4 bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 border-none">
                Pricing
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-foreground">
                Simple, Transparent Pricing
              </h2>
              <p className="text-muted-foreground max-w-[700px] mx-auto">
                Choose the perfect plan for your needs. All plans include access
                to our core metadata generation features. No hidden fees or
                surprises.
              </p>
            </div>

            {error && (
              <div
                className="bg-red-950/30 border border-red-800/30 text-red-400 px-4 py-3 rounded relative mb-6"
                role="alert"
              >
                <span className="block sm:inline">{error}</span>
                <button
                  className="absolute top-0 bottom-0 right-0 px-4 py-3"
                  onClick={() => setError("")}
                >
                  <span className="sr-only">Dismiss</span>
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {plans?.map((plan) => (
                <Card
                  key={plan.id}
                  className="flex flex-col h-full border-border bg-card shadow-lg hover:shadow-xl transition-all"
                >
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-xl font-bold text-foreground">
                        {plan.name || "Basic"}
                      </CardTitle>
                      {!plan.isArchived && (
                        <Badge
                          variant="outline"
                          className="bg-blue-950/30 text-blue-400 border-blue-800/20"
                        >
                          Popular
                        </Badge>
                      )}
                    </div>
                    <CardDescription className="text-sm text-muted-foreground">
                      {plan.isRecurring
                        ? `${plan.recurringInterval.charAt(0).toUpperCase() + plan.recurringInterval.slice(1)}ly`
                        : "One-time"}
                    </CardDescription>
                    <div className="mt-4">
                      {plan.prices && plan.prices.length > 0 && (
                        <>
                          <span className="text-4xl font-bold text-foreground">
                            {formatCurrency(
                              plan.prices[0].priceAmount,
                              plan.prices[0].priceCurrency,
                            )}
                          </span>
                          <span className="text-muted-foreground">
                            /{plan.prices[0].recurringInterval}
                          </span>
                        </>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <Separator className="my-4 bg-border" />
                    <ul className="space-y-3">
                      {plan.description &&
                        plan.description.split("\n").map((feature, index) => (
                          <li
                            key={index}
                            className="flex items-start text-muted-foreground"
                          >
                            <CheckCircle2 className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                            <span>{feature}</span>
                          </li>
                        ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="w-full bg-blue-700 text-white hover:bg-blue-600"
                      onClick={() =>
                        plan.prices &&
                        plan.prices.length > 0 &&
                        handleCheckout(plan.prices[0].id)
                      }
                      disabled={
                        isLoading || !plan.prices || plan.prices.length === 0
                      }
                    >
                      {isLoading &&
                      processingPlanId ===
                        (plan.prices && plan.prices.length > 0
                          ? plan.prices[0].id
                          : "") ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          Subscribe Now
                          <ChevronRight className="ml-1 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16 md:py-24 bg-muted">
          <div className="container px-4 mx-auto">
            <div className="text-center mb-16">
              <Badge className="mb-4 bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 border-none">
                Testimonials
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-foreground">
                Trusted by Content Creators
              </h2>
              <p className="text-muted-foreground max-w-[700px] mx-auto">
                See what our users have to say about our metadata generation
                services.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial) => (
                <Card
                  key={testimonial.id}
                  className="border-border bg-card shadow-md"
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${testimonial.avatar}`}
                          alt={testimonial.name}
                        />
                        <AvatarFallback>{testimonial.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-base text-foreground">
                          {testimonial.name}
                        </CardTitle>
                        <CardDescription className="text-muted-foreground">
                          {testimonial.role} at {testimonial.company}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4 fill-yellow-500 text-yellow-500"
                        />
                      ))}
                    </div>
                    <p className="text-muted-foreground">
                      {testimonial.content}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24">
          <div className="container px-4 mx-auto">
            <div className="bg-gradient-to-r from-blue-900 to-blue-700 rounded-3xl p-8 md:p-12 shadow-xl">
              <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
                  Ready to Optimize Your Content Metadata?
                </h2>
                <p className="text-lg md:text-xl mb-8 text-blue-100">
                  Join thousands of content creators who are already using our
                  AI-powered metadata generation to improve their SEO and reach.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Link to="/signup">
                    <Button
                      size="lg"
                      className="bg-white text-blue-700 hover:bg-blue-50 w-full sm:w-auto"
                    >
                      Start Your Free Trial
                    </Button>
                  </Link>
                  <Link to="#api-docs">
                    <Button
                      variant="outline"
                      size="lg"
                      className="border-blue-300 text-white hover:bg-blue-800 hover:text-white w-full sm:w-auto"
                    >
                      See How It Works
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-background border-t border-border py-12">
        <div className="container px-4 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <Link
                to="/"
                className="font-bold text-xl flex items-center mb-4 text-foreground"
              >
                <Server className="h-5 w-5 mr-2 text-blue-500" />
                MetaGen AI
              </Link>
              <p className="text-muted-foreground mb-4">
                AI-powered metadata generation for content creators, marketers,
                and SEO professionals.
              </p>
              <div className="flex space-x-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full text-muted-foreground hover:text-blue-500"
                >
                  <Github className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full text-muted-foreground hover:text-blue-500"
                >
                  <X className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full text-muted-foreground hover:text-blue-500"
                >
                  <Instagram className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-lg mb-4 text-foreground">
                Services
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    to="#"
                    className="text-muted-foreground hover:text-blue-500"
                  >
                    Title Generation
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    className="text-muted-foreground hover:text-blue-500"
                  >
                    Keyword Extraction
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    className="text-muted-foreground hover:text-blue-500"
                  >
                    Description Creation
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    className="text-muted-foreground hover:text-blue-500"
                  >
                    Batch Processing
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium text-lg mb-4 text-foreground">
                Resources
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    to="#"
                    className="text-muted-foreground hover:text-blue-500"
                  >
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    className="text-muted-foreground hover:text-blue-500"
                  >
                    API Reference
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    className="text-muted-foreground hover:text-blue-500"
                  >
                    SDKs & Libraries
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    className="text-muted-foreground hover:text-blue-500"
                  >
                    Support
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium text-lg mb-4 text-foreground">
                Company
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    to="#"
                    className="text-muted-foreground hover:text-blue-500"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    className="text-muted-foreground hover:text-blue-500"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    className="text-muted-foreground hover:text-blue-500"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    className="text-muted-foreground hover:text-blue-500"
                  >
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <Separator className="my-8 bg-border" />

          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} MetaGen AI. All rights reserved.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Link
                to="#"
                className="text-sm text-muted-foreground hover:text-blue-500"
              >
                Privacy
              </Link>
              <Link
                to="#"
                className="text-sm text-muted-foreground hover:text-blue-500"
              >
                Terms
              </Link>
              <Link
                to="#"
                className="text-sm text-muted-foreground hover:text-blue-500"
              >
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </footer>
      <Toaster />
    </div>
  );
}
