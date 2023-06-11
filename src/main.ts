import { readFileSync } from 'node:fs';
import {
  affectedCoordinates,
  copy,
  isOkField,
  readField,
  getFirstBranch,
  showData,
  posList,
  affectedBlock
} from './utils';
import { Cell, Digit, Field } from './type';

const shave = (field: Field): [isOk: true, shavedField: Field] | [isOk: false] => {
  let copiedField = copy(field);
  let isEdited = true;
  while (isEdited) {
    isEdited = false;
    for (const { x, y } of posList()) {
      if (copiedField[y][x].size === 1) {
        const targetVal = copiedField[y][x].values().next().value;
        for (const { x: tx, y: ty } of affectedCoordinates(x, y)) {
          if (copiedField[ty][tx].delete(targetVal)) {
            isEdited = true;
          }
        }
      } else {
        // row
        {
          const copiedCurrentCell = copy(copiedField[y][x]);
          for (let tx = 0; tx < 9; tx++) {
            if (tx === x) continue;
            copiedField[y][tx].forEach(digit => copiedCurrentCell.delete(digit));
          }
          if (copiedCurrentCell.size > 0 && copiedCurrentCell.size < copiedField[y][x].size) {
            isEdited = true;
            copiedField[y][x] = copiedCurrentCell;
          }
        }
        // colum
        {
          const copiedCurrentCell = copy(copiedField[y][x]);
          for (let ty = 0; ty < 9; ty++) {
            if (ty === y) continue;
            copiedField[ty][x].forEach(digit => copiedCurrentCell.delete(digit));
          }
          if (copiedCurrentCell.size > 0 && copiedCurrentCell.size < copiedField[y][x].size) {
            isEdited = true;
            copiedField[y][x] = copiedCurrentCell;
          }
        }
        // block
        {
          const copiedCurrentCell = copy(copiedField[y][x]);
          for (const {x: tx, y: ty } of affectedBlock(x, y)) {
            copiedField[ty][tx].forEach(digit => copiedCurrentCell.delete(digit));
          }
          if (copiedCurrentCell.size > 0 && copiedCurrentCell.size < copiedField[y][x].size) {
            isEdited = true;
            copiedField[y][x] = copiedCurrentCell;
          }
        }
      }
    }
  }
  if (isOkField(copiedField)) {
    return [true, copiedField];
  } else {
    return [false];
  }
};
const solve = (field: Field): [isOk: true, ansField: Field] | [isOk: false] => {
  const [isOkFlag, shavedField] = shave(field);
  if (!isOkFlag) return [false];
  const [isSolved, x, y, targetCell] = getFirstBranch(shavedField);
  if (isSolved) return [true, shavedField];

  for (const assumption of targetCell) {
    shavedField[y][x] = new Set([assumption]);
    const [isOkFlag, ansField] = solve(shavedField);
    if (isOkFlag) return [true, ansField];
  }
  return [false];
};

const input = readFileSync('/dev/stdin', 'utf8');
const firstField = readField(input);

const [isOk, ans] = solve(firstField);
if (isOk) {
  showData(ans);
} else {
  console.log(false);
}
