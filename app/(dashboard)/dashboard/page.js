import ButtonAccount from "@/components/ButtonAccount";
import Link from "next/link";

export const dynamic = "force-dynamic";

// This is a private page: It's protected by the layout.js component which ensures the user is authenticated.
// It's a server component which means you can fetch data (like the user profile) before the page is rendered.
// See https://shipfa.st/docs/tutorials/private-page
export default function Dashboard() {
  // const sites = 

  const dashboards = [
    { id: 1, name: "Dashboard 1", visitors: 1200 },
    { id: 2, name: "Dashboard 2", visitors: 800 },
    { id: 3, name: "Dashboard 3", visitors: 450 },
  ];

  return (
    <div className="max-w-[1440px] px-16 py-8 mx-auto">
      <div className="flex justify-between items-center">
        <ButtonAccount />
        <Link href="/dashboard/new">
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Create New Dashboard</button>
        </Link>
      </div>
      <h1 className="text-3xl md:text-4xl font-extrabold mt-16">Private Page</h1>
      <div className="flex flex-wrap gap-4 mt-4">
        { dashboards.map((dashboard) => (
          <Link
            key={ dashboard.id }
            href={ `/dashboard/${dashboard.id}` }
            className="w-full sm:w-[calc(50%-8px)] md:w-[calc(33.333%-10.666px)]"
          >
            <div className="border rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow cursor-pointer">
              <h2 className="text-xl font-bold">{ dashboard.name }</h2>
              <p className="text-gray-600">Total Visitors: { dashboard.visitors }</p>
            </div>
          </Link>
        )) }
      </div>
    </div>
  );
}
