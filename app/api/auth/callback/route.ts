import { cookies } from "next/headers";
import { NextResponse, after, type NextRequest } from "next/server";
import { createAuthActions } from "@insforge/sdk/ssr";
import { createPostHogServer } from "@/lib/posthog-server";

export async function GET(request: NextRequest) {
  try {
    const code = request.nextUrl.searchParams.get("insforge_code");
    const cookieStore = await cookies();
    const verifier = cookieStore.get("insforge_code_verifier")?.value;
    const provider = cookieStore.get("insforge_oauth_provider")?.value ?? "unknown";

    if (!code || !verifier) {
      return NextResponse.redirect(new URL("/login?error=oauth", request.url));
    }

    const response = NextResponse.redirect(new URL("/dashboard", request.url));
    const auth = createAuthActions({
      requestCookies: request.cookies,
      responseCookies: response.cookies,
    });

    const { data, error } = await auth.exchangeOAuthCode(code, verifier);
    if (error || !data) {
      console.error("[api/auth/callback]", error);
      return NextResponse.redirect(new URL("/login?error=oauth", request.url));
    }

    // Deferred to run after the redirect is sent — PostHog being slow or
    // unreachable must never delay or fail a successful sign-in.
    after(async () => {
      try {
        const posthog = createPostHogServer();
        posthog.capture({
          distinctId: data.user.id,
          event: "oauth_sign_in_completed",
          properties: { userId: data.user.id, provider },
        });
        await posthog.shutdown();
      } catch (posthogError) {
        console.error("[api/auth/callback]", posthogError);
      }
    });

    response.cookies.delete("insforge_code_verifier");
    response.cookies.delete("insforge_oauth_provider");
    return response;
  } catch (error) {
    console.error("[api/auth/callback]", error);
    return NextResponse.redirect(new URL("/login?error=oauth", request.url));
  }
}
