import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardFilters } from "@/components/dashboard/DashboardFilters";
import { CallEvaluationsTable } from "@/components/dashboard/CallEvaluationsTable";

const Index = () => {
  return (
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

        <DashboardFilters />
        <CallEvaluationsTable />
      </main>
    </div>
  );
};

export default Index;
