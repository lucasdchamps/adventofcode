import { readFileSync } from "fs";

type Squares = Array<Array<string>>;

type Tile = {
    id: string;
    squares: Squares;
    adjacentTileIds?: Array<string>;
};
type Image = Record<string, Tile>;

function parseImage(tileStrings: Array<string>): Image {
    const image: Image = {};
    for (const tileString of tileStrings) {
        const idString = tileString.split("\n")[0];
        const id = idString.match(/\d+/)![0];

        const rows = tileString.split("\n").slice(1);
        const squares = rows.map(row => row.split(""));

        image[id] = { id, squares };
    }
    Object.values(image).forEach(tile => tile.adjacentTileIds = findAdjacentTileIds(image, tile));
    return image;
}

function findAdjacentTileIds(image: Image, tile: Tile): string[] {
    return Object.keys(image).filter(otherTileId => {
        if (otherTileId === tile.id) { return false; }

        let otherSquares = copySquares(image[otherTileId].squares);
        if (areSquaresMatchingAfterRotations(tile.squares, otherSquares)) { return true; }

        otherSquares = flip(otherSquares);
        if (areSquaresMatchingAfterRotations(tile.squares, otherSquares)) { return true; }
    });

    function areSquaresMatchingAfterRotations(squares: Squares, otherSquares: Squares) {
        if (areSquaresMatching(squares, otherSquares)) { return true; }

        otherSquares = rotate(otherSquares);
        if (areSquaresMatching(squares, otherSquares)) { return true; }

        otherSquares = rotate(otherSquares);
        if (areSquaresMatching(squares, otherSquares)) { return true; }

        otherSquares = rotate(otherSquares);
        if (areSquaresMatching(squares, otherSquares)) { return true; }
    }
}

function copySquares(squares: Squares): Squares {
    return [...squares.map(row => [...row])];
}

function flip(squares: Squares): Squares {
    return [...squares.map(row => [...row].reverse())];
}

function rotate(squares: Squares): Squares {
    const rotatedSquares: Squares = [];
    for (let columnIndex = 0; columnIndex < squares.length; columnIndex += 1) {
        const rotatedRow: Array<string> = [];
        for (let rowIndex = squares.length - 1; rowIndex >= 0; rowIndex -= 1) {
            rotatedRow.push(squares[rowIndex][columnIndex]);
        }
        rotatedSquares.push(rotatedRow);
    }
    return rotatedSquares;
}

function getTopCorner(squares: Squares): string {
    return squares[0].join("");
}
function getRightCorner(squares: Squares): string {
    return squares.map(row => row[row.length - 1]).join("");
}
function getBottomCorner(squares: Squares): string {
    return squares[squares.length - 1].join("");
}
function getLeftCorner(squares: Squares): string {
    return squares.map(row => row[0]).join("");
}

function areSquaresMatching(squares1: Squares, squares2: Squares) {
    return getTopCorner(squares1) === getBottomCorner(squares2) ||
        getRightCorner(squares1) === getLeftCorner(squares2) ||
        getBottomCorner(squares1) === getTopCorner(squares2) ||
        getLeftCorner(squares1) === getRightCorner(squares2);
}

function getMatchingTiles(image: Image, tile: Tile) {
    const adjacentTiles = tile.adjacentTileIds!.map(id => image[id]);
    return adjacentTiles.filter(otherTile => areSquaresMatching(tile.squares, otherTile.squares));
}

function isCornerTile(tile: Tile) {
    return tile.adjacentTileIds!.length === 2;
}

function isBorderTile(tile: Tile) {
    return tile.adjacentTileIds!.length === 3;
}

function isCenterTile(tile: Tile) {
    return tile.adjacentTileIds!.length === 4;
}

function isImageValid(image: Image) {
    const imageLength = Math.sqrt(Object.keys(image).length);
    const threeMatchesNumber = (4 * imageLength - 8);
    const fourMatchesNumber = (imageLength - 2) * (imageLength - 2);
    const numberMatchings = Object.values(image).map(tile => getMatchingTiles(image, tile).length);

    return numberMatchings.filter(n => n === 2).length === 4 &&
           numberMatchings.filter(n => n === 3).length === threeMatchesNumber &&
           numberMatchings.filter(n => n === 4).length === fourMatchesNumber;
}

