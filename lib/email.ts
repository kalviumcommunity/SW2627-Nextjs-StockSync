import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function sendVerificationEmail(email: string, name: string, token: string) {
  if (!resend || !process.env.EMAIL_FROM || !process.env.APP_URL) {
    throw new Error('Email verification is not configured. Set RESEND_API_KEY, EMAIL_FROM, and APP_URL.');
  }

  const verificationUrl = `${process.env.APP_URL.replace(/\/$/, '')}/verify-email?token=${encodeURIComponent(token)}`;
  const { error } = await resend.emails.send({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Verify your StockSync account',
    html: `<p>Hello ${name},</p><p>Click the link below to verify your StockSync account. This link expires in 24 hours.</p><p><a href="${verificationUrl}">Verify email address</a></p><p>If you did not create this account, you can ignore this email.</p>`,
  });

  if (error) throw new Error(`Could not send verification email: ${error.message}`);
}