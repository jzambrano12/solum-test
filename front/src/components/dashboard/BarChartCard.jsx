"use client";

import { Card } from "@/components/ui/card";

export const BarChartCard = () => {
  // Mock data for critical failures by agent
  const agentData = [
    { name: "Agent Alpha", failures: 12 },
    { name: "Agent Beta", failures: 8 },
    { name: "Agent Gamma", failures: 15 },
    { name: "Agent Delta", failures: 6 },
    { name: "Agent Echo", failures: 10 },
  ];

  const maxFailures = Math.max(...agentData.map((d) => d.failures));

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-foreground">
          Critical Failures by Agent
        </h3>
        <div className="text-sm text-muted-foreground">Score &lt; 4.0</div>
      </div>

      <div className="space-y-4">
        {agentData.map((agent, index) => (
          <div key={agent.name} className="flex items-center gap-4">
            <div className="w-20 text-sm font-medium text-foreground truncate">
              {agent.name}
            </div>
            <div className="flex-1 relative">
              <div className="w-full bg-gray-200 rounded-full h-6">
                <div
                  className="bg-red-500 h-6 rounded-full transition-all duration-300 flex items-center justify-end pr-2"
                  style={{ width: `${(agent.failures / maxFailures) * 100}%` }}
                >
                  <span className="text-xs font-medium text-white">
                    {agent.failures}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {agentData.reduce((sum, agent) => sum + agent.failures, 0)}
            </div>
            <div className="text-xs text-muted-foreground">Total Failures</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">
              {(
                agentData.reduce((sum, agent) => sum + agent.failures, 0) /
                agentData.length
              ).toFixed(1)}
            </div>
            <div className="text-xs text-muted-foreground">Avg per Agent</div>
          </div>
        </div>
      </div>

      <div className="mt-4 p-3 bg-red-50 rounded-lg">
        <div className="flex items-center gap-2">
          <svg
            className="w-4 h-4 text-red-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-sm text-red-800">
            Agent Gamma needs immediate attention
          </span>
        </div>
      </div>
    </Card>
  );
};
