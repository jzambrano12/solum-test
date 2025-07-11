import { cn } from "@/lib/utils";

export const StatusBadge = ({ status, className }) => {
  const variants = {
    pending: "bg-yellow-100 text-yellow-800 border border-yellow-200",
    evaluated: "bg-green-100 text-green-800 border border-green-200",
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
