import { cache } from "react";
import { supabase } from "@/lib/supabase";

export interface CatalogKit {
  id: number;
  name: string;
  brand: string;
  productLine: string | null;
  secondaryLine: string | null;
  isNew: boolean;
  imageUrl: string | null;
  startingPriceUsd: number | null;
  badge: { label: string; detail: string | null } | null;
  isSoldOut: boolean;
}

// El scraper no trae un flag de disponibilidad dedicado: "agotado" viene
// mezclado en el detail del badge (ej. "35 Sets SOLD OUT"), así que se
// detecta por texto en vez de por una columna propia.
function isSoldOutBadge(detail: string | null | undefined): boolean {
  return detail?.toLowerCase().includes("sold out") ?? false;
}

type CatalogKitRow = {
  id: number;
  name: string;
  brand_id: number;
  product_line_id: number | null;
  secondary_line_id: number | null;
  is_new: boolean;
  image_url: string | null;
};

function mapCatalogKits(
  kitsData: CatalogKitRow[],
  brandsData: { id: number; name: string }[],
  linesData: { id: number; name: string }[],
  badgesData: { kit_id: number; label: string; detail: string | null }[],
  completeItemsData: { kit_id: number; price_usd: number | null }[],
): CatalogKit[] {
  const brandsById = new Map(brandsData.map((b) => [b.id, b.name]));
  const linesById = new Map(linesData.map((l) => [l.id, l.name]));

  const badgesByKit = new Map<
    number,
    { label: string; detail: string | null }
  >();
  for (const b of badgesData)
    badgesByKit.set(b.kit_id, { label: b.label, detail: b.detail });

  const minPriceByKit = new Map<number, number>();
  for (const item of completeItemsData) {
    if (item.price_usd == null) continue;
    const cur = minPriceByKit.get(item.kit_id);
    if (cur == null || item.price_usd < cur)
      minPriceByKit.set(item.kit_id, item.price_usd);
  }

  return kitsData.map((k) => {
    const badge = badgesByKit.get(k.id) ?? null;
    const soldOut = isSoldOutBadge(badge?.detail);
    return {
      id: k.id,
      name: k.name,
      brand: brandsById.get(k.brand_id) ?? "—",
      productLine:
        k.product_line_id != null
          ? (linesById.get(k.product_line_id) ?? null)
          : null,
      secondaryLine:
        k.secondary_line_id != null
          ? (linesById.get(k.secondary_line_id) ?? null)
          : null,
      isNew: k.is_new,
      imageUrl: k.image_url,
      // Los kits agotados se cotizan aparte (no tiene sentido anunciar un
      // precio de referencia para algo que ya no se puede comprar).
      startingPriceUsd: soldOut ? null : (minPriceByKit.get(k.id) ?? null),
      badge,
      isSoldOut: soldOut,
    };
  });
}

export async function getCatalogKits(): Promise<CatalogKit[]> {
  const [
    { data: kitsData, error: kitsErr },
    { data: brandsData },
    { data: linesData },
    { data: badgesData },
    { data: completeItemsData },
  ] = await Promise.all([
    supabase
      .from("kits")
      .select(
        "id, name, brand_id, product_line_id, secondary_line_id, is_new, image_url",
      )
      .order("name"),
    supabase.from("brands").select("id, name"),
    supabase.from("product_lines").select("id, name"),
    supabase.from("kit_badges").select("kit_id, label, detail"),
    supabase
      .from("kit_items")
      .select("kit_id, price_usd")
      .eq("item_type", "COMPLETE")
      .not("price_usd", "is", null),
  ]);

  if (kitsErr) throw new Error(`getCatalogKits: ${kitsErr.message}`);

  return mapCatalogKits(
    kitsData ?? [],
    brandsData ?? [],
    linesData ?? [],
    badgesData ?? [],
    completeItemsData ?? [],
  );
}

// Preview del home: prioriza lo nuevo y edición limitada (de cualquier
// marca), pero sin limitarse a eso — si esa categoría no alcanza las
// `limit` piezas, se completa con marcas "exóticas" para no dejar el home
// con menos tarjetas de las que caben en la grilla ni con marcas genéricas.
const FALLBACK_BRANDS = ["Nissan", "McLaren", "Ferrari", "Lamborghini"];

