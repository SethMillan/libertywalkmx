"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/lib/database.types";
import { EVENTS_BUCKET, storagePathFromPublicUrl } from "@/lib/admin/storage";
import { CloseIcon, UploadIcon } from "@/components/icons";
import { barlow, oswald } from "@/components/ui/formStyles";

// Sube fotos directo del navegador a Supabase Storage con la sesión del
// encargado (las políticas de supabase/admin.sql solo dejan a admins).
// Antes de subir, cada foto se reduce a máx. 2000 px y se convierte a WebP
// (o JPEG si el navegador no sabe generar WebP), para no subir fotos de
// celular de varios MB.
//
// Las fotos que se suben y se quitan antes de guardar se borran al momento.
// Las que ya estaban guardadas en el evento las borra el servidor al guardar
// (así "Cancelar" no pierde nada).

const MAX_SIDE = 2000;
const MAX_INPUT_BYTES = 25 * 1024 * 1024;

type Pending = { id: string; name: string; preview: string };

async function optimize(file: File): Promise<{ blob: Blob; ext: string; type: string }> {
  const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("canvas");
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const toBlob = (type: string) =>
    new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, 0.85));
  const webp = await toBlob("image/webp");
  if (webp && webp.type === "image/webp") return { blob: webp, ext: "webp", type: "image/webp" };
  const jpeg = await toBlob("image/jpeg");
  if (!jpeg) throw new Error("encode");
  return { blob: jpeg, ext: "jpg", type: "image/jpeg" };
}

