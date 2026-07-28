"use client";

import { useState } from "react";
import Link from "next/link";
import type { KitItemGroup, KitItemVariant } from "@/lib/catalog";
import { formatUsdReference } from "@/lib/format";

const WHATSAPP_NUMBER = "5214501097563";

type ItemType = "COMPLETE" | "SINGLE_PART";

interface SelectedItem {
  key: string;
  itemType: ItemType;
  itemName: string;
  material: string | null;
  priceUsd: number | null;
}

function variantKey(itemType: ItemType, itemName: string, material: string | null) {
  return `${itemType}:${itemName}:${material ?? "—"}`;
}

function ChipButton({
  isComplete,
  isSelected,
  material,
  priceUsd,
  onClick,
}: {
  isComplete: boolean;
  isSelected: boolean;
  material: string | null;
  priceUsd: number | null;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isSelected}
      className={`inline-flex items-center justify-between gap-2.5 border px-2.5 py-1.5 transition-colors duration-200 ${
        isComplete ? "text-[19px]" : "w-47.5 text-[17px]"
      } ${
        isSelected
          ? "border-(--text-primary)"
          : "border-(--border-default) hover:border-(--text-primary)"
      }`}
      style={
        isSelected
          ? {
              fontFamily: "var(--font-barlow), sans-serif",
              background: "var(--text-primary)",
              color: "var(--text-primary-w)",
            }
          : {
              fontFamily: "var(--font-barlow), sans-serif",
              color: "var(--text-secondary)",
            }
      }
    >
      <span className="flex items-center gap-2">
        <span
          aria-hidden="true"
          className="flex h-3.5 w-3.5 shrink-0 items-center justify-center border"
          style={{
            borderColor: isSelected ? "var(--text-primary-w)" : "var(--text-tertiary)",
            background: isSelected ? "var(--text-primary-w)" : "transparent",
          }}
        >
          {isSelected && (
            <svg viewBox="0 0 16 16" className="h-2.5 w-2.5" style={{ fill: "var(--text-primary)" }}>
              <path d="M6.3 11.3 3 8l1.4-1.4 1.9 1.9L11.6 3.2 13 4.6z" />
            </svg>
          )}
        </span>
        <span className="uppercase tracking-[0.5px]">{material ?? "—"}</span>
      </span>
      <span className="font-medium">
        {priceUsd != null ? formatUsdReference(priceUsd) : "Consultar"}
      </span>
    </button>
  );
}

// El kit completo se ve como una card: nombre, debajo en gris las piezas
// individuales que lo componen (mismos nombres que la sección "Piezas
// individuales", ya que ahí es de donde salen), y el precio anclado a la
// esquina inferior derecha — layout distinto al de las piezas sueltas.
function CompleteKitCard({
  group,
  includedParts,
  selected,
  onToggle,
}: {
  group: KitItemGroup;
  includedParts: string;
  selected: Map<string, SelectedItem>;
  onToggle: (itemType: ItemType, itemName: string, variant: KitItemVariant) => void;
}) {
  return (
    <div
      className="flex min-h-40 flex-col justify-between gap-4 border p-5 md:p-6"
      style={{ borderColor: "var(--border-default)" }}
    >
      <div>
        <p
          className="text-[19px] md:text-[20px] font-medium uppercase tracking-[0.5px]"
          style={{
            fontFamily: "var(--font-oswald), sans-serif",
            color: "var(--text-primary)",
          }}
        >
          {group.itemName}
        </p>
        {includedParts && (
          <p
            className="mt-1.5 text-[14px]"
            style={{
              fontFamily: "var(--font-barlow), sans-serif",
              color: "var(--text-tertiary)",
            }}
          >
            {includedParts}
          </p>
        )}
      </div>

      <div className="flex flex-wrap justify-end gap-2">
        {group.variants.map((v, i) => {
          const key = variantKey("COMPLETE", group.itemName, v.material);
          return (
            <ChipButton
              key={i}
              isComplete
              isSelected={selected.has(key)}
              material={v.material}
              priceUsd={v.priceUsd}
              onClick={() => onToggle("COMPLETE", group.itemName, v)}
            />
          );
        })}
      </div>
    </div>
  );
}

