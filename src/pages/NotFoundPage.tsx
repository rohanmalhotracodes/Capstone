import { Compass } from "lucide-react";
import { Link } from "react-router-dom";
import { EmptyState } from "../components/EmptyState";

export function NotFoundPage() {
  return (
    <div className="mx-auto max-w-xl">
      <EmptyState icon={Compass} title="Page not found" description="This route is not part of the Solar Sweeper dashboard." />
      <div className="mt-4 text-center">
        <Link to="/dashboard" className="inline-flex rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
          Return to Overview
        </Link>
      </div>
    </div>
  );
}
