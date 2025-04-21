"use client";

import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// Dynamically import the ReactApexChart component
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

interface EventData {
  id: string;
  event_type: string;
  timestamp: string;
}

export default function MonthlyTarget({ events }: { events: EventData[] }) {
  const [progress, setProgress] = useState(0); // Progress percentage

  useEffect(() => {
    // Calculate progress based on the number of events
    const target = 100; // Example target (e.g., 100 events)
    const achieved = events.length; // Number of events
    const calculatedProgress = Math.min((achieved / target) * 100, 100); // Cap at 100%
    setProgress(calculatedProgress);
  }, [events]);

  const options: ApexOptions = {
    colors: ["#465FFF"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "radialBar",
      height: 330,
      sparkline: {
        enabled: true,
      },
    },
    plotOptions: {
      radialBar: {
        startAngle: -85,
        endAngle: 85,
        hollow: {
          size: "80%",
        },
        track: {
          background: "#E4E7EC",
          strokeWidth: "100%",
          margin: 5, // margin is in pixels
        },
        dataLabels: {
          name: {
            show: false,
          },
          value: {
            fontSize: "36px",
            fontWeight: "600",
            offsetY: -40,
            color: "#1D2939",
            formatter: function (val) {
              return val + "%";
            },
          },
        },
      },
    },
    fill: {
      type: "solid",
      colors: ["#465FFF"],
    },
    stroke: {
      lineCap: "round",
    },
    labels: ["Progress"],
  };

  return (
    <div className="rounded-2xl border border-gray-200 p-5 dark:border-gray-800 h-full ">
      <div className="px-5 pt-5 bg-white shadow-default rounded-2xl pb-11  sm:px-6 sm:pt-6 gap-4 h-full flex flex-col items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-semibold">Monthly Target</h3>
          <p className="mt-1 font-normal text-gray-500 text-theme-sm ">Target you’ve set for each month</p>
        </div>
        <div className="relative ">
          <div className="max-h-[330px]">
            <ReactApexChart options={options} series={[progress]} type="radialBar" height={330} />
          </div>

          <span className="absolute left-1/2 top-full -translate-x-1/2 -translate-y-[95%] rounded-full bg-success-50 px-3 py-1 text-xs font-medium text-success-600 dark:bg-success-500/15 dark:text-success-500">
            +{Math.round(progress)}%
          </span>
        </div>
        <p className="mx-auto mt-10 w-full max-w-[380px] text-center text-sm text-gray-800 sm:text-base">
          You’ve achieved {Math.round(progress)}% of your target this month. Keep up your good work!
        </p>
      </div>
    </div>
  );
}