export async function getFeaturedKits(limit = 6): Promise<CatalogKit[]> {
  const { data: kitsData, error: kitsErr } = await supabase
    .from("kits")
    .select(
      "id, name, brand_id, product_line_id, secondary_line_id, is_new, image_url",
    )
    .order("created_at", { ascending: false });

  if (kitsErr) throw new Error(`getFeaturedKits: ${kitsErr.message}`);

  const kitIds = (kitsData ?? []).map((k) => k.id);

  const [{ data: brandsData }, { data: linesData }, { data: badgesData }, { data: completeItemsData }] =
    await Promise.all([
      supabase.from("brands").select("id, name"),
      supabase.from("product_lines").select("id, name"),
      kitIds.length
        ? supabase
            .from("kit_badges")
            .select("kit_id, label, detail")
            .in("kit_id", kitIds)
        : Promise.resolve({ data: [] }),
      kitIds.length
        ? supabase
            .from("kit_items")
            .select("kit_id, price_usd")
            .eq("item_type", "COMPLETE")
            .not("price_usd", "is", null)
            .in("kit_id", kitIds)
        : Promise.resolve({ data: [] }),
    ]);

  const badgedKitIds = new Set((badgesData ?? []).map((b) => b.kit_id));
  const soldOutKitIds = new Set(
    (badgesData ?? [])
      .filter((b) => isSoldOutBadge(b.detail))
      .map((b) => b.kit_id),
  );
  const isPriority = (k: { id: number; is_new: boolean }) =>
    k.is_new || badgedKitIds.has(k.id);
  const fallbackBrandIds = new Set(
    (brandsData ?? [])
      .filter((b) => FALLBACK_BRANDS.includes(b.name))
      .map((b) => b.id),
  );

  // El home nunca muestra agotados. Lo nuevo/edición limitada entra sin
  // importar la marca; el relleno para llegar a `limit` sí se restringe a
  // marcas exóticas en vez de tomar lo próximo del catálogo sin más.
  const available = (kitsData ?? []).filter((k) => !soldOutKitIds.has(k.id));
  const priorityKits = available.filter(isPriority);
  const fallbackKits = available.filter(
    (k) => !isPriority(k) && fallbackBrandIds.has(k.brand_id),
  );
  const featuredKitsData = [...priorityKits, ...fallbackKits].slice(0, limit);

  return mapCatalogKits(
    featuredKitsData,
    brandsData ?? [],
    linesData ?? [],
    badgesData ?? [],
    completeItemsData ?? [],
  );
}

// Home: selección curada a mano. La sección "BODY KITS" del home muestra
// exactamente estos kits, en este orden. Se emparejan por `kit_url` (columna
// UNIQUE, el permalink de libertywalk.co.jp) porque es el único identificador
// estable: `name` se sobrescribe en cada re-scrape y los `id` SERIAL no siguen
// un orden garantizado. Un kit que no exista o esté agotado simplemente no
// aparece — la grilla es responsiva y no asume una cantidad fija.
const CURATED_HOME_KIT_URLS = [
  "https://libertywalk.co.jp/bodykit/mazda-roadster-nd/",
  "https://libertywalk.co.jp/bodykit/lb-works-audi-r8/",
  "https://libertywalk.co.jp/bodykit/nissan-fairlady-z-rz34/",
  "https://libertywalk.co.jp/bodykit/lb-works-toyota-supra-a90/",
  "https://libertywalk.co.jp/bodykit/mclaren-720s/",
  "https://libertywalk.co.jp/bodykit/lb%e2%98%85nation-toyota-86-subaru-brz/",
  "https://libertywalk.co.jp/bodykit/lamborghini-huracan/",
  "https://libertywalk.co.jp/bodykit/lb-works-porsche-997/",
  "https://libertywalk.co.jp/bodykit/lb-works-honda-nsx-nc1/",
];

export async function getCuratedHomeKits(): Promise<CatalogKit[]> {
  const { data: kitsData, error: kitsErr } = await supabase
    .from("kits")
    .select(
      "id, name, kit_url, brand_id, product_line_id, secondary_line_id, is_new, image_url",
    )
    .in("kit_url", CURATED_HOME_KIT_URLS);

  if (kitsErr) throw new Error(`getCuratedHomeKits: ${kitsErr.message}`);

  const kitIds = (kitsData ?? []).map((k) => k.id);

  const [{ data: brandsData }, { data: linesData }, { data: badgesData }, { data: completeItemsData }] =
    await Promise.all([
      supabase.from("brands").select("id, name"),
      supabase.from("product_lines").select("id, name"),
      kitIds.length
        ? supabase
            .from("kit_badges")
            .select("kit_id, label, detail")
            .in("kit_id", kitIds)
        : Promise.resolve({ data: [] }),
      kitIds.length
        ? supabase
            .from("kit_items")
            .select("kit_id, price_usd")
            .eq("item_type", "COMPLETE")
            .not("price_usd", "is", null)
            .in("kit_id", kitIds)
        : Promise.resolve({ data: [] }),
    ]);

  const soldOutKitIds = new Set(
    (badgesData ?? [])
      .filter((b) => isSoldOutBadge(b.detail))
      .map((b) => b.kit_id),
  );

  const orderIndex = (url: string) => {
    const i = CURATED_HOME_KIT_URLS.indexOf(url);
    return i === -1 ? Number.MAX_SAFE_INTEGER : i;
  };

  const orderedKits = (kitsData ?? [])
    .filter((k) => !soldOutKitIds.has(k.id))
    .sort((a, b) => orderIndex(a.kit_url) - orderIndex(b.kit_url));

  return mapCatalogKits(
    orderedKits,
    brandsData ?? [],
    linesData ?? [],
    badgesData ?? [],
    completeItemsData ?? [],
  );
}

