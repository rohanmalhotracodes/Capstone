import { Link } from "react-router-dom";
import { EmptyState } from "../components/EmptyState";
import { LoadingSkeleton } from "../components/LoadingSkeleton";
import { PageHeader } from "../components/PageHeader";
import { SiteCard } from "../components/SiteCard";
import { useSolarData } from "../hooks/useSolarData";
import { Map } from "lucide-react";

export function SitesPage() {
  const { loading, sites } = useSolarData();

  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <div>
      <PageHeader
        title="Solar Sites"
        description="Portfolio view of monitored solar fields, cleaning readiness, production, device health, and weather conditions."
      />
      {sites.length === 0 ? (
        <EmptyState icon={Map} title="No solar sites available" description="Site data will appear here once the backend is connected." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {sites.map((site) => (
            <Link key={site.id} to={`/sites/${site.id}`} className="block h-full">
              <SiteCard site={site} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