export default function ImageUploader({
  multiple,
  value,
  onChange,
  onBusyChange,
  supabaseUrl,
  supabaseAnonKey,
  inputId,
}: {
  multiple: boolean;
  value: string[];
  onChange: (urls: string[]) => void;
  onBusyChange?: (busy: boolean) => void;
  supabaseUrl: string;
  supabaseAnonKey: string;
  inputId: string;
}) {
  const supabase = useMemo(
    () => createBrowserClient<Database>(supabaseUrl, supabaseAnonKey),
    [supabaseUrl, supabaseAnonKey],
  );
  const [pending, setPending] = useState<Pending[]>([]);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const uploadedHere = useRef(new Set<string>());
  // value más reciente (las subidas terminan en tiempos distintos).
  const latest = useRef(value);
  useEffect(() => {
    latest.current = value;
  }, [value]);

  useEffect(() => {
    onBusyChange?.(pending.length > 0);
  }, [pending.length, onBusyChange]);

  async function uploadOne(file: File): Promise<string | null> {
    if (!file.type.startsWith("image/")) {
      setError(`"${file.name}" no es una imagen.`);
      return null;
    }
    if (file.size > MAX_INPUT_BYTES) {
      setError(`"${file.name}" pesa más de 25 MB.`);
      return null;
    }
    let optimized;
    try {
      optimized = await optimize(file);
    } catch {
      setError(`No se pudo leer "${file.name}". Usa una foto JPG, PNG o WebP.`);
      return null;
    }
    const path = `${new Date().getFullYear()}/${crypto.randomUUID()}.${optimized.ext}`;
    const { error: uploadError } = await supabase.storage
      .from(EVENTS_BUCKET)
      .upload(path, optimized.blob, { contentType: optimized.type, cacheControl: "31536000", upsert: false });
    if (uploadError) {
      setError(`No se pudo subir "${file.name}". Revisa tu conexión e intenta de nuevo.`);
      return null;
    }
    const url = supabase.storage.from(EVENTS_BUCKET).getPublicUrl(path).data.publicUrl;
    uploadedHere.current.add(url);
    return url;
  }

  async function handleFiles(list: FileList | File[]) {
    setError("");
    const files = Array.from(list).slice(0, multiple ? 20 : 1);
    if (files.length === 0) return;

    const items: Pending[] = files.map((f) => ({
      id: crypto.randomUUID(),
      name: f.name,
      preview: URL.createObjectURL(f),
    }));
    setPending((p) => [...p, ...items]);

    await Promise.all(
      files.map(async (file, i) => {
        const url = await uploadOne(file);
        URL.revokeObjectURL(items[i].preview);
        setPending((p) => p.filter((x) => x.id !== items[i].id));
        if (!url) return;
        if (multiple) {
          latest.current = [...latest.current, url];
          onChange(latest.current);
        } else {
          const replaced = latest.current[0];
          latest.current = [url];
          onChange([url]);
          if (replaced) discardIfUploadedHere(replaced);
        }
      }),
    );
  }

  // Solo borra del bucket lo que se subió en esta misma edición y aún no se guardó.
  function discardIfUploadedHere(url: string) {
    if (!uploadedHere.current.has(url)) return;
    uploadedHere.current.delete(url);
    const path = storagePathFromPublicUrl(url, supabaseUrl);
    if (path) void supabase.storage.from(EVENTS_BUCKET).remove([path]);
  }

  function remove(url: string) {
    const next = value.filter((u) => u !== url);
    latest.current = next;
    onChange(next);
    discardIfUploadedHere(url);
  }

  function move(index: number, delta: number) {
    const target = index + delta;
    if (target < 0 || target >= value.length) return;
    const next = [...value];
    [next[index], next[target]] = [next[target], next[index]];
    latest.current = next;
    onChange(next);
  }

  const showDropzone = multiple || (value.length === 0 && pending.length === 0);

  return (
    <div>
      <div className={multiple ? "grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4" : "max-w-md"}>
        {value.map((url, i) => (
          <figure key={url} className="group relative aspect-[4/3] overflow-hidden border border-(--border-default) bg-(--bg-surface-2)">
            <img src={url} alt="" className="h-full w-full object-cover" />
            <div className="absolute inset-x-0 top-0 flex justify-between gap-1 p-1.5">
              {multiple ? (
                <span className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => move(i, -1)}
                    disabled={i === 0}
                    aria-label="Mover antes"
                    className="flex h-8 w-8 items-center justify-center bg-black/75 text-white transition-colors hover:bg-black disabled:opacity-30"
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    onClick={() => move(i, 1)}
                    disabled={i === value.length - 1}
                    aria-label="Mover después"
                    className="flex h-8 w-8 items-center justify-center bg-black/75 text-white transition-colors hover:bg-black disabled:opacity-30"
                  >
                    →
                  </button>
                </span>
              ) : (
                <span />
              )}
              <button
                type="button"
                onClick={() => remove(url)}
                aria-label="Quitar foto"
                className="flex h-8 w-8 items-center justify-center bg-black/75 text-white transition-colors hover:bg-[#c0392b]"
              >
                <CloseIcon />
              </button>
            </div>
            {!multiple && (
              <button
                type="button"
                onClick={() => fileInput.current?.click()}
                className="absolute bottom-2 left-2 bg-black/75 px-3 py-1.5 text-[12px] font-medium uppercase tracking-[1.5px] text-white transition-colors hover:bg-black"
                style={oswald}
              >
                Cambiar
              </button>
            )}
          </figure>
        ))}

        {pending.map((p) => (
          <figure key={p.id} className="relative aspect-[4/3] overflow-hidden border border-(--border-default) bg-(--bg-surface-2)">
            <img src={p.preview} alt="" className="h-full w-full object-cover opacity-50" />
            <figcaption
              className="absolute inset-0 flex items-center justify-center bg-black/30 text-[12px] font-medium uppercase tracking-[2px] text-white"
              style={oswald}
            >
              <span className="animate-pulse">Subiendo...</span>
            </figcaption>
          </figure>
        ))}

        {showDropzone && (
          <label
            htmlFor={inputId}
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              void handleFiles(e.dataTransfer.files);
            }}
            className={`flex cursor-pointer flex-col items-center justify-center gap-2 border border-dashed px-4 text-center transition-colors ${
              multiple ? "aspect-[4/3]" : "min-h-[180px] py-8"
            } ${
              dragging
                ? "border-(--text-primary) bg-white"
                : "border-[rgba(9,9,8,0.35)] bg-(--bg-surface) hover:border-(--text-primary) hover:bg-white"
            }`}
          >
            <UploadIcon className="h-7 w-7 text-(--text-tertiary)" />
            <span className="text-[13px] font-medium uppercase tracking-[1.5px] text-(--text-primary)" style={oswald}>
              {multiple ? "Agregar fotos" : "Subir portada"}
            </span>
            {!multiple && (
              <span className="text-[14px] text-(--text-tertiary)" style={barlow}>
                Arrastra una imagen o haz clic. JPG, PNG o WebP; se optimiza sola.
              </span>
            )}
          </label>
        )}
      </div>

      <input
        ref={fileInput}
        id={inputId}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif,image/heic,image/heif"
        multiple={multiple}
        className="sr-only"
        onChange={(e) => {
          if (e.target.files) void handleFiles(e.target.files);
          e.target.value = "";
        }}
      />

      {error && (
        <p className="mt-3 text-[14px]" style={{ ...barlow, color: "#c0392b" }} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
