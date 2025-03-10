import WindowsAppDownload from "../api/WindowsAppDownload";
import { AuthProvider } from "../../../supabase/auth";

export default function WindowsAppDownloadStoryboard() {
  return (
    <AuthProvider>
      <WindowsAppDownload hasActiveSubscription={true} />
    </AuthProvider>
  );
}
