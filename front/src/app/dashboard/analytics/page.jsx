import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DateRangePicker } from "@/components/dashboard/DateRangePicker";
import { KPICard } from "@/components/dashboard/KPICard";
import { LineChartCard } from "@/components/dashboard/LineChartCard";
import { BarChartCard } from "@/components/dashboard/BarChartCard";
import { RecentCallsTable } from "@/components/dashboard/RecentCallsTable";

const Analytics = () => {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-foreground mb-2">
            AI Agent Performance Analytics
          </h1>
          <p className="text-muted-foreground">
            Track and analyze agent performance metrics and trends
          </p>
        </div>

        {/* Date Range Picker */}
        <div className="mb-8">
          <DateRangePicker />
        </div>

        {/* Analytics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* KPI Card - spans 2 columns on larger screens */}
          <div className="lg:col-span-2">
            <KPICard />
          </div>

          {/* Recent Calls Table */}
          <div className="lg:col-span-1">
            <RecentCallsTable />
          </div>

          {/* Line Chart - spans 2 columns */}
          <div className="md:col-span-2">
            <LineChartCard />
          </div>

          {/* Bar Chart */}
          <div className="md:col-span-1">
            <BarChartCard />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Analytics;
