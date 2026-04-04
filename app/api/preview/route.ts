import { draftMode } from "next/headers";
import { NextResponse } from "next/server";

export const GET = async (request: Request) => {
  try {
    const url = new URL(request.url);
    const secret = url.searchParams.get("secret");
    const slug = url.searchParams.get("slug") ?? "/";

    if (!process.env.CONTENTFUL_PREVIEW_SECRET) {
      return NextResponse.json(
        { message: "Missing CONTENTFUL_PREVIEW_SECRET environment variable" },
        { status: 500 }
      );
    }

    if (!secret || secret !== process.env.CONTENTFUL_PREVIEW_SECRET) {
      return NextResponse.json(
        { message: "Invalid or missing preview secret" },
        { status: 401 }
      );
    }

    draftMode().enable();

    // Validate and sanitize slug
    const sanitizedSlug = slug.startsWith("/") ? slug : `/${slug}`;
    const redirectUrl = new URL(sanitizedSlug, request.url);

    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error("Preview route error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
};
