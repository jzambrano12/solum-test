import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DateRangePicker } from "@/components/dashboard/DateRangePicker";
import { KPICard } from "@/components/dashboard/KPICard";
import { LineChartCard } from "@/components/dashboard/LineChartCard";
import { BarChartCard } from "@/components/dashboard/BarChartCard";
import { RecentCallsTable } from "@/components/dashboard/RecentCallsTable";

const Analytics = () => {
  return (
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
    </div>
  );
};

export default Analytics;
