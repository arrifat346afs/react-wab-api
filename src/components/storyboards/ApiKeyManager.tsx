import ApiKeyManager from "../api/ApiKeyManager";
import { AuthProvider } from "../../../supabase/auth";

export default function ApiKeyManagerStoryboard() {
  return (
    <AuthProvider>
      <ApiKeyManager hasActiveSubscription={true} />
    </AuthProvider>
  );
}
