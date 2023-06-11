export type Digit = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
export const isDigit = (value: unknown): value is Digit => {
  if (!Number.isInteger(value)) return false;
  if (value as number < 1) return false;
  if (value as number > 9) return false;
  return true;
};
export type Cell = Set<Digit>
export type Field = [
  [Cell, Cell, Cell, Cell, Cell, Cell, Cell, Cell, Cell],
  [Cell, Cell, Cell, Cell, Cell, Cell, Cell, Cell, Cell],
  [Cell, Cell, Cell, Cell, Cell, Cell, Cell, Cell, Cell],
  [Cell, Cell, Cell, Cell, Cell, Cell, Cell, Cell, Cell],
  [Cell, Cell, Cell, Cell, Cell, Cell, Cell, Cell, Cell],
  [Cell, Cell, Cell, Cell, Cell, Cell, Cell, Cell, Cell],
  [Cell, Cell, Cell, Cell, Cell, Cell, Cell, Cell, Cell],
  [Cell, Cell, Cell, Cell, Cell, Cell, Cell, Cell, Cell],
  [Cell, Cell, Cell, Cell, Cell, Cell, Cell, Cell, Cell],
];