function ItemGroupRow({
  group,
  selected,
  onToggle,
}: {
  group: KitItemGroup;
  selected: Map<string, SelectedItem>;
  onToggle: (itemType: ItemType, itemName: string, variant: KitItemVariant) => void;
}) {
  return (
    <div
      className="grid grid-cols-1 items-center gap-x-4 gap-y-2 py-3 border-b sm:grid-cols-[minmax(0,1fr)_25rem]"
      style={{ borderColor: "var(--border-default)" }}
    >
      <p
        className="text-[17px] font-medium"
        style={{
          fontFamily: "var(--font-oswald), sans-serif",
          color: "var(--text-primary)",
        }}
      >
        {group.itemName}
      </p>
      {/* Cada variante (FRP, CFRP, ...) es un chip compacto en la misma
          fila que el nombre de la pieza — igual que libertywalk.co.jp —
          en vez de una fila propia por material. */}
      <div className="flex flex-wrap gap-2">
        {group.variants.map((v, i) => {
          const key = variantKey("SINGLE_PART", group.itemName, v.material);
          return (
            <ChipButton
              key={i}
              isComplete={false}
              isSelected={selected.has(key)}
              material={v.material}
              priceUsd={v.priceUsd}
              onClick={() => onToggle("SINGLE_PART", group.itemName, v)}
            />
          );
        })}
      </div>
    </div>
  );
}

