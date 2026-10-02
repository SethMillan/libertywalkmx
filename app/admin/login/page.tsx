import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ASSETS } from "@/lib/assets";
import { getAdminSession } from "@/lib/admin/auth";
import { signOut } from "@/app/admin/actions";
import LoginForm from "@/components/admin/LoginForm";
import { barlow, bebas, oswald } from "@/components/ui/formStyles";

export const metadata: Metadata = { title: "Entrar" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  const safeNext = next?.startsWith("/admin") && !next.startsWith("//") ? next : "/admin";

  const session = await getAdminSession();
  if (session.status === "ok") redirect(safeNext);

  return (
    <main className="flex min-h-screen w-full items-center justify-center px-5 py-12" style={{ background: "#090908" }}>
      <div className="w-full max-w-[420px]">
        <div className="mb-8 flex items-center justify-center gap-3">
          <img src={ASSETS.lbMxLogo} alt="" className="h-14 w-14 object-cover" />
          <span className="leading-none text-white" style={bebas}>
            <span className="block text-[24px]">LIBERTY WALK</span>
            <span className="block text-[15px] tracking-[1px]">MÉXICO · ADMIN</span>
          </span>
        </div>

        <div className="border bg-white" style={{ borderColor: "rgba(255,255,255,0.12)" }}>
          <div className="px-6 pb-2 pt-7 sm:px-8">
            <p
              className="mb-2 flex items-center gap-2 text-[14px] font-medium uppercase tracking-[3px]"
              style={{ ...oswald, color: "var(--text-tertiary)" }}
            >
              <span style={bebas}>★</span> Panel privado
            </p>
            <h1 className="mb-2 text-[30px] font-medium uppercase leading-tight" style={{ ...oswald, color: "var(--text-primary)" }}>
              Entrar
            </h1>
            <p className="mb-6 text-[15px] leading-relaxed" style={{ ...barlow, color: "var(--text-secondary)" }}>
              Solo para los encargados de administrar el contenido del sitio.
            </p>
          </div>

          <div className="px-6 pb-7 sm:px-8">
            {session.status === "forbidden" ? (
              <div className="flex flex-col gap-5">
                <p className="text-[15px] leading-relaxed" style={{ ...barlow, color: "#c0392b" }}>
                  La cuenta {session.email ?? ""} no tiene acceso al panel. Pide que te den de alta o
                  entra con otra cuenta.
                </p>
                <form action={signOut}>
                  <button
                    type="submit"
                    className="h-12 w-full border border-(--text-primary) text-[14px] font-medium uppercase tracking-[2px] text-(--text-primary) transition-colors hover:bg-(--text-primary) hover:text-white"
                    style={oswald}
                  >
                    Cerrar sesión
                  </button>
                </form>
              </div>
            ) : (
              <LoginForm next={safeNext} />
            )}
          </div>
        </div>

        <p className="mt-6 text-center">
          <Link
            href="/"
            className="text-[13px] uppercase tracking-[2px] text-white/60 transition-colors hover:text-white"
            style={oswald}
          >
            ← Volver al sitio
          </Link>
        </p>
      </div>
    </main>
  );
}
