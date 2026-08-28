import { NextResponse } from "next/server";

type ContactPayload = {
  name: string;
  phone: string;
  email: string;
  location: string;
  requirement: string;
  // Honeypot — real visitors never see or fill this field. A filled value
  // means the submission almost certainly came from a bot.
  company?: string;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export async function POST(request: Request) {
  let payload: Partial<ContactPayload>;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request body." },
      { status: 400 }
    );
  }

  if (isNonEmptyString(payload.company)) {
    // Honeypot tripped — pretend success so bots don't learn to adapt.
    return NextResponse.json({ ok: true });
  }

  const missing = (["name", "phone", "email", "location", "requirement"] as const).filter(
    (field) => !isNonEmptyString(payload[field])
  );
  if (missing.length > 0) {
    return NextResponse.json(
      { ok: false, error: `Missing required field(s): ${missing.join(", ")}.` },
      { status: 400 }
    );
  }

  if (!EMAIL_PATTERN.test(payload.email!.trim())) {
    return NextResponse.json(
      { ok: false, error: "That email address doesn't look right." },
      { status: 400 }
    );
  }

  const lead = {
    name: payload.name!.trim(),
    phone: payload.phone!.trim(),
    email: payload.email!.trim(),
    location: payload.location!.trim(),
    requirement: payload.requirement!.trim(),
    receivedAt: new Date().toISOString(),
  };

  // No email/CRM service is wired up yet — this is the single place to add
  // one (Resend, SendGrid, HubSpot, a Google Sheet via its API, etc.) once
  // credentials exist. Logging server-side keeps the lead from being lost
  // in the meantime and makes local testing possible.
  console.log("[contact] new lead:", lead);

  return NextResponse.json({ ok: true });
}
