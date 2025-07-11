"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "./StatusBadge";
import { Pagination } from "./Pagination";
import { CallEvaluationModal } from "./CallEvaluationModal";
import { useCalls } from "@/hooks/use-calls";

export const CallEvaluationsTable = ({ filters = {} }) => {
  const [selectedCall, setSelectedCall] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    calls,
    loading,
    error,
    totalCount,
    currentPage,
    totalPages,
    goToPage,
    refresh,
  } = useCalls(filters);

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDuration = (seconds) => {
    if (seconds < 60) {
      return `${seconds}s`;
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const getEvaluationStatus = (call) => {
    if (call.evaluation_id) {
      return "evaluated";
    }
    return "pending";
  };

  const handleEvaluateCall = (call) => {
    setSelectedCall(call);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCall(null);
    // Refresh data after modal closes (in case evaluation was added)
    refresh();
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Card className="overflow-hidden border-border">
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading calls...</p>
          </div>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <Card className="overflow-hidden border-border">
          <div className="p-8 text-center">
            <div className="text-destructive mb-2">Error loading calls</div>
            <p className="text-muted-foreground mb-4">{error}</p>
            <button
              onClick={refresh}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary-hover transition-colors"
            >
              Try Again
            </button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="overflow-hidden border-border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr className="border-b border-border">
                <th className="text-left p-4 font-medium text-foreground">
                  External Call ID
                </th>
                <th className="text-left p-4 font-medium text-foreground">
                  Company
                </th>
                <th className="text-left p-4 font-medium text-foreground">
                  Agent
                </th>
                <th className="text-left p-4 font-medium text-foreground">
                  Call Timestamp
                </th>
                <th className="text-left p-4 font-medium text-foreground">
                  Duration
                </th>
                <th className="text-left p-4 font-medium text-foreground">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-card">
              {calls.map((call) => {
                const status = getEvaluationStatus(call);
                return (
                  <tr
                    key={call.call_id}
                    className="border-b border-border hover:bg-muted/50 hover:shadow-sm transition-all duration-200 cursor-pointer"
                    onClick={() => handleEvaluateCall(call)}
                  >
                    <td className="p-4 text-muted-foreground font-mono text-sm">
                      {call.external_call_id}
                    </td>
                    <td className="p-4 text-foreground font-medium">
                      {call.company_name}
                    </td>
                    <td className="p-4 text-muted-foreground">
                      {call.agent_name}
                    </td>

                    <td className="p-4 text-muted-foreground">
                      {formatTimestamp(call.call_timestamp)}
                    </td>
                    <td className="p-4 text-muted-foreground">
                      {formatDuration(call.duration_seconds)}
                    </td>
                    <td className="p-4">
                      <StatusBadge status={status} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {calls.length === 0 && (
          <div className="p-8 text-center text-muted-foreground">
            No calls found.
          </div>
        )}
      </Card>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={goToPage}
        totalCount={totalCount}
        pageSize={10}
      />

      {/* Evaluation Modal */}
      <CallEvaluationModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        call={selectedCall}
      />
    </div>
  );
};
