import nodemailer from 'nodemailer';

const isMissingOrPlaceholder = (value) =>
  !value || value.includes('your_') || value === 'your_app_password';

const escapeHtml = (value = '') =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

const paragraph = (value = '') => escapeHtml(value).replace(/\n/g, '<br />');

const createTransporter = () => {
  const host = process.env.EMAIL_HOST || 'smtp.gmail.com';
  const port = Number(process.env.EMAIL_PORT) || 587;
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (isMissingOrPlaceholder(user) || isMissingOrPlaceholder(pass)) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
  });
};

const emailShell = ({ title, preheader = '', body }) => `
  <div style="display:none;max-height:0;overflow:hidden;color:transparent;opacity:0;">
    ${escapeHtml(preheader)}
  </div>
  <div style="margin:0;padding:0;background:#f7fafc;font-family:Arial,sans-serif;color:#172033;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f7fafc;padding:28px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;">
            <tr>
              <td style="background:#113f67;padding:28px 32px;">
                <p style="margin:0;color:#f59e0b;font-size:12px;font-weight:700;text-transform:uppercase;">WanderLux Travel</p>
                <h1 style="margin:8px 0 0;color:#ffffff;font-size:28px;line-height:1.2;">${escapeHtml(title)}</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:32px;">
                ${body}
              </td>
            </tr>
            <tr>
              <td style="border-top:1px solid #e2e8f0;padding:20px 32px;color:#64748b;font-size:13px;line-height:1.6;">
                WanderLux Travel Agency<br />
                This email was sent by the Travel Agency platform.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </div>
`;

export const sendEmail = async ({ to, subject, html, text, replyTo }) => {
  const transporter = createTransporter();

  if (!transporter) {
    console.log(`[Email Mock] To: ${to} | Subject: ${subject}`);
    return { success: true, mock: true };
  }

  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to,
      subject,
      html,
      text,
      replyTo,
    });

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email send error:', error.message);
    return { success: false, error: error.message };
  }
};

export const bookingConfirmationEmail = (booking, tour, user) => ({
  to: user.email,
  subject: `Booking Confirmation - ${tour.title}`,
  html: emailShell({
    title: 'Booking Confirmed',
    preheader: `Your booking for ${tour.title} has been received.`,
    body: `
      <p style="margin:0 0 16px;font-size:16px;line-height:1.7;">Dear ${escapeHtml(user.name)},</p>
      <p style="margin:0 0 20px;font-size:16px;line-height:1.7;">Your booking has been received. Here are the details:</p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:20px 0;">
        <tr><td style="padding:10px;border-bottom:1px solid #e2e8f0;"><strong>Tour</strong></td><td style="padding:10px;border-bottom:1px solid #e2e8f0;">${escapeHtml(tour.title)}</td></tr>
        <tr><td style="padding:10px;border-bottom:1px solid #e2e8f0;"><strong>Date</strong></td><td style="padding:10px;border-bottom:1px solid #e2e8f0;">${new Date(booking.travelDate).toLocaleDateString()}</td></tr>
        <tr><td style="padding:10px;border-bottom:1px solid #e2e8f0;"><strong>Travelers</strong></td><td style="padding:10px;border-bottom:1px solid #e2e8f0;">${booking.travelers}</td></tr>
        <tr><td style="padding:10px;border-bottom:1px solid #e2e8f0;"><strong>Total</strong></td><td style="padding:10px;border-bottom:1px solid #e2e8f0;">$${booking.totalPrice}</td></tr>
        <tr><td style="padding:10px;border-bottom:1px solid #e2e8f0;"><strong>Invoice</strong></td><td style="padding:10px;border-bottom:1px solid #e2e8f0;">${escapeHtml(booking.invoiceNumber)}</td></tr>
        <tr><td style="padding:10px;"><strong>Status</strong></td><td style="padding:10px;">${escapeHtml(booking.status)}</td></tr>
      </table>
      <p style="margin:20px 0 0;font-size:16px;line-height:1.7;">Thank you for choosing WanderLux Travel.</p>
    `,
  }),
});

