import { cn } from "@/lib/utils";

export const StatusBadge = ({ status, className }) => {
  const variants = {
    pending: "bg-warning text-warning-foreground",
    evaluated: "bg-success text-success-foreground",
  };

  const labels = {
    pending: "Pending",
    evaluated: "Evaluated",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        variants[status],
        className
      )}
    >
      {labels[status]}
    </span>
  );
};
