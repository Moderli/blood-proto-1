import { supabase } from './supabase';

interface Notification {
  id: string;
  bloodType: string;
  status: 'Low' | 'Critical';
  units: number;
  threshold: number;
  createdAt: string;
}

export async function sendBloodStockAlert(bloodType: string, units: number, status: 'Low' | 'Critical') {
  try {
    // Get all users who have registered for notifications for this blood type
    const { data: users, error: userError } = await supabase
      .from('notification_preferences')
      .select(`
        user_id,
        email,
        user_profiles!inner (
          blood_group
        )
      `)
      .eq('blood_type', bloodType)
      .eq('is_active', true);

    if (userError) throw userError;

    if (!users || users.length === 0) return;

    // Create notification record
    const { error: notificationError } = await supabase
      .from('notifications')
      .insert([
        {
          blood_type: bloodType,
          status,
          units,
          threshold: status === 'Critical' ? 10 : 20,
        },
      ]);

    if (notificationError) throw notificationError;

    // Send email to each user
    for (const user of users) {
      const { error: emailError } = await supabase.functions.invoke('send-email', {
        body: {
          to: user.email,
          subject: `Blood Stock Alert: ${bloodType} ${status}`,
          html: `
            <h2>Blood Stock Alert</h2>
            <p>The blood type ${bloodType} is currently ${status.toLowerCase()} with ${units} units remaining.</p>
            <p>As a donor with blood type ${user.user_profiles.blood_group}, your donation could help save lives.</p>
            <p>Please consider donating if you are eligible.</p>
          `,
        },
      });

      if (emailError) {
        console.error(`Failed to send email to ${user.email}:`, emailError);
      }
    }
  } catch (error) {
    console.error('Error sending blood stock alert:', error);
  }
}

export async function checkBloodStockLevels() {
  try {
    const { data: bloodStock, error } = await supabase
      .from('blood_stock')
      .select('*');

    if (error) throw error;

    for (const stock of bloodStock) {
      if (stock.units <= 10) {
        await sendBloodStockAlert(stock.blood_type, stock.units, 'Critical');
      } else if (stock.units <= 20) {
        await sendBloodStockAlert(stock.blood_type, stock.units, 'Low');
      }
    }
  } catch (error) {
    console.error('Error checking blood stock levels:', error);
  }
} 