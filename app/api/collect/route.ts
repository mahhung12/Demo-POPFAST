import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Use service role to allow inserts
);

export async function POST(req: Request) {
  const body = await req.json();

  const {
    site_id,
    url,
    referrer,
    user_agent,
    browser,
    os,
    device,
  } = body;

  // Step 1: Extract IP from request headers
  const forwardedFor = req.headers.get('x-forwarded-for');
  const ip =
    forwardedFor?.split(',')[0] ||
    req.headers.get('x-real-ip') ||
    ''; // localhost may be empty or "::1"

  // Step 2: Lookup country from IP
  let geo = {};
  try {
    const res = await fetch(`https://ipwho.is/${ip}`);
    geo = await res.json();
  } catch (e) {
    console.error('Geo lookup failed:', e);
  }

  // Step 3: Insert into Supabase
  const { error } = await supabase.from('pageviews').insert({
    site_id,
    url,
    referrer,
    user_agent,
    country: geo['country'] + " | " + geo['country_code'] + " | " + geo['region'] + " | " + geo['city'],
    browser,
    os,
    device,
    ip_address: ip,
    timestamp: new Date().toISOString(),
  });

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const site_id = searchParams.get('site_id');

  if (!site_id) {
    return NextResponse.json({ success: false, error: 'Missing site_id' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('pageviews')
    .select('*')
    .eq('site_id', site_id)
    .order('timestamp', { ascending: false });

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, data });
}
