import { NextResponse } from "next/server";

/**
 * HubSpot OAuth callback.
 *
 * After the user authorizes the app, HubSpot redirects here with a `code`
 * query parameter. We exchange it for access + refresh tokens and display
 * the refresh token so it can be saved in .env.local.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.json(
      { error: "Missing authorization code" },
      { status: 400 }
    );
  }

  const clientId = process.env.HUBSPOT_CLIENT_ID;
  const clientSecret = process.env.HUBSPOT_CLIENT_SECRET;
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "").replace(/\/+$/, "");
  const redirectUri = `${siteUrl}/api/hubspot/callback`;

  if (!clientId || !clientSecret) {
    return NextResponse.json(
      { error: "HUBSPOT_CLIENT_ID and HUBSPOT_CLIENT_SECRET not configured" },
      { status: 500 }
    );
  }

  const tokenRes = await fetch("https://api.hubapi.com/oauth/v1/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      code,
    }),
  });

  if (!tokenRes.ok) {
    const err = await tokenRes.json();
    return NextResponse.json(
      { error: "Token exchange failed", details: err },
      { status: 400 }
    );
  }

  const tokens = await tokenRes.json();

  // In production, store the refresh token securely.
  // For this POC, we display it so it can be added to .env.local.
  return new NextResponse(
    `<html>
      <body style="font-family:system-ui;max-width:600px;margin:40px auto;padding:0 20px">
        <h2>HubSpot Connected!</h2>
        <p>Add this to your <code>.env.local</code>:</p>
        <pre style="background:#f4f4f4;padding:16px;border-radius:8px;word-break:break-all">HUBSPOT_REFRESH_TOKEN=${tokens.refresh_token}</pre>
        <p style="color:#666;font-size:14px">
          Access token expires in ${Math.round(tokens.expires_in / 60)} min —
          the refresh token is long-lived and will auto-renew access tokens.
        </p>
      </body>
    </html>`,
    { headers: { "Content-Type": "text/html" } }
  );
}
