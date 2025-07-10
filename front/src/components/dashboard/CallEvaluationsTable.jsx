import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "./StatusBadge";
import { Pagination } from "./Pagination";

// Mock data that matches the Supabase schema
const mockCalls = [
  {
    id: "1",
    externalCallId: "call_123456",
    company: "Clinic A",
    agent: "Inbound - Prod",
    callTimestamp: "2024-01-15T14:30:00Z",
    durationInSeconds: 45,
    status: "pending",
  },
  {
    id: "2",
    externalCallId: "call_789012",
    company: "Clinic B",
    agent: "Outbound - Dev",
    callTimestamp: "2024-01-15T13:15:00Z",
    durationInSeconds: 120,
    status: "evaluated",
  },
  {
    id: "3",
    externalCallId: "call_345678",
    company: "Clinic A",
    agent: "Inbound - Prod",
    callTimestamp: "2024-01-15T12:00:00Z",
    durationInSeconds: 78,
    status: "pending",
  },
  {
    id: "4",
    externalCallId: "call_901234",
    company: "Clinic C",
    agent: "Outbound - Prod",
    callTimestamp: "2024-01-15T11:45:00Z",
    durationInSeconds: 156,
    status: "evaluated",
  },
  {
    id: "5",
    externalCallId: "call_567890",
    company: "Clinic B",
    agent: "Inbound - Dev",
    callTimestamp: "2024-01-15T10:30:00Z",
    durationInSeconds: 92,
    status: "pending",
  },
];

export const CallEvaluationsTable = () => {
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

  return (
    <div className="space-y-4">
      <Card className="overflow-hidden border-border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr className="border-b border-border">
                <th className="text-left p-4 font-medium text-foreground">
                  Status
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
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-card">
              {mockCalls.map((call, index) => (
                <tr
                  key={call.id}
                  className="border-b border-border hover:bg-muted/30 transition-colors duration-200"
                >
                  <td className="p-4">
                    <StatusBadge status={call.status} />
                  </td>
                  <td className="p-4 text-foreground font-medium">
                    {call.company}
                  </td>
                  <td className="p-4 text-muted-foreground">{call.agent}</td>
                  <td className="p-4 text-muted-foreground">
                    {formatTimestamp(call.callTimestamp)}
                  </td>
                  <td className="p-4 text-muted-foreground">
                    {formatDuration(call.durationInSeconds)}
                  </td>
                  <td className="p-4">
                    <Button
                      size="sm"
                      className="bg-primary hover:bg-primary-hover text-primary-foreground transition-colors duration-200"
                    >
                      Evaluate
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Pagination />
    </div>
  );
};
