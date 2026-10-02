import { CheckIcon } from "@/components/icons";
import { barlow } from "@/components/ui/formStyles";

// Aviso de confirmación tras guardar/eliminar (llega como ?ok=... en la URL).
const MESSAGES: Record<string, string> = {
  creado: "Evento creado.",
  guardado: "Cambios guardados.",
  eliminado: "Evento eliminado.",
};

export default function Notice({ code }: { code?: string }) {
  const message = code ? MESSAGES[code] : undefined;
  if (!message) return null;
  return (
    <div
      role="status"
      className="mb-6 flex items-center gap-3 border px-4 py-3 text-[15px]"
      style={{ ...barlow, background: "#fff", borderColor: "var(--text-primary)", color: "var(--text-primary)" }}
    >
      <span className="flex h-7 w-7 shrink-0 items-center justify-center text-white" style={{ background: "#090908" }}>
        <CheckIcon className="h-4 w-4" />
      </span>
      {message}
    </div>
  );
}
