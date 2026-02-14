import { getApplications } from "@/lib/mock-db";
import { LoanDashboard } from "@/components/LoanDashboard";

export default function Page() {
  const applications = getApplications();

  return (
    <main className="min-h-screen bg-gray-50">
      <LoanDashboard initialApplications={applications} />
    </main>
  );
}
