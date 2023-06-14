import { Cell, Digit, Field, Option, ReadonlyField, isDigit } from './type'

export const copy = <T>(data: T): T => {
  return structuredClone(data);
};

export const createField = () => {
  const field:Cell[][] = [];
  for (let y = 0; y < 9; y++) {
    field[y] = [];
    for (let x = 0; x < 9; x++) {
      field[y][x] = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    }
  }
  return field as Field<Cell>;
};

type Pos = {x: number, y: number}

export const posList: readonly Pos[] = (() => {
  const pos: Pos[] = [];
  for (let y = 0; y < 9; y++) {
    for (let x = 0; x < 9; x++) {
      pos.push({x, y});
    }
  }
  return pos;
})();

const getAffectedColumPositions = (x: number, y: number) => {
  const pos: Pos[] = [];
  for (let iy = 0; iy < 9; iy++) {
    if (iy === y) continue;
    pos.push({ x, y: iy });
  }
  return pos;
};

const getAffectedRowPositions = (x: number, y: number) => {
  const pos: Pos[] = [];
  for (let ix = 0; ix < 9; ix++) {
    if (ix === x) continue;
    pos.push({ x: ix, y });
  }
  return pos;
};

const getAffectedBlockPositions = (x: number, y: number) => {
  const [originX, originY] = [x, y].map(v => Math.floor(v / 3) * 3);
  const pos: Pos[] = [];
  for (let dy = 0; dy < 3; dy++) {
    for (let dx = 0; dx < 3; dx++) {
      const ix = originX + dx;
      const iy = originY + dy;
      if (ix === x && iy === y) continue;
      pos.push({ x: ix, y: iy });
    }
  }
  return pos;
};

const getAffectedCoordinates = (x: number, y: number) => {
  const pos: Pos[] = [
    ...getAffectedColumPositions(x, y),
    ...getAffectedRowPositions(x, y),
  ];
  
  const [originX, originY] = [x, y].map(v => Math.floor(v / 3) * 3);
  
  for (let dy = 0; dy < 3; dy++) {
    for (let dx = 0; dx < 3; dx++) {
      const ix = originX + dx;
      const iy = originY + dy;
      if (ix === x) continue;
      if (iy === y) continue;
      pos.push({ x: ix, y: iy });
    }
  }
  return pos;
};

type Affected = {
  readonly columPositions: readonly Pos[],
  readonly rowPositions: readonly Pos[],
  readonly blockPositions: readonly Pos[],
  readonly allPositions: readonly Pos[],
}

export const affectedList = (() => {
  const field: Affected[][] = [];
  for (let y = 0; y < 9; y++) {
    field[y] = [];
    for (let x = 0; x < 9; x++) {
      field[y][x] = {
        columPositions: getAffectedColumPositions(x, y),
        rowPositions: getAffectedRowPositions(x, y),
        blockPositions: getAffectedBlockPositions(x, y),
        allPositions: getAffectedCoordinates(x, y),
      } as const;
    }
  }
  return field as Field<Affected> as ReadonlyField<Affected>;
})();

export const isOkField = (field: Field<Cell>) => field.every(v => v.every(c => c.size !== 0));

export const getFirstBranch = (field: Field<Cell>): Option<[x: number, y: number, targetCel: Digit[]]> => {
  for (const {x, y} of posList) {
    if (field[y][x].size > 1) {
      return [true, [x, y, [...field[y][x].values()]]];
    }
  }
  return [false];
}

export const showData = (field: Field<Cell>) => {
  const lineSplitter = '---+---+---';
  const lines = field.map(l => l.map((c, i) => `${c.size === 1 ? c.values().next().value : ' '}${i === 2 || i === 5 ? '|' : ''}`).join(''));
  lines.splice(3, 0, lineSplitter);
  lines.splice(7, 0, lineSplitter);
  console.log(`${lines.join('\n')}\n`);
};

export const readField = (strField: string): Field<Cell> => {
  const data = strField
    .split('\n')
    .map(l => [...l])
    .map(l => l.map(Number))
  ;
  const field = createField();

  for (const {x, y} of posList) {
    const value = data[y][x];
    if (!isDigit(value)) continue;
    field[y][x] = new Set([value]);
  }
  return field;
};