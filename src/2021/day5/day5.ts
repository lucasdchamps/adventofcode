import { readFileSync } from "fs";
import { Point, toInt } from "../../utils";

const input = readFileSync("src/2021/day5/day5.input.txt", "utf8");

type LineType = {
    start: Point;
    end: Point;
}

class Line {
    line: LineType;
    points: Point[];

    constructor(line: LineType) {
        this.line = line;
    }

    isVertical() {
        return this.line.start.x === this.line.end.x;
    }

    isHorizontal() {
        return this.line.start.y === this.line.end.y;
    }

    horizontalPoints() {
        const points: Point[] = [];
        const startx = Math.min(this.line.start.x, this.line.end.x);
        const endx = Math.max(this.line.start.x, this.line.end.x);
        for (let i = startx; i <= endx; i++) {
            points.push(new Point(i, this.line.start.y));
        }
        return points;
    }

    verticalPoints() {
        const points: Point[] = [];
        const starty = Math.min(this.line.start.y, this.line.end.y);
        const endy = Math.max(this.line.start.y, this.line.end.y);
        for (let i = starty; i <= endy; i++) {
            points.push(new Point(this.line.start.x, i));
        }
        return points;
    }

    diagonalPoints() {
        const points: Point[] = [];
        let i = this.line.start.x;
        let j = this.line.start.y;
        while(i != this.line.end.x && j != this.line.end.y) {
            points.push(new Point(i, j));
            if (i < this.line.end.x) {
                i += 1;
            } else {
                i -= 1;
            }
            if (j < this.line.end.y) {
                j += 1;
            } else {
                j -= 1;
            }
        }
        points.push(new Point(this.line.end.x, this.line.end.y));
        return points;
    }

    getPoints() {
        if (this.points) { return this.points; }
        if (this.isHorizontal()) {
            this.points = this.horizontalPoints();
        } else if (this.isVertical()) {
            this.points = this.verticalPoints();
        } else {
            this.points = this.diagonalPoints();
        }
        return this.points
    }

    intersectionPoints(line2: Line) {
        const intersectionPoints = [];
        for (const point of this.getPoints()) {
            for (const point2 of line2.getPoints()) {
                if (point.x === point2.x && point.y === point2.y) {
                    intersectionPoints.push(JSON.stringify({ x: point.x, y: point.y }));
                }
            }
        }
        return intersectionPoints;
    }
}

function parseInput(textLines: string[]) {
    const res = [];
    for (const textLine of textLines) {
        const [start, end] = textLine.split(" -> ");
        const [startx, starty] = start.split(",").map(toInt);
        const [endx, endy] = end.split(",").map(toInt);
        res.push(new Line({
            start: new Point(startx, starty),
            end: new Point(endx, endy)
        }));
    }
    return res;
}

function part1(lines: Line[]) {
    const intersectionPoints = new Set();
    for (let i = 0; i < lines.length; i++) {
        for (let j = i + 1; j < lines.length; j++) {
            for (const point of lines[i].intersectionPoints(lines[j])) {
                intersectionPoints.add(point);
            }
        }
    }
    return intersectionPoints.size;
}

let lines = parseInput(input.split("\n"));
lines = lines.filter(line => line.isHorizontal() || line.isVertical());
console.log(part1(lines));

lines = parseInput(input.split("\n"));
console.log(part1(lines));
