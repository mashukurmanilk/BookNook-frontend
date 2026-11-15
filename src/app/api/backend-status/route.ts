import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const backendUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000")
    .trim()
    .replace(/\/$/, "");

  const diagnostics: Record<string, any> = {
    configuredBackendUrl: backendUrl,
    timestamp: new Date().toISOString(),
    env: {
      has_NEXT_PUBLIC_API_URL: Boolean(process.env.NEXT_PUBLIC_API_URL),
      has_BETTER_AUTH_SECRET: Boolean(process.env.BETTER_AUTH_SECRET),
      has_MONGODB_URI: Boolean(process.env.MONGODB_URI),
    },
  };

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const testRes = await fetch(`${backendUrl}/`, {
      signal: controller.signal,
      cache: "no-store",
    });
    clearTimeout(timeoutId);

    const data = await testRes.json().catch(() => ({ text: "Non-JSON response" }));
    diagnostics.status = "SUCCESS: Backend is reachable";
    diagnostics.backendResponse = data;
    diagnostics.httpStatus = testRes.status;

    // Also test /books endpoint
    try {
      const booksRes = await fetch(`${backendUrl}/books?limit=1`, { cache: "no-store" });
      const booksData = await booksRes.json();
      diagnostics.booksEndpointStatus = booksRes.status;
      diagnostics.booksCount = booksData?.count ?? 0;
    } catch (e: any) {
      diagnostics.booksEndpointError = e.message;
    }

    return NextResponse.json(diagnostics, { status: 200 });
  } catch (error: any) {
    diagnostics.status = "FAILED: Could not reach backend";
    diagnostics.error = error?.message || String(error);
    diagnostics.suggestion =
      backendUrl.includes("localhost")
        ? "NEXT_PUBLIC_API_URL is defaulting to localhost. Set NEXT_PUBLIC_API_URL in your Vercel frontend settings to your deployed backend URL (https://your-backend.vercel.app) and redeploy."
        : "Check that your backend URL is live and accessible.";

    return NextResponse.json(diagnostics, { status: 502 });
  }
}
