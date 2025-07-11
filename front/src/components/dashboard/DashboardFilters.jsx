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
    call_reason: "",
    evaluation_status: "",
    customer_name: "",
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

  const handleCustomerNameChange = (e) => {
    const value = e.target.value;
    handleFilterChange("customer_name", value);
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Company Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            By Company
          </label>
          <Select
            onValueChange={(value) => handleFilterChange("company_name", value)}
          >
            <SelectTrigger className="bg-background border-input">
              <SelectValue placeholder="All companies" />
            </SelectTrigger>
            <SelectContent className="bg-white border-border">
              <SelectItem value="all">All Companies</SelectItem>
              <SelectItem value="Clinic A">Clinic A</SelectItem>
              <SelectItem value="Clinic B">Clinic B</SelectItem>
              <SelectItem value="Clinic C">Clinic C</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Call Reason Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Call Reason
          </label>
          <Select
            onValueChange={(value) => handleFilterChange("call_reason", value)}
          >
            <SelectTrigger className="bg-background border-input">
              <SelectValue placeholder="All reasons" />
            </SelectTrigger>
            <SelectContent className="bg-white border-border">
              <SelectItem value="all">All Reasons</SelectItem>
              <SelectItem value="APPOINTMENT_ADJUSTMENT">
                Appointment Adjustment
              </SelectItem>
              <SelectItem value="MISSED_CALL">Missed Call</SelectItem>
              <SelectItem value="LOOKING_FOR_SOMEONE">
                Looking for someone
              </SelectItem>
              <SelectItem value="NEW_APPOINTMENT_EXISTING_CLIENT">
                New appointment existing client
              </SelectItem>
              <SelectItem value="MISCALANEOUS">Miscellaneous</SelectItem>
              <SelectItem value="BILLING">Billing</SelectItem>
              <SelectItem value="GENERAL_INQUIRY">General Inquiry</SelectItem>
              <SelectItem value="NEW_CLIENT_SPANISH">
                New client Spanish
              </SelectItem>
              <SelectItem value="NEW_CLIENT_ENGLISH">
                New client English
              </SelectItem>
              <SelectItem value="TIME_SENSITIVE">Time Sensitive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Evaluation Status Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Evaluation Status
          </label>
          <Select
            onValueChange={(value) =>
              handleFilterChange("evaluation_status", value)
            }
          >
            <SelectTrigger className="bg-background border-input">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent className="bg-white border-border">
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="evaluated">Evaluated</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Customer Name Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Customer Name
          </label>
          <Input
            placeholder="Search by customer name..."
            className="bg-background border-input"
            value={filters.customer_name}
            onChange={handleCustomerNameChange}
          />
        </div>

        {/* Search by External Call ID */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Search</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search by external call ID..."
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
