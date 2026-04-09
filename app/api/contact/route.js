import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
        return Response.json({ error: 'All fields are required.' }, { status: 400 });
    }

    const { error } = await resend.emails.send({
        from: 'Contact Form <onboarding@resend.dev>',
        to: process.env.CONTACT_EMAIL,
        subject: `New message from ${name}`,
        text: `From: ${name} (${email})\n\n${message}`,
    });

    if (error) {
        return Response.json({ error: 'Failed to send email.' }, { status: 500 });
    }

    return Response.json({ success: true });
}