"use client";

import DashboardFirstOption from "@/components/common/DashBoardFirstOption";
import DashboardSecondOption from "@/components/common/SecondOptions/DashBoardSecondOption";
import { getSiteById } from "@/libs/dashboard/site.js";
import { totalUniqueUsers } from "@/libs/utils";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export const dynamic = "force-dynamic";

export default function Dashboard() {
  const { id } = useParams();

  const [trackingEvents, setTrackingEvents] = useState([]);
  const [selectedDashboard, setSelectedDashboard] = useState("general");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // const router = useRouter();

  useEffect(() => {
    const fetchSiteDetails = async () => {
      setLoading(true);
      try {
        const site = await getSiteById(id);
        setTrackingEvents(site || []);
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
  }, [id, selectedDashboard]);

  if (loading) {
    return renderSkeleton();
  }

  if (error) {
    return <div className="text-red-500 mt-4">Error: {error}</div>;
  }

  if (!trackingEvents || trackingEvents.length === 0) {
    return <div className="text-gray-500 mt-4">No site details found.</div>;
  }

  return (
    <div className="my-5 max-w-[1520px] mx-auto bg-white rounded-lg">
      <Link href="/dashboard">
        <button className="px-4 py-2 rounded-md bg-gray-200 border bg-inherit !text-black transition-colors flex items-center gap-2 hover:bg-gray-100">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12H3m0 0l4.5-4.5M3 12l4.5 4.5" />
          </svg>
          Dashboard
        </button>
      </Link>

      <div className="flex space-x-4 mb-8 w-full justify-between mt-4">
        <div className="flex justify-between items-center gap-4">
          <h1 className="text-2xl font-bold">{trackingEvents.name}</h1>
          <span className="text-green-600 font-medium flex items-center gap-2">
            {/* <div className="w-3 h-3 rounded-full bg-red-600 animate-pulse"></div> */}
            {/* {totalUniqueUsers(trackingEvents)} current visitors */}
            {/* { trackingEvents.length } current visitors */}
          </span>
        </div>

        <select
          className="appearance-none px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={selectedDashboard}
          onChange={(e) => setSelectedDashboard(e.target.value)}
        >
          <option value="general">General</option>
          <option value="detail">Detail</option>
        </select>
      </div>

      {selectedDashboard === "general" ? (
        <DashboardFirstOption trackingEvents={trackingEvents} />
      ) : (
        <DashboardSecondOption trackingEvents={trackingEvents} />
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