function orientImage(image: Image, tileIndexesStack: Array<string>, oriented: Set<string>): boolean {
    if (isImageValid(image)) { return true; }

    let tileIndex = tileIndexesStack.shift();
    while (tileIndex && oriented.has(tileIndex)) {
        tileIndex = tileIndexesStack.shift();
    }
    if (!tileIndex) { return false; }

    const tile = image[tileIndex];
    orientTile(image, tile, oriented);
    oriented.add(tileIndex);

    const cornerTileIds = tile.adjacentTileIds!.filter(id => isCornerTile(image[id]));
    const borderTileIds = tile.adjacentTileIds!.filter(id => isBorderTile(image[id]));
    const centerTileIds = tile.adjacentTileIds!.filter(id => isCenterTile(image[id]));
    [...cornerTileIds, ...borderTileIds, ...centerTileIds].forEach(id => {
        if (oriented.has(id)) { return; }
        tileIndexesStack.push(id);
    });

    return orientImage(image, tileIndexesStack, oriented);
}

function orientTile(image: Image, tile: Tile, oriented: Set<string>) {
    const orientations = [{ squares: copySquares(tile.squares), nbMatchingTiles: getNumberMatchingTiles() }];
    fillRotatedOrientations();

    tile.squares = flip(rotate(tile.squares));
    orientations.push({ squares: copySquares(tile.squares), nbMatchingTiles: getNumberMatchingTiles() });
    fillRotatedOrientations();

    orientations.sort((o1, o2) => o2.nbMatchingTiles - o1.nbMatchingTiles);
    tile.squares = orientations[0].squares;

    function getNumberMatchingTiles() {
        return getMatchingTiles(image, tile).map(t => t.id).filter(id => oriented.has(id)).length;
    }
    function fillRotatedOrientations() {
        tile.squares = rotate(tile.squares);
        orientations.push({ squares: copySquares(tile.squares), nbMatchingTiles: getNumberMatchingTiles() });
        tile.squares = rotate(tile.squares);
        orientations.push({ squares: copySquares(tile.squares), nbMatchingTiles: getNumberMatchingTiles() });
        tile.squares = rotate(tile.squares);
        orientations.push({ squares: copySquares(tile.squares), nbMatchingTiles: getNumberMatchingTiles() });
    }
}

function computePositionedTiles(image: Image): Array<Array<Tile>> {
    const positionedTiles: Array<Array<Tile>> = [];
    const imageLength = Math.sqrt(Object.keys(image).length);
    let rowIndex = 0;
    let columnIndex = 0;
    let nextTile = findTopLeftCorner() as Tile;

    while(rowIndex < imageLength) {
        const row: Array<Tile> = [];

        while(columnIndex < imageLength) {
            row.push(nextTile);
            nextTile = findRightTile(nextTile) as Tile;
            columnIndex += 1;
        }

        positionedTiles.push(row);
        columnIndex = 0;
        nextTile = findBottomTile(positionedTiles[rowIndex][0]) as Tile;
        rowIndex += 1;
    }

    return positionedTiles;

    function findRightTile(tile: Tile): Tile | undefined {
        const adjacentTiles = tile.adjacentTileIds!.map(id => image[id]);
        const rightCorner = getRightCorner(tile.squares);
        return adjacentTiles.find(adjacentTile => getLeftCorner(adjacentTile.squares) === rightCorner);
    }
    function findBottomTile(tile: Tile): Tile | undefined {
        const adjacentTiles = tile.adjacentTileIds!.map(id => image[id]);
        const bottomCorner = getBottomCorner(tile.squares);
        return adjacentTiles.find(adjacentTile => getTopCorner(adjacentTile.squares) === bottomCorner);
    }
    function findTopLeftCorner(): Tile | undefined {
        const cornerTiles = Object.values(image).filter(isCornerTile);
        return cornerTiles.find(cornerTile => findRightTile(cornerTile) && findBottomTile(cornerTile));
    }
}

