
import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        // const supabase = createServerActionClient({ cookies: () => cookieStore });
        const supabase = createClient();

        // Get the user
        const {
            data: { user },
            error: authError,
        } = await supabase.auth.getUser();

        if (authError || !user) {
            console.error('Auth Error:', authError);
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const { domain, name, timezone } = await req.json();

        if (!domain) {
            return NextResponse.json({ success: false, error: 'Domain is required' }, { status: 400 });
        }

        // Insert into sites table
        const { data, error } = await supabase
            .from('sites')
            .insert({
                user_id: user.id,
                domain,
                name,
                timezone,
            })
            .select('*')
            .single();

        if (error) {
            return NextResponse.json({ success: false, error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, site: data });
    } catch (err) {
        console.error('Error in POST handler:', err);
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}
export async function GET(req: Request) {
    try {
        const supabase = createClient();

        // Parse the query parameters from the request URL
        const url = new URL(req.url);
        const userId = url.searchParams.get('user_id'); // Get user_id from query params

        if (!userId) {
            return NextResponse.json({ success: false, error: 'User ID is required' }, { status: 400 });
        }

        // Fetch sites and join with pageviews table
        const { data, error } = await supabase
            .from('sites')
            .select(`
                *,
                pageviews (
                    *
                )
            `)
            .eq('user_id', userId);

        if (error) {
            return NextResponse.json({ success: false, error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, sites: data });
    } catch (err) {
        console.error('Error in GET handler:', err);
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}
