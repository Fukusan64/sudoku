import { Cell, Digit, Field, isDigit } from './type'

export const createField = () => {
  const field:Cell[][] = [];
  for (let y = 0; y < 9; y++) {
    field[y] = [];
    for (let x = 0; x < 9; x++) {
      field[y][x] = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    }
  }
  return field as Field;
};

export const posList = () => {
  const pos: {x: number, y: number}[] = [];
  for (let y = 0; y < 9; y++) {
    for (let x = 0; x < 9; x++) {
      pos.push({x, y});
    }
  }
  return pos;
};

export const copy = <T>(data: T): T => {
  return structuredClone(data);
};


export const readField = (strField: string): Field => {
  const data = strField
    .split('\n')
    .map(l => [...l])
    .map(l => l.map(Number))
  ;
  const field = createField();

  for (const {x, y} of posList()) {
    const value = data[y][x];
    if (!isDigit(value)) continue;
    field[y][x] = new Set([value]);
  }
  return field;
};

export const affectedCoordinates = (x: number, y: number) => {
  const pos: {x: number, y: number}[] = [];
  for (let iy = 0; iy < 9; iy++) {
    if (iy === y) continue;
    pos.push({ x, y: iy });
  }
  
  for (let ix = 0; ix < 9; ix++) {
    if (ix === x) continue;
    pos.push({ x: ix, y });
  }

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

export const affectedBlock = (x: number, y: number) => {
  const [originX, originY] = [x, y].map(v => Math.floor(v / 3) * 3);
  const pos: {x: number, y: number}[] = [];
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

export const isOkField = (field: Field) => field.every(v => v.every(c => c.size !== 0));

export const getFirstBranch = (field: Field): [isSolved: false, x: number, y: number, targetCel: Digit[]] | [isSolved: true] => {
  for (const {x, y} of posList()) {
    if (field[y][x].size > 1) {
      return [false, x, y, [...field[y][x].values()]];
    }
  }
  return [true];
}

export const showData = (field: Field) => {
  const lineSplitter = '---+---+---';
  const lines = field.map(l => l.map((c, i) => `${c.size === 1 ? c.values().next().value : ' '}${i === 2 || i === 5 ? '|' : ''}`).join(''));
  lines.splice(3, 0, lineSplitter);
  lines.splice(7, 0, lineSplitter);
  console.log(`${lines.join('\n')}\n`);
};
