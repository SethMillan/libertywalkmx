"""
SCRAPER LIBERTY WALK MX — con Selenium
========================================
Usa Selenium porque el sitio carga kits dinámicamente con JavaScript
(infinite scroll / botón "Load More").

requests + BeautifulSoup solo ve el HTML inicial.
Selenium abre un navegador real y puede hacer scroll o clicks.

Instalación:
    pip install selenium beautifulsoup4
    
    Además necesitas ChromeDriver:
    - Opción fácil: pip install webdriver-manager
    - O descarga manualmente desde https://chromedriver.chromium.org

Uso:
    python scraper_lbwmx_selenium.py

Salida:
    lbwmx_catalog.csv
"""

import sys
import time
import csv
import subprocess
import os
import tempfile

# Forzar UTF-8 en la consola de Windows para evitar errores con emojis
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, NoSuchElementException

try:
    # Si tienes webdriver-manager instalado (recomendado)
    from webdriver_manager.chrome import ChromeDriverManager
    USE_WEBDRIVER_MANAGER = True
except ImportError:
    USE_WEBDRIVER_MANAGER = False


# ─────────────────────────────────────────────────────────────────
# CONFIGURACIÓN
# ─────────────────────────────────────────────────────────────────

BASE_URL = "https://libertywalk.co.jp"  # ← ajusta al dominio real

# URLs de marca del sitio Liberty Walk MX.
# Formato: /car_brands/<slug_marca>/
# Si alguna URL no carga kits, el script la omite automaticamente con un warning.
BRAND_URLS = {
    # JDM
    "Nissan":              f"{BASE_URL}/car_brands/nissan/",
    "Toyota":              f"{BASE_URL}/car_brands/toyota/",
    "Lexus":               f"{BASE_URL}/car_brands/lexus/",
    "Honda":               f"{BASE_URL}/car_brands/honda/",
    "Mazda":               f"{BASE_URL}/car_brands/mazda/",
    "Suzuki":              f"{BASE_URL}/car_brands/suzuki/",
    "Daihatsu":            f"{BASE_URL}/car_brands/daihatsu/",
    "Subaru":              f"{BASE_URL}/car_brands/subaru/",
    # Europeos - superdeportivos
    "Lamborghini":         f"{BASE_URL}/car_brands/lamborghini/",
    "Ferrari":             f"{BASE_URL}/car_brands/ferrari/",
    "McLaren":             f"{BASE_URL}/car_brands/mclaren/",
    "Porsche":             f"{BASE_URL}/car_brands/porsche/",
    "Maserati":            f"{BASE_URL}/car_brands/maserati/",
    "Abarth":              f"{BASE_URL}/car_brands/abarth/",
    # Europeos - premium
    "BMW":                 f"{BASE_URL}/car_brands/bmw/",
    "Mercedes-Benz":       f"{BASE_URL}/car_brands/benz/",
    "Audi":                f"{BASE_URL}/car_brands/audi/",
    "Mini":                f"{BASE_URL}/car_brands/mini/",
    # Americanos
    "Chevrolet":           f"{BASE_URL}/car_brands/chevrolet/",
    "Ford":                f"{BASE_URL}/car_brands/ford/",
    "Dodge":               f"{BASE_URL}/car_brands/dodge/",
    "Jeep":                f"{BASE_URL}/car_brands/jeep/",
    # EV
    "Tesla":               f"{BASE_URL}/car_brands/tesla/",
    # Camiones pesados
    "Mitsubishi Fuso":     f"{BASE_URL}/car_brands/mitsubishi/",
    "UD Trucks":           f"{BASE_URL}/car_brands/ud/",
    "Hino":                f"{BASE_URL}/car_brands/hino/",
    "Isuzu":               f"{BASE_URL}/car_brands/isuzu/",
    # Motos / triciclos
    "Harley-Davidson":     f"{BASE_URL}/car_brands/harley-davidson/",
}

OUTPUT_FILE = "lbwmx_catalog.csv"
APPEND_MODE = True  # True = agrega al CSV/MD existente, False = sobreescribe

# Cuántos segundos esperar entre páginas de marca (respetuoso con el servidor)
DELAY_BETWEEN_BRANDS = 2.0

