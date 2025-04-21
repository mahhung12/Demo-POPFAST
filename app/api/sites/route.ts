
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

        console.log('User:', user);

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

export async function GET() {
    try {
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

        console.log('User:', user);

        // Fetch all sites for the user
        const { data, error } = await supabase
            .from('sites')
            .select('*')
            .eq('user_id', user.id);

        if (error) {
            return NextResponse.json({ success: false, error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, sites: data });
    } catch (err) {
        console.error('Error in GET handler:', err);
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}
