import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = createClient();

    const siteId = params?.id; // Safely access params.id

    if (!siteId) {
      console.error("Site ID is missing in params:", params);
      return NextResponse.json({ success: false, error: "Site ID is required" }, { status: 400 });
    }

    // Fetch site details and join with pageviews table
    const { data, error } = await supabase
      .from("sites")
      .select(`
        *,
        pageviews ( * )
      `)
      .eq("id", siteId)
      // .order("timestamp", { foreignTable: "pageviews", ascending: false }) // Order pageviews by timestamp (desc)
      .order("timestamp", { referencedTable: "pageviews", ascending: false }) // Order pageviews by timestamp (desc)
      .single(); // Fetch a single site by ID

    console.log("Fetched site data:", data); // Log the fetched data

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, site: data });
  } catch (err) {
    console.error("Error in GET handler:", err);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
