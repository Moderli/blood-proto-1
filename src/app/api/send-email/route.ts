import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { createClient } from '@supabase/supabase-js';

// Create a transporter using Gmail SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

// Create Supabase admin client
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Handle OPTIONS request for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export async function POST(request: NextRequest) {
  try {
    // Log the request details
    console.log('Request URL:', request.url);
    console.log('Request method:', request.method);
    console.log('Request headers:', Object.fromEntries(request.headers.entries()));

    // Get the request body
    let body;
    try {
      body = await request.json();
    } catch (e) {
      console.error('Error parsing request body:', e);
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { 
          status: 400,
          headers: corsHeaders
        }
      );
    }

    // Validate required fields
    if (!body || !body.userIds || !body.bloodType || !body.units || !body.status) {
      console.error('Missing required fields:', body);
      return NextResponse.json(
        { error: 'Missing required fields' },
        { 
          status: 400,
          headers: corsHeaders
        }
      );
    }

    const { userIds, bloodType, units, status } = body;
    console.log('Processing request for:', { userIds, bloodType, units, status });

    // Validate environment variables
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      console.error('Missing email configuration');
      return NextResponse.json(
        { error: 'Email service not configured' },
        { 
          status: 500,
          headers: corsHeaders
        }
      );
    }

    // Get user emails using admin client
    const { data: users, error: userError } = await supabaseAdmin.auth.admin.listUsers();
    if (userError) {
      console.error('Error fetching users:', userError);
      return NextResponse.json(
        { error: 'Failed to fetch users' },
        { 
          status: 500,
          headers: corsHeaders
        }
      );
    }

    // Filter users by IDs and get their emails
    const recipientEmails = users.users
      .filter(user => userIds.includes(user.id))
      .map(user => user.email)
      .filter((email): email is string => !!email);

    console.log('Found recipient emails:', recipientEmails);

    if (recipientEmails.length === 0) {
      return NextResponse.json(
        { error: 'No valid recipients found' },
        { 
          status: 400,
          headers: corsHeaders
        }
      );
    }

    const subject = `Blood Scarcity Alert: ${bloodType} Blood Type`;
    const html = `
      <h2>Blood Scarcity Alert</h2>
      <p>The blood bank is currently experiencing a ${status.toLowerCase()} supply of ${bloodType} blood type.</p>
      <p>Current units available: ${units}</p>
      <p>As someone with ${bloodType} blood type, your donation could help save lives.</p>
      <p>Please consider donating if you are eligible.</p>
      <p>Thank you for your support!</p>
    `;

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: recipientEmails.join(','),
      subject,
      html,
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent successfully:', info.response);

      return NextResponse.json({ 
        success: true, 
        messageId: info.messageId,
        recipientCount: recipientEmails.length 
      }, { 
        headers: corsHeaders
      });
    } catch (emailError) {
      console.error('Error sending email:', emailError);
      return NextResponse.json(
        { error: 'Failed to send email' },
        { 
          status: 500,
          headers: corsHeaders
        }
      );
    }
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { 
        status: 500,
        headers: corsHeaders
      }
    );
  }
} 