# Cuántos segundos esperar después de cada scroll / load more
DELAY_AFTER_SCROLL = 1.5

# Máximo de intentos de scroll antes de asumir que ya cargó todo
MAX_SCROLL_ATTEMPTS = 30


# ─────────────────────────────────────────────────────────────────
# MAPEO DE CLASES → NOMBRES LEGIBLES
# ─────────────────────────────────────────────────────────────────

LINE_MAP = {
    "lb-works":             "LB-WORKS",
    "lb-silhouette-works":  "LB-Silhouette WORKS GT",
    "lb-performance":       "LB★PERFORMANCE",
    "lb-nation":            "lb★nation",
    "lb-stance":            "lb★nation",        # lb-stance = lb★nation en este sitio
    "lb-works-suv":         "LB-WORKS SUV",
    "lb-e-works":           "LB-E-WORKS",
    "lb-trucks":            "LB-TRUCKS",
    "lb-kaido":             "LB-KAIDO WORKS",
    "lb-classics":          "LB-CLASSICS",      # linea nueva encontrada en el HTML
    "limited-edition":      "Limited Edition",
    "manage-new":           None,               # clase interna de WP, ignorar
}


# ─────────────────────────────────────────────────────────────────
# CONFIGURAR SELENIUM
# ─────────────────────────────────────────────────────────────────

BRAVE_EXE = r"C:\Program Files\BraveSoftware\Brave-Browser\Application\brave.exe"

_port_counter = [9300]  # puerto base para cada instancia


def create_driver():
    """
    Lanza Brave en un puerto de depuracion fijo y conecta Selenium a el.

    Brave crashea cuando ChromeDriver lo lanza con --remote-debugging-port=0,
    asi que lo lanzamos directamente y Selenium se conecta al proceso ya corriendo.
    """
    port = _port_counter[0]
    _port_counter[0] += 1

    tmp_profile = os.path.join(tempfile.gettempdir(), f"brave_scraper_{port}")
    os.makedirs(tmp_profile, exist_ok=True)

    brave_proc = subprocess.Popen([
        BRAVE_EXE,
        "--headless=new",
        "--no-sandbox",
        "--disable-gpu",
        "--disable-extensions",
        "--no-first-run",
        "--window-size=1920,1080",
        f"--user-data-dir={tmp_profile}",
        f"--remote-debugging-port={port}",
    ])

    # Esperar a que el puerto esté escuchando (max 10 s)
    import socket
    deadline = time.time() + 10
    while time.time() < deadline:
        if brave_proc.poll() is not None:
            raise RuntimeError(f"Brave crasheo al arrancar (puerto {port})")
        try:
            with socket.create_connection(("localhost", port), timeout=1):
                break
        except OSError:
            time.sleep(0.5)
    else:
        brave_proc.terminate()
        raise RuntimeError(f"Brave no abrio el puerto {port} en 10 s")

    options = Options()
    options.add_experimental_option("debuggerAddress", f"localhost:{port}")

    if USE_WEBDRIVER_MANAGER:
        service = Service(ChromeDriverManager(driver_version="150").install())
        driver = webdriver.Chrome(service=service, options=options)
    else:
        driver = webdriver.Chrome(options=options)

    driver._brave_proc = brave_proc
    return driver


# ─────────────────────────────────────────────────────────────────
# CARGAR TODOS LOS KITS DE UNA PÁGINA (scroll / load more)
# ─────────────────────────────────────────────────────────────────

