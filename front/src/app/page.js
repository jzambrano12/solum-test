"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        // Usuario autenticado, redirigir al dashboard
        router.push("/dashboard");
      } else {
        // Usuario no autenticado, redirigir al login
        router.push("/auth");
      }
    }
  }, [user, loading, router]);

  // Mostrar loading mientras se verifica el estado de autenticación
  return (
    <div className="min-h-screen flex items-center justify-center bg-black/5">
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}
