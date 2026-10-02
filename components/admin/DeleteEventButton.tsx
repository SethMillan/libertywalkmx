"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { deleteEvent } from "@/app/admin/(panel)/eventos/actions";
import { barlow, oswald } from "@/components/ui/formStyles";

// Botón "Eliminar" con confirmación. Borra el evento y sus fotos del bucket.
export default function DeleteEventButton({
  id,
  title,
  compact = false,
}: {
  id: number;
  title: string;
  compact?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    cancelRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !pending) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, pending]);

  function confirmDelete() {
    setError("");
    startTransition(async () => {
      const res = await deleteEvent(id);
      if (res) setError(res.message);
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={
          compact
            ? "text-[13px] font-medium uppercase tracking-[1.5px] text-[#c0392b] underline-offset-4 hover:underline"
            : "inline-flex h-11 items-center justify-center border border-[#c0392b] px-5 text-[14px] font-medium uppercase tracking-[1.5px] text-[#c0392b] transition-colors hover:bg-[#c0392b] hover:text-white"
        }
        style={oswald}
      >
        Eliminar
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4 sm:items-center"
          onClick={() => !pending && setOpen(false)}
        >
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby={`borrar-${id}-titulo`}
            aria-describedby={`borrar-${id}-texto`}
            className="w-full max-w-md border bg-white"
            style={{ borderColor: "var(--text-primary)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 pb-2 pt-6">
              <p
                id={`borrar-${id}-titulo`}
                className="mb-2 text-[22px] font-medium uppercase leading-tight"
                style={{ ...oswald, color: "var(--text-primary)" }}
              >
                ¿Eliminar este evento?
              </p>
              <p id={`borrar-${id}-texto`} className="text-[15px] leading-relaxed" style={{ ...barlow, color: "var(--text-secondary)" }}>
                <strong className="text-(--text-primary)">{title}</strong> se borrará del sitio junto con
                sus fotos. No se puede deshacer.
              </p>
              {error && (
                <p className="mt-3 text-[14px]" style={{ ...barlow, color: "#c0392b" }} role="alert">
                  {error}
                </p>
              )}
            </div>
            <div className="flex gap-3 px-6 pb-6 pt-4">
              <button
                ref={cancelRef}
                type="button"
                disabled={pending}
                onClick={() => setOpen(false)}
                className="h-11 flex-1 border border-(--text-primary) text-[14px] font-medium uppercase tracking-[1.5px] text-(--text-primary) transition-colors hover:bg-(--text-primary) hover:text-white"
                style={oswald}
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={pending}
                onClick={confirmDelete}
                className="h-11 flex-1 text-[14px] font-medium uppercase tracking-[1.5px] text-white transition-opacity hover:opacity-90 disabled:cursor-wait disabled:opacity-70"
                style={{ ...oswald, background: "#c0392b" }}
              >
                {pending ? "Eliminando..." : "Eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
