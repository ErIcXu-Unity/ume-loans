import { StatusHistoryEntry } from "@/types/loan";
import { StatusBadge } from "./StatusBadge";

const formatTimestamp = (ts: string) => {
  try {
    return new Intl.DateTimeFormat("en-AU", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date(ts));
  } catch {
    return ts;
  }
};

interface StatusTimelineProps {
  history: StatusHistoryEntry[];
}

export function StatusTimeline({ history }: StatusTimelineProps) {
  if (!history || history.length === 0) {
    return <p className="text-sm text-gray-500">No status history available.</p>;
  }

  const sorted = [...history].reverse();

  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-900 mb-3">Status History</h3>
      <ol className="relative border-l border-gray-200 ml-2 space-y-4">
        {sorted.map((entry, i) => (
          <li key={i} className="ml-4">
            <div className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full border border-white bg-gray-300" />
            <div className="flex items-center gap-2">
              <StatusBadge status={entry.status} />
              <span className="text-xs text-gray-500">
                {formatTimestamp(entry.timestamp)}
              </span>
            </div>
            <p className="mt-1 text-sm text-gray-600">
              {entry.notes || "No notes provided"}
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}
