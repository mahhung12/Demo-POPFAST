import { getSites } from "@/libs/dashboard/site";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";

export const dynamic = "force-dynamic";

// This is a private page: It's protected by the layout.js component which ensures the user is authenticated.
// It's a server component which means you can fetch data (like the user profile) before the page is rendered.
// See https://shipfa.st/docs/tutorials/private-page
export default async function Dashboard() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const sites = await getSites(user.id);

  return (
    <div className="flex flex-col gap-4">
      <Link href="/dashboard/new">
        <button className="px-4 py-2 rounded-md bg-gray-200 border bg-inherit !text-black transition-colors flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-plus size-4"
          >
            <path d="M5 12h14"></path>
            <path d="M12 5v14"></path>
          </svg>
          Website
        </button>
      </Link>

      {!sites || sites.length === 0 ? (
        <div className="max-w-[1440px]">
          <p className="mt-2">You don&#39;t have any sites yet. Create one to get started.</p>
        </div>
      ) : (
        <div className="w-full flex flex-wrap gap-4">
          {sites.map((dashboard) => (
            <Link
              key={dashboard.id}
              href={`/dashboard/${dashboard.id}`}
              className="w-full sm:w-[calc(50%-8px)] md:w-[calc(33.333%-10.666px)]"
            >
              <div className="border rounded-md p-4 hover:shadow-lg transition-shadow cursor-pointer">
                <h2 className="text-xl font-bold">{dashboard.name}</h2>
                <p className="text-gray-600 mt-12">Total Visitors: {dashboard.pageviews.length || 0}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
