type Grid = any[][];

export class Board {
    grid: Grid;

    constructor(grid: Grid) {
        this.grid = grid;
    }

    height() {
        return this.grid.length;
    }

    length() {
        return this.grid[0].length;
    }

    // only top, right, bottom, left
    adjacents(i: number, j: number) {
        const adjacents = [];
        if (i > 0) { adjacents.push(this.grid[i - 1][j]); }
        if (j > 0) { adjacents.push(this.grid[i][j - 1]); }
        if (i < this.height() - 1) { adjacents.push(this.grid[i + 1][j]); }
        if (j < this.length() - 1) { adjacents.push(this.grid[i][j + 1]); }
        return adjacents;
    }

    // only top, right, bottom, left
    adjacentCoordinates(i: number, j: number) {
        const adjacents: number[][] = [];
        if (i > 0) { adjacents.push([i - 1, j]); }
        if (j > 0) { adjacents.push([i, j - 1]); }
        if (i < this.height() - 1) { adjacents.push([i + 1, j]); }
        if (j < this.length() - 1) { adjacents.push([i, j + 1]); }
        return adjacents;
    }

    cell(i: number, j: number) {
        return this.grid[i][j];
    }

    setCellValue(i: number, j: number, value: any) {
        this.grid[i][j] = value;
    }

    column(j: number) {
        const column = []
        for (let i = 0; i < this.grid.length; i++) {
            column.push(this.grid[i][j]);
        }
        return column;
    }

    row(i: number) {
        const row = []
        for (let j = 0; j < this.grid[i].length; j++) {
            row.push(this.grid[i][j]);
        }
        return row;
    }

    IterateAdjacents(i: number, j: number, fn: (cell: any, colIndex: number, rowIndex: number) => void) {
        if (i > 0) { fn(this.grid[i - 1][j], i - 1, j); }
        if (j > 0) { fn(this.grid[i][j - 1], i, j - 1); }
        if (i < this.height() - 1) { fn(this.grid[i + 1][j], i + 1, j); }
        if (j < this.length() - 1) { fn(this.grid[i][j + 1], i, j + 1); }
    }

    // all adjacents (also diagonal)
    iterateAllAdjacents(i: number, j: number, fn: (cell: any, colIndex: number, rowIndex: number) => void) {
        if (i > 0) {
            fn(this.grid[i - 1][j], i - 1, j);

            if (j > 0) {
                fn(this.grid[i - 1][j - 1], i - 1, j - 1);
            }
            if (j < this.length() - 1) {
                fn(this.grid[i - 1][j + 1], i - 1, j + 1);
            }
        }
        if (j > 0) {
            fn(this.grid[i][j - 1], i, j - 1);

            if (i < this.height() - 1) {
                fn(this.grid[i + 1][j - 1], i + 1, j - 1);
            }
        }
        if (i < this.height() - 1) {
            fn(this.grid[i + 1][j], i + 1, j);

            if (j < this.length() - 1) {
                fn(this.grid[i + 1][j + 1], i + 1, j + 1);
            }
        }
        if (j < this.length() - 1) {
            fn(this.grid[i][j + 1], i, j + 1)
        }
    }

    iterateCells(fn: (cell: any, colIndex: number, rowIndex: number) => void) {
        for (let i = 0; i < this.grid.length; i++) {
            for (let j = 0; j < this.grid[i].length; j++) {
                fn(this.grid[i][j], i, j);
            }
        }
    }

    iterateRow(rowIndex: number, fn: (cell: any, colIndex: number) => void) {
        for (let j = 0; j < this.grid[rowIndex].length; j++) {
            fn(this.grid[rowIndex][j], j);
        }
    }

    iterateColumn(colIndex: number, fn: (cell: any, rowIndex: number) => void) {
        for (let i = 0; i < this.grid.length; i++) {
            fn(this.grid[i][colIndex], i);
        }
    }
}
