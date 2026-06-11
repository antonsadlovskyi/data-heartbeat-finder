import { createStart, createMiddleware } from "@tanstack/react-start";

import { renderErrorPage } from "./lib/error-page";
import { attachSupabaseAuth } from "@/integrations/supabase/auth-attacher";

// Pre-register server functions so Vite's module runner knows about them
// before the first client RPC call arrives (fixes "Invalid server function ID" in dev mode).
import "@/lib/data/workspace.functions";
import "@/lib/data/page-objects.functions";
import "@/lib/data/onboarding.functions";

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