def load_all_kits(driver):
    """
    Hace scroll hasta el final de la página repetidamente
    hasta que no aparezcan más kits nuevos.
    
    Hay dos patrones comunes en Elementor:
    1. Infinite scroll: al llegar al final carga más automáticamente.
    2. Botón "Load More": hay que hacer click en un botón.
    
    Esta función maneja ambos casos.
    """
    last_kit_count = 0
    attempts = 0

    while attempts < MAX_SCROLL_ATTEMPTS:

        # ── Intentar click en botón "Load More" si existe ────────
        # Elementor suele usar estas clases para el botón
        try:
            load_more_btn = driver.find_element(
                By.CSS_SELECTOR,
                "button.e-load-more-button, a.e-load-more-button, .elementor-button.e-load-more"
            )
            if load_more_btn.is_displayed() and load_more_btn.is_enabled():
                driver.execute_script("arguments[0].click();", load_more_btn)
                print(f"     🖱️  Click en 'Load More'")
                time.sleep(DELAY_AFTER_SCROLL)
        except NoSuchElementException:
            # No hay botón → intentar con scroll
            driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
            time.sleep(DELAY_AFTER_SCROLL)

        # ── Contar cuántos kits hay ahora ────────────────────────
        current_kits = driver.find_elements(By.CSS_SELECTOR, "div.e-loop-item")
        current_count = len(current_kits)

        if current_count == last_kit_count:
            # No aparecieron nuevos kits → llegamos al final
            attempts += 1
            if attempts >= 3:
                # Confirmamos que no hay más después de 3 intentos sin cambio
                break
        else:
            # Aparecieron nuevos → seguir
            print(f"     ↓  Cargados: {current_count} kits...")
            last_kit_count = current_count
            attempts = 0  # reset del contador de intentos fallidos

    # Esperar que termine cualquier animación pendiente
    time.sleep(1.0)
    return last_kit_count


# ─────────────────────────────────────────────────────────────────
# PARSEO DE CLASES
# ─────────────────────────────────────────────────────────────────

def parse_product_lines(classes):
    lines = []
    for cls in classes:
        if cls.startswith("lb_brand-"):
            slug = cls.replace("lb_brand-", "")
            mapped = LINE_MAP.get(slug)
            if mapped is None:
                continue
            if mapped and mapped not in lines:
                lines.append(mapped)
    return lines


def is_new(classes):
    return "manage-new" in classes


# ─────────────────────────────────────────────────────────────────
# PARSEO DE KITS DEL HTML
# ─────────────────────────────────────────────────────────────────

def parse_kits_from_html(html, brand_name):
    """
    Igual que antes pero recibe el HTML ya completo
    (después de que Selenium cargó todo) y el nombre de la marca
    (lo sabemos porque venimos de una URL de marca específica).
    """
    soup = BeautifulSoup(html, "html.parser")
    kits = []

    items = soup.select("div.e-loop-item")

    for item in items:
        classes = item.get("class", [])

        # Líneas de producto
        product_lines = parse_product_lines(classes)
        primary_line  = product_lines[0] if product_lines else "Sin línea"
        extra_lines   = product_lines[1:] if len(product_lines) > 1 else []

        # ¿Es nuevo?
        kit_is_new = is_new(classes)

        # Nombre
        name_tag = item.select_one("h3.elementor-heading-title")
        name = name_tag.text.strip() if name_tag else "Sin nombre"

        # URL del kit
        link_tag = item.select_one(".elementor-widget-image a")
        kit_url  = link_tag["href"] if link_tag else None

        # Imagen (src principal)
        img_tag   = item.select_one(".elementor-widget-image img")
        image_url = img_tag["src"] if img_tag else None

        # Imagen HD (mayor resolución del srcset)
        image_hd = None
        if img_tag and img_tag.get("srcset"):
            srcset_parsed = []
            for entry in img_tag["srcset"].split(","):
                parts = entry.strip().split(" ")
                if len(parts) == 2:
                    try:
                        width = int(parts[1].replace("w", ""))
                        srcset_parsed.append((width, parts[0]))
                    except ValueError:
                        pass
            if srcset_parsed:
                srcset_parsed.sort(key=lambda x: x[0], reverse=True)
                image_hd = srcset_parsed[0][1]

        # Badges (excluyendo "NEW" porque ya está en su columna)
        badge_tags = item.select("span.elementor-button-text")
        badges = [
            b.text.strip()
            for b in badge_tags
            if b.text.strip().upper() != "NEW"
        ]

        kits.append({
            "name":         name,
            "brand":        brand_name,
            "product_line": primary_line,
            "extra_lines":  " | ".join(extra_lines),
            "is_new":       "Sí" if kit_is_new else "No",
            "badges":       " | ".join(badges),
            "kit_url":      kit_url,
            "image_url":    image_url,
            "image_hd_url": image_hd,
        })

    return kits


# ─────────────────────────────────────────────────────────────────
# GUARDAR CSV
# ─────────────────────────────────────────────────────────────────

