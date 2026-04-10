import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

const WEBHOOK_SECRET = process.env.CONTENTFUL_WEBHOOK_SECRET ?? "";

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
    // Verify webhook secret
    const secret = request.headers.get("x-webhook-secret");
    if (WEBHOOK_SECRET && secret !== WEBHOOK_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await request.json();
    const contentType = payload.sys?.contentType?.sys?.id ?? "unknown";
    const topic =
      request.headers.get("x-contentful-topic") ?? "ContentManagement.Entry.publish";

    // Extract article info for Slack notification
    const fields = payload.fields ?? {};
    const locale = "en-US";
    const title = fields.title?.[locale] ?? fields.heading?.[locale] ?? "Untitled";
    const slug = fields.slug?.[locale] ?? "";

    // Determine the action from the topic header
    // Format: ContentManagement.Entry.publish, ContentManagement.Entry.unpublish, etc.
    const action = topic.split(".").pop() ?? "update";

    // Send Slack notification for article events
    if (contentType === "newsArticle") {
      const emoji =
        action === "publish" ? "📰" : action === "unpublish" ? "🗑️" : "✏️";
      await notifySlack(
        [
          `${emoji} *News article ${action}ed*`,
          `*Title:* ${title}`,
          slug ? `*URL:* /news-and-stories/${slug}` : null,
          `*Content type:* ${contentType}`,
        ]
          .filter(Boolean)
          .join("\n")
      );
    } else {
      await notifySlack(
        `🔄 *Content ${action}ed* — ${title} (${contentType})`
      );
    }

    // Revalidate affected paths
    revalidatePath("/", "layout");

    return NextResponse.json({
      revalidated: true,
      contentType,
      action,
    });
  } catch (error) {
    console.error("Revalidation webhook error:", error);
    return NextResponse.json(
      { error: "Revalidation failed" },
      { status: 500 }
    );
  }
}
