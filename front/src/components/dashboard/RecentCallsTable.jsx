"use client";

import { Card } from "@/components/ui/card";

export const RecentCallsTable = () => {
  // Mock data for recent high-rated calls
  const recentCalls = [
    {
      id: "call_789012",
      agent: "Agent Beta",
      score: 9.8,
      date: "2024-01-15",
      time: "14:32",
      duration: "12:34",
    },
    {
      id: "call_345678",
      agent: "Agent Alpha",
      score: 9.5,
      date: "2024-01-15",
      time: "13:45",
      duration: "08:21",
    },
    {
      id: "call_901234",
      agent: "Agent Gamma",
      score: 9.2,
      date: "2024-01-15",
      time: "11:18",
      duration: "15:47",
    },
    {
      id: "call_567890",
      agent: "Agent Delta",
      score: 9.0,
      date: "2024-01-14",
      time: "16:22",
      duration: "09:56",
    },
    {
      id: "call_112233",
      agent: "Agent Echo",
      score: 9.1,
      date: "2024-01-14",
      time: "15:08",
      duration: "11:12",
    },
  ];

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-foreground">
          Recent High-Rated Calls
        </h3>
        <div className="text-sm text-muted-foreground">Score ≥ 9.0</div>
      </div>

      <div className="space-y-4">
        {recentCalls.map((call) => (
          <div
            key={call.id}
            className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200"
          >
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <div className="text-sm font-medium text-foreground">
                  {call.agent}
                </div>
                <div className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                  {call.score}/10
                </div>
              </div>
              <div className="text-xs text-muted-foreground">
                {call.date} at {call.time}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-muted-foreground">
                {call.duration}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t">
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing latest 5 calls
          </div>
          <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
            View All →
          </button>
        </div>
      </div>

      <div className="mt-4 p-3 bg-green-50 rounded-lg">
        <div className="flex items-center gap-2">
          <svg
            className="w-4 h-4 text-green-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-sm text-green-800">
            Excellent performance across all agents
          </span>
        </div>
      </div>
    </Card>
  );
};