export const resetPasswordEmail = (user, resetUrl) => ({
  to: user.email,
  subject: 'Password Reset Request - WanderLux Travel',
  html: emailShell({
    title: 'Reset Your Password',
    preheader: 'Use the secure link to reset your password.',
    body: `
      <p style="margin:0 0 16px;font-size:16px;line-height:1.7;">Hi ${escapeHtml(user.name)},</p>
      <p style="margin:0 0 20px;font-size:16px;line-height:1.7;">You requested a password reset. This link expires in 1 hour.</p>
      <a href="${escapeHtml(resetUrl)}" style="display:inline-block;background:#113f67;color:#ffffff;padding:13px 22px;text-decoration:none;border-radius:8px;font-weight:700;">Reset Password</a>
      <p style="margin:22px 0 0;color:#64748b;font-size:14px;line-height:1.7;">If you did not request this, you can ignore this email.</p>
    `,
  }),
});

export const verificationEmail = (user, verifyUrl) => ({
  to: user.email,
  subject: 'Verify Your Email - WanderLux Travel',
  html: emailShell({
    title: 'Welcome to WanderLux',
    preheader: 'Verify your email address to activate your account.',
    body: `
      <p style="margin:0 0 16px;font-size:16px;line-height:1.7;">Hi ${escapeHtml(user.name)},</p>
      <p style="margin:0 0 20px;font-size:16px;line-height:1.7;">Please verify your email address to finish setting up your account.</p>
      <a href="${escapeHtml(verifyUrl)}" style="display:inline-block;background:#0f9f8f;color:#ffffff;padding:13px 22px;text-decoration:none;border-radius:8px;font-weight:700;">Verify Email</a>
    `,
  }),
});

export const contactNotificationEmail = (contact) => ({
  to: process.env.EMAIL_TO || process.env.EMAIL_USER,
  replyTo: contact.email,
  subject: `New Contact Message - ${contact.name}`,
  html: emailShell({
    title: 'New Contact Message',
    preheader: `${contact.name} sent a new travel inquiry.`,
    body: `
      <p style="margin:0 0 20px;font-size:16px;line-height:1.7;">A new message was submitted from the website contact form.</p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:20px 0;">
        <tr><td style="padding:10px;border-bottom:1px solid #e2e8f0;"><strong>Name</strong></td><td style="padding:10px;border-bottom:1px solid #e2e8f0;">${escapeHtml(contact.name)}</td></tr>
        <tr><td style="padding:10px;border-bottom:1px solid #e2e8f0;"><strong>Email</strong></td><td style="padding:10px;border-bottom:1px solid #e2e8f0;">${escapeHtml(contact.email)}</td></tr>
        <tr><td style="padding:10px;border-bottom:1px solid #e2e8f0;"><strong>Phone</strong></td><td style="padding:10px;border-bottom:1px solid #e2e8f0;">${escapeHtml(contact.phone || 'Not provided')}</td></tr>
      </table>
      <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:18px;font-size:15px;line-height:1.7;">
        ${paragraph(contact.message)}
      </div>
    `,
  }),
  text: `New contact message\n\nName: ${contact.name}\nEmail: ${contact.email}\nPhone: ${contact.phone || 'Not provided'}\n\n${contact.message}`,
});

export const contactAutoReplyEmail = (contact) => ({
  to: contact.email,
  subject: 'We received your message - WanderLux Travel',
  html: emailShell({
    title: 'Message Received',
    preheader: 'Thanks for contacting WanderLux Travel.',
    body: `
      <p style="margin:0 0 16px;font-size:16px;line-height:1.7;">Hi ${escapeHtml(contact.name)},</p>
      <p style="margin:0 0 16px;font-size:16px;line-height:1.7;">Thank you for reaching out to WanderLux Travel. We received your message and our travel team will get back to you within 24 hours.</p>
      <p style="margin:0;color:#64748b;font-size:14px;line-height:1.7;">Your message:</p>
      <div style="margin-top:10px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:18px;font-size:15px;line-height:1.7;">
        ${paragraph(contact.message)}
      </div>
    `,
  }),
  text: `Hi ${contact.name},\n\nThank you for reaching out to WanderLux Travel. We received your message and our travel team will get back to you within 24 hours.\n\nYour message:\n${contact.message}`,
});
