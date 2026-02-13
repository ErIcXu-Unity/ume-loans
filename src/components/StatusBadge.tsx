import { ApplicationStatus } from "@/types/loan";

const STATUS_STYLES: Record<ApplicationStatus, string> = {
  Pending: "bg-amber-100 text-amber-800",
  "Under Review": "bg-blue-100 text-blue-800",
  Approved: "bg-green-100 text-green-800",
  Rejected: "bg-red-100 text-red-800",
};

interface StatusBadgeProps {
  status: ApplicationStatus;
  size?: "sm" | "lg";
}

export function StatusBadge({ status, size = "sm" }: StatusBadgeProps) {
  const sizeClass =
    size === "lg" ? "px-3 py-1.5 text-sm font-semibold" : "px-2 py-0.5 text-xs font-medium";

  return (
    <span
      className={`inline-flex items-center rounded-full ${STATUS_STYLES[status]} ${sizeClass}`}
      aria-label={`Status: ${status}`}
      role="status"
    >
      {status}
    </span>
  );
}
