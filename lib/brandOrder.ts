// Orden preferido de marcas: las más buscadas primero, el resto en orden
// alfabético después. Se usa en el modal de "Marcas" del catálogo
// (components/CatalogGrid.tsx) — si se necesita el mismo orden en otro
// listado de marcas, importar de aquí en vez de duplicar la lista.
export const BRAND_PRIORITY_ORDER = [
  "Nissan",
  "Lamborghini",
  "Ferrari",
  "McLaren",
  "BMW",
  "Porsche",
  "Chevrolet",
  "Honda",
  "Toyota",
  "Dodge",
  "Ford",
  "Jeep",
  "Audi",
  "Mercedes-Benz",
  "Maserati",
  "Mazda",
  "Tesla",
  "Isuzu",
];

export function brandPriorityIndex(name: string): number {
  const index = BRAND_PRIORITY_ORDER.indexOf(name);
  return index === -1 ? BRAND_PRIORITY_ORDER.length : index;
}
