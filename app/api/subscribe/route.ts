import { NextResponse } from "next/server";

type SubscribePayload = {
  firstName?: string;
  lastName?: string;
  phoneCountryCode?: string;
  phone?: string;
  email?: string;
  privacyConsent?: boolean;
  smsConsent?: boolean;
};

export async function POST(request: Request) {
  let payload: SubscribePayload = {};
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const email = payload.email?.trim();
  if (!email) {
    return NextResponse.json({ error: "Email is required." }, { status: 400 });
  }

  const apiKey = process.env.BREVO_API_KEY;
  const listEnv = process.env.BREVO_LIST_ID;
  if (!apiKey || !listEnv) {
    return NextResponse.json({ error: "Email service not configured." }, { status: 500 });
  }

  const listIds = listEnv
    .split(",")
    .map((value) => Number(value.trim()))
    .filter((value) => !Number.isNaN(value));

  const attributes: Record<string, string> = {};
  if (payload.firstName?.trim()) attributes.FNAME = payload.firstName.trim();
  if (payload.lastName?.trim()) attributes.LNAME = payload.lastName.trim();
  if (payload.privacyConsent) attributes.OPT_IN = true;
  if (payload.smsConsent) attributes.SMS_CONSENT = true;
  if (payload.phone?.trim()) {
    const rawPhone = payload.phone.trim();
    const countryCode = payload.phoneCountryCode?.trim() || "";
    let formattedPhone = rawPhone;
    if (!rawPhone.startsWith("+")) {
      const digits = rawPhone.replace(/\D/g, "").replace(/^0+/, "");
      const codeDigits = countryCode.replace(/\D/g, "");
      formattedPhone = codeDigits ? `+${codeDigits}${digits}` : rawPhone;
    }
    attributes.SMS = formattedPhone;
  }

  const response = await fetch("https://api.brevo.com/v3/contacts", {
    method: "POST",
    headers: {
      "api-key": apiKey,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      email,
      attributes,
      listIds: listIds.length ? listIds : undefined,
      emailBlacklisted: false,
      smsBlacklisted: false,
      updateEnabled: true,
    }),
  });

  if (response.ok) {
    const templateId = process.env.BREVO_CONFIRM_TEMPLATE_ID;
    const senderEmail = process.env.BREVO_SENDER_EMAIL;
    const senderName = process.env.BREVO_SENDER_NAME || "Overtone Festival";

    if (!templateId || !senderEmail) {
      return NextResponse.json(
        { error: "Confirmation email not configured. Set BREVO_CONFIRM_TEMPLATE_ID and BREVO_SENDER_EMAIL." },
        { status: 500 }
      );
    }

    const firstName = payload.firstName?.trim() || "";
    const lastName = payload.lastName?.trim() || "";
    const contactName = `${firstName} ${lastName}`.trim() || email;

    const emailResponse = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": apiKey,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        to: [{ email, name: contactName }],
        sender: { email: senderEmail, name: senderName },
        templateId: Number(templateId),
        params: {
          FIRSTNAME: firstName,
          LASTNAME: lastName,
          FNAME: firstName,
          LNAME: lastName,
        },
      }),
    });

    if (!emailResponse.ok) {
      let sendError = "Unable to send confirmation email.";
      try {
        const data = await emailResponse.json();
        sendError = data?.message || sendError;
      } catch {
        // ignore
      }
      return NextResponse.json({ error: sendError }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  }

  let errorMessage = "Unable to submit. Please try again.";
  try {
    const data = await response.json();
    errorMessage = data?.message || errorMessage;
  } catch {
    // keep generic error message
  }

  return NextResponse.json({ error: errorMessage }, { status: 500 });
}
