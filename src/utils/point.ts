export class Point {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    equals(point2: Point) {
        return this.x === point2.x && this.y === point2.y;
    }

    toJSON() {
        return JSON.stringify([this.x, this.y]);
    }
}
