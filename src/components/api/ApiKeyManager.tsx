import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Copy, Key, RefreshCw, Trash2, Eye, EyeOff, Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "../../../supabase/auth";

interface ApiKey {
  id: string;
  name: string;
  key: string;
  created: string;
  lastUsed: string | null;
}

interface ApiKeyManagerProps {
  hasActiveSubscription?: boolean;
}

export default function ApiKeyManager({ hasActiveSubscription = false }: ApiKeyManagerProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([
    {
      id: "key_1",
      name: "Production API Key",
      key: "sk_live_51NzQpRCkNXTbZQo6Ht2mCnDOkjGRmaCVZwZVDvCWH8jKMO1tYz",
      created: "2023-06-15T10:30:00Z",
      lastUsed: "2023-06-20T14:45:00Z"
    },
    {
      id: "key_2",
      name: "Development API Key",
      key: "sk_test_51NzQpRCkNXTbZQo6Ht2mCnDOkjGRmaCVZwZVDvCWH8jKMO1tYz",
      created: "2023-06-10T08:15:00Z",
      lastUsed: null
    }
  ]);
  const [newKeyName, setNewKeyName] = useState("");
  const [visibleKeys, setVisibleKeys] = useState<Record<string, boolean>>({});

  const toggleKeyVisibility = (keyId: string) => {
    setVisibleKeys(prev => ({
      ...prev,
      [keyId]: !prev[keyId]
    }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "API key copied",
      description: "The API key has been copied to your clipboard.",
    });
  };

  const createNewKey = () => {
    if (!hasActiveSubscription) {
      toast({
        title: "Subscription required",
        description: "You need an active subscription to create API keys.",
        variant: "destructive",
      });
      return;
    }

    if (!newKeyName.trim()) {
      toast({
        title: "Name required",
        description: "Please provide a name for your API key.",
        variant