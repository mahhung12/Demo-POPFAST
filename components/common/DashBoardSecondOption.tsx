"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CategoryScale, Chart as ChartJS, Legend, LinearScale, LineElement, PointElement, Tooltip } from "chart.js";
import { Line } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

export default function DashboardSecondOption({ events }: { events: any[] }) {
  const eventCountsByDate = events.reduce((acc: Record<string, number>, event) => {
    const date = new Date(event.timestamp).toISOString().split("T")[0]; // Extract date (YYYY-MM-DD)
    acc[date] = (acc[date] || 0) + 1; // Increment count for the date
    return acc;
  }, {});

  // Prepare data for the Line Chart
  const chartLabels = Object.keys(eventCountsByDate).sort(); // Sorted dates
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

  // Process events to calculate top pages
  const topPages = events.reduce((acc: Record<string, number>, event) => {
    const url = event.url || "Unknown";
    acc[url] = (acc[url] || 0) + 1;
    return acc;
  }, {});

const sortedTopPages = Object.entries(topPages)
    .sort(([, a], [, b]) => Number(b) - Number(a)) // Ensure values are numbers
    .slice(0, 5); // Limit to top 5 pages

  return (
    <div className="space-y-6">
      {/* Existing Block: Traffic Summary */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
        {[
          ["UNIQUE VISITORS", new Set(events.map((event) => event.ip_address)).size || "N/A"], // Unique IPs
          ["TOTAL VISITS", events.length || "N/A"], // Total events
          ["TOTAL PAGEVIEWS", new Set(events.map((event) => event.url).filter((url) => url)).size || "N/A"], // Unique URLs
          ["VIEWS PER VISIT", "N/A"], // Placeholder for views per visit
          ["BOUNCE RATE", "N/A"], // Placeholder for bounce rate
          ["VISIT DURATION", "N/A"], // Placeholder for visit duration
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

      {/* Existing Block: Traffic Chart */}
      <Card>
        <CardContent className="pt-6">
          <Line data={chartData} options={chartOptions} />
        </CardContent>
      </Card>

      {/* Existing Block: Top Sources */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Updated Block: Top Pages */}
        <Card>
          <CardContent className="pt-4">
            <h2 className="font-medium mb-4">Top Pages</h2>
            <Table>
              <TableBody>
                {sortedTopPages.map(([page, visitors], idx) => (
                  <TableRow key={idx}>
                    <TableCell>{page}</TableCell>
                    <TableCell className="text-right">{visitors as any}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <h2 className="font-medium mb-4">Recent Events</h2>
            <Table>
              <TableBody>
                {events.map((event, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{event.event_type}</TableCell>
                    <TableCell>{new Date(event.timestamp).toLocaleString()}</TableCell>
                    <TableCell>{event.ip_address}</TableCell>
                    <TableCell>{event.metadata?.provider || "N/A"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
