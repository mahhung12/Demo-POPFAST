"use client";
import { useEffect, useState } from "react";
import CountryMap from "./CountryMap";

export default function DemographicCard({ events }: { events: any }) {
  const [countryData, setCountryData] = useState<{ country: string; count: number; percentage: number }[]>([]);
  const [mapMarkers, setMapMarkers] = useState<{ latLng: [number, number]; name: string }[]>([]);

  useEffect(() => {
    const fetchGeoData = async (ip: string) => {
      try {
        const res = await fetch(`https://ipwho.is/${ip}`);
        const geo = await res.json();
        if (geo.success) {
          return { lat: geo.latitude, lng: geo.longitude, country: geo.country };
        }
      } catch (e) {
        console.error("Geo lookup failed:", e);
      }
      return { lat: 0, lng: 0, country: "Unknown" }; // Default values if lookup fails
    };

    const processData = async () => {
      const countryCounts: Record<string, { count: number; latLng: [number, number] }> = {};
      const ipToGeoCache: Record<string, { lat: number; lng: number; country: string }> = {};

      for (const event of events.pageviews) {
        const ipAddress = event.ip_address;
        if (!ipAddress) continue;

        // Check if IP is already cached
        if (!ipToGeoCache[ipAddress]) {
          const geoData = await fetchGeoData(ipAddress);
          ipToGeoCache[ipAddress] = geoData;
        }

        const { lat, lng, country } = ipToGeoCache[ipAddress];
        const countryName = country || "Unknown";

        if (!countryCounts[countryName]) {
          countryCounts[countryName] = { count: 0, latLng: [lat, lng] };
        }
        countryCounts[countryName].count += 1; // Increment count for the country
      }

      // Calculate total unique users and percentages
      const totalUniqueUsers = Object.values(countryCounts).reduce((sum, data) => sum + data.count, 0);
      const aggregatedData = Object.entries(countryCounts).map(([country, data]) => ({
        country,
        count: data.count,
        percentage: Math.round((data.count / totalUniqueUsers) * 100),
      }));

      // Generate markers for the map
      const markers = Object.entries(countryCounts).map(([country, data]) => ({
        latLng: data.latLng,
        name: country,
      }));

      setCountryData(aggregatedData);
      setMapMarkers(markers);
    };

    processData();
  }, [events]);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
      <div className="flex justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Customers Demographic</h3>
          <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-600">Number of customers based on country</p>
        </div>
      </div>

      <div className="px-4 py-6 my-6 overflow-hidden border border-gray-200 rounded-2xl bg-gray-50 dark:border-gray-800 dark:bg-gray-900 sm:px-6">
        <div
          id="mapOne"
          className="mapOne map-btn -mx-4 -my-6 h-[212px] w-[252px] 2xsm:w-[307px] xsm:w-[358px] sm:-mx-6 md:w-[668px] lg:w-[634px] xl:w-[393px] 2xl:w-[554px]"
        >
          {mapMarkers.length > 0 ? (
            <CountryMap markers={mapMarkers} />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">Loading map...</div>
          )}
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
