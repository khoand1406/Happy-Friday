import nodemailer from 'nodemailer';

type MailOptions = {
  to: string;
  subject: string;
  html?: string;
  text?: string;
};

let cachedTransporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter | null {
  if (cachedTransporter) return cachedTransporter;

  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    // Missing config – skip actual sending
    return null;
  }

  cachedTransporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
  return cachedTransporter;
}

export async function sendMail(options: MailOptions): Promise<void> {
  const transporter = getTransporter();
  if (!transporter) {
    console.warn('[mailer] SMTP not configured. Email would be sent to:', options.to);
    return;
  }
  const from = process.env.SMTP_FROM || process.env.SMTP_USER || 'no-reply@example.com';
  await transporter.sendMail({
    from,
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html,
  });
}


