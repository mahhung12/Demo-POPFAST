import DemographicCard from "@/components/dashboard/DemographicCard";
import { EcommerceMetrics } from "@/components/dashboard/EcommerceMetrics";
import MonthlySalesChart from "@/components/dashboard/MonthlySalesChart";
import MonthlyTarget from "@/components/dashboard/MonthlyTarget";
import RecentOrders from "@/components/dashboard/RecentOrders";
import StatisticsChart from "@/components/dashboard/StatisticsChart";
import "react-loading-skeleton/dist/skeleton.css";

export default function DashboardSecondOption({ trackingEvents }: { trackingEvents: any[] }) {
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12 space-y-6 xl:col-span-7">
        <EcommerceMetrics events={trackingEvents} />
        <MonthlySalesChart events={trackingEvents} />
      </div>
      <div className="col-span-12 xl:col-span-5">
        <MonthlyTarget events={trackingEvents} />
      </div>
      <div className="col-span-12">
        <StatisticsChart events={trackingEvents} />
      </div>
      <div className="col-span-12 xl:col-span-5">
        <DemographicCard events={trackingEvents} />
      </div>
      <div className="col-span-12 xl:col-span-7">
        <RecentOrders events={trackingEvents} />
      </div>
    </div>
  );
}
