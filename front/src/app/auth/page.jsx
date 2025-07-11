import { LoginCard } from "@/components/LoginCard";
import { AuthGuard } from "@/components/auth/AuthGuard";

export const dynamic = "force-dynamic";

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full relative bg-white">
      {/* Cool Blue Glow Top */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: "#ffffff",
          backgroundImage: `
            radial-gradient(
              circle at top center,
              rgba(70, 130, 180, 0.5),
              transparent 70%
            )
          `,
          filter: "blur(80px)",
          backgroundRepeat: "no-repeat",
        }}
      />
      {/* Your Content/Components */}
      <div className="relative z-10">
        <AuthGuard requireAuth={false}>
          <LoginCard />
        </AuthGuard>
      </div>
    </div>
  );
}
