import "server-only";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { Database } from "@/lib/database.types";

// Cliente de Supabase con la sesión del usuario (cookies). Lo usa el panel
// /admin: a diferencia de lib/supabase.ts (llave pública, sin sesión), aquí
// las consultas se hacen "como" el encargado y las políticas RLS de
// supabase/admin.sql deciden qué puede leer y escribir.

export function supabaseConfig() {
  const url = process.env.SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    throw new Error(
      "Missing SUPABASE_URL / SUPABASE_ANON_KEY environment variables.",
    );
  }
  return { url, anonKey };
}

export async function createSessionClient() {
  const { url, anonKey } = supabaseConfig();
  const cookieStore = await cookies();

  return createServerClient<Database>(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // Desde un Server Component no se pueden escribir cookies. No pasa
          // nada: proxy.ts ya refresca la sesión en cada request de /admin.
        }
      },
    },
  });
}

export type SessionClient = Awaited<ReturnType<typeof createSessionClient>>;
