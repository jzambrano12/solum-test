"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const DateRangePicker = () => {
  const [selectedRange, setSelectedRange] = useState("7d");

  const dateRanges = [
    { value: "1d", label: "Last 24 hours" },
    { value: "7d", label: "Last 7 days" },
    { value: "30d", label: "Last 30 days" },
    { value: "90d", label: "Last 90 days" },
    { value: "custom", label: "Custom Range" },
  ];

  return (
    <Card className="p-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-lg font-medium text-foreground">Time Range</h3>
          <p className="text-sm text-muted-foreground">
            Select the time period for your analysis
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {dateRanges.map((range) => (
            <Button
              key={range.value}
              variant={selectedRange === range.value ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedRange(range.value)}
              className={`${
                selectedRange === range.value
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "text-foreground hover:bg-gray-100"
              }`}
            >
              {range.label}
            </Button>
          ))}
        </div>
      </div>
    </Card>
  );
};