export default function OrderBuilder({
  kitName,
  completeItems,
  singleParts,
}: {
  kitName: string;
  completeItems: KitItemGroup[];
  singleParts: KitItemGroup[];
}) {
  const [selected, setSelected] = useState<Map<string, SelectedItem>>(new Map());
  const [expanded, setExpanded] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [emailForm, setEmailForm] = useState({ nombre: "", email: "", telefono: "" });
  const [emailStatus, setEmailStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [emailError, setEmailError] = useState("");

  // El kit completo no trae su propia lista de piezas incluidas — se arma
  // a partir de "Piezas individuales", que es justo lo que compone el kit.
  const includedPartsText = singleParts.map((p) => p.itemName).join(" · ");

  const toggle = (itemType: ItemType, itemName: string, variant: KitItemVariant) => {
    const key = variantKey(itemType, itemName, variant.material);
    setSelected((prev) => {
      const next = new Map(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.set(key, {
          key,
          itemType,
          itemName,
          material: variant.material,
          priceUsd: variant.priceUsd,
        });
      }
      return next;
    });
  };

  const removeItem = (key: string) => {
    setSelected((prev) => {
      const next = new Map(prev);
      next.delete(key);
      return next;
    });
  };

  const items = Array.from(selected.values());
  const subtotal = items.reduce((s, i) => s + (i.priceUsd ?? 0), 0);
  const pendingCount = items.filter((i) => i.priceUsd == null).length;

  const buildWhatsAppMessage = () => {
    const lines = items.map(
      (i) =>
        `• ${i.itemName} (${i.material ?? "—"}) — ${
          i.priceUsd != null ? formatUsdReference(i.priceUsd) : "Precio a cotizar"
        }`,
    );
    return [
      "Hola, me interesa cotizar el siguiente kit de Liberty Walk México:",
      "",
      `Kit: ${kitName}`,
      "",
      ...lines,
      "",
      `Enlace: ${window.location.href}`,
    ].join("\n");
  };

  const handleWhatsApp = () => {
    const text = buildWhatsAppMessage();
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setEmailForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailForm.nombre || !emailForm.email) {
      setEmailError("Nombre y email son requeridos");
      setEmailStatus("error");
      return;
    }
    setEmailStatus("loading");
    setEmailError("");
    try {
      const res = await fetch("/api/order-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: emailForm.nombre,
          email: emailForm.email,
          telefono: emailForm.telefono,
          kitName,
          kitUrl: window.location.href,
          items: items.map(({ itemType, itemName, material, priceUsd }) => ({
            itemType,
            itemName,
            material,
            priceUsd,
          })),
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Error al enviar");
      }
      setEmailStatus("success");
    } catch (err) {
      setEmailError(err instanceof Error ? err.message : "Error al enviar el correo.");
      setEmailStatus("error");
    }
  };

  const disclaimer =
    "Precios de referencia en USD tomados del catálogo oficial de Liberty Walk Japón. El precio final en México (incluye importación, aranceles e instalación) se cotiza de forma personalizada.";

  const fieldStyle: React.CSSProperties = {
    fontFamily: "var(--font-barlow), sans-serif",
    fontSize: 14,
    color: "var(--text-primary)",
    outline: "none",
    background: "var(--bg-surface-2)",
    border: "1px solid var(--border-default)",
    padding: "10px 12px",
  };

  return (
    <>
      <div
        className={`mt-10 md:mt-14 flex flex-col gap-10 md:gap-12 ${
          selected.size > 0 ? "pb-28 md:pb-24" : ""
        }`}
      >
        {completeItems.length > 0 && (
          <div>
            <p
              className="mb-2 text-[14px] font-medium uppercase tracking-[2.8px]"
              style={{
                fontFamily: "var(--font-oswald), sans-serif",
                color: "var(--text-tertiary)",
              }}
            >
              Kit completo
            </p>
            <div className="flex flex-col gap-4">
              {completeItems.map((g) => (
                <CompleteKitCard
                  key={g.itemName}
                  group={g}
                  includedParts={includedPartsText}
                  selected={selected}
                  onToggle={toggle}
                />
              ))}
            </div>
          </div>
        )}

        {singleParts.length > 0 && (
          <div>
            <p
              className="mb-2 text-[14px] font-medium uppercase tracking-[2.8px]"
              style={{
                fontFamily: "var(--font-oswald), sans-serif",
                color: "var(--text-tertiary)",
              }}
            >
              Piezas individuales
            </p>
            <div>
              {singleParts.map((g) => (
                <ItemGroupRow
                  key={g.itemName}
                  group={g}
                  selected={selected}
                  onToggle={toggle}
                />
              ))}
            </div>
          </div>
        )}

        <p
          className="text-[13px] not-italic leading-relaxed"
          style={{
            fontFamily: "var(--font-barlow), sans-serif",
            color: "var(--text-tertiary)",
          }}
        >
          {disclaimer}
        </p>

        <div>
          <p
            className="mb-3 text-[14px]"
            style={{
              fontFamily: "var(--font-barlow), sans-serif",
              color: "var(--text-secondary)",
            }}
          >
            ¿Prefieres cotizar el kit completo sin elegir piezas por separado?
          </p>
          <Link
            href="/#contacto"
            className="quote-cta mx-auto flex h-14 w-fit cursor-pointer items-center justify-center gap-x-[30px] px-10 font-normal uppercase md:h-16 md:px-12"
            style={{
              fontFamily: "var(--font-oswald), sans-serif",
              fontSize: "clamp(18px, 3vw, 24px)",
              background: "var(--text-primary)",
              color: "var(--text-primary-w)",
            }}
          >
            <span className="quote-cta__label">Cotizar este kit completo</span>
            <span className="quote-cta__icon flex w-5 items-center">
              <svg viewBox="0 0 66 43" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  className="one"
                  d="M40.1543933,3.89485454 L43.9763149,0.139296592 C44.1708311,-0.0518420739 44.4826329,-0.0518571125 44.6771675,0.139262789 L65.6916134,20.7848311 C66.0855801,21.1718824 66.0911863,21.8050225 65.704135,22.1989893 C65.7000188,22.2031791 65.6958657,22.2073326 65.6916762,22.2114492 L44.677098,42.8607841 C44.4825957,43.0519059 44.1708242,43.0519358 43.9762853,42.8608513 L40.1545186,39.1069479 C39.9575152,38.9134427 39.9546793,38.5968729 40.1481845,38.3998695 C40.1502893,38.3977268 40.1524132,38.395603 40.1545562,38.3934985 L56.9937789,21.8567812 C57.1908028,21.6632968 57.193672,21.3467273 57.0001876,21.1497035 C56.9980647,21.1475418 56.9959223,21.1453995 56.9937605,21.1432767 L40.1545208,4.60825197 C39.9574869,4.41477773 39.9546013,4.09820839 40.1480756,3.90117456 C40.1501626,3.89904911 40.1522686,3.89694235 40.1543933,3.89485454 Z"
                  fill="#FFFFFF"
                />
                <path
                  className="two"
                  d="M20.1543933,3.89485454 L23.9763149,0.139296592 C24.1708311,-0.0518420739 24.4826329,-0.0518571125 24.6771675,0.139262789 L45.6916134,20.7848311 C46.0855801,21.1718824 46.0911863,21.8050225 45.704135,22.1989893 C45.7000188,22.2031791 45.6958657,22.2073326 45.6916762,22.2114492 L24.677098,42.8607841 C24.4825957,43.0519059 24.1708242,43.0519358 23.9762853,42.8608513 L20.1545186,39.1069479 C19.9575152,38.9134427 19.9546793,38.5968729 20.1481845,38.3998695 C20.1502893,38.3977268 20.1524132,38.395603 20.1545562,38.3934985 L36.9937789,21.8567812 C37.1908028,21.6632968 37.193672,21.3467273 37.0001876,21.1497035 C36.9980647,21.1475418 36.9959223,21.1453995 36.9937605,21.1432767 L20.1545208,4.60825197 C19.9574869,4.41477773 19.9546013,4.09820839 20.1480756,3.90117456 C20.1501626,3.89904911 20.1522686,3.89694235 20.1543933,3.89485454 Z"
                  fill="#FFFFFF"
                />
                <path
                  className="three"
                  d="M0.154393339,3.89485454 L3.97631488,0.139296592 C4.17083111,-0.0518420739 4.48263286,-0.0518571125 4.67716753,0.139262789 L25.6916134,20.7848311 C26.0855801,21.1718824 26.0911863,21.8050225 25.704135,22.1989893 C25.7000188,22.2031791 25.6958657,22.2073326 25.6916762,22.2114492 L4.67709797,42.8607841 C4.48259567,43.0519059 4.17082418,43.0519358 3.97628526,42.8608513 L0.154518591,39.1069479 C-0.0424848215,38.9134427 -0.0453206733,38.5968729 0.148184538,38.3998695 C0.150289256,38.3977268 0.152413239,38.395603 0.154556228,38.3934985 L16.9937789,21.8567812 C17.1908028,21.6632968 17.193672,21.3467273 17.0001876,21.1497035 C16.9980647,21.1475418 16.9959223,21.1453995 16.9937605,21.1432767 L0.15452076,4.60825197 C-0.0425130651,4.41477773 -0.0453986756,4.09820839 0.148075568,3.90117456 C0.150162624,3.89904911 0.152268631,3.89694235 0.154393339,3.89485454 Z"
                  fill="#FFFFFF"
                />
              </svg>
            </span>
          </Link>
        </div>
      </div>

      {selected.size > 0 && (
        <div
          className="fixed inset-x-0 bottom-0 z-40"
          style={{
            background: "var(--bg-surface)",
            borderTop: "1px solid var(--border-default)",
            boxShadow: "0 -8px 24px rgba(0,0,0,0.15)",
          }}
        >
          {expanded && (
            <div
              className="max-h-[50vh] overflow-y-auto border-b px-5 pt-5 pb-3 md:px-10"
              style={{ borderColor: "var(--border-default)" }}
            >
              <p
                className="mb-3 text-[13px] font-medium uppercase tracking-[2px]"
                style={{
                  fontFamily: "var(--font-oswald), sans-serif",
                  color: "var(--text-tertiary)",
                }}
              >
                {kitName}
              </p>
              {items.map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between gap-3 py-2 text-[14px]"
                  style={{
                    fontFamily: "var(--font-barlow), sans-serif",
                    color: "var(--text-primary)",
                  }}
                >
                  <span>
                    {item.itemName} · {item.material ?? "—"}
                  </span>
                  <span className="flex items-center gap-3">
                    <span className="font-medium">
                      {item.priceUsd != null ? formatUsdReference(item.priceUsd) : "Cotizar"}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeItem(item.key)}
                      aria-label={`Quitar ${item.itemName}`}
                      className="text-[18px] leading-none"
                      style={{ color: "var(--text-tertiary)" }}
                    >
                      ×
                    </button>
                  </span>
                </div>
              ))}

              {showEmailForm && (
                <form onSubmit={handleEmailSubmit} className="mt-4 flex flex-col gap-3">
                  <div className="flex flex-col gap-3 md:flex-row">
                    <input
                      type="text"
                      name="nombre"
                      value={emailForm.nombre}
                      onChange={handleEmailChange}
                      placeholder="Nombre completo"
                      aria-label="Nombre completo"
                      style={fieldStyle}
                      className="flex-1"
                    />
                    <input
                      type="email"
                      name="email"
                      value={emailForm.email}
                      onChange={handleEmailChange}
                      placeholder="Email"
                      aria-label="Email"
                      style={fieldStyle}
                      className="flex-1"
                    />
                    <input
                      type="tel"
                      name="telefono"
                      value={emailForm.telefono}
                      onChange={handleEmailChange}
                      placeholder="Teléfono"
                      aria-label="Teléfono"
                      style={fieldStyle}
                      className="flex-1"
                    />
                  </div>

                  {emailStatus === "error" && (
                    <p
                      className="text-[13px]"
                      style={{ color: "#c0392b", fontFamily: "var(--font-barlow), sans-serif" }}
                    >
                      {emailError}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={emailStatus === "loading" || emailStatus === "success"}
                    className="h-11 w-full text-[14px] font-medium uppercase transition-colors disabled:cursor-not-allowed md:w-auto md:px-8"
                    style={{
                      fontFamily: "var(--font-oswald), sans-serif",
                      background:
                        emailStatus === "success" ? "var(--bg-surface-2)" : "var(--text-primary)",
                      color:
                        emailStatus === "success" ? "var(--text-primary)" : "var(--text-primary-w)",
                      border: emailStatus === "success" ? "1px solid var(--border-default)" : "none",
                    }}
                  >
                    {emailStatus === "loading" && "ENVIANDO..."}
                    {emailStatus === "success" && "✓ SOLICITUD ENVIADA"}
                    {(emailStatus === "idle" || emailStatus === "error") && "ENVIAR SOLICITUD →"}
                  </button>
                </form>
              )}
            </div>
          )}

          <div className="flex items-center justify-between gap-4 px-5 py-3 md:px-10">
            <button type="button" onClick={() => setExpanded((v) => !v)} className="text-left">
              <p
                className="text-[12px] font-medium uppercase tracking-[1.5px]"
                style={{
                  fontFamily: "var(--font-oswald), sans-serif",
                  color: "var(--text-tertiary)",
                }}
              >
                {items.length} pieza{items.length !== 1 ? "s" : ""} seleccionada
                {items.length !== 1 ? "s" : ""}
              </p>
              <p
                className="text-[16px] font-medium"
                style={{
                  fontFamily: "var(--font-oswald), sans-serif",
                  color: "var(--text-primary)",
                }}
              >
                {subtotal > 0 ? formatUsdReference(subtotal) : "—"}
                {pendingCount > 0 ? ` · ${pendingCount} a cotizar` : ""}
              </p>
            </button>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleWhatsApp}
                className="h-11 px-4 text-[13px] font-medium uppercase transition-colors md:px-6"
                style={{
                  fontFamily: "var(--font-oswald), sans-serif",
                  background: "#25D366",
                  color: "#0c0d0d",
                }}
              >
                WhatsApp
              </button>
              <button
                type="button"
                onClick={() => {
                  setExpanded(true);
                  setShowEmailForm(true);
                }}
                className="h-11 px-4 text-[13px] font-medium uppercase transition-colors md:px-6"
                style={{
                  fontFamily: "var(--font-oswald), sans-serif",
                  background: "var(--text-primary)",
                  color: "var(--text-primary-w)",
                }}
              >
                Correo
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
