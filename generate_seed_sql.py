"""
GENERADOR DE SEED SQL — catálogo Liberty Walk MX
==================================================
Lee lbwmx_catalog.csv, lbwmx_catalog_detalle.csv y lbwmx_catalog_galeria.csv
(la fuente completa de datos — los .md son reportes de solo lectura generados
a partir de estos mismos CSV y no traen imágenes ni todos los campos) y
escribe varios archivos .sql en seed_sql/, listos para correr en orden
contra el esquema de schema.sql: uno para catálogos (marcas/líneas/
materiales), uno para kits, uno para badges, uno para kit_items (todas las
variantes de precio) y uno para la galería de imágenes. Cada archivo es
idempotente y se puede pegar y correr en el SQL Editor de Supabase.

No requiere psycopg2 ni conexión a base de datos: solo genera texto SQL.
El SQL resultante es idempotente (usa ON CONFLICT ... DO UPDATE/NOTHING y
resuelve las FK por llave natural via subconsultas/JOIN), así que se puede
volver a generar y volver a correr después de cada scrape nuevo sin duplicar
ni pisar datos de forma incorrecta.

Uso:
    python generate_seed_sql.py
    # luego, en orden numérico, correr cada archivo de seed_sql/ contra la DB
    # (psql "$DATABASE_URL" -f seed_sql/01_lookups.sql, etc, o pegarlos en
    # el SQL Editor de Supabase uno a la vez)
"""

import csv
import os

CATALOG = "lbwmx_catalog.csv"
DETALLE = "lbwmx_catalog_detalle.csv"
GALERIA = "lbwmx_catalog_galeria.csv"
OUTPUT_DIR = "seed_sql"


def read_csv(path):
    with open(path, encoding="utf-8-sig", newline="") as f:
        return list(csv.DictReader(f))


def sql_str(value):
    value = (value or "").strip()
    if not value:
        return "NULL"
    return "'" + value.replace("'", "''") + "'"


def sql_bool(value):
    return "TRUE" if (value or "").strip().lower() in ("sí", "si", "true", "1", "yes") else "FALSE"


def sql_num(value):
    value = (value or "").strip()
    return value if value else "NULL"


def sql_int(value):
    value = (value or "").strip()
    return str(int(value)) if value else "NULL"


def parse_badge(raw_badge):
    raw_badge = (raw_badge or "").strip()
    if not raw_badge or raw_badge.lower() == "no":
        return None
    parts = [p.strip() for p in raw_badge.split("|", 1)]
    label = parts[0]
    detail = parts[1] if len(parts) > 1 and parts[1] else None
    return label, detail


def write_sql(filename, statements, wrap_transaction=True):
    out = [
        "-- ============================================================",
        "-- Seed data — catálogo Liberty Walk MX (generado automáticamente",
        "-- por generate_seed_sql.py a partir de los CSV del scraper)",
        "-- NO editar a mano: volver a correr generate_seed_sql.py",
        "-- ============================================================",
        "",
    ]
    if wrap_transaction:
        out.append("BEGIN;")
        out.append("")
    out.extend(statements)
    if wrap_transaction:
        out.append("COMMIT;")
    out.append("")
    path = os.path.join(OUTPUT_DIR, filename)
    with open(path, "w", encoding="utf-8") as f:
        f.write("\n".join(out))
    return path


