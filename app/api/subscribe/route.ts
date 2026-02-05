import { NextResponse } from "next/server";

type SubscribePayload = {
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
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
  if (payload.firstName?.trim()) attributes.FIRSTNAME = payload.firstName.trim();
  if (payload.lastName?.trim()) attributes.LASTNAME = payload.lastName.trim();
  if (payload.phone?.trim()) attributes.SMS = payload.phone.trim();

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
      updateEnabled: true,
    }),
  });

  if (response.ok) {
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
