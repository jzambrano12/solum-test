"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

export const DashboardFilters = ({ onFiltersChange }) => {
  const [filters, setFilters] = useState({
    company_name: "",
    agent_type: "",
    agent_environment: "",
    search: "",
  });

  const handleFilterChange = (key, value) => {
    const newFilters = {
      ...filters,
      [key]: value === "all" ? "" : value,
    };
    setFilters(newFilters);

    // Only pass non-empty filters to parent
    const activeFilters = Object.entries(newFilters)
      .filter(([_, value]) => value !== "")
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

    onFiltersChange(activeFilters);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    handleFilterChange("search", value);
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Company Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Filter by Company
          </label>
          <Select
            onValueChange={(value) => handleFilterChange("company_name", value)}
          >
            <SelectTrigger className="bg-background border-input">
              <SelectValue placeholder="Select company" />
            </SelectTrigger>
            <SelectContent className="bg-white border-border">
              <SelectItem value="all">All Companies</SelectItem>
              <SelectItem value="Clinic A">Clinic A</SelectItem>
              <SelectItem value="Clinic B">Clinic B</SelectItem>
              <SelectItem value="Clinic C">Clinic C</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Agent Type Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Filter by Agent Type
          </label>
          <Select
            onValueChange={(value) => handleFilterChange("agent_type", value)}
          >
            <SelectTrigger className="bg-background border-input">
              <SelectValue placeholder="Select agent type" />
            </SelectTrigger>
            <SelectContent className="bg-white border-border">
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="inbound">Inbound</SelectItem>
              <SelectItem value="outbound">Outbound</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Environment Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Filter by Environment
          </label>
          <Select
            onValueChange={(value) =>
              handleFilterChange("agent_environment", value)
            }
          >
            <SelectTrigger className="bg-background border-input">
              <SelectValue placeholder="Select environment" />
            </SelectTrigger>
            <SelectContent className="bg-white border-border">
              <SelectItem value="all">All Environments</SelectItem>
              <SelectItem value="production">Production</SelectItem>
              <SelectItem value="development">Development</SelectItem>
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
              value={filters.search}
              onChange={handleSearchChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