def merge_rows_by_key(existing_rows, new_rows, key_fields):
    """
    Combina filas existentes con filas nuevas, reemplazando (no duplicando)
    las existentes cuya clave coincide con alguna fila nueva.

    Esto permite correr el scraper varias veces sin acumular duplicados:
    los kits vueltos a scrapear se actualizan, los que no se tocaron esta
    corrida (ej. una marca que fallo) se conservan tal cual estaban.
    """
    new_keys = {tuple(row.get(f, "") for f in key_fields) for row in new_rows}
    kept = [
        row for row in existing_rows
        if tuple(row.get(f, "") for f in key_fields) not in new_keys
    ]
    return kept + new_rows


def save_to_csv(kits, filename):
    if not kits:
        print("\n⚠️  No hay datos para guardar.")
        return kits

    import os
    fieldnames = list(kits[0].keys())
    file_exists = os.path.isfile(filename)

    merged = kits
    if APPEND_MODE and file_exists:
        with open(filename, "r", newline="", encoding="utf-8") as f:
            existing_rows = list(csv.DictReader(f))
        merged = merge_rows_by_key(existing_rows, kits, ["kit_url"])

    with open(filename, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(merged)

    print(f"\n✅ CSV guardado: '{filename}' ({len(merged)} kits totales, {len(kits)} procesados en esta corrida)")
    return merged


# ─────────────────────────────────────────────────────────────────
# RESUMEN
# ─────────────────────────────────────────────────────────────────

def print_summary(kits):
    if not kits:
        return

    print("\n" + "─" * 50)
    print("RESUMEN")
    print("─" * 50)
    print(f"\n📦 Total de kits: {len(kits)}")

    brands = {}
    for kit in kits:
        b = kit["brand"]
        brands[b] = brands.get(b, 0) + 1

    print(f"\n🚗 Por marca:")
    for brand, count in sorted(brands.items(), key=lambda x: -x[1]):
        print(f"   {brand:<20} {count} kits")

    lines = {}
    for kit in kits:
        l = kit["product_line"]
        lines[l] = lines.get(l, 0) + 1

    print(f"\n🏷️  Por linea de producto:")
    for line, count in sorted(lines.items(), key=lambda x: -x[1]):
        print(f"   {line:<30} {count} kits")

    new_kits = [k for k in kits if k["is_new"] == "Sí"]
    if new_kits:
        print(f"\n🆕 Nuevos ({len(new_kits)}):")
        for k in new_kits:
            print(f"   • {k['name']}")

    special = [k for k in kits if k["badges"]]
    if special:
        print(f"\n⭐ Con badges especiales ({len(special)}):")
        for k in special:
            print(f"   • {k['name']} → {k['badges']}")


def save_to_md(kits, filename):
    """
    Genera un reporte en Markdown con:
    - Resumen general (total, por marca, por linea)
    - Detalle por marca: cada kit encontrado con su linea, si es nuevo y badges
    - Marcas que no devolvieron resultados
    """
    from datetime import datetime

    brands = {}
    for kit in kits:
        b = kit["brand"]
        if b not in brands:
            brands[b] = []
        brands[b].append(kit)

    lines = {}
    for kit in kits:
        l = kit["product_line"]
        lines[l] = lines.get(l, 0) + 1

    new_kits  = [k for k in kits if k["is_new"] == "Sí"]
    special   = [k for k in kits if k["badges"]]
    empty_brands = [b for b in BRAND_URLS if b not in brands]

    lines_md = []
    now = datetime.now().strftime("%Y-%m-%d %H:%M")

    # ── Encabezado ──────────────────────────────────────────────
    lines_md.append("# Reporte de Scraping — Liberty Walk MX")
    lines_md.append(f"**Fecha:** {now}  ")
    lines_md.append(f"**Fuente:** libertywalk.co.jp  ")
    lines_md.append(f"**Archivo CSV:** lbwmx_catalog.csv")
    lines_md.append("")

    # ── Resumen general ──────────────────────────────────────────
    lines_md.append("---")
    lines_md.append("")
    lines_md.append("## Resumen general")
    lines_md.append("")
    lines_md.append(f"| Concepto | Total |")
    lines_md.append(f"|---|---|")
    lines_md.append(f"| Kits extraidos | **{len(kits)}** |")
    lines_md.append(f"| Marcas con resultados | **{len(brands)}** |")
    lines_md.append(f"| Marcas sin resultados | **{len(empty_brands)}** |")
    lines_md.append(f"| Kits marcados como NEW | **{len(new_kits)}** |")
    lines_md.append(f"| Kits con badges especiales | **{len(special)}** |")
    lines_md.append("")

    # ── Por marca ────────────────────────────────────────────────
    lines_md.append("## Kits por marca")
    lines_md.append("")
    lines_md.append("| Marca | Kits |")
    lines_md.append("|---|---|")
    for brand, brand_kits in sorted(brands.items(), key=lambda x: -len(x[1])):
        lines_md.append(f"| {brand} | {len(brand_kits)} |")
    lines_md.append("")

    # ── Por linea de producto ────────────────────────────────────
    lines_md.append("## Kits por linea de producto")
    lines_md.append("")
    lines_md.append("| Linea | Kits |")
    lines_md.append("|---|---|")
    for line, count in sorted(lines.items(), key=lambda x: -x[1]):
        lines_md.append(f"| {line} | {count} |")
    lines_md.append("")

    # ── Detalle por marca ────────────────────────────────────────
    lines_md.append("---")
    lines_md.append("")
    lines_md.append("## Detalle por marca")
    lines_md.append("")

    for brand, brand_kits in sorted(brands.items()):
        lines_md.append(f"### {brand} ({len(brand_kits)} kits)")
        lines_md.append("")
        lines_md.append("| Kit | Linea | Nuevo | Badges | URL |")
        lines_md.append("|---|---|---|---|---|")
        for kit in brand_kits:
            name    = kit["name"]
            line    = kit["product_line"]
            is_new  = "✅" if kit["is_new"] == "Sí" else ""
            badges  = kit["badges"] if kit["badges"] else ""
            url     = f"[ver]({kit['kit_url']})" if kit["kit_url"] else ""
            lines_md.append(f"| {name} | {line} | {is_new} | {badges} | {url} |")
        lines_md.append("")

    # ── Kits nuevos ──────────────────────────────────────────────
    if new_kits:
        lines_md.append("---")
        lines_md.append("")
        lines_md.append(f"## Kits nuevos ({len(new_kits)})")
        lines_md.append("")
        for kit in new_kits:
            url = f"[{kit['name']}]({kit['kit_url']})" if kit["kit_url"] else kit["name"]
            lines_md.append(f"- {url} — *{kit['brand']} / {kit['product_line']}*")
        lines_md.append("")

    # ── Badges especiales ────────────────────────────────────────
    if special:
        lines_md.append("---")
        lines_md.append("")
        lines_md.append(f"## Kits con badges especiales ({len(special)})")
        lines_md.append("")
        lines_md.append("| Kit | Marca | Badge |")
        lines_md.append("|---|---|---|")
        for kit in special:
            lines_md.append(f"| {kit['name']} | {kit['brand']} | {kit['badges']} |")
        lines_md.append("")

    # ── Marcas sin resultados ────────────────────────────────────
    if empty_brands:
        lines_md.append("---")
        lines_md.append("")
        lines_md.append(f"## Marcas sin resultados ({len(empty_brands)})")
        lines_md.append("")
        lines_md.append("> Estas marcas no devolvieron kits. Puede que la URL sea incorrecta o que no haya kits publicados.")
        lines_md.append("")
        for b in sorted(empty_brands):
            lines_md.append(f"- {b}: `{BRAND_URLS.get(b, 'URL desconocida')}`")
        lines_md.append("")

    # El reporte siempre refleja el estado actual completo (no se acumula
    # con corridas viejas — eso duplicaba secciones enteras en cada run).
    with open(filename, "w", encoding="utf-8") as f:
        f.write("\n".join(lines_md))
    print(f"\n📄 Reporte MD guardado: '{filename}'")


# ─────────────────────────────────────────────────────────────────
# SCRAPING DE DETALLE: PRECIOS Y PIEZAS POR KIT
# ─────────────────────────────────────────────────────────────────

def parse_kit_detail(driver, kit_url):
    """
    Entra a la pagina individual de un kit y extrae:
    - Kit(s) completo(s) con variantes de material y precio
    - Piezas individuales con variantes de material y precio
    - Galeria de imagenes (todas las fotos del carrusel)

    Los datos estan en atributos data-* de los labels, sin necesidad
    de parsear texto — es la forma mas confiable de extraerlos.

    Ejemplo de HTML del kit completo:
        <label class="lb-bodykit-complete__price-item"
               data-name="LB-WORKS LC500 complete kit - FRP"
               data-price-usd="13380">
          <span class="lb-bodykit-complete__material">FRP</span>
        </label>

    Ejemplo de HTML de pieza individual:
        <label class="lb-bodykit-single-parts__price-item"
               data-name="LB Front Diffuser - FRP"
               data-price-usd="2160">
          <span class="lb-bodykit-single-parts__material">FRP</span>
        </label>
    """
    try:
        driver.get(kit_url)
        # Esperar a que cargue el contenido de precios
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located(
                (By.CSS_SELECTOR, ".lb-bodykit-complete__price-item, .lb-bodykit-single-parts__price-item")
            )
        )
        time.sleep(1.0)
    except TimeoutException:
        return None

    soup = BeautifulSoup(driver.page_source, "html.parser")

    # ── TÍTULO DEL KIT ───────────────────────────────────────────
    title_tag = soup.select_one("h1.elementor-heading-title")
    kit_title = title_tag.text.strip() if title_tag else ""

    # ── GALERÍA DE IMÁGENES ──────────────────────────────────────
    # El carrusel tiene slides duplicados (para el loop), usamos
    # data-swiper-slide-index para deduplicar y ordenar
    seen_indices = set()
    gallery_images = []
    for slide in soup.select(".swiper-slide"):
        idx = slide.get("data-swiper-slide-index")
        if idx is None or idx in seen_indices:
            continue
        seen_indices.add(idx)
        img = slide.select_one("img.swiper-slide-image")
        if img and img.get("src"):
            gallery_images.append({
                "slide_index": int(idx),
                "url": img["src"],
                "alt": img.get("alt", "")
            })
    gallery_images.sort(key=lambda x: x["slide_index"])

    # ── KIT(S) COMPLETO(S) ───────────────────────────────────────
    # Cada label es una variante: mismo kit, diferente material/precio
    # Agrupamos por nombre base (sin " - FRP" al final)
    complete_kits = {}
    for label in soup.select(".lb-bodykit-complete__price-item"):
        full_name  = label.get("data-name", "").strip()
        price_usd  = label.get("data-price-usd", "")
        price_jpy  = label.get("data-price-jpy", "")
        material_tag = label.select_one(".lb-bodykit-complete__material")
        material = material_tag.text.strip() if material_tag else ""

        # Nombre base: quitar " - MATERIAL" del final
        base_name = full_name
        if " - " in full_name:
            base_name = full_name.rsplit(" - ", 1)[0].strip()

        if base_name not in complete_kits:
            complete_kits[base_name] = {
                "name": base_name,
                "variants": []
            }
        complete_kits[base_name]["variants"].append({
            "material":  material,
            "price_usd": float(price_usd) if price_usd else None,
            "price_jpy": float(price_jpy) if price_jpy else None,
        })

    # ── PIEZAS INDIVIDUALES ──────────────────────────────────────
    # Cada grupo de labels con el mismo nombre base = una pieza
    # con multiples variantes de material
    single_parts = {}
    for label in soup.select(".lb-bodykit-single-parts__price-item"):
        full_name  = label.get("data-name", "").strip()
        price_usd  = label.get("data-price-usd", "")
        price_jpy  = label.get("data-price-jpy", "")
        material_tag = label.select_one(".lb-bodykit-single-parts__material")
        material = material_tag.text.strip() if material_tag else ""

        # Nombre base: quitar " - MATERIAL" del final
        base_name = full_name
        if " - " in full_name:
            base_name = full_name.rsplit(" - ", 1)[0].strip()

        if base_name not in single_parts:
            single_parts[base_name] = {
                "name": base_name,
                "variants": []
            }
        single_parts[base_name]["variants"].append({
            "material":  material,
            "price_usd": float(price_usd) if price_usd else None,
            "price_jpy": float(price_jpy) if price_jpy else None,
        })

    return {
        "kit_title":      kit_title,
        "kit_url":        kit_url,
        "gallery":        gallery_images,
        "complete_kits":  list(complete_kits.values()),
        "single_parts":   list(single_parts.values()),
    }


