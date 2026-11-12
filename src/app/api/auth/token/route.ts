import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { signUserToken } from "@/lib/jwt";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: No active session found" },
        { status: 401 }
      );
    }

    const token = await signUserToken({
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
    });

    return NextResponse.json({
      success: true,
      token,
      user: session.user,
    });
  } catch (error: any) {
    console.error("Token generation error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to generate auth token", error: error?.message },
      { status: 500 }
    );
  }
}
