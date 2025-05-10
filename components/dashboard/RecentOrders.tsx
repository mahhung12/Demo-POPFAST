import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../ui/table";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "../ui/tooltip";
import Image from "next/image";

type GeoInfo = {
  country: string;
  flagImg: string;
};

export default function RecentActivities({ events }: { events: any }) {
  const [geoMap, setGeoMap] = useState<Record<string, GeoInfo>>({});

  useEffect(() => {
    const fetchGeo = async (ip: string) => {
      try {
        const res = await fetch(`https://ipwho.is/${ip}`);
        const geo = await res.json();
        if (geo.success) {
          return {
            country: geo.country,
            flagImg: geo.flag?.img || "",
          };
        }
      } catch (e) {
        console.error("Geo lookup failed:", e);
      }
      return {
        country: "Unknown",
        flagImg: "",
      };
    };

    const uniqueIps = Array.from(new Set(events.pageviews.map((e: any) => e.ip_address).filter(Boolean)));
    let cancelled = false;

    (async () => {
      const geoResults: Record<string, GeoInfo> = {};
      await Promise.all(
        uniqueIps.map(async (ip) => {
          geoResults[ip as any] = await fetchGeo(ip as any);
        })
      );
      if (!cancelled) setGeoMap(geoResults);
    })();

    return () => {
      cancelled = true;
    };
  }, [events.pageviews]);

  const tableData = events.pageviews.map((event: any) => ({
    id: event.id,
    url: event.url || "Unknown URL",
    ip: event.ip_address || "Unknown IP",
    timestamp: event.timestamp || "Unknown Timestamp",
  }));

  const columns = [
    { key: "url", label: "URL", formatter: (value: string) => formatUrl(value) },
    { key: "ip", label: "Country" },
    {
      key: "timestamp",
      label: "Date",
      formatter: (value: string) => {
        // If value does not end with Z or a timezone offset, treat as UTC by appending Z
        let iso = value;
        if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{1,3}$/.test(value)) {
          iso = value.replace(/\.(\d{1,3})$/, (m, ms) => "." + ms.padEnd(3, "0")) + "Z";
        }
        const date = new Date(iso);
        return date.toLocaleString("en-US", { timeZone: events.timezone || "UTC" });
      },
    },
  ];

  function formatUrl(url: string) {
    try {
      const parsedUrl = new URL(url);
      return parsedUrl.hostname + parsedUrl.pathname;
    } catch {
      return url || "Invalid URL";
    }
  }

  return (
    <TooltipProvider>
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
        <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Recent Activities</h3>
        </div>
        <div className="max-w-full overflow-x-auto max-h-[280px] overflow-y-scroll">
          <Table>
            {/* Table Header */}
            <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.key}
                    isHeader
                    className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
              {tableData.map((row) => (
                <TableRow key={row.id}>
                  {columns.map((column) => (
                    <TableCell
                      key={column.key}
                      className="py-3 px-3 text-start whitespace-nowrap truncate text-gray-500 text-theme-sm dark:text-gray-400"
                    >
                      {column.key === "ip" ? (
                        <span className="flex items-center gap-2">
                          {geoMap[row.ip]?.flagImg ? (
                            <Image
                              src={geoMap[row.ip].flagImg}
                              alt="flag"
                              width={24}
                              height={24}
                              objectFit="cover"
                              className="border"
                            />
                          ) : (
                            <span className="w-5 h-4 rounded border bg-gray-200 inline-block" />
                          )}
                          <span className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                            {geoMap[row.ip]?.country || "Loading..."}
                          </span>
                        </span>
                      ) : (
                        <Tooltip>
                          <TooltipTrigger>
                            <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                              {column.formatter ? column.formatter(row[column.key]) : row[column.key]}
                            </p>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{row[column.key]}</p>
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </TooltipProvider>
  );
}
