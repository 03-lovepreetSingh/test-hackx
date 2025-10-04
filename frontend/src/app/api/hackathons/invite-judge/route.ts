import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

interface JudgeInvitation {
  id: string;
  hackathonId: string;
  hackathonTitle: string;
  judgeName: string;
  judgeEmail: string;
  status: 'invited' | 'accepted' | 'declined';
  invitedAt: string;
  acceptedAt?: string;
  customMessage?: string;
}

// Mock data for development
const mockInvitations: JudgeInvitation[] = [];

// Email configuration
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

const generateInvitationEmail = (data: {
  hackathonTitle: string;
  judgeName: string;
  customMessage?: string;
  acceptUrl: string;
  declineUrl: string;
}) => {
  return {
    subject: `Judge Invitation: ${data.hackathonTitle}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Judge Invitation</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8f9fa;
          }
          .container {
            background: white;
            border-radius: 8px;
            padding: 30px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
          }
          .logo {
            font-size: 24px;
            font-weight: bold;
            color: #0092ff;
            margin-bottom: 10px;
          }
          .title {
            font-size: 28px;
            font-weight: bold;
            color: #1a1a1a;
            margin-bottom: 10px;
          }
          .subtitle {
            color: #666;
            font-size: 16px;
          }
          .content {
            margin-bottom: 30px;
          }
          .greeting {
            font-size: 18px;
            margin-bottom: 20px;
          }
          .hackathon-info {
            background: #f8f9fa;
            border-left: 4px solid #0092ff;
            padding: 20px;
            margin: 20px 0;
            border-radius: 4px;
          }
          .hackathon-title {
            font-size: 20px;
            font-weight: bold;
            color: #1a1a1a;
            margin-bottom: 10px;
          }
          .custom-message {
            background: #e3f2fd;
            border-left: 4px solid #2196f3;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
            font-style: italic;
          }
          .actions {
            text-align: center;
            margin: 30px 0;
          }
          .btn {
            display: inline-block;
            padding: 12px 30px;
            margin: 0 10px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: bold;
            font-size: 16px;
            transition: all 0.3s ease;
          }
          .btn-accept {
            background: #4ef467;
            color: #000;
          }
          .btn-accept:hover {
            background: #3dd55f;
          }
          .btn-decline {
            background: #ff6b35;
            color: white;
          }
          .btn-decline:hover {
            background: #e55a2b;
          }
          .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            color: #666;
            font-size: 14px;
          }
          .benefits {
            background: #f0f8ff;
            padding: 20px;
            border-radius: 6px;
            margin: 20px 0;
          }
          .benefits h3 {
            color: #0092ff;
            margin-bottom: 15px;
          }
          .benefits ul {
            margin: 0;
            padding-left: 20px;
          }
          .benefits li {
            margin-bottom: 8px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">HackX</div>
            <div class="title">You're Invited to Judge!</div>
            <div class="subtitle">Join our expert panel of judges</div>
          </div>
          
          <div class="content">
            <div class="greeting">Hello ${data.judgeName},</div>
            
            <p>We're excited to invite you to serve as a judge for our upcoming hackathon. Your expertise and experience would be invaluable in evaluating innovative projects and helping us identify the most promising solutions.</p>
            
            <div class="hackathon-info">
              <div class="hackathon-title">${data.hackathonTitle}</div>
              <p>This hackathon brings together talented developers, designers, and innovators to create groundbreaking solutions. As a judge, you'll have the opportunity to:</p>
            </div>
            
            <div class="benefits">
              <h3>Why Judge with Us?</h3>
              <ul>
                <li><strong>Discover Innovation:</strong> Be among the first to see cutting-edge projects and solutions</li>
                <li><strong>Network:</strong> Connect with other industry experts and talented participants</li>
                <li><strong>Impact:</strong> Help shape the future by identifying the most promising projects</li>
                <li><strong>Recognition:</strong> Gain recognition as an expert in your field</li>
                <li><strong>Learning:</strong> Learn about emerging technologies and trends</li>
              </ul>
            </div>
            
            ${data.customMessage ? `
              <div class="custom-message">
                <strong>Personal Message:</strong><br>
                ${data.customMessage}
              </div>
            ` : ''}
            
            <p>If you're interested in joining our judging panel, please click the button below to accept the invitation. If you're unable to participate this time, we completely understand and hope to work with you in the future.</p>
          </div>
          
          <div class="actions">
            <a href="${data.acceptUrl}" class="btn btn-accept">Accept Invitation</a>
            <a href="${data.declineUrl}" class="btn btn-decline">Decline</a>
          </div>
          
          <div class="footer">
            <p>This invitation was sent by the HackX team.</p>
            <p>If you have any questions, please don't hesitate to reach out to us.</p>
            <p>© 2024 HackX. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Hello ${data.judgeName},
      
      You're invited to judge: ${data.hackathonTitle}
      
      We're excited to invite you to serve as a judge for our upcoming hackathon. Your expertise and experience would be invaluable in evaluating innovative projects.
      
      ${data.customMessage ? `Personal Message: ${data.customMessage}` : ''}
      
      To accept this invitation, please visit: ${data.acceptUrl}
      To decline, please visit: ${data.declineUrl}
      
      Best regards,
      The HackX Team
    `
  };
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      hackathonId,
      hackathonTitle,
      judgeName,
      judgeEmail,
      message: customMessage
    } = body;

    // Validate required fields
    if (!hackathonId || !hackathonTitle || !judgeName || !judgeEmail) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if already invited
    const existingInvitation = mockInvitations.find(
      inv => inv.hackathonId === hackathonId && inv.judgeEmail === judgeEmail
    );

    if (existingInvitation) {
      return NextResponse.json(
        { success: false, error: 'Judge has already been invited to this hackathon' },
        { status: 400 }
      );
    }

    // Create invitation record
    const invitation: JudgeInvitation = {
      id: Date.now().toString(),
      hackathonId,
      hackathonTitle,
      judgeName,
      judgeEmail,
      status: 'invited',
      invitedAt: new Date().toISOString(),
      customMessage
    };

    // Generate URLs for acceptance/decline
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const acceptUrl = `${baseUrl}/api/hackathons/accept-judge?token=${invitation.id}`;
    const declineUrl = `${baseUrl}/api/hackathons/decline-judge?token=${invitation.id}`;

    // Create email content
    const emailContent = generateInvitationEmail({
      hackathonTitle,
      judgeName,
      customMessage,
      acceptUrl,
      declineUrl
    });

    // Send email if SMTP is configured
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      try {
        const transporter = createTransporter();
        
        await transporter.sendMail({
          from: `"HackX Team" <${process.env.SMTP_USER}>`,
          to: judgeEmail,
          subject: emailContent.subject,
          text: emailContent.text,
          html: emailContent.html,
        });

        console.log(`✅ Judge invitation email sent to ${judgeEmail}`);
      } catch (emailError) {
        console.error('❌ Failed to send email:', emailError);
        // Continue with the invitation even if email fails
      }
    } else {
      console.log('📧 SMTP not configured, skipping email send');
      console.log('📧 Email would be sent to:', judgeEmail);
      console.log('📧 Accept URL:', acceptUrl);
      console.log('📧 Decline URL:', declineUrl);
    }

    // Store invitation
    mockInvitations.push(invitation);

    return NextResponse.json({
      success: true,
      data: {
        invitationId: invitation.id,
        acceptUrl,
        declineUrl
      },
      message: 'Judge invitation sent successfully'
    });
  } catch (error) {
    console.error('Error sending judge invitation:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send judge invitation' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const hackathonId = searchParams.get('hackathonId');
    const judgeEmail = searchParams.get('judgeEmail');

    let filteredInvitations = mockInvitations;

    if (hackathonId) {
      filteredInvitations = filteredInvitations.filter(inv => inv.hackathonId === hackathonId);
    }

    if (judgeEmail) {
      filteredInvitations = filteredInvitations.filter(inv => inv.judgeEmail === judgeEmail);
    }

    return NextResponse.json({
      success: true,
      data: filteredInvitations,
      message: 'Invitations retrieved successfully'
    });
  } catch (error) {
    console.error('Error fetching invitations:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch invitations' },
      { status: 500 }
    );
  }
}
