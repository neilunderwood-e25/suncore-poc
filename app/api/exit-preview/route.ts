import { draftMode } from "next/headers";
import { NextResponse } from "next/server";

export const GET = async (request: Request) => {
  try {
    draftMode().disable();

    const url = new URL(request.url);
    const slug = url.searchParams.get("slug") ?? "/";

    // Validate and sanitize slug
    const sanitizedSlug = slug.startsWith("/") ? slug : `/${slug}`;
    const redirectUrl = new URL(sanitizedSlug, request.url);

    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error("Exit preview route error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
};
