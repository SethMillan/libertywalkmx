// Tipos escritos a mano para el esquema documentado en DATABASE.md.
// Si en algún momento hay acceso al CLI de Supabase, `supabase gen types typescript`
// puede reemplazar este archivo sin tocar el resto del código (mismos nombres).
//
// Esta app solo lee datos (nunca inserta/actualiza desde el frontend), así que
// `Insert`/`Update` son copias de `Row` — existen solo porque el generic
// `GenericTable` de @supabase/postgrest-js los exige, no porque se usen.

interface Table<Row> {
  Row: Row;
  Insert: Row;
  Update: Row;
  Relationships: [];
}

export interface Database {
  public: {
    Tables: {
      brands: Table<{ id: number; name: string }>;
      product_lines: Table<{ id: number; name: string }>;
      materials: Table<{ id: number; name: string }>;
      kits: Table<{
        id: number;
        kit_url: string;
        name: string;
        brand_id: number;
        product_line_id: number | null;
        secondary_line_id: number | null;
        is_new: boolean;
        image_url: string | null;
        image_hd_url: string | null;
        gallery_count: number;
        created_at: string;
        updated_at: string;
      }>;
      kit_badges: Table<{
        id: number;
        kit_id: number;
        label: string;
        detail: string | null;
      }>;
      kit_items: Table<{
        id: number;
        kit_id: number;
        item_type: "COMPLETE" | "SINGLE_PART";
        item_name: string;
        material_id: number | null;
        price_usd: number | null;
        price_jpy: number | null;
      }>;
      kit_gallery_images: Table<{
        id: number;
        kit_id: number;
        slide_index: number;
        image_url: string;
        alt: string | null;
      }>;
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
}
