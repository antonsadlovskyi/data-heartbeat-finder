import { createStart, createMiddleware } from "@tanstack/react-start";

import { renderErrorPage } from "./lib/error-page";
import { attachSupabaseAuth } from "@/integrations/supabase/auth-attacher";

// ENV validation — fail fast on server start if required vars are missing
const REQUIRED_ENV = [
  "VITE_SUPABASE_URL",
  "VITE_SUPABASE_ANON_KEY",
  "N8N_WF01_WEBHOOK_URL",
  "N8N_WEBHOOK_SECRET",
] as const;

const OPTIONAL_ENV = ["N8N_WF06_URL", "N8N_WF07_URL"] as const;

for (const key of REQUIRED_ENV) {
  const val = process.env[key] ?? (import.meta as any).env?.[key];
  if (!val) {
    throw new Error(
      `[FlyHigh] Missing required environment variable: ${key}. ` +
        `Add it to your .env file or deployment environment.`
    );
  }
}

for (const key of OPTIONAL_ENV) {
  const val = process.env[key] ?? (import.meta as any).env?.[key];
  if (!val) {
    console.warn(
      `[FlyHigh] Optional env var not set: ${key}. ` +
        `The corresponding webhook will not work until it is configured.`
    );
  }
}

// Pre-register server functions so Vite's module runner knows about them
// before the first client RPC call arrives (fixes "Invalid server function ID" in dev mode).
import "@/lib/data/workspace.functions";
import "@/lib/data/page-objects.functions";
import "@/lib/data/onboarding.functions";
import "@/lib/data/insights.functions";
import "@/lib/data/todos.functions";

const errorMiddleware = createMiddleware().server(async ({ next }) => {
  const { getRequest } = await import('@tanstack/react-start/server');
  const req = getRequest();
  console.log('[request]', req?.method, req?.url);
  try {
    return await next();
  } catch (error) {
    if (error != null && typeof error === "object" && "statusCode" in error) {
      throw error;
    }
    console.error(error);
    return new Response(renderErrorPage(), {
      status: 500,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }
});

export const startInstance = createStart(() => ({
  requestMiddleware: [errorMiddleware],
  functionMiddleware: [attachSupabaseAuth],
}));
