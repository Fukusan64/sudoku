import { readFileSync } from 'node:fs';
import {
  affectedList,
  copy,
  isOkField,
  readField,
  getFirstBranch,
  showData,
  posList
} from './utils';
import { Cell, Field, Option } from './type';

const getUniqVal = (target: Cell, otherCells: Cell[]): Option<Cell> => {
  const t = copy(target);
  let isDeleted = false;
  otherCells.forEach(other => {
    for (const d of other) {
      if (t.delete(d)) isDeleted = true;
    }
  });

  if (isDeleted && t.size > 0) return [true, t];
  return [false];
};

const shave = (field: Field<Cell>): Option<Field<Cell>> => {
  let copiedField = copy(field);
  let isEdited = true;
  while (isEdited) {
    isEdited = false;
    posList.forEach(({ x, y }) => {
      if (copiedField[y][x].size === 1) {
        const targetVal = copiedField[y][x].values().next().value;
        affectedList[y][x].allPositions.forEach(({x, y}) => {
          if (copiedField[y][x].delete(targetVal)) isEdited = true;
        });
      } else {
        const { allPositions: _, ...positionList } = affectedList[y][x];
        Object.values(positionList).forEach(ps => {  
          const [hasAns, newCell] = getUniqVal(
            copiedField[y][x],
            ps.map(({x, y}) => copiedField[y][x]),
          );
          if (hasAns) {
            copiedField[y][x] = newCell;
            isEdited = true;
          }
        });
      }
    });
  };

  if (isOkField(copiedField)) {
    return [true, copiedField];
  } else {
    return [false];
  }
};

const solve = (field: Field<Cell>): Option<Field<Cell>> => {
  const [isOkFlag, shavedField] = shave(field);
  if (!isOkFlag) return [false];
  
  const [hasBranch, result] = getFirstBranch(shavedField);
  if (!hasBranch) return [true, shavedField];
  
  const [x, y, targetCell] = result;
  
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