def flatten_detail_to_csv_rows(kit_card, detail):
    """
    Convierte el detalle de un kit en filas planas para el CSV.
    Una fila por cada variante de precio (kit completo o pieza individual).

    Columnas:
        brand, kit_name, kit_url, is_new, badges,
        type (COMPLETE / SINGLE_PART),
        item_name, material, price_usd, price_jpy,
        image_primary, image_hd, gallery_count
    """
    rows = []
    brand    = kit_card.get("brand", "")
    kit_name = detail.get("kit_title") or kit_card.get("name", "")
    kit_url  = detail.get("kit_url", "")
    is_new   = kit_card.get("is_new", "No")
    badges   = kit_card.get("badges", "")

    # Imagen primaria del listado
    image_primary = kit_card.get("image_url", "")
    image_hd      = kit_card.get("image_hd_url", "")
    gallery_count = len(detail.get("gallery", []))

    base = {
        "brand":         brand,
        "kit_name":      kit_name,
        "kit_url":       kit_url,
        "is_new":        is_new,
        "badges":        badges,
        "image_primary": image_primary,
        "image_hd":      image_hd,
        "gallery_count": gallery_count,
    }

    # Kits completos
    for ck in detail.get("complete_kits", []):
        for v in ck.get("variants", []):
            rows.append({
                **base,
                "type":       "COMPLETE",
                "item_name":  ck["name"],
                "material":   v["material"],
                "price_usd":  v["price_usd"],
                "price_jpy":  v["price_jpy"],
            })

    # Piezas individuales
    for sp in detail.get("single_parts", []):
        for v in sp.get("variants", []):
            rows.append({
                **base,
                "type":       "SINGLE_PART",
                "item_name":  sp["name"],
                "material":   v["material"],
                "price_usd":  v["price_usd"],
                "price_jpy":  v["price_jpy"],
            })

    # Si no tenia nada de precios, igual guardamos el kit basico
    if not rows:
        rows.append({
            **base,
            "type":      "",
            "item_name": kit_name,
            "material":  "",
            "price_usd": None,
            "price_jpy": None,
        })

    return rows


