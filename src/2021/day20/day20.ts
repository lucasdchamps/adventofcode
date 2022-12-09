import { readFileSync } from "fs";

const input = readFileSync("src/2021/day20/day20.input.txt", "utf8");

class Pixel {
    value: 0 | 1;

    constructor(value: "." | "#") {
        this.value = value === "." ? 0 : 1;
    }

    toString() {
        return this.value ? "#" : ".";
    }
}

class PixelBoard {
    pixels: Pixel[][];
    index: number;

    constructor(pixels: Pixel[][], index: number) {
        this.pixels = pixels;
        this.index = index;
    }

    toString() {
        return this.pixels.map(pixelRow => pixelRow.map(pixel => pixel.toString()).join("")).join("\n");
    }

    length() {
        return this.pixels[0].length;
    }

    height() {
        return this.pixels.length;
    }

    valueAt(i: number, j: number) {
        if (0 <= i && i <= this.height() - 1 && 0 <= j && j <= this.length() - 1) {
            return this.pixels[i][j].value;
        }
        return this.index % 2 === 0 ? 0 : 1;
    }

    binaryAt(i: number, j: number) {
        return `${this.valueAt(i - 1, j - 1)}${this.valueAt(i - 1, j)}${this.valueAt(i - 1, j + 1)}` +
               `${this.valueAt(i, j - 1)}${this.valueAt(i, j)}${this.valueAt(i, j + 1)}` +
               `${this.valueAt(i + 1, j - 1)}${this.valueAt(i + 1, j)}${this.valueAt(i + 1, j + 1)}`;
    }

    numberLit() {
        let nbLit = 0;
        this.pixels.forEach(pixelRow => pixelRow.forEach(pixel => {
            if (pixel.value) { nbLit += 1; }
        }))
        return nbLit;
    }
}

function parseInput(lines: string[]) {
    const enhancementAlgorithm = lines[0].split("").map((char: "." | "#") => new Pixel(char));
    const pixels: Pixel[][] = [];
    lines.slice(2).forEach(line => {
        pixels.push(line.split("").map((char: "." | "#") => new Pixel(char)));
    });
    return {
        enhancementAlgorithm,
        pixelBoard: new PixelBoard(pixels, 0)
    }
}

let res = parseInput(input.split("\n"));

function enhance(enhancementAlgorithm: Pixel[], pixelBoard: PixelBoard, step: number) {
    const enhancedPixels: Pixel[][] = [];
    for (let i = -1; i < pixelBoard.height() + 1; i++) {
        const row = [];

        for (let j = -1; j < pixelBoard.length() + 1; j++) {
            const index = parseInt(pixelBoard.binaryAt(i, j), 2);
            row.push(enhancementAlgorithm[index]);
        }

        enhancedPixels.push(row);
    }
    return new PixelBoard(enhancedPixels, step);
}

function part1(enhancementAlgorithm: Pixel[], pixelBoard: PixelBoard) {
    const enhancedBoard = enhance(enhancementAlgorithm, pixelBoard, 1);
    return enhance(enhancementAlgorithm, enhancedBoard, 2).numberLit();
}

console.log(part1(res.enhancementAlgorithm, res.pixelBoard));

function part2(enhancementAlgorithm: Pixel[], pixelBoard: PixelBoard) {
    let step = 1;
    let enhancedBoard = pixelBoard;
    while(step <= 50) {
        enhancedBoard = enhance(enhancementAlgorithm, enhancedBoard, step);
        step += 1;
    }
    return enhancedBoard.numberLit();
}

res = parseInput(input.split("\n"));

console.log(part2(res.enhancementAlgorithm, res.pixelBoard));
