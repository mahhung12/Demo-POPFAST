"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { CategoryScale, Chart as ChartJS, Legend, LinearScale, LineElement, PointElement } from "chart.js";
import { Line } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Legend);

export default function DashboardFirstOption({ trackingEvents = [] }: { trackingEvents?: any }) {
  // Ensure pageviews is always an array
  const eventCountsByDate = (trackingEvents.pageviews || []).reduce((acc: Record<string, number>, pageview) => {
    const date = new Date(pageview.timestamp).toISOString().split("T")[0]; // Extract date (YYYY-MM-DD)
    acc[date] = (acc[date] || 0) + 1; // Increment count for the date
    return acc;
  }, {});

  // Prepare data for the Line Chart
  const chartLabels = Object.keys(eventCountsByDate || {}).sort(); // Sorted dates
  const chartDataValues = chartLabels.map((date) => eventCountsByDate[date]); // Corresponding counts

  const chartData = {
    labels: chartLabels, // Dates as labels
    datasets: [
      {
        label: "Events",
        data: chartDataValues, // Event counts
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
      legend: {
        position: "top" as const, // Explicitly specify the type as a valid literal
      },
      tooltip: {
        mode: "index", // Explicitly cast to the expected type
        intersect: false,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Date",
        },
      },
      y: {
        title: {
          display: true,
          text: "Number of Events",
        },
        beginAtZero: true,
      },
    },
  } as any;

  // Process pageviews to calculate top pages
  const topPages = (trackingEvents.pageviews || []).reduce((acc: Record<string, number>, pageview) => {
    const url = pageview.url || "Unknown";
    acc[url] = (acc[url] || 0) + 1;
    return acc;
  }, {});

  const sortedTopPages = Object.entries(topPages || {})
    .sort(([, a], [, b]) => Number(b) - Number(a)) // Ensure values are numbers
    .slice(0, 5); // Limit to top 5 pages

  return (
    <div className="space-y-6">
      {/* Traffic Summary */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
        {[
          ["UNIQUE VISITORS", new Set(trackingEvents.pageviews.map((pageview) => pageview.user_agent)).size || "-"], // Unique user agents
          ["TOTAL VISITS", trackingEvents.pageviews.length || "-"], // Total pageviews
          [
            "TOTAL PAGEVIEWS",
            new Set(trackingEvents.pageviews.map((pageview) => pageview.url).filter((url) => url)).size || "-",
          ],
          [
            "VIEWS PER VISIT",
            (
              trackingEvents.length / new Set(trackingEvents.pageviews.map((pageview) => pageview.user_agent)).size
            ).toFixed(2) || "-",
          ], // Views per visit
          ["BOUNCE RATE", "-"], // Placeholder for bounce rate
          ["VISIT DURATION", "-"], // Placeholder for visit duration
        ].map(([label, current, previous], idx) => (
          <Card key={idx} className="text-center">
            <CardContent className="pt-4 pb-2">
              <div className="text-xs text-gray-500">{label}</div>
              <div className="text-xl font-semibold">{current}</div>
              <div className="text-xs text-gray-400">{previous}</div>
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
      <div className="grid 2xl:grid-cols-[40%,60%] gap-4">
        {/* Top Pages Section */}
        <Card>
          <CardContent className="pt-4 min-h-[350px]">
            <h2 className="font-medium mb-4">Top Pages</h2>
            {sortedTopPages.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {sortedTopPages.map(([page, visitors], idx) => (
                  <div
                    key={idx}
                    className="flex flex-col items-start gap-2 sm:grid sm:grid-cols-[90%,10%] sm:items-center sm:p-4 sm:border sm:border-gray-200 rounded-md sm:hover:bg-gray-50"
                  >
                    {/* Page URL with Tooltip */}
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <a
                            href={page}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 truncate hover:underline"
                          >
                            {page ? `${new URL(page).hostname}${new URL(page).pathname}` : "-"}
                          </a>
                        </TooltipTrigger>
                        <TooltipContent>{page || "No URL available"}</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    {/* Visitors Count */}
                    <span className="text-right font-medium text-gray-700">{visitors as any}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 flex items-center justify-center h-full">
                No top pages available.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Events Section */}
        <Card>
          <CardContent className="pt-4 min-h-[350px]">
            <h2 className="font-medium mb-4">Recent Events</h2>
            {trackingEvents.pageviews.length > 0 ? (
              <>
                <div className="hidden md:block">
                  <Table className="table-auto w-full border-collapse border border-gray-200">
                    <thead>
                      <tr className="bg-gray-100 text-left">
                        <th className="px-4 py-2 border border-gray-200">URL</th>
                        <th className="px-4 py-2 border border-gray-200">Timestamp</th>
                        <th className="px-4 py-2 border border-gray-200">Referrer</th>
                        <th className="px-4 py-2 border border-gray-200">Country</th>
                      </tr>
                    </thead>
                    <TableBody>
                      {trackingEvents.pageviews.map((pageview, idx) => (
                        <TableRow key={idx} className="hover:bg-gray-50">
                          {/* URL Field with Tooltip */}
                          <TableCell className="px-4 py-2 border border-gray-200 text-blue-600 truncate max-w-[200px]">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <a href={pageview.url} target="_blank" rel="noopener noreferrer">
                                    {pageview.url
                                      ? `${new URL(pageview.url).hostname}${new URL(pageview.url).pathname}`
                                      : "-"}
                                  </a>
                                </TooltipTrigger>
                                <TooltipContent>{pageview.url || "No URL available"}</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </TableCell>

                          {/* Timestamp Field */}
                          <TableCell className="px-4 py-2 border border-gray-200">
                            {`${new Date(pageview.timestamp).toLocaleDateString()} - ${new Date(
                              pageview.timestamp
                            ).toLocaleTimeString()}`}
                          </TableCell>

                          {/* Referrer Field with Tooltip */}
                          <TableCell className="px-4 py-2 border border-gray-200 truncate max-w-[150px]">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span>{pageview.referrer ? new URL(pageview.referrer).hostname : "-"}</span>
                                </TooltipTrigger>
                                <TooltipContent>{pageview.referrer || "No Referrer available"}</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </TableCell>

                          {/* Country Field */}
                          <TableCell className="px-4 py-2 border border-gray-200">{pageview.country || "-"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div className="block md:hidden space-y-4">
                  {trackingEvents.pageviews.map((pageview, idx) => (
                    <div key={idx} className="p-4 border border-gray-200 rounded-md hover:bg-gray-50">
                      {/* URL Field */}
                      <div className="mb-2">
                        <span className="block text-xs text-gray-500">URL</span>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <a
                                href={pageview.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 truncate hover:underline"
                              >
                                {pageview.url
                                  ? `${new URL(pageview.url).hostname}${new URL(pageview.url).pathname}`
                                  : "-"}
                              </a>
                            </TooltipTrigger>
                            <TooltipContent>{pageview.url || "No URL available"}</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>

                      {/* Timestamp Field */}
                      <div className="mb-2">
                        <span className="block text-xs text-gray-500">Timestamp</span>
                        <span className="text-gray-700">
                          {`${new Date(pageview.timestamp).toLocaleDateString()} - ${new Date(
                            pageview.timestamp
                          ).toLocaleTimeString()}`}
                        </span>
                      </div>

                      {/* Referrer Field */}
                      <div className="mb-2">
                        <span className="block text-xs text-gray-500">Referrer</span>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="text-gray-500 truncate hover:underline">
                                {pageview.referrer ? new URL(pageview.referrer).hostname : "-"}
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>{pageview.referrer || "No Referrer available"}</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>

                      {/* Country Field */}
                      <div>
                        <span className="block text-xs text-gray-500">Country</span>
                        <span className="text-gray-700">{pageview.country || "-"}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center text-gray-500 flex items-center justify-center h-full">
                No recent events available.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
