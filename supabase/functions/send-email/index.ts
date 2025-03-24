import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NotificationPayload {
  type: string;
  blood_type: string;
  units: number;
  status: string;
  preview?: boolean;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { type, blood_type, units, status, preview } = await req.json() as NotificationPayload;

    // Get users with matching blood type
    const { data: users, error: userError } = await supabaseClient
      .from('user_profiles')
      .select('user_id, blood_group, notification_preferences')
      .eq('blood_group', blood_type)
      .eq('notification_preferences->blood_scarcity', true);

    if (userError) throw userError;

    // If preview mode, just return the count
    if (preview) {
      return new Response(
        JSON.stringify({ count: users?.length || 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Send notifications to each user
    const notifications = users?.map(async (user) => {
      const { error: notificationError } = await supabaseClient
        .from('notifications')
        .insert({
          user_id: user.user_id,
          type: 'blood_scarcity',
          title: `Blood Scarcity Alert: ${blood_type}`,
          message: `The blood bank is running ${status.toLowerCase()} on ${blood_type} blood (${units} units available).`,
          read: false,
        });

      if (notificationError) throw notificationError;
    });

    await Promise.all(notifications || []);

    return new Response(
      JSON.stringify({ success: true, count: users?.length || 0 }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
}); 