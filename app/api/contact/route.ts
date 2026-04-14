import { NextResponse } from "next/server";
import { getHubSpotAccessToken } from "@/lib/hubspot/oauth";

type ContactPayload = {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  jobTitle?: string;
  subject: string;
  message: string;
};

async function notifySlack(message: string) {
  const token = process.env.SLACK_BOT_TOKEN;
  const channel = process.env.SLACK_CHANNEL_ID;
  if (!token || !channel) return;

  await fetch("https://slack.com/api/chat.postMessage", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ channel, text: message }),
  }).catch((err) => {
    console.error("Slack notification error:", err);
  });
}

async function createOrUpdateHubSpotContact(payload: ContactPayload) {
  const token = await getHubSpotAccessToken();
  if (!token) {
    return null;
  }

  const contactProperties = {
    firstname: payload.firstName,
    lastname: payload.lastName,
    email: payload.email,
    ...(payload.phone && { phone: payload.phone }),
    ...(payload.company && { company: payload.company }),
    ...(payload.jobTitle && { jobtitle: payload.jobTitle }),
    message: `[${payload.subject}] ${payload.message}`,
    lifecyclestage: "lead",
  };

  // Try to create a new contact
  const createRes = await fetch(
    "https://api.hubapi.com/crm/v3/objects/contacts",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ properties: contactProperties }),
    }
  );

  if (createRes.ok) {
    const created = await createRes.json();
    console.log("HubSpot contact created:", created.id);
    return { action: "created", id: created.id };
  }

  // If 409 conflict (contact already exists), update instead
  if (createRes.status === 409) {
    const conflict = await createRes.json();
    const existingId = conflict.message?.match(/Existing ID: (\d+)/)?.[1];

    if (existingId) {
      const updateRes = await fetch(
        `https://api.hubapi.com/crm/v3/objects/contacts/${existingId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ properties: contactProperties }),
        }
      );

      if (updateRes.ok) {
        console.log("HubSpot contact updated:", existingId);
        return { action: "updated", id: existingId };
      }

      const updateErr = await updateRes.json();
      console.error("HubSpot update error:", updateErr);
      return null;
    }
  }

  const createErr = await createRes.json();
  console.error("HubSpot create error:", createErr);
  return null;
}

export async function POST(request: Request) {
  try {
    const body: ContactPayload = await request.json();

    if (!body.firstName || !body.lastName || !body.email || !body.subject || !body.message) {
      return NextResponse.json(
        { error: "First name, last name, email, subject, and message are required" },
        { status: 400 }
      );
    }

    // Send to HubSpot and Slack in parallel
    const [hubspotResult] = await Promise.all([
      createOrUpdateHubSpotContact(body).catch((err) => {
        console.error("HubSpot sync error:", err);
        return null;
      }),
      notifySlack(
        [
          `*New Contact Us submission*`,
          `*Name:* ${body.firstName} ${body.lastName}`,
          `*Email:* ${body.email}`,
          body.phone ? `*Phone:* ${body.phone}` : null,
          body.company ? `*Company:* ${body.company}` : null,
          body.jobTitle ? `*Job Title:* ${body.jobTitle}` : null,
          `*Subject:* ${body.subject}`,
          `*Message:* ${body.message}`,
        ]
          .filter(Boolean)
          .join("\n")
      ),
    ]);

    return NextResponse.json({
      success: true,
      hubspot: hubspotResult
        ? { action: hubspotResult.action, contactId: hubspotResult.id }
        : null,
    });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
