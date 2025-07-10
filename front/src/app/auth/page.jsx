import { LoginCard } from "@/components/LoginCard";
import { AuthGuard } from "@/components/auth/AuthGuard";

export const dynamic = "force-dynamic";

export default function LoginPage() {
  return (
    <AuthGuard requireAuth={false}>
      <LoginCard />
    </AuthGuard>
  );
}
