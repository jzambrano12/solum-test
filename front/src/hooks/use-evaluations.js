"use client";

import { useState, useEffect, useCallback } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const useEvaluations = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const createEvaluation = useCallback(async (evaluationData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/evaluations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(evaluationData),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateEvaluation = useCallback(async (evaluationId, evaluationData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/evaluations/${evaluationId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(evaluationData),
        }
      );

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    createEvaluation,
    updateEvaluation,
    isLoading,
    error,
  };
};

// Hook específico para obtener call-evaluations con filtros
export const useCallEvaluations = (filters = {}) => {
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  const fetchEvaluations = useCallback(
    async (page = 1, currentFilters = {}) => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({
          limit: pageSize.toString(),
          offset: ((page - 1) * pageSize).toString(),
          ...currentFilters,
        });

        const response = await fetch(
          `${API_BASE_URL}/api/call-evaluations?${params}`
        );

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        setEvaluations(data.data || []);
        setTotalCount(data.count || 0);
        setCurrentPage(page);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching call evaluations:", err);
      } finally {
        setLoading(false);
      }
    },
    [pageSize]
  );

  const fetchEvaluationById = useCallback(async (callId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/call-evaluations/${callId}`
      );

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (err) {
      console.error("Error fetching call evaluation by ID:", err);
      throw err;
    }
  }, []);

  const goToPage = useCallback(
    (page) => {
      if (page >= 1 && page <= Math.ceil(totalCount / pageSize)) {
        fetchEvaluations(page, filters);
      }
    },
    [fetchEvaluations, filters, totalCount, pageSize]
  );

  const refresh = useCallback(() => {
    fetchEvaluations(currentPage, filters);
  }, [fetchEvaluations, currentPage, filters]);

  useEffect(() => {
    fetchEvaluations(1, filters);
  }, [fetchEvaluations, filters]);

  return {
    evaluations,
    loading,
    error,
    totalCount,
    currentPage,
    pageSize,
    totalPages: Math.ceil(totalCount / pageSize),
    goToPage,
    refresh,
    fetchEvaluationById,
  };
};
