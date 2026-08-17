"use client";

import { useEffect } from "react";
import posthog from "posthog-js";

export function OAuthErrorNotice() {
  useEffect(() => {
    posthog.capture("oauth_sign_in_failed");
  }, []);

  return (
    <p className="mt-6 rounded-md border border-border bg-surface-secondary px-3 py-2 text-sm text-text-secondary">
      Something went wrong signing you in. Please try again.
    </p>
  );
}
