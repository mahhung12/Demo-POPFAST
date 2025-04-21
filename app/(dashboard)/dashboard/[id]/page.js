import DemographicCard from "@/components/dashboard/DemographicCard";
import { EcommerceMetrics } from "@/components/dashboard/EcommerceMetrics";
import MonthlySalesChart from "@/components/dashboard/MonthlySalesChart";
import MonthlyTarget from "@/components/dashboard/MonthlyTarget";
import RecentOrders from "@/components/dashboard/RecentOrders";
import StatisticsChart from "@/components/dashboard/StatisticsChart";
import { createClient } from '@supabase/supabase-js'

export const dynamic = "force-dynamic";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || "" // Use service role only on server
)

export default async function Dashboard() {
  // 👇 Fetch tracking data
  const { data: trackingEvents, error } = await supabase
    .from("analytics_events")
    .select("*")
    .order("timestamp", { ascending: false })
    .limit(5);

  if (error) {
    console.error("❌ Failed to fetch tracking data:", error.message);
  } else {
    console.log("✅ Tracking Events:", trackingEvents);
  }

  return (
    <div className="max-w-[1440px] px-16 py-8 mx-auto grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12 space-y-6 xl:col-span-7">
        <EcommerceMetrics events={ trackingEvents || [] } />

        <MonthlySalesChart events={ trackingEvents || [] } />
      </div>

      <div className="col-span-12 xl:col-span-5">
        <MonthlyTarget events={ trackingEvents || [] } />
      </div>

      <div className="col-span-12">
        <StatisticsChart events={ trackingEvents || [] } />
      </div>

      <div className="col-span-12 xl:col-span-5">
        <DemographicCard events={ trackingEvents || [] } />
      </div>

      <div className="col-span-12 xl:col-span-7">
        <RecentOrders events={ trackingEvents || [] } />
      </div>
    </div>
  );
}
