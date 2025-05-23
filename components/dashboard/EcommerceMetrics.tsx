"use client";
import React from "react";
import Image from "next/image";
import Badge from "../ui/badge/Badge";
import Link from "next/link";

interface EcommerceMetricsProps {
  events: any;
}

export const EcommerceMetrics = ({ events }: EcommerceMetricsProps) => {
  // Calculate metrics
  const totalRecords = events.pageviews.length;

  // Get unique referrer links
  const totalReferrers = Array.from(new Set(events.pageviews.map((e) => e.referrer).filter(Boolean)));

  // Get unique country names
  // const topCountries = Array.from(new Set(events.pageviews.map((e) => e.country).filter(Boolean)));

  // Use ip_address to calculate unique users
  const uniqueUsers = new Set(events.pageviews.map((e) => e.ip_address).filter(Boolean)).size;

  const countryVisitCounts = events.pageviews.reduce((acc: Record<string, Set<string>>, pageview) => {
    if (pageview.country && pageview.ip_address) {
      if (!acc[pageview.country]) {
        acc[pageview.country] = new Set();
      }
      acc[pageview.country].add(pageview.ip_address);
    }
    return acc;
  }, {});

  // Convert to an array of country and visit count
  const topCountries = Object.entries(countryVisitCounts).map(([country, ips]) => ({
    country,
    visitCount: (ips as any).size,
  }));

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
      {/* Total Events */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl">
          <Image src="/icons/box-line.svg" alt="Total Events Icon" width={24} height={24} />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 font-medium">Total records</span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm">{totalRecords}</h4>
          </div>
          <Badge color="success">
            <Image src="/icons/arrow-up.svg" alt="Arrow Up Icon" width={16} height={16} className="inline-block mr-1" />
            +{((totalRecords / 100) * 10).toFixed(2)}%
          </Badge>
        </div>
      </div>

      {/* Unique Users */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl">
          <Image src="/icons/group.svg" alt="Unique Users Icon" width={24} height={24} />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 font-medium">Unique Users</span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm">{uniqueUsers}</h4>
          </div>
          <Badge color="success">
            <Image src="/icons/arrow-up.svg" alt="Arrow Up Icon" width={16} height={16} className="inline-block mr-1" />
            +{((uniqueUsers / 100) * 10).toFixed(2)}%
          </Badge>
        </div>
      </div>

      {/* Top Referrers */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl">
          <Image src="/icons/info.svg" alt="Top Referrers Icon" width={24} height={24} />
        </div>
        <div className="mt-5">
          <div>
            <span className="text-sm text-gray-500 font-medium">Total Referrers</span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm">{totalReferrers.length}</h4>
          </div>
          <ul className="mt-2 space-y-1">
            {totalReferrers.map((referrer: any, idx) => (
              <li key={idx} className="text-blue-600 truncate hover:underline">
                <Link href={referrer} target="_blank" rel="noopener noreferrer">
                  {referrer}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Top Countries */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl">
          <Image src="/icons/shooting-star.svg" alt="Top Countries Icon" width={24} height={24} />
        </div>
        <div className="mt-5">
          <div>
            <span className="text-sm text-gray-500 font-medium">Country-wise Unique Visits</span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm">{topCountries.length}</h4>
          </div>
          <ul className="mt-2 space-y-1">
            {topCountries.map(({ country, visitCount }, idx) => (
              <li key={idx} className="text-gray-800 truncate">
                {country} - {visitCount} visits
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
