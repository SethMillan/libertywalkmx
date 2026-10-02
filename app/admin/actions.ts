"use server";

import { redirect } from "next/navigation";
import { cleanLine } from "@/lib/sanitize";
import { createSessionClient } from "@/lib/supabase/session";

export type SignInState = { error: string; email: string } | null;

// Solo se permite regresar a rutas del panel (evita redirecciones abiertas).
function safeNext(value: FormDataEntryValue | null) {
  const next = typeof value === "string" ? value : "";
  return next.startsWith("/admin") && !next.startsWith("//") ? next : "/admin";
}

export async function signIn(_prev: SignInState, formData: FormData): Promise<SignInState> {
  const email = cleanLine(formData.get("email"), 254).toLowerCase();
  const password = typeof formData.get("password") === "string" ? String(formData.get("password")) : "";

  if (!email || !password) {
    return { error: "Escribe tu correo y tu contraseña.", email };
  }

  const supabase = await createSessionClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    return { error: "Correo o contraseña incorrectos.", email };
  }

  // Tener cuenta no basta: debe estar en admin_users (supabase/admin.sql).
  const { data: isAdmin } = await supabase.rpc("is_admin");
  if (!isAdmin) {
    await supabase.auth.signOut();
    return { error: "Tu cuenta no tiene acceso al panel. Pide que te den de alta.", email };
  }

  redirect(safeNext(formData.get("next")));
}

export async function signOut() {
  const supabase = await createSessionClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
