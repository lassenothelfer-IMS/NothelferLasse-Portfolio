import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// ── Basic in-memory rate limiting ──────────────────────────────
// Per-instance only (resets on redeploy / cold start), but enough to
// blunt casual abuse of a public email endpoint. For multi-instance
// hosting, back this with a shared store (e.g. Upstash/Redis).
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT_MAX       = 5;      // max submissions per window per IP
const hits = new Map();              // ip -> number[] (timestamps)

function isRateLimited(ip) {
    const now = Date.now();
    const recent = (hits.get(ip) || []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
    recent.push(now);
    hits.set(ip, recent);

    // Opportunistically prune stale IPs so the map doesn't grow unbounded.
    if (hits.size > 5000) {
        for (const [key, times] of hits) {
            if (times.every((t) => now - t >= RATE_LIMIT_WINDOW_MS)) hits.delete(key);
        }
    }

    return recent.length > RATE_LIMIT_MAX;
}

// ── Validation limits ──────────────────────────────────────────
const MAX_NAME    = 100;
const MAX_EMAIL   = 254;
const MAX_MESSAGE = 5000;
const EMAIL_RE    = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req) {
    const ip =
        req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
        req.headers.get('x-real-ip') ||
        'unknown';

    if (isRateLimited(ip)) {
        return Response.json(
            { error: 'Too many requests. Please try again in a minute.' },
            { status: 429 },
        );
    }

    let body;
    try {
        body = await req.json();
    } catch {
        return Response.json({ error: 'Invalid request body.' }, { status: 400 });
    }

    const { name, email, message, company } = body ?? {};

    // Honeypot: real users never fill the hidden `company` field.
    // Silently accept so bots don't learn they were caught.
    if (company) {
        return Response.json({ success: true });
    }

    // ── Server-side validation (never trust the client) ──
    if (
        typeof name    !== 'string' ||
        typeof email   !== 'string' ||
        typeof message !== 'string'
    ) {
        return Response.json({ error: 'All fields are required.' }, { status: 400 });
    }

    const cleanName    = name.trim();
    const cleanEmail   = email.trim();
    const cleanMessage = message.trim();

    if (!cleanName || !cleanEmail || !cleanMessage) {
        return Response.json({ error: 'All fields are required.' }, { status: 400 });
    }

    if (
        cleanName.length    > MAX_NAME ||
        cleanEmail.length   > MAX_EMAIL ||
        cleanMessage.length > MAX_MESSAGE
    ) {
        return Response.json({ error: 'One or more fields are too long.' }, { status: 400 });
    }

    if (!EMAIL_RE.test(cleanEmail)) {
        return Response.json({ error: 'Please provide a valid email address.' }, { status: 400 });
    }

    const { error } = await resend.emails.send({
        from: 'Contact Form <onboarding@resend.dev>',
        to: process.env.CONTACT_EMAIL,
        replyTo: cleanEmail,
        subject: `New message from ${cleanName}`,
        text: `From: ${cleanName} (${cleanEmail})\n\n${cleanMessage}`,
    });

    if (error) {
        return Response.json({ error: 'Failed to send email.' }, { status: 500 });
    }

    return Response.json({ success: true });
}
