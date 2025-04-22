"use client";

import { useState, useEffect } from "react";
import DemographicCard from "@/components/dashboard/DemographicCard";
import { EcommerceMetrics } from "@/components/dashboard/EcommerceMetrics";
import MonthlySalesChart from "@/components/dashboard/MonthlySalesChart";
import MonthlyTarget from "@/components/dashboard/MonthlyTarget";
import RecentOrders from "@/components/dashboard/RecentOrders";
import StatisticsChart from "@/components/dashboard/StatisticsChart";
import { createClient } from "@supabase/supabase-js";
import DashboardSecondOption from "@/components/common/DashBoardSecondOption";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export const dynamic = "force-dynamic";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export default function Dashboard() {
  const [trackingEvents, setTrackingEvents] = useState([]);
  const [selectedDashboard, setSelectedDashboard] = useState("optionOne");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrackingData = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("analytics_events")
          .select("*")
          .order("timestamp", { ascending: false });
        // .limit(50000);

        if (error) {
          console.error("❌ Failed to fetch tracking data:", error.message);
          setError(error.message);
        } else {
          console.log("✅ Tracking Events:", data);
          setTrackingEvents(data || []);
        }
      } catch (err) {
        console.error("❌ Unexpected error:", err.message);
        setError("Unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchTrackingData();
  }, []);

  console.log("trackingEvents", trackingEvents);

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return <div className="text-red-500">Error: Supabase URL and Key are required.</div>;
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

  return (
    <div className="my-5 max-w-[1520px] px-16 py-8 mx-auto p-4 bg-white rounded-lg shadow-md">
      <div className="flex space-x-4 mb-8 w-full justify-between">
        <div className="flex justify-between items-center gap-4">
          <h1 className="text-2xl font-bold">Popfast</h1>
          <span className="text-green-600 font-medium flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-600 animate-pulse"></div>
            {Array.from(new Set(trackingEvents.map((event) => event.ip_address))).length} current visitors
          </span>
        </div>

        <select
          className="px-4 py-2 rounded bg-gray-200 text-gray-700"
          value={selectedDashboard}
          onChange={(e) => setSelectedDashboard(e.target.value)}
        >
          <option value="optionOne">Dashboard one</option>
          <option value="optionTwo">Dashboard two</option>
        </select>
      </div>

      {loading ? (
        renderSkeleton()
      ) : selectedDashboard === "optionOne" ? (
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

      {error && <div className="text-red-500 mt-4">Error: {error}</div>}
    </div>
  );
}
