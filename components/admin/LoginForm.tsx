"use client";

import { useActionState } from "react";
import { signIn, type SignInState } from "@/app/admin/actions";
import { FIELD_CLASS, LABEL_CLASS, barlow, oswald } from "@/components/ui/formStyles";

export default function LoginForm({ next }: { next: string }) {
  const [state, formAction, pending] = useActionState<SignInState, FormData>(signIn, null);

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <input type="hidden" name="next" value={next} />
      <div>
        <label htmlFor="admin-email" className={LABEL_CLASS} style={{ ...oswald, color: "var(--text-tertiary)" }}>
          Correo
        </label>
        <input
          id="admin-email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="username"
          required
          defaultValue={state?.email ?? ""}
          className={`${FIELD_CLASS} h-12`}
          style={barlow}
        />
      </div>
      <div>
        <label htmlFor="admin-password" className={LABEL_CLASS} style={{ ...oswald, color: "var(--text-tertiary)" }}>
          Contraseña
        </label>
        <input
          id="admin-password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className={`${FIELD_CLASS} h-12`}
          style={barlow}
        />
      </div>

      <div aria-live="polite">
        {state?.error && (
          <p className="text-[15px]" style={{ ...barlow, color: "#c0392b" }}>
            {state.error}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={pending}
        className="h-13 w-full text-[16px] font-medium uppercase tracking-[2px] text-white transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black disabled:cursor-wait disabled:opacity-70"
        style={{ ...oswald, background: "var(--text-primary)" }}
      >
        {pending ? "Entrando..." : "Entrar"}
      </button>
    </form>
  );
}
