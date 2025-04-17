import { Table, TableBody, TableCell, TableHeader, TableRow } from "../ui/table";
import Badge from "../ui/badge/Badge";
import Image from "next/image";

interface EventData {
  id: string;
  event_type: string;
  timestamp: string;
  metadata: {
    section?: string;
    provider?: string;
    plan?: string;
    buttonId?: string;
  };
}

export default function RecentOrders({ events }: { events: EventData[] }) {
  // Transform the events data into a format suitable for the table
  const tableData = events.map((event) => ({
    id: event.id,
    name: event.metadata?.section || "Unknown Section",
    category: event.metadata?.provider || "Unknown Provider",
    timestamp: event.timestamp,

    price: event.metadata?.plan || "N/A",
    status: event.event_type,
    // image: "/images/product/default-product.jpg", // Placeholder image
  }));

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Recent Events</h3>
      </div>
      <div className="max-w-full overflow-x-auto">
        <Table>
          {/* Table Header */}
          <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
            {["Name", "Category", "Timestamp", "Event Type"].map((header, index) => (
              <TableCell key={index} isHeader className="py-3 font-medium text-gray-800 text-start text-theme-xs">
                {header}
              </TableCell>
            ))}
          </TableHeader>

          {/* Table Body */}
          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {tableData.map((product) => (
              <TableRow key={product.id} className="">
                <TableCell className="py-3">
                  <div className="flex items-center gap-3">
                    <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">{product.name}</p>
                  </div>
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm capitalize dark:text-gray-400">
                  {product.category}
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {product.timestamp && <span>{product.timestamp}</span>}
                </TableCell>
                <TableCell className="text-gray-500 text-theme-sm">
                  <Badge
                    size="sm"
                    color={
                      product.status === "Delivered" ? "success" : product.status === "Pending" ? "warning" : "error"
                    }
                  >
                    {product.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
