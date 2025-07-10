"use client";

import { Card } from "@/components/ui/card";

export const KPICard = () => {
  const currentScore = 8.7;
  const previousScore = 8.2;
  const trend = ((currentScore - previousScore) / previousScore) * 100;
  const isPositiveTrend = trend > 0;

  return (
    <Card className="p-6 h-full">
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-foreground">
            Average Quality Score
          </h3>
          <div className="flex items-center gap-2">
            <div
              className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                isPositiveTrend
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              <svg
                className={`w-3 h-3 ${
                  isPositiveTrend ? "text-green-600" : "text-red-600"
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={
                    isPositiveTrend
                      ? "M5 10l7-7m0 0l7 7m-7-7v18"
                      : "M19 14l-7 7m0 0l-7-7m7 7V3"
                  }
                />
              </svg>
              {Math.abs(trend).toFixed(1)}%
            </div>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl font-bold text-foreground mb-2">
              {currentScore}
              <span className="text-3xl text-muted-foreground">/10</span>
            </div>
            <div className="text-sm text-muted-foreground">
              Compared to last period: {previousScore}/10
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-4 pt-4 border-t">
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">1,247</div>
            <div className="text-xs text-muted-foreground">Total Calls</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">89%</div>
            <div className="text-xs text-muted-foreground">High Quality</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">2.3%</div>
            <div className="text-xs text-muted-foreground">Critical Issues</div>
          </div>
        </div>
      </div>
    </Card>
  );
};
