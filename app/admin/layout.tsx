import type { Metadata } from "next";

// Todo /admin: privado y fuera de buscadores. No usa el NavBar ni el Footer
// del sitio (esos viven en app/(sitio)/layout.tsx).
export const metadata: Metadata = {
  title: { default: "Panel", template: "%s | Admin LBWK MX" },
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full flex-col" style={{ background: "var(--bg-surface)" }}>
      {children}
    </div>
  );
}
