// Tipos escritos a mano para el esquema documentado en DATABASE.md.
// Si en algún momento hay acceso al CLI de Supabase, `supabase gen types typescript`
// puede reemplazar este archivo sin tocar el resto del código (mismos nombres).
//
// El catálogo solo se lee desde el sitio, así que en esas tablas
// `Insert`/`Update` son copias de `Row` — existen solo porque el generic
// `GenericTable` de @supabase/postgrest-js los exige, no porque se usen.
// `events` sí se escribe (panel /admin) y tiene tipos de escritura reales.

interface Table<Row> {
  Row: Row;
  Insert: Row;
  Update: Row;
  Relationships: [];
}

interface WritableTable<Row, Insert> {
  Row: Row;
  Insert: Insert;
  Update: Partial<Insert>;
  Relationships: [];
}

export type EventDbRow = {
  id: number;
  slug: string;
  title: string;
  event_type: string | null;
  starts_on: string;
  ends_on: string | null;
  time_label: string | null;
  venue: string | null;
  city: string;
  address: string | null;
  maps_url: string | null;
  summary: string | null;
  description: string | null;
  cover_url: string | null;
  gallery_urls: string[];
  video_url: string | null;
  external_url: string | null;
  is_published: boolean;
  featured_on_home: boolean;
  created_at: string;
  updated_at: string;
};

// Lo obligatorio al crear un evento; el resto tiene default en la base.
export type EventDbInsert = Pick<EventDbRow, "slug" | "title" | "starts_on" | "city"> &
  Partial<Omit<EventDbRow, "id" | "created_at" | "updated_at" | "slug" | "title" | "starts_on" | "city">>;

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
      // Eventos (supabase/events.sql). Se escribe desde el panel /admin.
      events: WritableTable<EventDbRow, EventDbInsert>;
      // Lista de administradores del panel (supabase/admin.sql). Solo lectura
      // desde la app: las altas se hacen en el SQL Editor.
      admin_users: Table<{ user_id: string; email: string; created_at: string }>;
    };
    Views: Record<string, never>;
    Functions: {
      // ¿La sesión actual es de un administrador? (supabase/admin.sql)
      is_admin: { Args: Record<PropertyKey, never>; Returns: boolean };
    };
  };
}
