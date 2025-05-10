"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { totalUniqueUsers } from "@/libs/utils";
import { CategoryScale, Chart as ChartJS, Legend, LinearScale, LineElement, PointElement } from "chart.js";
import { JSX, useMemo, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  FaAndroid,
  FaAndroid as FaAndroidLogo,
  FaApple,
  FaXing,
  FaChrome,
  FaDesktop,
  FaEdge,
  FaFacebook,
  FaFirefoxBrowser,
  FaGlobe,
  FaGoogle,
  FaInstagram,
  FaLinux,
  FaListUl,
  FaMobileAlt,
  FaQuestion,
  FaReddit,
  FaSafari,
  FaTabletAlt,
  FaTools,
  FaTwitter,
  FaWindows,
  FaYahoo,
  FaYoutube,
} from "react-icons/fa";
import { SiMacos } from "react-icons/si";
import DemographicCard from "../dashboard/DemographicCard";
import RecentActivities from "../dashboard/RecentOrders";

// Icon mapping helpers
const browserIcons: Record<string, JSX.Element> = {
  Chrome: <FaChrome className="text-blue-500" />,
  Firefox: <FaFirefoxBrowser className="text-orange-500" />,
  Edge: <FaEdge className="text-blue-700" />,
  Safari: <FaSafari className="text-gray-500" />,
};

const osIcons: Record<string, JSX.Element> = {
  Windows: <FaWindows className="text-blue-600" />,
  MacOS: <SiMacos className="text-gray-700" />,
  Linux: <FaLinux className="text-black" />,
  Android: <FaAndroid className="text-green-600" />,
  iOS: <FaApple className="text-gray-700" />,
};

const deviceIcons: Record<string, JSX.Element> = {
  desktop: <FaDesktop className="text-blue-600" />,
  tablet: <FaTabletAlt className="text-purple-600" />,
  mobile: <FaMobileAlt className="text-green-600" />,
};

// Referrer icon mapping
const referrerIcons: Record<string, JSX.Element> = {
  "youtube.com": <FaYoutube className="text-red-500" />,
  "facebook.com": <FaFacebook className="text-blue-600" />,
  "twitter.com": <FaTwitter className="text-sky-400" />,
  "google.com": <FaGoogle className="text-green-600" />,
  "google.co.uk": <FaGoogle className="text-green-600" />,
  "reddit.com": <FaReddit className="text-orange-500" />,
  "instagram.com": <FaInstagram className="text-pink-500" />,
  "bing.com": <FaXing className="text-blue-500" />,
  "weblist.su": <FaListUl className="text-gray-700" />,
  "ares.tools": <FaTools className="text-gray-700" />,
  "in.search.yahoo.com": <FaYahoo className="text-purple-700" />,
  "android-app://com.google.android.googlequicksearchbox/": <FaAndroidLogo className="text-green-600" />,
};

const TABS = ["Browser", "OS", "Device"] as const;
type TabType = (typeof TABS)[number];

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Legend);

