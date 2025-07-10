import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

export const DashboardFilters = () => {
  return (
    <div className="bg-card rounded-lg border border-border p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Company Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Filter by Company
          </label>
          <Select>
            <SelectTrigger className="bg-background border-input">
              <SelectValue placeholder="Select company" />
            </SelectTrigger>
            <SelectContent className="bg-white border-border">
              <SelectItem value="all">All Companies</SelectItem>
              <SelectItem value="clinic-a">Clinic A</SelectItem>
              <SelectItem value="clinic-b">Clinic B</SelectItem>
              <SelectItem value="clinic-c">Clinic C</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Agent Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Filter by Agent
          </label>
          <Select>
            <SelectTrigger className="bg-background border-input">
              <SelectValue placeholder="Select agent" />
            </SelectTrigger>
            <SelectContent className="bg-white border-border">
              <SelectItem value="all">All Agents</SelectItem>
              <SelectItem value="inbound-prod">Inbound - Prod</SelectItem>
              <SelectItem value="outbound-prod">Outbound - Prod</SelectItem>
              <SelectItem value="inbound-dev">Inbound - Dev</SelectItem>
              <SelectItem value="outbound-dev">Outbound - Dev</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Status Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Filter by Status
          </label>
          <Select>
            <SelectTrigger className="bg-background border-input">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent className="bg-white border-border">
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="evaluated">Evaluated</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Search */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Search</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search by call ID..."
              className="pl-10 bg-background border-input"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