function computeFinalSquares(positionedTiles: Array<Array<Tile>>) {
    const finalSquares: Squares = [];

    positionedTiles.forEach(row => {
        row.forEach(tile => { tile.squares = removeBorders(tile.squares); })
    });

    const tileLength = positionedTiles[0][0].squares.length;
    const finalLength = tileLength * positionedTiles.length;
    let tileRowIndex = 0;
    let tileColumnIndex = 0;
    let rowIndex = 0;
    let columnIndex = 0;

    while(rowIndex < finalLength) {
        const row: Array<string> = [];

        while(columnIndex < finalLength) {
            row.push(positionedTiles[tileRowIndex][tileColumnIndex].squares[rowIndex % tileLength][columnIndex % tileLength]);
            columnIndex += 1;
            if (columnIndex % tileLength === 0) { tileColumnIndex += 1; }
        }

        finalSquares.push(row);
        columnIndex = 0;
        tileColumnIndex = 0;
        rowIndex += 1;
        if (rowIndex % tileLength === 0) { tileRowIndex += 1; }
    }


    return finalSquares;

    function removeBorders(squares: Squares): Squares {
        return squares.slice(1, squares.length - 1).map(row => row.slice(1, row.length - 1));
    }
}

function findSeaMonstersPositions(finalSquares: Squares, seaMonster: Squares): Array<[number, number]> {
    const positions: Array<[number, number]> = [];
    for (let i = 0; i < finalSquares.length; i += 1) {
        for (let j = 0; j < finalSquares.length; j += 1) {
            if (isSeaMonsterThere(i, j)) {
                positions.push([i, j]);
            }
        }
    }
    return positions;

    function isSeaMonsterThere(startRow: number, startColumn: number) {
        let squareRow = startRow;
        let squareColumn = startColumn;

        for(let monsterRow = 0; monsterRow < seaMonster.length; monsterRow += 1) {
            if (squareRow >= finalSquares.length) { return false; }

            for (let monsterColumn = 0; monsterColumn < seaMonster[monsterRow].length; monsterColumn += 1) {
                if (squareColumn >= finalSquares.length) { return false; }

                const monsterValue = seaMonster[monsterRow][monsterColumn];
                const squareValue = finalSquares[squareRow][squareColumn];
                if (monsterValue === "#" && squareValue !== "#") { return false; }

                squareColumn += 1;
            }

            squareRow += 1;
            squareColumn = startColumn;
        }

        return true;
    }
}

function computeWaterRoughness(finalSquares: Squares, seaMonsterPositions: Array<[number, number]>, seaMonster: Squares) {
    let waterRoughness = 0;
    for (let i = 0; i < finalSquares.length; i += 1) {
        for (let j = 0; j < finalSquares.length; j += 1) {
            if (seaMonsterIsThere(i, j)) { continue; }
            if (finalSquares[i][j] !== "#") { continue; }
            waterRoughness += 1;
        }
    }
    return waterRoughness;

    function seaMonsterIsThere(row: number, column: number) {
        return seaMonsterPositions.find(position => {
            const i = position[0];
            const j = position[1];
            return i <= row && row < i + seaMonster.length &&
                   j <= column && column < j + seaMonster[0].length &&
                   seaMonster[row - i][column - j] === "#";
        })
    }
}

const inputFile = readFileSync("src/day20/day20.input.txt", "utf8");
const tileStrings = inputFile.split("\n\n");
const image = parseImage(tileStrings);
const cornerTiles = Object.values(image).filter(isCornerTile)
const cornerTileIds = cornerTiles.map(tile => tile.id);
console.log(cornerTileIds);
console.log(orientImage(image, [cornerTileIds[0]], new Set()));
console.log(isImageValid(image));

const positionedTiles = computePositionedTiles(image);
let finalSquares = computeFinalSquares(positionedTiles);

const seaMonster: Squares = [
    "                  # ".split(""),
    "#    ##    ##    ###".split(""),
    " #  #  #  #  #  #   ".split("")
];

finalSquares = rotate(rotate(rotate(finalSquares)));
const seaMonsterPositions = findSeaMonstersPositions(finalSquares, seaMonster);
console.log(computeWaterRoughness(finalSquares, seaMonsterPositions, seaMonster));
