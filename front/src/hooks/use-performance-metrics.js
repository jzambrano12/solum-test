"use client";

import { useState, useEffect } from "react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://solum-test-back.up.railway.app";

export const usePerformanceMetrics = (filters = {}) => {
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);

  const fetchMetrics = async () => {
    setLoading(true);
    setError(null);

    try {
      // Build query parameters
      const params = new URLSearchParams();

      // Add filters
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          params.append(key, value);
        }
      });

      const response = await fetch(
        `${API_URL}/api/performance-metrics?${params}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setMetrics(data.data || []);
      setTotalCount(data.count || 0);
    } catch (err) {
      console.error("Error fetching performance metrics:", err);
      setError(err.message || "Failed to fetch performance metrics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, [JSON.stringify(filters)]);

  const refresh = () => {
    fetchMetrics();
  };

  // Helper functions to calculate overall statistics
  const getOverallStats = () => {
    if (metrics.length === 0) return null;

    const totalCalls = metrics.reduce(
      (sum, metric) => sum + metric.total_calls,
      0
    );
    const totalEvaluatedCalls = metrics.reduce(
      (sum, metric) => sum + metric.evaluated_calls,
      0
    );
    const totalHighQualityCalls = metrics.reduce(
      (sum, metric) => sum + metric.high_quality_calls,
      0
    );
    const totalMediumQualityCalls = metrics.reduce(
      (sum, metric) => sum + metric.medium_quality_calls,
      0
    );
    const totalLowQualityCalls = metrics.reduce(
      (sum, metric) => sum + metric.low_quality_calls,
      0
    );

    // Calculate weighted average score
    const weightedScoreSum = metrics.reduce((sum, metric) => {
      return sum + (metric.avg_score || 0) * metric.evaluated_calls;
    }, 0);
    const averageScore =
      totalEvaluatedCalls > 0 ? weightedScoreSum / totalEvaluatedCalls : 0;

    // Calculate overall percentages
    const highQualityPercentage =
      totalEvaluatedCalls > 0
        ? (totalHighQualityCalls / totalEvaluatedCalls) * 100
        : 0;
    const mediumQualityPercentage =
      totalEvaluatedCalls > 0
        ? (totalMediumQualityCalls / totalEvaluatedCalls) * 100
        : 0;
    const lowQualityPercentage =
      totalEvaluatedCalls > 0
        ? (totalLowQualityCalls / totalEvaluatedCalls) * 100
        : 0;

    return {
      totalCalls,
      totalEvaluatedCalls,
      averageScore: Math.round(averageScore * 100) / 100,
      totalHighQualityCalls,
      totalMediumQualityCalls,
      totalLowQualityCalls,
      highQualityPercentage: Math.round(highQualityPercentage * 100) / 100,
      mediumQualityPercentage: Math.round(mediumQualityPercentage * 100) / 100,
      lowQualityPercentage: Math.round(lowQualityPercentage * 100) / 100,
      evaluationRate:
        totalCalls > 0
          ? Math.round((totalEvaluatedCalls / totalCalls) * 100 * 100) / 100
          : 0,
    };
  };

  // Get metrics grouped by company
  const getMetricsByCompany = () => {
    const companies = {};

    metrics.forEach((metric) => {
      if (!companies[metric.company_name]) {
        companies[metric.company_name] = {
          name: metric.company_name,
          agents: [],
          totalCalls: 0,
          evaluatedCalls: 0,
          highQualityCalls: 0,
          mediumQualityCalls: 0,
          lowQualityCalls: 0,
        };
      }

      const company = companies[metric.company_name];
      company.agents.push(metric);
      company.totalCalls += metric.total_calls;
      company.evaluatedCalls += metric.evaluated_calls;
      company.highQualityCalls += metric.high_quality_calls;
      company.mediumQualityCalls += metric.medium_quality_calls;
      company.lowQualityCalls += metric.low_quality_calls;
    });

    return Object.values(companies);
  };

  // Get top performing agents
  const getTopPerformingAgents = (limit = 5) => {
    return metrics
      .filter((metric) => metric.avg_score && metric.evaluated_calls > 0)
      .sort((a, b) => b.avg_score - a.avg_score)
      .slice(0, limit);
  };

  // Get agents that need attention (low scores)
  const getAgentsNeedingAttention = (limit = 5) => {
    return metrics
      .filter((metric) => metric.avg_score && metric.evaluated_calls > 0)
      .sort((a, b) => a.avg_score - b.avg_score)
      .slice(0, limit);
  };

  return {
    metrics,
    loading,
    error,
    totalCount,
    refresh,
    getOverallStats,
    getMetricsByCompany,
    getTopPerformingAgents,
    getAgentsNeedingAttention,
  };
};
