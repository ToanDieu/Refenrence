export function isNumber(value: string): boolean {
  return !Number.isNaN(+value);
}