# ─────────────────────────────────────────────────────────────────
# GUARDAR CSV DE IMÁGENES
# ─────────────────────────────────────────────────────────────────

def save_gallery_csv(all_details, filename):
    """
    Guarda un CSV separado con todas las imagenes de galeria por kit.
    Una fila por imagen. Los kits vueltos a scrapear reemplazan sus
    filas viejas; los kits no tocados esta corrida se conservan.
    """
    import os

    rows = []
    for detail in all_details:
        for img in detail.get("gallery", []):
            rows.append({
                "kit_url":     detail["kit_url"],
                "kit_title":   detail["kit_title"],
                "slide_index": img["slide_index"],
                "image_url":   img["url"],
                "alt":         img["alt"],
            })

    if not rows:
        return

    merged = rows
    if APPEND_MODE and os.path.isfile(filename):
        with open(filename, "r", newline="", encoding="utf-8") as f:
            existing_rows = list(csv.DictReader(f))
        merged = merge_rows_by_key(existing_rows, rows, ["kit_url"])

    with open(filename, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=list(rows[0].keys()))
        writer.writeheader()
        writer.writerows(merged)

    print(f"\n🖼️  CSV de galeria guardado: '{filename}' ({len(merged)} imagenes totales)")


# ─────────────────────────────────────────────────────────────────
# FLUJO PRINCIPAL
# ─────────────────────────────────────────────────────────────────

