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
      <div className="min-h-screen bg-background">
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
    </AuthGuard>
  );
};

export default Index;
