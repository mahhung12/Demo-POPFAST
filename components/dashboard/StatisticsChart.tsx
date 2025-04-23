"use client";
import React, { useEffect, useState } from "react";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import ChartTab from "../common/SecondOptions/ChartTab";

// Dynamically import the ReactApexChart component
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export default function StatisticsChart({ events }: { events: any }) {
  const [series, setSeries] = useState([
    { name: "Total Pageviews", data: [] },
    { name: "Estimated", data: [] },
  ]);
  const [selectedOption, setSelectedOption] = useState<"optionOne" | "optionTwo" | "optionThree">("optionOne");

  useEffect(() => {
    // Transform the response data into counts based on the selected option
    const monthlyCounts = Array(12).fill(0); // Initialize monthly counts
    const monthlyEstimated = Array(12).fill(0); // Initialize monthly estimated values

    events.pageviews.forEach((event) => {
      const month = new Date(event.timestamp).getMonth(); // Get the month (0-11)

      monthlyCounts[month] += 1; // Increment the count for the respective month
      monthlyEstimated[month] += 50; // Example: Add $50 per pageview as an estimated value
    });

    if (selectedOption === "optionOne") {
      // Monthly data
      setSeries([
        { name: "Total Pageviews", data: monthlyCounts },
        { name: "Estimated", data: monthlyEstimated },
      ]);
    } else if (selectedOption === "optionTwo") {
      // Quarterly data
      const quarterlyCounts = [0, 0, 0, 0];
      const quarterlyEstimated = [0, 0, 0, 0];
      for (let i = 0; i < 12; i++) {
        const quarter = Math.floor(i / 3); // Determine the quarter (0-3)
        quarterlyCounts[quarter] += monthlyCounts[i];
        quarterlyEstimated[quarter] += monthlyEstimated[i];
      }
      setSeries([
        { name: "Total Pageviews", data: quarterlyCounts },
        { name: "Estimated", data: quarterlyEstimated },
      ]);
    } else if (selectedOption === "optionThree") {
      // Annual data
      const annualCount = monthlyCounts.reduce((sum, val) => sum + val, 0);
      const annualEstimated = monthlyEstimated.reduce((sum, val) => sum + val, 0);
      setSeries([
        { name: "Total Pageviews", data: [annualCount] },
        { name: "Estimated", data: [annualEstimated] },
      ]);
    }
  }, [events, selectedOption]);

  const options: ApexOptions = {
    legend: {
      show: false,
      position: "top",
      horizontalAlign: "left",
    },
    colors: ["#465FFF", "#9CB9FF"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      height: 310,
      type: "line",
      toolbar: {
        show: false,
      },
    },
    stroke: {
      curve: "straight",
      width: [2, 2],
    },
    fill: {
      type: "gradient",
      gradient: {
        opacityFrom: 0.55,
        opacityTo: 0,
      },
    },
    markers: {
      size: 0,
      strokeColors: "#fff",
      strokeWidth: 2,
      hover: {
        size: 6,
      },
    },
    grid: {
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      enabled: true,
      x: {
        format: "dd MMM yyyy",
      },
    },
    xaxis: {
      type: "category",
      categories:
        selectedOption === "optionOne"
          ? ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
          : selectedOption === "optionTwo"
          ? ["Q1", "Q2", "Q3", "Q4"]
          : ["2025"], // Annual data
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      tooltip: {
        enabled: false,
      },
    },
    yaxis: {
      labels: {
        style: {
          fontSize: "12px",
          colors: ["#6B7280"],
        },
      },
      title: {
        text: "",
        style: {
          fontSize: "0px",
        },
      },
    },
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between">
        <div className="w-full">
          <h3 className="text-lg font-semibold">Statistics</h3>
          <p className="mt-1 text-gray-500 text-theme-sm ">
            {/* $50 per pageview as an estimated value */}
            The estimated values are calculated based on a fixed rate of $50 per pageview.
          </p>
        </div>
        <div className="flex items-start w-full gap-3 sm:justify-end">
          <ChartTab selected={selectedOption} onChange={(option) => setSelectedOption(option)} />
        </div>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="min-w-[1000px] xl:min-w-full">
          <ReactApexChart options={options} series={series} type="area" height={310} />
        </div>
      </div>
    </div>
  );
}
