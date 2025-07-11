"use client";

import { useState } from "react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardFilters } from "@/components/dashboard/DashboardFilters";
import { CallEvaluationsTable } from "@/components/dashboard/CallEvaluationsTable";
import { AuthGuard } from "@/components/auth/AuthGuard";

export const dynamic = "force-dynamic";

const Index = () => {
  const [filters, setFilters] = useState({});

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <AuthGuard requireAuth={true}>
      <div className="min-h-screen w-full bg-[#f9fafb] relative">
        {/* Diagonal Fade Grid Background - Top Right */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, #d1d5db 1px, transparent 1px),
              linear-gradient(to bottom, #d1d5db 1px, transparent 1px)
            `,
            backgroundSize: "32px 32px",
            WebkitMaskImage:
              "radial-gradient(ellipse 80% 80% at 100% 0%, #000 50%, transparent 90%)",
            maskImage:
              "radial-gradient(ellipse 80% 80% at 100% 0%, #000 50%, transparent 90%)",
          }}
        />

        {/* Content */}
        <div className="relative z-10">
          <DashboardHeader />

          <main className="container mx-auto px-6 py-8">
            <div className="mb-8">
              <h1 className="text-3xl font-semibold text-foreground mb-2">
                Call Evaluations
              </h1>
              <p className="text-muted-foreground">
                Monitor and evaluate agent performance across all calls
              </p>
            </div>

            <DashboardFilters onFiltersChange={handleFiltersChange} />
            <CallEvaluationsTable filters={filters} />
          </main>
        </div>
      </div>
    </AuthGuard>
  );
};

export default Index;
