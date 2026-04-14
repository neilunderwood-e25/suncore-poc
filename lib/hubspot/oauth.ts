/**
 * HubSpot OAuth token management.
 *
 * Uses the refresh token (long-lived) to obtain short-lived access tokens
 * and caches them in memory until they expire.
 */

const HUBSPOT_TOKEN_URL = "https://api.hubapi.com/oauth/v1/token";

let cachedToken: { accessToken: string; expiresAt: number } | null = null;

export async function getHubSpotAccessToken(): Promise<string | null> {
  const clientId = process.env.HUBSPOT_CLIENT_ID;
  const clientSecret = process.env.HUBSPOT_CLIENT_SECRET;
  const refreshToken = process.env.HUBSPOT_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    console.warn("HubSpot OAuth credentials not configured — skipping");
    return null;
  }

  // Return cached token if still valid (with 60s buffer)
  if (cachedToken && Date.now() < cachedToken.expiresAt - 60_000) {
    return cachedToken.accessToken;
  }

  const res = await fetch(HUBSPOT_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    console.error("HubSpot token refresh failed:", err);
    cachedToken = null;
    return null;
  }

  const data = await res.json();

  cachedToken = {
    accessToken: data.access_token,
    expiresAt: Date.now() + data.expires_in * 1000,
  };

  return cachedToken.accessToken;
}
