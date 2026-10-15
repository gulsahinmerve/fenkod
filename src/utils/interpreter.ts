import { CodeBlock, Direction, GridCell } from '../types/game';

export interface ExecStep {
  blockId: string;
  type: 'forward' | 'turn_right' | 'turn_left' | 'wait' | 'check_condition';
  meta?: string;
}

export function checkCondition(
  condition: string,
  playerPos: { x: number; y: number },
  direction: Direction,
  cells: GridCell[],
  gridWidth: number,
  gridHeight: number
): boolean {
  let nextX = playerPos.x;
  let nextY = playerPos.y;

  if (direction === 0) nextX += 1;
  else if (direction === 1) nextY += 1;
  else if (direction === 2) nextX -= 1;
  else if (direction === 3) nextY -= 1;

  const isOutOfBounds = nextX < 0 || nextX >= gridWidth || nextY < 0 || nextY >= gridHeight;
  const nextCell = cells.find((c) => c.x === nextX && c.y === nextY);
  const currentCell = cells.find((c) => c.x === playerPos.x && c.y === playerPos.y);

  switch (condition) {
    case 'front_is_blocked':
      return Boolean(isOutOfBounds || nextCell?.type === 'wall' || nextCell?.type === 'obstacle' || (nextCell?.type === 'question' && !nextCell.unlocked));
    case 'front_is_clear':
      return Boolean(!isOutOfBounds && (nextCell?.type === 'empty' || nextCell?.type === 'crystal' || (nextCell?.type === 'question' && nextCell.unlocked)));
    case 'on_crystal':
      return Boolean(currentCell?.type === 'crystal' && !currentCell.collected);
    case 'front_is_door':
      return Boolean(nextCell && nextCell.type === 'question' && !nextCell.unlocked);
    default:
      return false;
  }
}

/**
 * Expands nested CodeBlocks (loops, conditionals) into a flat step sequence
 * with a safe max execution limit to prevent accidental infinite loops.
 */
export function compileProgram(
  blocks: CodeBlock[],
  playerPos: { x: number; y: number },
  direction: Direction,
  cells: GridCell[],
  gridWidth: number,
  gridHeight: number,
  maxSteps = 250
): ExecStep[] {
  const steps: ExecStep[] = [];
  let simulatedPos = { ...playerPos };
  let simulatedDir = direction;
  const simulatedCells = cells.map((c) => ({ ...c }));

  function executeBlockList(blockList: CodeBlock[]) {
    for (const b of blockList) {
      if (steps.length >= maxSteps) return;

      if (b.type === 'forward') {
        const stepCount = Math.max(1, Math.min(b.stepCount || 1, 9));
        for (let s = 0; s < stepCount; s++) {
          if (steps.length >= maxSteps) return;
          steps.push({ blockId: b.id, type: 'forward' });
          let nx = simulatedPos.x;
          let ny = simulatedPos.y;
          if (simulatedDir === 0) nx += 1;
          else if (simulatedDir === 1) ny += 1;
          else if (simulatedDir === 2) nx -= 1;
          else if (simulatedDir === 3) ny -= 1;

          const target = simulatedCells.find((c) => c.x === nx && c.y === ny);
          if (target && target.type !== 'wall' && target.type !== 'obstacle') {
            simulatedPos = { x: nx, y: ny };
          }
        }
      } else if (b.type === 'turn_right' || b.type === 'turn_left' || b.type === 'wait') {
        steps.push({ blockId: b.id, type: b.type });
        if (b.type === 'turn_right') {
          simulatedDir = ((simulatedDir + 1) % 4) as Direction;
        } else if (b.type === 'turn_left') {
          simulatedDir = ((simulatedDir + 3) % 4) as Direction;
        }
      } else if (b.type === 'loop') {
        const count = Math.max(1, Math.min(b.loopCount || 2, 10));
        for (let i = 0; i < count; i++) {
          if (steps.length >= maxSteps) break;
          if (b.children && b.children.length > 0) {
            executeBlockList(b.children);
          }
        }
      } else if (b.type === 'if_condition') {
        const condMet = checkCondition(
          b.condition || 'front_is_clear',
          simulatedPos,
          simulatedDir,
          simulatedCells,
          gridWidth,
          gridHeight
        );
        steps.push({ blockId: b.id, type: 'check_condition', meta: condMet ? 'true' : 'false' });
        if (condMet && b.children && b.children.length > 0) {
          executeBlockList(b.children);
        } else if (!condMet && b.elseChildren && b.elseChildren.length > 0) {
          executeBlockList(b.elseChildren);
        }
      }
    }
  }

  executeBlockList(blocks);
  return steps;
}