def main():
    all_kits = []
    brand_results = {brand: 0 for brand in BRAND_URLS}  # conteo por marca

    print("=" * 50)
    print("SCRAPER LIBERTY WALK MX — Selenium")
    print("=" * 50)

    driver        = create_driver()   # driver para listados de marcas
    driver_detail = create_driver()   # driver para paginas de detalle

    try:
        # ── FASE 1: listado por marca ────────────────────────────
        for brand_name, url in BRAND_URLS.items():
            print(f"\n🚗 {brand_name}: {url}")

            driver.get(url)

            try:
                WebDriverWait(driver, 10).until(
                    EC.presence_of_element_located(
                        (By.CSS_SELECTOR, "div.e-loop-item")
                    )
                )
            except TimeoutException:
                print(f"   ⚠️  No se encontraron kits en {url} (puede que la URL sea incorrecta)")
                brand_results[brand_name] = 0
                continue

            total = load_all_kits(driver)
            print(f"   ✅ Total cargados: {total} kits")

            html = driver.page_source
            kits = parse_kits_from_html(html, brand_name)
            all_kits.extend(kits)
            brand_results[brand_name] = len(kits)

            print(f"   📋 Parseados: {len(kits)} kits")
            time.sleep(DELAY_BETWEEN_BRANDS)

        # ── RESUMEN FASE 1 ───────────────────────────────────────
        print_summary(all_kits)

        # ── FASE 2: detalle de kits ──────────────────────────────
        print("\n" + "=" * 50)
        print("FASE 2 — DETALLE DE KITS (precios y piezas)")
        print("=" * 50)

        all_detail_rows = []
        all_details     = []
        failed_urls     = []

        total_kits = len(all_kits)
        for i, kit_card in enumerate(all_kits, 1):
            kit_url = kit_card.get("kit_url")
            if not kit_url:
                continue

            print(f"  [{i}/{total_kits}] {kit_card['name'][:60]}...")

            detail = parse_kit_detail(driver_detail, kit_url)

            if detail:
                all_details.append(detail)
                rows = flatten_detail_to_csv_rows(kit_card, detail)
                all_detail_rows.extend(rows)
                complete_count = sum(len(ck["variants"]) for ck in detail["complete_kits"])
                parts_count    = sum(len(sp["variants"]) for sp in detail["single_parts"])
                print(f"         completo: {complete_count} variantes | piezas: {parts_count} variantes | fotos: {len(detail['gallery'])}")
            else:
                print(f"         ⚠️  Sin datos de precios")
                failed_urls.append(kit_url)

            time.sleep(DELAY_BETWEEN_BRANDS)

        if failed_urls:
            print(f"\n⚠️  Kits sin datos ({len(failed_urls)}):")
            for u in failed_urls:
                print(f"   {u}")

            fail_log = OUTPUT_FILE.replace(".csv", "_fallos.log")
            from datetime import datetime
            with open(fail_log, "a", encoding="utf-8") as f:
                stamp = datetime.now().strftime("%Y-%m-%d %H:%M")
                for u in failed_urls:
                    f.write(f"{stamp}\t{u}\n")
            print(f"   (registrado en '{fail_log}' para seguimiento)")

        # ── GUARDAR RESULTADOS ───────────────────────────────────
        merged_kits = save_to_csv(all_kits, OUTPUT_FILE)

        detail_file = OUTPUT_FILE.replace(".csv", "_detalle.csv")
        if all_detail_rows:
            existing_detail_rows = []
            if APPEND_MODE and os.path.isfile(detail_file):
                with open(detail_file, "r", newline="", encoding="utf-8") as f:
                    existing_detail_rows = list(csv.DictReader(f))
            merged_detail_rows = merge_rows_by_key(
                existing_detail_rows, all_detail_rows, ["kit_url"]
            )
            with open(detail_file, "w", newline="", encoding="utf-8") as f:
                writer = csv.DictWriter(f, fieldnames=list(all_detail_rows[0].keys()))
                writer.writeheader()
                writer.writerows(merged_detail_rows)
            print(f"\n✅ CSV de detalle guardado: '{detail_file}' ({len(merged_detail_rows)} filas totales, {len(all_detail_rows)} de esta corrida)")

        gallery_file = OUTPUT_FILE.replace(".csv", "_galeria.csv")
        save_gallery_csv(all_details, gallery_file)

        save_to_md(merged_kits, OUTPUT_FILE.replace(".csv", "_reporte.md"))

    finally:
        for d in [driver, driver_detail]:
            try:
                proc = getattr(d, "_brave_proc", None)
                d.quit()
                if proc:
                    proc.terminate()
            except Exception:
                pass
        print("\n🔒 Navegadores cerrados.")


if __name__ == "__main__":
    main()