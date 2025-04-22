"use client";

import DashboardSecondOption from "@/components/common/DashBoardSecondOption";
import DemographicCard from "@/components/dashboard/DemographicCard";
import { EcommerceMetrics } from "@/components/dashboard/EcommerceMetrics";
import MonthlySalesChart from "@/components/dashboard/MonthlySalesChart";
import MonthlyTarget from "@/components/dashboard/MonthlyTarget";
import RecentOrders from "@/components/dashboard/RecentOrders";
import StatisticsChart from "@/components/dashboard/StatisticsChart";
import { getSiteById } from "@/libs/dashboard/site";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export const dynamic = "force-dynamic";

export default function Dashboard() {
  const { id } = useParams();

  const [siteDetails, setSiteDetails] = useState(null);
  const [trackingEvents, setTrackingEvents] = useState([]);
  const [selectedDashboard, setSelectedDashboard] = useState("optionTwo");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // const router = useRouter();

  useEffect(() => {
    const fetchSiteDetails = async () => {
      setLoading(true);
      try {
        const site = await getSiteById(id); // Fetch site details by ID
        setSiteDetails(site);
        setTrackingEvents(site.pageviews || []); // Set tracking events from pageviews
      } catch (err) {
        console.error("❌ Failed to fetch site details:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchSiteDetails();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return renderSkeleton();
  }

  if (error) {
    return <div className="text-red-500 mt-4">Error: {error}</div>;
  }

  if (!siteDetails) {
    return <div className="text-gray-500 mt-4">No site details found.</div>;
  }

  return (
    <div className="my-5 max-w-[1520px] mx-auto bg-white rounded-lg">
      <div className="flex space-x-4 mb-8 w-full justify-between">
        <div className="flex justify-between items-center gap-4">
          <h1 className="text-2xl font-bold">{siteDetails.name}</h1>
          <span className="text-green-600 font-medium flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-600 animate-pulse"></div>
            {Array.from(new Set(trackingEvents.map((event) => event.ip_address))).length} current visitors
          </span>
        </div>

        <select
          className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={selectedDashboard}
          onChange={(e) => setSelectedDashboard(e.target.value)}
        >
          <option value="optionOne">Dashboard one</option>
          <option value="optionTwo">Dashboard two</option>
        </select>
      </div>

      {selectedDashboard === "optionOne" ? (
        <DashboardSecondOption events={trackingEvents} />
      ) : (
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
      )}
    </div>
  );
}

const renderSkeleton = () => (
  <div className="grid grid-cols-12 gap-4 md:gap-6">
    <div className="col-span-12 space-y-6 xl:col-span-7">
      <Skeleton height={200} />
      <Skeleton height={200} />
    </div>
    <div className="col-span-12 xl:col-span-5">
      <Skeleton height={200} />
    </div>
    <div className="col-span-12">
      <Skeleton height={200} />
    </div>
    <div className="col-span-12 xl:col-span-5">
      <Skeleton height={200} />
    </div>
    <div className="col-span-12 xl:col-span-7">
      <Skeleton height={200} />
    </div>
  </div>
);
