"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createAuthActions } from "@insforge/sdk/ssr";

type OAuthProvider = "google" | "github";

async function signInWithProvider(provider: OAuthProvider): Promise<void> {
  let redirectUrl = "/login?error=oauth";

  try {
    const cookieStore = await cookies();
    const auth = createAuthActions({ cookies: cookieStore });

    const { data, error } = await auth.signInWithOAuth(provider, {
      redirectTo: new URL(
        "/api/auth/callback",
        process.env.NEXT_PUBLIC_APP_URL,
      ).toString(),
      skipBrowserRedirect: true,
    });

    if (error || !data.url || !data.codeVerifier) {
      console.error("[actions/auth]", error);
    } else {
      const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax" as const,
        path: "/",
        maxAge: 600,
      };
      cookieStore.set("insforge_code_verifier", data.codeVerifier, cookieOptions);
      // Read back in the callback route instead of guessing from user.providers,
      // which lists every provider ever linked — not necessarily the one just used.
      cookieStore.set("insforge_oauth_provider", provider, cookieOptions);
      redirectUrl = data.url;
    }
  } catch (error) {
    console.error("[actions/auth]", error);
  }

  redirect(redirectUrl);
}

export async function signInWithGoogle(): Promise<void> {
  await signInWithProvider("google");
}

export async function signInWithGithub(): Promise<void> {
  await signInWithProvider("github");
}

export async function signOut(): Promise<void> {
  try {
    const cookieStore = await cookies();
    const auth = createAuthActions({ cookies: cookieStore });
    const { error } = await auth.signOut();

    if (error) {
      console.error("[actions/auth]", error);
    }
  } catch (error) {
    console.error("[actions/auth]", error);
  }

  redirect("/");
}
