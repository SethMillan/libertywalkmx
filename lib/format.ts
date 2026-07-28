export function formatUsdReference(n: number): string {
  return `$${n.toLocaleString("en-US", { maximumFractionDigits: 0 })} USD`;
}