def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    catalog_rows = read_csv(CATALOG)
    detalle_rows = read_csv(DETALLE)
    galeria_rows = read_csv(GALERIA)

    generated_files = []

    # ---------------------------------------------------------------
    # 01_lookups.sql — brands, product_lines, materials
    # ---------------------------------------------------------------
    brands = sorted({r["brand"].strip() for r in catalog_rows if r["brand"].strip()})
    lines = set()
    for r in catalog_rows:
        if r["product_line"].strip():
            lines.add(r["product_line"].strip())
        if r["extra_lines"].strip():
            lines.add(r["extra_lines"].strip())
    lines = sorted(lines)
    materials = sorted({r["material"].strip() for r in detalle_rows if r["material"].strip()})

    stmts = []
    stmts.append("-- brands")
    stmts.append("INSERT INTO brands (name) VALUES")
    stmts.append(",\n".join(f"    ({sql_str(b)})" for b in brands))
    stmts.append("ON CONFLICT (name) DO NOTHING;")
    stmts.append("")
    stmts.append("-- product_lines")
    stmts.append("INSERT INTO product_lines (name) VALUES")
    stmts.append(",\n".join(f"    ({sql_str(l)})" for l in lines))
    stmts.append("ON CONFLICT (name) DO NOTHING;")
    stmts.append("")
    stmts.append("-- materials")
    stmts.append("INSERT INTO materials (name) VALUES")
    stmts.append(",\n".join(f"    ({sql_str(m)})" for m in materials))
    stmts.append("ON CONFLICT (name) DO NOTHING;")
    generated_files.append(write_sql("01_lookups.sql", stmts))

    # ---------------------------------------------------------------
    # 02_kits.sql — kits + gallery_count
    # ---------------------------------------------------------------
    stmts = []
    stmts.append("-- kits")
    stmts.append("INSERT INTO kits (kit_url, name, brand_id, product_line_id, secondary_line_id,")
    stmts.append("                  is_new, image_url, image_hd_url)")
    stmts.append("SELECT v.kit_url, v.name, b.id, pl_main.id, pl_sec.id, v.is_new, v.image_url, v.image_hd_url")
    stmts.append("FROM (VALUES")
    kit_value_rows = []
    for r in catalog_rows:
        kit_value_rows.append(
            "    ({url}, {name}, {brand}, {line}, {secondary}, {is_new}, {img}, {img_hd})".format(
                url=sql_str(r["kit_url"]),
                name=sql_str(r["name"]),
                brand=sql_str(r["brand"]),
                line=sql_str(r["product_line"]),
                secondary=sql_str(r["extra_lines"]),
                is_new=sql_bool(r["is_new"]),
                img=sql_str(r["image_url"]),
                img_hd=sql_str(r["image_hd_url"]),
            )
        )
    stmts.append(",\n".join(kit_value_rows))
    stmts.append(") AS v(kit_url, name, brand_name, line_name, secondary_name, is_new, image_url, image_hd_url)")
    stmts.append("JOIN brands b ON b.name = v.brand_name")
    stmts.append("LEFT JOIN product_lines pl_main ON pl_main.name = v.line_name")
    stmts.append("LEFT JOIN product_lines pl_sec ON pl_sec.name = v.secondary_name")
    stmts.append("ON CONFLICT (kit_url) DO UPDATE SET")
    stmts.append("    name = EXCLUDED.name,")
    stmts.append("    brand_id = EXCLUDED.brand_id,")
    stmts.append("    product_line_id = EXCLUDED.product_line_id,")
    stmts.append("    secondary_line_id = EXCLUDED.secondary_line_id,")
    stmts.append("    is_new = EXCLUDED.is_new,")
    stmts.append("    image_url = EXCLUDED.image_url,")
    stmts.append("    image_hd_url = EXCLUDED.image_hd_url;")
    stmts.append("")

    gallery_count_by_url = {}
    for r in detalle_rows:
        gallery_count_by_url.setdefault(r["kit_url"], r["gallery_count"])

    stmts.append("-- gallery_count por kit (de lbwmx_catalog_detalle.csv)")
    stmts.append("UPDATE kits SET gallery_count = v.gallery_count")
    stmts.append("FROM (VALUES")
    gc_rows = [
        f"    ({sql_str(url)}, {sql_int(count)})" for url, count in gallery_count_by_url.items()
    ]
    stmts.append(",\n".join(gc_rows))
    stmts.append(") AS v(kit_url, gallery_count)")
    stmts.append("WHERE kits.kit_url = v.kit_url;")
    generated_files.append(write_sql("02_kits.sql", stmts))

    # ---------------------------------------------------------------
    # 03_badges.sql
    # ---------------------------------------------------------------
    badge_rows = []
    for r in catalog_rows:
        badge = parse_badge(r["badges"])
        if badge:
            label, detail = badge
            badge_rows.append((r["kit_url"], label, detail))

    if badge_rows:
        stmts = []
        urls = sorted({b[0] for b in badge_rows})
        url_list = ", ".join(sql_str(u) for u in urls)
        stmts.append("-- kit_badges")
        stmts.append(
            f"DELETE FROM kit_badges WHERE kit_id IN (SELECT id FROM kits WHERE kit_url IN ({url_list}));"
        )
        stmts.append("INSERT INTO kit_badges (kit_id, label, detail)")
        stmts.append("SELECT k.id, v.label, v.detail")
        stmts.append("FROM (VALUES")
        stmts.append(
            ",\n".join(
                f"    ({sql_str(url)}, {sql_str(label)}, {sql_str(detail)})"
                for url, label, detail in badge_rows
            )
        )
        stmts.append(") AS v(kit_url, label, detail)")
        stmts.append("JOIN kits k ON k.kit_url = v.kit_url;")
        generated_files.append(write_sql("03_badges.sql", stmts))

    # ---------------------------------------------------------------
    # 04_kit_items.sql — todas las variantes de precio en un solo archivo
    # ---------------------------------------------------------------
    item_rows = []
    for r in detalle_rows:
        item_rows.append(
            (
                r["kit_url"],
                r["type"],
                r["item_name"],
                r["material"],
                r["price_usd"],
                r["price_jpy"],
            )
        )

    stmts = []
    stmts.append("-- kit_items")
    stmts.append("INSERT INTO kit_items (kit_id, item_type, item_name, material_id, price_usd, price_jpy)")
    stmts.append("SELECT k.id, v.item_type, v.item_name, m.id, v.price_usd, v.price_jpy")
    stmts.append("FROM (VALUES")
    rows_sql = [
        "    ({url}, {item_type}, {item_name}, {material}, {usd}, {jpy})".format(
            url=sql_str(url),
            item_type=sql_str(item_type),
            item_name=sql_str(item_name),
            material=sql_str(material),
            usd=sql_num(usd),
            jpy=sql_num(jpy),
        )
        for url, item_type, item_name, material, usd, jpy in item_rows
    ]
    stmts.append(",\n".join(rows_sql))
    stmts.append(") AS v(kit_url, item_type, item_name, material_name, price_usd, price_jpy)")
    stmts.append("JOIN kits k ON k.kit_url = v.kit_url")
    stmts.append("LEFT JOIN materials m ON m.name = v.material_name")
    stmts.append("ON CONFLICT (kit_id, item_type, item_name, material_id) DO UPDATE SET")
    stmts.append("    price_usd = EXCLUDED.price_usd,")
    stmts.append("    price_jpy = EXCLUDED.price_jpy;")
    generated_files.append(write_sql("04_kit_items.sql", stmts))

    # ---------------------------------------------------------------
    # 05_gallery_01.sql / 05_gallery_02.sql — imágenes de galería,
    # divididas en 2 archivos de tamaño similar
    # ---------------------------------------------------------------
    gallery_rows = [
        (r["kit_url"], r["slide_index"], r["image_url"], r["alt"]) for r in galeria_rows
    ]
    midpoint = (len(gallery_rows) + 1) // 2
    gallery_halves = [gallery_rows[:midpoint], gallery_rows[midpoint:]]
    for i, half in enumerate(gallery_halves, start=1):
        stmts = []
        stmts.append(f"-- kit_gallery_images (parte {i}/{len(gallery_halves)})")
        stmts.append("INSERT INTO kit_gallery_images (kit_id, slide_index, image_url, alt)")
        stmts.append("SELECT k.id, v.slide_index, v.image_url, v.alt")
        stmts.append("FROM (VALUES")
        rows_sql = [
            "    ({url}, {slide}, {img}, {alt})".format(
                url=sql_str(url), slide=sql_int(slide), img=sql_str(img), alt=sql_str(alt)
            )
            for url, slide, img, alt in half
        ]
        stmts.append(",\n".join(rows_sql))
        stmts.append(") AS v(kit_url, slide_index, image_url, alt)")
        stmts.append("JOIN kits k ON k.kit_url = v.kit_url")
        stmts.append("ON CONFLICT (kit_id, slide_index) DO UPDATE SET")
        stmts.append("    image_url = EXCLUDED.image_url,")
        stmts.append("    alt = EXCLUDED.alt;")
        generated_files.append(write_sql(f"05_gallery_{i:02d}.sql", stmts))

    # ---------------------------------------------------------------
    # 06_verify.sql — chequeos de conteo e integridad post-carga
    # (los números esperados se calculan de los mismos CSV, así que
    # siempre quedan sincronizados con lo que se generó arriba)
    # ---------------------------------------------------------------
    complete_count = sum(1 for r in item_rows if r[1] == "COMPLETE")
    single_part_count = sum(1 for r in item_rows if r[1] == "SINGLE_PART")
    kits_with_items = len({r[0] for r in item_rows})
    kits_with_gallery = len({r[0] for r in gallery_rows})
    new_count = sum(1 for r in catalog_rows if sql_bool(r["is_new"]) == "TRUE")

    sample = catalog_rows[0]
    sample_url = sample["kit_url"]
    sample_item_count = sum(1 for r in item_rows if r[0] == sample_url)
    sample_gallery_count = sum(1 for r in gallery_rows if r[0] == sample_url)
    sample_badge = next((b for b in badge_rows if b[0] == sample_url), None)

    stmts = []
    stmts.append(
        "-- Corre cada bloque (1, 2, 3) por separado: seleccioná el texto de un"
    )
    stmts.append(
        "-- bloque y ejecutá solo esa selección. La mayoría de los editores SQL"
    )
    stmts.append(
        "-- (incluido el de Supabase) solo muestran el resultado del último"
    )
    stmts.append("-- statement corrido, no de los tres a la vez.")
    stmts.append("")
    stmts.append("-- 1) Conteos por tabla: cada fila debe decir OK")
    stmts.append("WITH checks AS (")
    checks = [
        ("brands", "(SELECT count(*) FROM brands)", len(brands)),
        ("product_lines", "(SELECT count(*) FROM product_lines)", len(lines)),
        ("materials", "(SELECT count(*) FROM materials)", len(materials)),
        ("kits", "(SELECT count(*) FROM kits)", len(catalog_rows)),
        ("kits is_new = true", "(SELECT count(*) FROM kits WHERE is_new)", new_count),
        ("kit_badges", "(SELECT count(*) FROM kit_badges)", len(badge_rows)),
        ("kit_items", "(SELECT count(*) FROM kit_items)", len(item_rows)),
        (
            "kit_items COMPLETE",
            "(SELECT count(*) FROM kit_items WHERE item_type = 'COMPLETE')",
            complete_count,
        ),
        (
            "kit_items SINGLE_PART",
            "(SELECT count(*) FROM kit_items WHERE item_type = 'SINGLE_PART')",
            single_part_count,
        ),
        ("kit_gallery_images", "(SELECT count(*) FROM kit_gallery_images)", len(gallery_rows)),
        (
            "kits con al menos 1 kit_item",
            "(SELECT count(DISTINCT kit_id) FROM kit_items)",
            kits_with_items,
        ),
        (
            "kits con al menos 1 imagen de galeria",
            "(SELECT count(DISTINCT kit_id) FROM kit_gallery_images)",
            kits_with_gallery,
        ),
    ]
    check_lines = [
        f"    SELECT {sql_str(name)} AS check_name, {expr}::int AS actual, {expected} AS expected"
        for name, expr, expected in checks
    ]
    stmts.append("\n    UNION ALL\n".join(check_lines))
    stmts.append(")")
    stmts.append("SELECT check_name, actual, expected,")
    stmts.append("       CASE WHEN actual = expected THEN 'OK' ELSE 'MISMATCH' END AS status")
    stmts.append("FROM checks")
    stmts.append("ORDER BY status DESC, check_name;")
    stmts.append("")
    stmts.append("-- 2) Integridad / datos huerfanos: todas las filas deben dar 0")
    stmts.append("SELECT 'kits sin brand_id' AS issue, count(*) AS n FROM kits WHERE brand_id IS NULL")
    stmts.append("UNION ALL")
    stmts.append("SELECT 'kit_url duplicados', count(*) - count(DISTINCT kit_url) FROM kits")
    stmts.append("UNION ALL")
    stmts.append(
        "SELECT 'kit_items con item_name vacio', count(*) FROM kit_items "
        "WHERE item_name IS NULL OR item_name = ''"
    )
    stmts.append("UNION ALL")
    stmts.append(
        "SELECT 'kit_gallery_images con image_url vacio', count(*) FROM kit_gallery_images "
        "WHERE image_url IS NULL OR image_url = ''"
    )
    stmts.append("UNION ALL")
    stmts.append(
        "SELECT 'kit_badges huerfanos (sin kit)', count(*) FROM kit_badges b "
        "LEFT JOIN kits k ON k.id = b.kit_id WHERE k.id IS NULL"
    )
    stmts.append("UNION ALL")
    stmts.append(
        "SELECT 'kit_items huerfanos (sin kit)', count(*) FROM kit_items i "
        "LEFT JOIN kits k ON k.id = i.kit_id WHERE k.id IS NULL"
    )
    stmts.append("UNION ALL")
    stmts.append(
        "SELECT 'kit_gallery_images huerfanos (sin kit)', count(*) FROM kit_gallery_images g "
        "LEFT JOIN kits k ON k.id = g.kit_id WHERE k.id IS NULL"
    )
    stmts.append(";")
    stmts.append("")
    stmts.append(f"-- 3) Muestra puntual: {sql_str(sample['name'])}")
    stmts.append(
        f"-- esperado: items_count={sample_item_count}, gallery_images_count={sample_gallery_count}, "
        f"badge={'si' if sample_badge else 'no'}"
    )
    stmts.append("SELECT k.name, k.kit_url, b.name AS brand, pl.name AS product_line,")
    stmts.append("       k.is_new, k.gallery_count,")
    stmts.append("       (SELECT count(*) FROM kit_items i WHERE i.kit_id = k.id) AS items_count,")
    stmts.append(
        "       (SELECT count(*) FROM kit_gallery_images g WHERE g.kit_id = k.id) AS gallery_images_count,"
    )
    stmts.append(
        "       (SELECT string_agg(bd.label || COALESCE(' | ' || bd.detail, ''), '; ') "
        "FROM kit_badges bd WHERE bd.kit_id = k.id) AS badges"
    )
    stmts.append("FROM kits k")
    stmts.append("JOIN brands b ON b.id = k.brand_id")
    stmts.append("LEFT JOIN product_lines pl ON pl.id = k.product_line_id")
    stmts.append(f"WHERE k.kit_url = {sql_str(sample_url)};")
    generated_files.append(write_sql("06_verify.sql", stmts, wrap_transaction=False))

    print(f"{len(generated_files)} archivos generados en {OUTPUT_DIR}/:")
    for path in generated_files:
        print(f"  {path}")
    print()
    print("Resumen:")
    print(f"  brands: {len(brands)}")
    print(f"  product_lines: {len(lines)}")
    print(f"  materials: {len(materials)}")
    print(f"  kits: {len(catalog_rows)}")
    print(f"  kit_badges: {len(badge_rows)}")
    print(f"  kit_items: {len(item_rows)}")
    print(f"  kit_gallery_images: {len(gallery_rows)}")
    print()
    print("Correr los archivos en orden numérico (01, 02, 03, 04, 05) contra la DB.")


if __name__ == "__main__":
    main()
