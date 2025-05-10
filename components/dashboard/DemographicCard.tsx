"use client";
import { useEffect, useState } from "react";
import CountryMap from "./CountryMap";
import Image from "next/image";

type GeoInfo = {
  lat: number;
  lng: number;
  country: string;
  countryCode: string;
  region: string;
  city: string;
  flagImg: string;
};

type GroupedData = {
  name: string;
  count: number;
  percentage: number;
  flagImg: string;
};

const TABS = ["Map", "Country", "Region", "City"] as const;
type TabType = (typeof TABS)[number];

export default function DemographicCard({ events }: { events: any }) {
  const [activeTab, setActiveTab] = useState<TabType>("Map");
  const [geoList, setGeoList] = useState<GeoInfo[]>([]);
  const [mapMarkers, setMapMarkers] = useState<{ latLng: [number, number]; name: string }[]>([]);
  const [grouped, setGrouped] = useState<{
    country: GroupedData[];
    region: GroupedData[];
    city: GroupedData[];
  }>({ country: [], region: [], city: [] });

  console.log("events", events);

  useEffect(() => {
    const fetchGeoData = async (ip: string) => {
      try {
        const res = await fetch(`https://ipwho.is/${ip}`);
        const geo = await res.json();
        if (geo.success) {
          return {
            lat: geo.latitude,
            lng: geo.longitude,
            country: geo.country,
            countryCode: geo.country_code,
            region: geo.region,
            city: geo.city,
            flagImg: geo.flag?.img || "",
          };
        }
      } catch (e) {
        console.error("Geo lookup failed:", e);
      }
      return {
        lat: 0,
        lng: 0,
        country: "Unknown",
        countryCode: "",
        region: "Unknown",
        city: "Unknown",
        flagImg: "",
      };
    };

    const processData = async () => {
      const ipToGeo: Record<string, GeoInfo> = {};
      const markers: { latLng: [number, number]; name: string }[] = [];

      // Only process unique IPs
      for (const event of events.pageviews) {
        const ipAddress = event.ip_address;
        if (!ipAddress || ipToGeo[ipAddress]) continue;

        ipToGeo[ipAddress] = await fetchGeoData(ipAddress);

        // Add marker for each unique IP (city name)
        const geo = ipToGeo[ipAddress];
        markers.push({
          latLng: [geo.lat, geo.lng],
          name: geo.city || "Unknown",
        });
      }

      const uniqueGeoList = Object.values(ipToGeo);
      setGeoList(uniqueGeoList);
      setMapMarkers(markers);

      // Group by country, region, city using unique IPs
      const groupBy = (key: keyof GeoInfo) => {
        const map: Record<string, { count: number; flagImg: string }> = {};
        uniqueGeoList.forEach((geo) => {
          const name = geo[key] || "Unknown";
          if (!map[name]) {
            map[name] = { count: 0, flagImg: geo.flagImg };
          }
          map[name].count += 1;
        });
        const total = uniqueGeoList.length;
        return Object.entries(map)
          .map(([name, { count, flagImg }]) => ({
            name,
            count,
            percentage: total ? Math.round((count / total) * 100) : 0,
            flagImg,
          }))
          .sort((a, b) => b.count - a.count);
      };

      setGrouped({
        country: groupBy("country"),
        region: groupBy("region"),
        city: groupBy("city"),
      });
    };

    processData();
  }, [events]);

  return (
    <div className="h-full rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-6 pt-4">
      <div className="flex gap-2 mb-6">
        {TABS.map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 rounded ${
              activeTab === tab ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            } font-medium transition`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="h-[250px] overflow-y-scroll">
        {activeTab === "Map" && (
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
        )}

        {activeTab !== "Map" && (
          <div className="space-y-5 max-h-[320px] overflow-y-auto px-2">
            {(activeTab === "Country" ? grouped.country : activeTab === "Region" ? grouped.region : grouped.city).map(
              ({ name, count, flagImg }) => (
                <div key={name} className="flex items-center justify-between border-b pb-2 last:border-b-0">
                  <div className="flex items-center gap-3">
                    {flagImg ? (
                      <Image src={flagImg} alt="flag" width={24} height={24} objectFit="cover" className="border" />
                    ) : (
                      <span className="w-6 h-6 rounded-full border bg-gray-200 flex items-center justify-center text-xs">
                        ?
                      </span>
                    )}
                    <div>
                      <p className="font-semibold text-gray-800 text-theme-sm">{name}</p>
                    </div>
                  </div>
                  <div className="flex w-full max-w-[140px] items-center gap-3">
                    <span className="block text-gray-500 text-theme-xs dark:text-gray-600">{count} Customers</span>
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}
