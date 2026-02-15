import { LoanApplication } from "@/types/loan";
import { StatusBadge } from "./StatusBadge";
import { formatDistanceToNow } from "date-fns";

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD" }).format(amount);

interface ApplicationListProps {
  applications: LoanApplication[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

function getLastUpdateTime(app: LoanApplication): string {
  if (app.statusHistory.length > 0) {
    return app.statusHistory[app.statusHistory.length - 1].timestamp;
  }
  return app.applicationDate;
}

export function ApplicationList({ applications, selectedId, onSelect }: ApplicationListProps) {
  const sorted = [...applications].sort(
    (a, b) => new Date(getLastUpdateTime(b)).getTime() - new Date(getLastUpdateTime(a)).getTime()
  );

  return (
    <nav aria-label="Application list">
      <ul className="space-y-2">
        {sorted.map((app) => (
          <li key={app.id}>
            <button
              onClick={() => onSelect(app.id)}
              className={`w-full cursor-pointer rounded-lg border p-3 text-left transition-colors hover:bg-gray-50 ${
                selectedId === app.id
                  ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500"
                  : "border-gray-200 bg-white"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">{app.id}</span>
                <StatusBadge status={app.currentStatus} />
              </div>
              <p className="mt-1 font-medium text-gray-900">
                {app.applicantName ?? "Unknown Applicant"}
              </p>
              <div className="mt-0.5 flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  {app.loanAmount ? formatCurrency(app.loanAmount) : "N/A"}
                </span>
                <span className="text-xs text-gray-400">
                  {formatDistanceToNow(new Date(getLastUpdateTime(app)), { addSuffix: true })}
                </span>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
