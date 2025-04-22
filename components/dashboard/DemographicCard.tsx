"use client";
import { useEffect, useState } from "react";
import CountryMap from "./CountryMap";

interface EventData {
  id: string;
  event_type: string;
  timestamp: string;
  ip_address: string;
  metadata: {
    country?: string;
  };
}

export default function DemographicCard({ events }: { events: EventData[] }) {
  const [countryData, setCountryData] = useState<{ country: string; count: number; percentage: number }[]>([]);

  useEffect(() => {
    // Aggregate data by unique IPs and country
    const uniqueIps = new Set<string>();
    const countryCounts: Record<string, number> = {};

    events.forEach((event) => {
      if (!uniqueIps.has(event.ip_address)) {
        uniqueIps.add(event.ip_address); // Add unique IP to the set
        const country = event.metadata?.country || "Unknown"; // Default to "Unknown" if no country is provided
        countryCounts[country] = (countryCounts[country] || 0) + 1; // Increment count for the country
      }
    });

    // Calculate total customers and percentages
    const totalCustomers = Object.values(countryCounts).reduce((sum, count) => sum + count, 0);
    const aggregatedData = Object.entries(countryCounts).map(([country, count]) => ({
      country: country || "Unknown country",
      count,
      percentage: Math.round((count / totalCustomers) * 100),
    }));

    setCountryData(aggregatedData);
  }, [events]);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
      <div className="flex justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 ">Customers Demographic</h3>
          <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-600">Number of customers based on country</p>
        </div>
      </div>

      <div className="px-4 py-6 my-6 overflow-hidden border border-gray-200 rounded-2xl bg-gray-50 dark:border-gray-800 dark:bg-gray-900 sm:px-6">
        <div
          id="mapOne"
          className="mapOne map-btn -mx-4 -my-6 h-[212px] w-[252px] 2xsm:w-[307px] xsm:w-[358px] sm:-mx-6 md:w-[668px] lg:w-[634px] xl:w-[393px] 2xl:w-[554px]"
        >
          <CountryMap />
        </div>
      </div>

      <div className="space-y-5">
        {countryData.map(({ country, count, percentage }) => (
          <div key={country} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div>
                <p className="font-semibold text-gray-800 text-theme-sm">{country}</p>
                <span className="block text-gray-500 text-theme-xs dark:text-gray-600">{count} Customers</span>
              </div>
            </div>

            <div className="flex w-full max-w-[140px] items-center gap-3">
              <div className="relative block h-2 w-full max-w-[100px] rounded-sm bg-gray-200 dark:bg-gray-500">
                <div
                  className="absolute left-0 top-0 flex h-full items-center justify-center rounded-sm bg-brand-500 text-xs font-medium text-black"
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
              <p className="font-medium text-gray-800 text-theme-sm">{percentage}%</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
