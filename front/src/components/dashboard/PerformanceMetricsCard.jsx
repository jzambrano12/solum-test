"use client";

import { Card } from "@/components/ui/card";
import {
  TrendingUp,
  TrendingDown,
  Users,
  Phone,
  CheckCircle,
  AlertCircle,
  Star,
} from "lucide-react";

export const PerformanceMetricsCard = ({ stats, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="p-4 bg-white/90 border-border animate-pulse">
            <div className="h-6 bg-gray-200 rounded mb-2"></div>
            <div className="h-8 bg-gray-200 rounded mb-1"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="p-4 bg-white/90 border-border">
          <div className="text-center text-muted-foreground">
            No data available
          </div>
        </Card>
      </div>
    );
  }

  const metrics = [
    {
      id: "total-calls",
      label: "Total Calls",
      value: stats.totalCalls.toLocaleString(),
      subtext: `${stats.totalEvaluatedCalls.toLocaleString()} evaluated`,
      icon: Phone,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      id: "avg-score",
      label: "Average Score",
      value: stats.averageScore.toFixed(1),
      subtext: `${stats.evaluationRate}% evaluation rate`,
      icon: Star,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      id: "high-quality",
      label: "High Quality",
      value: `${stats.highQualityPercentage}%`,
      subtext: `${stats.totalHighQualityCalls.toLocaleString()} calls`,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      id: "low-quality",
      label: "Needs Attention",
      value: `${stats.lowQualityPercentage}%`,
      subtext: `${stats.totalLowQualityCalls.toLocaleString()} calls`,
      icon: AlertCircle,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 metrics-grid">
      {metrics.map((metric) => {
        const Icon = metric.icon;
        return (
          <Card
            key={metric.id}
            className="p-4 bg-white/90 border-border hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                    <Icon className={`h-4 w-4 ${metric.color}`} />
                  </div>
                  <p className="text-sm font-medium text-foreground">
                    {metric.label}
                  </p>
                </div>
                <p className="text-2xl font-bold text-foreground mb-1">
                  {metric.value}
                </p>
                <p className="text-xs text-muted-foreground">
                  {metric.subtext}
                </p>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export const QualityDistributionCard = ({ stats, loading }) => {
  if (loading) {
    return (
      <Card className="p-4 bg-white/90 border-border animate-pulse">
        <div className="h-6 bg-gray-200 rounded mb-4"></div>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/6"></div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  if (!stats) {
    return (
      <Card className="p-4 bg-white/90 border-border">
        <div className="text-center text-muted-foreground">
          No data available
        </div>
      </Card>
    );
  }

  const qualitySegments = [
    {
      label: "High Quality",
      percentage: stats.highQualityPercentage,
      count: stats.totalHighQualityCalls,
      color: "bg-green-500",
      textColor: "text-green-600",
    },
    {
      label: "Medium Quality",
      percentage: stats.mediumQualityPercentage,
      count: stats.totalMediumQualityCalls,
      color: "bg-yellow-500",
      textColor: "text-yellow-600",
    },
    {
      label: "Low Quality",
      percentage: stats.lowQualityPercentage,
      count: stats.totalLowQualityCalls,
      color: "bg-red-500",
      textColor: "text-red-600",
    },
  ];

  return (
    <Card className="p-4 bg-white/90 border-border">
      <h3 className="text-lg font-semibold text-foreground mb-4">
        Quality Distribution
      </h3>

      {/* Visual Progress Bar */}
      <div className="mb-4">
        <div className="flex h-3 bg-gray-200 rounded-full overflow-hidden progress-bar">
          {qualitySegments.map((segment, index) => (
            <div
              key={index}
              className={`${segment.color} transition-all duration-300 ${
                segment.label === "High Quality"
                  ? "quality-high"
                  : segment.label === "Medium Quality"
                  ? "quality-medium"
                  : "quality-low"
              }`}
              style={{ width: `${segment.percentage}%` }}
            />
          ))}
        </div>
      </div>

      {/* Quality Breakdown */}
      <div className="space-y-3">
        {qualitySegments.map((segment, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${segment.color}`} />
              <span className="text-sm font-medium text-foreground">
                {segment.label}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {segment.count.toLocaleString()} calls
              </span>
              <span className={`text-sm font-semibold ${segment.textColor}`}>
                {segment.percentage.toFixed(1)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export const TopPerformersCard = ({ agents, loading }) => {
  if (loading) {
    return (
      <Card className="p-4 bg-white/90 border-border animate-pulse">
        <div className="h-6 bg-gray-200 rounded mb-4"></div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  if (!agents || agents.length === 0) {
    return (
      <Card className="p-4 bg-white/90 border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Top Performers
        </h3>
        <div className="text-center text-muted-foreground">
          No evaluated agents available
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 bg-white/90 border-border">
      <h3 className="text-lg font-semibold text-foreground mb-4">
        Top Performers
      </h3>
      <div className="space-y-3">
        {agents.map((agent, index) => (
          <div
            key={agent.agent_name}
            className="flex items-center justify-between ranking-item"
          >
            <div className="flex items-center gap-2">
              <div
                className={`
                flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold
                ${
                  index === 0
                    ? "bg-yellow-100 text-yellow-600"
                    : index === 1
                    ? "bg-gray-100 text-gray-600"
                    : index === 2
                    ? "bg-orange-100 text-orange-600"
                    : "bg-blue-100 text-blue-600"
                }
              `}
              >
                {index + 1}
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  {agent.agent_name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {agent.company_name} • {agent.evaluated_calls} evaluations
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-foreground">
                {agent.avg_score.toFixed(1)}
              </p>
              <p className="text-xs text-muted-foreground">avg score</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export const CompanyPerformanceCard = ({ companies, loading }) => {
  if (loading) {
    return (
      <Card className="p-4 bg-white/90 border-border animate-pulse">
        <div className="h-6 bg-gray-200 rounded mb-4"></div>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  if (!companies || companies.length === 0) {
    return (
      <Card className="p-4 bg-white/90 border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Company Performance
        </h3>
        <div className="text-center text-muted-foreground">
          No companies available
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 bg-white/90 border-border">
      <h3 className="text-lg font-semibold text-foreground mb-4">
        Company Performance
      </h3>
      <div className="space-y-4">
        {companies.map((company) => {
          const evaluationRate =
            company.totalCalls > 0
              ? Math.round((company.evaluatedCalls / company.totalCalls) * 100)
              : 0;
          const highQualityRate =
            company.evaluatedCalls > 0
              ? Math.round(
                  (company.highQualityCalls / company.evaluatedCalls) * 100
                )
              : 0;

          return (
            <div
              key={company.name}
              className="border-b border-border pb-3 last:border-b-0 company-item"
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-foreground">{company.name}</h4>
                <span className="text-sm text-muted-foreground">
                  {company.agents.length} agents
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div className="text-center">
                  <p className="font-semibold text-foreground">
                    {company.totalCalls.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">Total calls</p>
                </div>
                <div className="text-center">
                  <p className="font-semibold text-foreground">
                    {evaluationRate}%
                  </p>
                  <p className="text-xs text-muted-foreground">Evaluated</p>
                </div>
                <div className="text-center">
                  <p className="font-semibold text-foreground">
                    {highQualityRate}%
                  </p>
                  <p className="text-xs text-muted-foreground">High quality</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
