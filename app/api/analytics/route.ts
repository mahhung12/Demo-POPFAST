import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { url, eventType, metadata } = body;

  const userAgent = req.headers.get("user-agent") || "";
  const ip = req.headers.get("x-forwarded-for") || req.ip || "";

  const request = {
    url,
    event_type: eventType,
    user_agent: userAgent,
    ip_address: ip,
    metadata,
  };

  console.log("Logging analytics event:", request);

  const { error } = await supabase.from("analytics_events").insert(request);

  if (error) {
    console.error("Failed to log analytics event:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
