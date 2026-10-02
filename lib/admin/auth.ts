import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { createSessionClient, type SessionClient } from "@/lib/supabase/session";

// Revisión de acceso al panel. Se llama en CADA página y acción del servidor
// de /admin (no basta con el layout ni con proxy.ts: el layout no se vuelve a
// ejecutar al navegar y proxy.ts solo ve si hay sesión, no si es admin).
// La última palabra la tiene la base de datos con public.is_admin().

type AdminSession =
  | { status: "anonymous" }
  | { status: "forbidden"; email: string | null }
  | {
      status: "ok";
      supabase: SessionClient;
      user: { id: string; email: string | null };
    };

// cache(): dentro de un mismo request, varias llamadas comparten el resultado.
export const getAdminSession = cache(async (): Promise<AdminSession> => {
  const supabase = await createSessionClient();
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;
  if (!claims?.sub) return { status: "anonymous" };

  const email = typeof claims.email === "string" ? claims.email : null;
  const { data: isAdmin, error } = await supabase.rpc("is_admin");
  if (error || !isAdmin) return { status: "forbidden", email };

  return { status: "ok", supabase, user: { id: claims.sub, email } };
});

export async function requireAdmin() {
  const session = await getAdminSession();
  if (session.status !== "ok") redirect("/admin/login");
  return session;
}
