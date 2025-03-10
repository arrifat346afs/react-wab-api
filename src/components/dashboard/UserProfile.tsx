import { useAuth } from "../../../supabase/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Edit, Mail, User as UserIcon } from "lucide-react";

export function UserProfile() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="py-4 text-gray-500">Loading user profile...</div>;
  }

  if (!user) {
    return (
      <div className="py-4 text-gray-500">
        Please sign in to view your profile
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-6 items-start">
      <div className="flex flex-col items-center space-y-4">
        <Avatar className="h-24 w-24">
          <AvatarImage
            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`}
            alt={user.email || ""}
          />
          <AvatarFallback className="text-2xl">
            {user.email?.[0].toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <Edit className="h-3 w-3" /> Change Avatar
        </Button>
      </div>

      <div className="flex-1 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-500">
              Full Name
            </label>
            <div className="flex items-center mt-1">
              <UserIcon className="h-4 w-4 text-gray-400 mr-2" />
              <span className="font-medium">
                {user.user_metadata?.full_name || "Not provided"}
              </span>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500">
              Email Address
            </label>
            <div className="flex items-center mt-1">
              <Mail className="h-4 w-4 text-gray-400 mr-2" />
              <span className="font-medium">{user.email}</span>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500">
              Account Created
            </label>
            <div className="mt-1 font-medium">
              {new Date(user.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500">
              Last Sign In
            </label>
            <div className="mt-1 font-medium">
              {user.last_sign_in_at
                ? new Date(user.last_sign_in_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "N/A"}
            </div>
          </div>
        </div>

        <div className="pt-4">
          <Button variant="outline" className="mr-2">
            <Edit className="h-4 w-4 mr-2" /> Edit Profile
          </Button>
          <Button
            variant="outline"
            className="text-red-600 border-red-200 hover:bg-red-50"
          >
            Change Password
          </Button>
        </div>
      </div>
    </div>
  );
}
