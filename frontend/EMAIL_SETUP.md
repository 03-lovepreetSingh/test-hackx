# Email Setup Guide for Judge Invitations

This guide explains how to configure email functionality for sending judge invitations.

## 📧 Email Configuration

### 1. Gmail Setup (Recommended)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
   - Copy the 16-character password

3. **Set Environment Variables**:
   ```bash
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-16-character-app-password
   ```

### 2. Other Email Providers

#### Outlook/Hotmail
```bash
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_USER=your-email@outlook.com
SMTP_PASS=your-password
```

#### Yahoo Mail
```bash
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
SMTP_USER=your-email@yahoo.com
SMTP_PASS=your-app-password
```

#### Custom SMTP Server
```bash
SMTP_HOST=your-smtp-server.com
SMTP_PORT=587
SMTP_USER=your-username
SMTP_PASS=your-password
```

## 🔧 Environment Variables

Create a `.env.local` file in the frontend directory:

```env
# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Application Configuration
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Lighthouse Configuration (for IPFS/IPNS)
LIGHTHOUSE_API_KEY=your-lighthouse-api-key
LIGHTHOUSE_PRIVATE_KEY=your-lighthouse-private-key

# JWT Configuration
JWT_SECRET=your-jwt-secret-key
```

## 📧 Email Features

### Judge Invitation Email
- **Beautiful HTML Template**: Professional design with HackX branding
- **Personal Messages**: Custom messages from organizers
- **Accept/Decline Links**: Direct links for judges to respond
- **Mobile Responsive**: Works on all devices

### Email Content Includes:
- Hackathon title and description
- Personal invitation message
- Benefits of judging
- Accept/Decline buttons
- Contact information

## 🚀 Testing Email Functionality

### 1. Test Email Sending
```bash
# Send a test invitation
curl -X POST http://localhost:3000/api/hackathons/invite-judge \
  -H "Content-Type: application/json" \
  -d '{
    "hackathonId": "1",
    "hackathonTitle": "Test Hackathon",
    "judgeName": "Test Judge",
    "judgeEmail": "test@example.com",
    "message": "Test invitation message"
  }'
```

### 2. Test Accept/Decline Links
- Accept: `http://localhost:3000/api/hackathons/accept-judge?token=INVITATION_ID`
- Decline: `http://localhost:3000/api/hackathons/decline-judge?token=INVITATION_ID`

## 🔒 Security Considerations

1. **App Passwords**: Use app-specific passwords, not your main account password
2. **Environment Variables**: Never commit `.env` files to version control
3. **Token Security**: Invitation tokens should be unique and time-limited
4. **Rate Limiting**: Implement rate limiting for email sending

## 📱 Email Templates

The system includes professionally designed email templates with:
- HackX branding and colors
- Responsive design for mobile devices
- Clear call-to-action buttons
- Professional typography
- Benefits and information sections

## 🛠️ Troubleshooting

### Common Issues:

1. **"Authentication failed"**
   - Check your app password
   - Ensure 2FA is enabled
   - Verify email and password are correct

2. **"Connection timeout"**
   - Check SMTP host and port
   - Verify firewall settings
   - Try different port (465 for SSL)

3. **"Emails not sending"**
   - Check environment variables
   - Verify SMTP configuration
   - Check server logs for errors

### Debug Mode:
Set `NODE_ENV=development` to see detailed email logs in console.

## 📊 Email Analytics

Track email performance:
- Sent invitations
- Acceptance rate
- Response time
- Bounce rate

## 🔄 Email Workflow

1. **Organizer** invites judge via "My Hackathons" page
2. **System** sends beautiful HTML email
3. **Judge** clicks Accept/Decline link
4. **System** updates judge status
5. **Judge** gains access to judging dashboard

## 📞 Support

For email configuration issues:
1. Check this guide
2. Verify environment variables
3. Test with a simple email first
4. Check server logs for errors