export interface KitItemVariant {
  material: string | null;
  priceUsd: number | null;
  priceJpy: number | null;
}

export interface KitItemGroup {
  itemName: string;
  variants: KitItemVariant[];
}

export interface KitDetail {
  id: number;
  name: string;
  kitUrl: string;
  brand: string;
  productLine: string | null;
  secondaryLine: string | null;
  isNew: boolean;
  imageUrl: string | null;
  imageHdUrl: string | null;
  badge: { label: string; detail: string | null } | null;
  completeItems: KitItemGroup[];
  singleParts: KitItemGroup[];
  gallery: { slideIndex: number; imageUrl: string; alt: string | null }[];
}

function groupItems(
  rows: {
    item_name: string;
    material_id: number | null;
    price_usd: number | null;
    price_jpy: number | null;
  }[],
  materialsById: Map<number, string>,
): KitItemGroup[] {
  const groups = new Map<string, KitItemGroup>();
  for (const row of rows) {
    if (!groups.has(row.item_name))
      groups.set(row.item_name, { itemName: row.item_name, variants: [] });
    groups.get(row.item_name)!.variants.push({
      material:
        row.material_id != null
          ? (materialsById.get(row.material_id) ?? null)
          : null,
      priceUsd: row.price_usd,
      priceJpy: row.price_jpy,
    });
  }
  return Array.from(groups.values());
}

// cache() evita que generateMetadata() y la página hagan cada una su propio
// round-trip a Supabase para el mismo kit dentro del mismo request.
export const getKitDetail = cache(
  async (id: number): Promise<KitDetail | null> => {
    const { data: kit, error } = await supabase
      .from("kits")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) throw new Error(`getKitDetail: ${error.message}`);
    if (!kit) return null;

    const [
      { data: brand },
      { data: lines },
      { data: badges },
      { data: items },
      { data: gallery },
      { data: materials },
    ] = await Promise.all([
      supabase.from("brands").select("name").eq("id", kit.brand_id).maybeSingle(),
      supabase.from("product_lines").select("id, name"),
      supabase.from("kit_badges").select("label, detail").eq("kit_id", id),
      supabase
        .from("kit_items")
        .select("item_type, item_name, material_id, price_usd, price_jpy")
        .eq("kit_id", id)
        .order("id"),
      supabase
        .from("kit_gallery_images")
        .select("slide_index, image_url, alt")
        .eq("kit_id", id)
        .order("slide_index"),
      supabase.from("materials").select("id, name"),
    ]);

    const linesById = new Map((lines ?? []).map((l) => [l.id, l.name]));
    const materialsById = new Map((materials ?? []).map((m) => [m.id, m.name]));
    const allItems = items ?? [];

    return {
      id: kit.id,
      name: kit.name,
      kitUrl: kit.kit_url,
      brand: brand?.name ?? "—",
      productLine:
        kit.product_line_id != null
          ? (linesById.get(kit.product_line_id) ?? null)
          : null,
      secondaryLine:
        kit.secondary_line_id != null
          ? (linesById.get(kit.secondary_line_id) ?? null)
          : null,
      isNew: kit.is_new,
      imageUrl: kit.image_url,
      imageHdUrl: kit.image_hd_url,
      badge: badges?.[0]
        ? { label: badges[0].label, detail: badges[0].detail }
        : null,
      completeItems: groupItems(
        allItems.filter((i) => i.item_type === "COMPLETE"),
        materialsById,
      ),
      singleParts: groupItems(
        allItems.filter((i) => i.item_type === "SINGLE_PART"),
        materialsById,
      ),
      gallery: (gallery ?? []).map((g) => ({
        slideIndex: g.slide_index,
        imageUrl: g.image_url,
        alt: g.alt,
      })),
    };
  },
);
