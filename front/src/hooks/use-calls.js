"use client";

import { useState, useEffect, useCallback } from "react";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://solum-test-back.up.railway.app";

export const useCalls = (filters = {}) => {
  const [calls, setCalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  const fetchCalls = useCallback(
    async (page = 1, currentFilters = {}) => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({
          limit: pageSize.toString(),
          offset: ((page - 1) * pageSize).toString(),
          ...currentFilters,
        });

        const response = await fetch(`${API_BASE_URL}/api/calls?${params}`);

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        setCalls(data.data || []);
        setTotalCount(data.count || 0);
        setCurrentPage(page);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching calls:", err);
      } finally {
        setLoading(false);
      }
    },
    [pageSize]
  );

  const fetchCallById = useCallback(async (callId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/calls/${callId}`);

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (err) {
      console.error("Error fetching call by ID:", err);
      throw err;
    }
  }, []);

  const goToPage = useCallback(
    (page) => {
      if (page >= 1 && page <= Math.ceil(totalCount / pageSize)) {
        fetchCalls(page, filters);
      }
    },
    [fetchCalls, filters, totalCount, pageSize]
  );

  const refresh = useCallback(() => {
    fetchCalls(currentPage, filters);
  }, [fetchCalls, currentPage, filters]);

  useEffect(() => {
    fetchCalls(1, filters);
  }, [fetchCalls, filters]);

  return {
    calls,
    loading,
    error,
    totalCount,
    currentPage,
    pageSize,
    totalPages: Math.ceil(totalCount / pageSize),
    goToPage,
    refresh,
    fetchCallById,
  };
};
