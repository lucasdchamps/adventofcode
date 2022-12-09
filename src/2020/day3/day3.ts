import { DAY3_INPUT } from "./day3.input";

const TREE = "#"

type Row = string[];
type Puzzle = [Row];

type RightShift = number;
type DownShift = number;
type Slope = {
    right: RightShift;
    down: DownShift;
}

function countEncounteredTrees(puzzle: Puzzle, slope: Slope) {
    let encounteredTreesNumber = 0;
    const position = { x: 0, y: 0 };
    const puzzleHeight = puzzle.length;
    const puzzleLength = puzzle[0].length;
    
    while (position.y < puzzleHeight) {
        position.x = (position.x + slope.right) % puzzleLength;
        position.y += slope.down;

        if (puzzle[position.y] && puzzle[position.y][position.x] === TREE) {
            encounteredTreesNumber += 1;
        }
    }
    
    return encounteredTreesNumber;
}

console.log(countEncounteredTrees(DAY3_INPUT as Puzzle, { right: 3, down: 1 }));

const slope11Result = countEncounteredTrees(DAY3_INPUT as Puzzle, { right: 1, down: 1 });
const slope31Result = countEncounteredTrees(DAY3_INPUT as Puzzle, { right: 3, down: 1 });
const slope51Result = countEncounteredTrees(DAY3_INPUT as Puzzle, { right: 5, down: 1 });
const slope71Result = countEncounteredTrees(DAY3_INPUT as Puzzle, { right: 7, down: 1 });
const slope12Result = countEncounteredTrees(DAY3_INPUT as Puzzle, { right: 1, down: 2 });
console.log(slope11Result * slope31Result * slope51Result * slope71Result * slope12Result);
