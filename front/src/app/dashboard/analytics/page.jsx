"use client";

import { useState } from "react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import {
  PerformanceMetricsCard,
  QualityDistributionCard,
  TopPerformersCard,
  CompanyPerformanceCard,
} from "@/components/dashboard/PerformanceMetricsCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, Filter, Download } from "lucide-react";
import { usePerformanceMetrics } from "@/hooks/use-performance-metrics";

const Analytics = () => {
  const [filters, setFilters] = useState({});

  const {
    metrics,
    loading,
    error,
    totalCount,
    refresh,
    getOverallStats,
    getMetricsByCompany,
    getTopPerformingAgents,
    getAgentsNeedingAttention,
  } = usePerformanceMetrics(filters);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value === "all" ? undefined : value,
    }));
  };

  const handleRefresh = () => {
    refresh();
  };

  const handleExport = () => {
    // Add timestamp to the print
    const printDate = new Date().toLocaleString();

    // Create a temporary element to show export info
    const exportInfo = document.createElement("div");
    exportInfo.className = "print-info print-only";
    exportInfo.innerHTML = `
      <div>
        <strong>Performance Analytics Report</strong><br>
        Generated: ${printDate}<br>
        Filters Applied: ${
          Object.entries(filters)
            .filter(([_, value]) => value)
            .map(([key, value]) => `${key}: ${value}`)
            .join(", ") || "None"
        }<br>
        Total Agents: ${totalCount}
      </div>
    `;

    document.body.appendChild(exportInfo);

    // Trigger print
    window.print();

    // Clean up
    setTimeout(() => {
      document.body.removeChild(exportInfo);
    }, 1000);
  };

  const overallStats = getOverallStats();
  const companiesData = getMetricsByCompany();
  const topPerformers = getTopPerformingAgents(5);
  const needsAttention = getAgentsNeedingAttention(3);

  if (error) {
    return (
      <div className="min-h-screen w-full bg-[#f9fafb] relative">
        <div className="relative z-10">
          <DashboardHeader />
          <main className="container mx-auto px-6 py-8">
            <Card className="p-8 bg-white/90 border-border">
              <div className="text-center">
                <div className="text-destructive mb-4">
                  Failed to load analytics
                </div>
                <p className="text-muted-foreground mb-6">{error}</p>
                <Button
                  onClick={handleRefresh}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Try Again
                </Button>
              </div>
            </Card>
          </main>
        </div>
      </div>
    );
  }

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
        <div className="no-print">
          <DashboardHeader />
        </div>

        {/* Print-only header */}
        <div className="print-only print-header">
          <h1 className="text-2xl font-bold">
            Solum QA - Performance Analytics Report
          </h1>
          <p>Comprehensive agent performance and call quality metrics</p>
        </div>

        <main className="container mx-auto px-6 py-8">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-semibold text-foreground mb-2">
                Performance Analytics
              </h1>
              <p className="text-muted-foreground">
                Real-time insights into agent performance and call quality
                metrics
              </p>
            </div>
            <div className="flex items-center gap-2 mt-4 md:mt-0 no-print">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={loading}
                className="flex items-center gap-2"
              >
                <RefreshCw
                  className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExport}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Export PDF
              </Button>
            </div>
          </div>

          {/* Filters */}
          <Card className="p-4 bg-white/90 border-border mb-6 no-print">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">
                Filters
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Select
                  onValueChange={(value) =>
                    handleFilterChange("company_name", value)
                  }
                >
                  <SelectTrigger className="bg-background border-input">
                    <SelectValue placeholder="All companies" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-border">
                    <SelectItem value="all">All Companies</SelectItem>
                    <SelectItem value="Clinic A">Clinic A</SelectItem>
                    <SelectItem value="Clinic B">Clinic B</SelectItem>
                    <SelectItem value="Clinic C">Clinic C</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Select
                  onValueChange={(value) =>
                    handleFilterChange("agent_type", value)
                  }
                >
                  <SelectTrigger className="bg-background border-input">
                    <SelectValue placeholder="All agent types" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-border">
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="inbound">Inbound</SelectItem>
                    <SelectItem value="outbound">Outbound</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Select
                  onValueChange={(value) =>
                    handleFilterChange("agent_environment", value)
                  }
                >
                  <SelectTrigger className="bg-background border-input">
                    <SelectValue placeholder="All environments" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-border">
                    <SelectItem value="all">All Environments</SelectItem>
                    <SelectItem value="production">Production</SelectItem>
                    <SelectItem value="development">Development</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center text-sm text-muted-foreground">
                {loading ? (
                  <span>Loading...</span>
                ) : (
                  <span>{totalCount} agents found</span>
                )}
              </div>
            </div>
          </Card>

          {/* Overview Metrics */}
          <div className="avoid-break">
            <PerformanceMetricsCard stats={overallStats} loading={loading} />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6 avoid-break">
            {/* Quality Distribution - spans 2 columns */}
            <div className="lg:col-span-2">
              <QualityDistributionCard stats={overallStats} loading={loading} />
            </div>

            {/* Top Performers */}
            <div>
              <TopPerformersCard agents={topPerformers} loading={loading} />
            </div>
          </div>

          {/* Secondary Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Company Performance */}
            <div>
              <CompanyPerformanceCard
                companies={companiesData}
                loading={loading}
              />
            </div>

            {/* Agents Needing Attention */}
            <div>
              <Card className="p-4 bg-white/90 border-border">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Needs Attention
                </h3>
                {loading ? (
                  <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between"
                      >
                        <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
                      </div>
                    ))}
                  </div>
                ) : needsAttention.length > 0 ? (
                  <div className="space-y-3">
                    {needsAttention.map((agent, index) => (
                      <div
                        key={agent.agent_name}
                        className="flex items-center justify-between ranking-item"
                      >
                        <div className="flex items-center gap-2">
                          <div className="flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold bg-red-100 text-red-600">
                            {index + 1}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">
                              {agent.agent_name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {agent.company_name} • {agent.evaluated_calls}{" "}
                              evaluations
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-red-600">
                            {agent.avg_score.toFixed(1)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            avg score
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground">
                    No agents need attention
                  </div>
                )}
              </Card>
            </div>
          </div>

          {/* Detailed Metrics Table */}
          {metrics.length > 0 && (
            <Card className="mt-6 bg-white/90 border-border page-break">
              <div className="p-4 border-b border-border">
                <h3 className="text-lg font-semibold text-foreground">
                  Detailed Metrics
                </h3>
                <p className="text-sm text-muted-foreground">
                  Complete breakdown of agent performance metrics
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr className="border-b border-border">
                      <th className="text-left p-3 font-medium text-foreground">
                        Agent
                      </th>
                      <th className="text-left p-3 font-medium text-foreground">
                        Company
                      </th>
                      <th className="text-left p-3 font-medium text-foreground">
                        Type
                      </th>
                      <th className="text-center p-3 font-medium text-foreground">
                        Total Calls
                      </th>
                      <th className="text-center p-3 font-medium text-foreground">
                        Evaluated
                      </th>
                      <th className="text-center p-3 font-medium text-foreground">
                        Avg Score
                      </th>
                      <th className="text-center p-3 font-medium text-foreground">
                        High Quality
                      </th>
                      <th className="text-center p-3 font-medium text-foreground">
                        Low Quality
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {metrics.map((metric) => (
                      <tr
                        key={`${metric.company_name}-${metric.agent_name}`}
                        className="border-b border-border hover:bg-muted/20"
                      >
                        <td className="p-3 font-medium text-foreground">
                          {metric.agent_name}
                        </td>
                        <td className="p-3 text-muted-foreground">
                          {metric.company_name}
                        </td>
                        <td className="p-3 text-muted-foreground capitalize">
                          {metric.agent_type}
                        </td>
                        <td className="p-3 text-center">
                          {metric.total_calls.toLocaleString()}
                        </td>
                        <td className="p-3 text-center">
                          {metric.evaluated_calls.toLocaleString()}
                        </td>
                        <td className="p-3 text-center font-semibold">
                          {metric.avg_score
                            ? metric.avg_score.toFixed(1)
                            : "N/A"}
                        </td>
                        <td className="p-3 text-center">
                          <span className="text-green-600 font-medium">
                            {metric.high_quality_percentage
                              ? `${metric.high_quality_percentage.toFixed(1)}%`
                              : "N/A"}
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <span className="text-red-600 font-medium">
                            {metric.low_quality_percentage
                              ? `${metric.low_quality_percentage.toFixed(1)}%`
                              : "N/A"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </main>
      </div>
    </div>
  );
};

export default Analytics;
