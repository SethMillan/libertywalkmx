const brands = [
  "Nissan", "BMW", "Mercedes", "Lamborghini", "Dodge",
  "Mazda", "McLaren", "Toyota", "Audi", "Ferrari", "Porsche",
];

export default function BrandsCarousel() {
  const items = [...brands, ...brands];

  return (
    <div className="relative h-[100px] md:h-[140px] w-full overflow-hidden border-b"
      style={{ background: "var(--bg-surface)", borderColor: "var(--border-default)" }}>
      <div className="flex items-center h-full animate-marquee whitespace-nowrap">
        {items.map((brand, i) => (
          <span key={`${brand}-${i}`} className="flex items-center shrink-0">
            <span className="text-[14px] md:text-[20px] font-semibold tracking-[2px] uppercase px-4 md:px-6"
              style={{ fontFamily: "var(--font-oswald), sans-serif", color: "var(--text-primary)" }}>
              {brand}
            </span>
            <span className="text-[14px] md:text-[20px] px-1" style={{ color: "var(--text-secondary)" }}>★</span>
          </span>
        ))}
      </div>
    </div>
  );
}
