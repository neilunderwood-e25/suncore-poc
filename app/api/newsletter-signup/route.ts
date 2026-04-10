import { NextResponse } from "next/server";

type SubscriberPayload = {
  firstName: string;
  lastName: string;
  email: string;
  country?: string;
  company?: string;
  subscribed: boolean;
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

export async function POST(request: Request) {
  try {
    const body: SubscriberPayload = await request.json();

    if (!body.firstName || !body.lastName || !body.email) {
      return NextResponse.json(
        { error: "First name, last name, and email are required" },
        { status: 400 }
      );
    }

    const action = body.subscribed ? "subscription" : "unsubscribe request";
    await notifySlack(
      [
        `*New newsletter ${action}*`,
        `*Name:* ${body.firstName} ${body.lastName}`,
        `*Email:* ${body.email}`,
        body.company ? `*Company:* ${body.company}` : null,
        body.country ? `*Country:* ${body.country}` : null,
      ]
        .filter(Boolean)
        .join("\n")
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Newsletter signup error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
