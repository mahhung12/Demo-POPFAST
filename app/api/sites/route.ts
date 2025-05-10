import { withCorsHandler } from "@/libs/cors";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

async function handlePOST(req: Request) {
  try {
    const supabase = createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { domain, name, timezone } = await req.json();

    if (!domain) {
      return NextResponse.json({ success: false, error: "Domain is required" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("sites")
      .insert({
        // user_id: "f01f7624-02a0-4443-8542-ffefcec71eca",
        user_id: user.id,
        domain,
        name,
        timezone,
      })
      .select("*")
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, site: data });
  } catch (err) {
    console.error("Error in POST handler:", err);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

async function handleGET(req: Request) {
  try {
    const supabase = createClient();
    const url = new URL(req.url);
    const userId = url.searchParams.get("user_id");

    if (!userId) {
      return NextResponse.json({ success: false, error: "User ID is required" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("sites")
      .select(
        `
        *,
        pageviews (
          *
        )
      `
      )
      .eq("user_id", userId);

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, sites: data });
  } catch (err) {
    console.error("Error in GET handler:", err);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

async function handleDELETE(req: Request) {
  try {
    const supabase = createClient();
    // Parse the body to get the id
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ success: false, error: "Site ID is required" }, { status: 400 });
    }

    const { error } = await supabase.from("sites").delete().eq("id", id);

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Site deleted successfully" });
  } catch (err) {
    console.error("Error in DELETE handler:", err);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

export const POST = withCorsHandler(handlePOST);
export const GET = withCorsHandler(handleGET);
export const DELETE = withCorsHandler(handleDELETE);
export const OPTIONS = withCorsHandler(async () => new NextResponse(null, { status: 204 }));