// Helper to aggregate by property (optionally by unique IP)
function aggregateByProperty(pageviews: any[], property: string, uniqueByIp: boolean = false): Record<string, number> {
  if (uniqueByIp) {
    const seen: Record<string, Set<string>> = {};
    return pageviews.reduce((acc: Record<string, number>, curr) => {
      const key = curr[property] || "Unknown";
      const ip = curr.ip_address || "";
      if (!seen[key]) seen[key] = new Set();
      if (!seen[key].has(ip)) {
        acc[key] = (acc[key] || 0) + 1;
        seen[key].add(ip);
      }
      return acc;
    }, {});
  }
  return pageviews.reduce((acc: Record<string, number>, curr) => {
    const key = curr[property] || "Unknown";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
}

export default function DashboardFirstOption({ trackingEvents = [] }: { trackingEvents?: any }) {
  const [activeTab, setActiveTab] = useState<TabType>("Browser");
  const pageviews = useMemo(() => trackingEvents.pageviews || [], [trackingEvents.pageviews]);

  // Memoized chart data
  const { chartData, chartOptions, sortedTopPages } = useMemo(() => {
    // Group by hour for chart
    const eventCountsByHour = pageviews.reduce((acc: Record<string, number>, pageview) => {
      const date = new Date(pageview.timestamp);
      const hourLabel =
        date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false }).slice(0, 2) + ":00";
      acc[hourLabel] = (acc[hourLabel] || 0) + 1;
      return acc;
    }, {});
    const sortedHours = Object.keys(eventCountsByHour).sort((a, b) => parseInt(a) - parseInt(b));
    const hourlyCounts = sortedHours.map((hour) => eventCountsByHour[hour]);

    const chartData = {
      labels: sortedHours,
      datasets: [
        {
          label: "Visitors per Hour",
          data: hourlyCounts,
          borderColor: "#3b82f6",
          backgroundColor: "rgba(59, 130, 246, 0.2)",
          borderWidth: 2,
          tension: 0.4,
        },
      ],
    };

    const chartOptions = {
      responsive: true,
      plugins: {
        legend: { position: "top" as const },
        tooltip: { mode: "index" as const, intersect: false },
      },
      scales: {
        x: { title: { display: true, text: "Date" } },
        y: { title: { display: true, text: "Number of Events" }, beginAtZero: true },
      },
    };

    // Top pages
    const topPages = pageviews.reduce((acc: Record<string, number>, pageview) => {
      const url = pageview.url || "Unknown";
      acc[url] = (acc[url] || 0) + 1;
      return acc;
    }, {});
    const sortedTopPages = Object.entries(topPages)
      .sort(([, a], [, b]) => Number(b) - Number(a))
      .slice(0, 5);

    return { chartData, chartOptions, sortedTopPages };
  }, [pageviews]);

  // Tab content aggregation
  const tabData = useMemo(() => {
    let data: Record<string, number> = {};
    let iconMap: Record<string, JSX.Element> = {};
    if (activeTab === "Browser") {
      data = aggregateByProperty(pageviews, "browser");
      iconMap = browserIcons;
    } else if (activeTab === "OS") {
      data = aggregateByProperty(pageviews, "os");
      iconMap = osIcons;
    } else if (activeTab === "Device") {
      data = aggregateByProperty(pageviews, "device");
      iconMap = deviceIcons;
    }
    const entries = Object.entries(data).sort(([, a], [, b]) => b - a);
    return { entries, iconMap };
  }, [activeTab, pageviews]);

  // Traffic summary cards
  const summaryCards = [
    ["VISITORS", totalUniqueUsers(trackingEvents) || "-"],
    ["TOTAL VISITS", pageviews.length || "-"],
    [
      "TOTAL PAGEVIEWS",
      new Set(pageviews.map((pageview: any) => pageview.url).filter((url: string) => url)).size || "-",
    ],
    [
      "VIEWS PER VISIT",
      totalUniqueUsers(trackingEvents) ? (pageviews.length / totalUniqueUsers(trackingEvents)).toFixed(2) : "-",
    ],
    ["VISIT DURATION", "-"],
  ];

  return (
    <div className="space-y-6">
      {/* Traffic Summary */}
      <div className="flex items-center justify-between gap-4">
        {summaryCards.map(([label, current], idx) => (
          <Card key={idx} className="text-center w-full">
            <CardContent className="pt-4 pb-2">
              <div className="text-xs text-gray-500">{label}</div>
              <div className="text-xl font-semibold">{current}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Traffic Chart */}
      <Card>
        <CardContent className="pt-6">
          <Line data={chartData} options={chartOptions} />
        </CardContent>
      </Card>

      {/* Top Sources */}
      <div className="grid 2xl:grid-cols-[60%,40%] gap-4">
        {/* Demographic Section */}
        <div className="min-h-[350px]">
          <DemographicCard events={trackingEvents} />
        </div>

        {/* Recent Events Section */}
        <Card>
          <CardContent className="pt-4 min-h-[350px]">
            {/* Tabs */}
            <div className="flex gap-2 mb-4">
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
            {tabData.entries.length > 0 ? (
              <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto">
                {tabData.entries.map(([key, count], idx) => (
                  <div key={idx} className="flex justify-between items-center px-2 py-2 border-b last:border-b-0">
                    <span className="flex items-center gap-2 font-medium text-gray-700">
                      {tabData.iconMap[key] || <FaQuestion className="text-gray-400" />}
                      {key}
                    </span>
                    <span className="font-semibold text-gray-900">{count}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 flex items-center justify-center h-full">
                No data available.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Top Referrals & Recent Activities */}
      <div className="grid grid-cols-[30%,70%] gap-4 items-stretch justify-between">
        <Card>
          <CardContent className="pt-4 h-[350px]">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-5">Top Referrals</h3>

            {(() => {
              // Group by referrer
              const referrerCounts = pageviews.reduce((acc: Record<string, number>, pv: any) => {
                const ref = pv.referrer && pv.referrer.trim() ? pv.referrer : "Direct / None";
                acc[ref] = (acc[ref] || 0) + 1;
                return acc;
              }, {});
              const sortedReferrers = Object.entries(referrerCounts)
                .sort(([, a], [, b]) => Number(b) - Number(a))
                .slice(0, 5);

              return sortedReferrers.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 max-h-[300px] overflow-y-auto">
                  {sortedReferrers.map(([ref, count], idx) => {
                    let domain = "";
                    try {
                      if (ref !== "Direct / None") {
                        // For android-app://, use the protocol+host as the domain
                        if (ref.startsWith("android-app://")) {
                          domain = "android-app://com.google.android.googlequicksearchbox/";
                        } else {
                          domain = new URL(ref).hostname.replace(/^www\./, "");
                          // For google.co.uk, google.com, etc., use the full hostname
                          // No special assignment needed for these domains
                        }
                      }
                    } catch {
                      domain = "";
                    }
                    const icon =
                      domain && referrerIcons[domain] ? referrerIcons[domain] : <FaGlobe className="text-gray-400" />;

                    return (
                      <div key={idx} className="flex flex-row gap-2 items-center justify-between">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              {ref !== "Direct / None" ? (
                                <span className="flex items-center gap-2">
                                  {icon}
                                  <a
                                    href={ref}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 truncate hover:underline"
                                  >
                                    {ref ? `${domain}${new URL(ref).pathname}` : "-"}
                                  </a>
                                </span>
                              ) : (
                                <span className="flex items-center gap-2 text-gray-700">
                                  <FaGlobe className="text-gray-400" />
                                  {ref}
                                </span>
                              )}
                            </TooltipTrigger>
                            <TooltipContent>{ref}</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <span className="text-right font-medium text-gray-700">{String(count)}</span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center text-gray-500 flex items-center justify-center h-full">
                  No referral data available.
                </div>
              );
            })()}
          </CardContent>
        </Card>
        <div className="h-[350px]">
          <RecentActivities events={trackingEvents} />
        </div>
      </div>
    </div>
  );
}
