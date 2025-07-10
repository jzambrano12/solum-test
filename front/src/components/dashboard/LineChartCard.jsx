"use client";

import { Card } from "@/components/ui/card";

export const LineChartCard = () => {
  // Mock data for quality scores over time
  const timeLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];
  const agents = [
    {
      name: "Agent Alpha",
      color: "#3b82f6",
      data: [8.2, 8.5, 8.1, 8.7, 8.9, 8.6, 8.8],
    },
    {
      name: "Agent Beta",
      color: "#10b981",
      data: [7.8, 8.0, 8.3, 8.4, 8.2, 8.5, 8.7],
    },
    {
      name: "Agent Gamma",
      color: "#f59e0b",
      data: [8.0, 7.9, 8.2, 8.1, 8.3, 8.4, 8.5],
    },
  ];

  // Calculate chart dimensions
  const chartWidth = 600;
  const chartHeight = 300;
  const padding = 40;
  const innerWidth = chartWidth - 2 * padding;
  const innerHeight = chartHeight - 2 * padding;

  // Scale functions
  const xScale = (index) =>
    padding + (index / (timeLabels.length - 1)) * innerWidth;
  const yScale = (value) => padding + (10 - value) * (innerHeight / 2); // Scale from 6-10

  const generatePath = (data) => {
    return data
      .map((value, index) => {
        const x = xScale(index);
        const y = yScale(value);
        return `${index === 0 ? "M" : "L"} ${x} ${y}`;
      })
      .join(" ");
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-foreground">
          Quality Score Over Time
        </h3>
        <div className="flex items-center gap-4">
          {agents.map((agent) => (
            <div key={agent.name} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: agent.color }}
              />
              <span className="text-sm text-muted-foreground">
                {agent.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="relative">
        <svg
          width={chartWidth}
          height={chartHeight}
          className="w-full h-auto"
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        >
          {/* Grid lines */}
          <defs>
            <pattern
              id="grid"
              width="100"
              height="50"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 100 0 L 0 0 0 50"
                fill="none"
                stroke="#f3f4f6"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Y-axis labels */}
          {[6, 7, 8, 9, 10].map((value) => (
            <g key={value}>
              <line
                x1={padding}
                y1={yScale(value)}
                x2={chartWidth - padding}
                y2={yScale(value)}
                stroke="#e5e7eb"
                strokeWidth="1"
              />
              <text
                x={padding - 10}
                y={yScale(value) + 5}
                textAnchor="end"
                className="text-xs fill-gray-500"
              >
                {value}
              </text>
            </g>
          ))}

          {/* X-axis labels */}
          {timeLabels.map((label, index) => (
            <text
              key={label}
              x={xScale(index)}
              y={chartHeight - padding + 20}
              textAnchor="middle"
              className="text-xs fill-gray-500"
            >
              {label}
            </text>
          ))}

          {/* Agent lines */}
          {agents.map((agent) => (
            <g key={agent.name}>
              <path
                d={generatePath(agent.data)}
                fill="none"
                stroke={agent.color}
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Data points */}
              {agent.data.map((value, index) => (
                <circle
                  key={index}
                  cx={xScale(index)}
                  cy={yScale(value)}
                  r="4"
                  fill={agent.color}
                  stroke="white"
                  strokeWidth="2"
                />
              ))}
            </g>
          ))}
        </svg>
      </div>

      <div className="mt-4 flex justify-between text-sm text-muted-foreground">
        <span>Time Period: Last 7 months</span>
        <span>Average trend: +2.3%</span>
      </div>
    </Card>
  );
};
