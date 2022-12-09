import { readFileSync } from "fs";

const input = readFileSync("src/2021/day12/day12.input.txt", "utf8");

class Cave {
    name: string;
    linkedCaves: Cave[];

    constructor(name: string) {
        this.name = name;
        this.linkedCaves = [];
    }

    isSmall() {
        return this.name.toLowerCase() === this.name;
    }

    log() {
        return "name: " + this.name + ", linkedCaves: " + this.linkedCaves.map(cave => cave.name).join(" ");
    }
}

class Path {
    caves: Cave[] = [];
    seen: Record<string, number> = {};
    smallCaveVisitedTwice = false;

    constructor(caves: Cave[]) {
        caves.forEach(cave => this.add(cave));
    }

    add(cave: Cave) {
        this.caves.push(cave);
        this.seen[cave.name] = this.seen[cave.name] ? this.seen[cave.name] + 1 : 1;
    }

    hasVisited(cave: Cave) {
        return this.seen[cave.name] > 0;
    }

    hasVisitedSmallCaveTwice() {
        if (this.smallCaveVisitedTwice) { return true; }
        this.smallCaveVisitedTwice = !! Object.keys(this.seen).find(name =>
            name.toLowerCase() === name &&
            name !== "start" && name !== "end" &&
            this.seen[name] > 1
        );
        return this.smallCaveVisitedTwice;
    }

    lastCave() {
        return this.caves[this.caves.length - 1];
    }

    log() {
        return this.caves.map(cave => cave.name).join(" -> ");
    }
}

function parseInput(lines: string[]) {
    const caves: Record<string, Cave> = {};
    lines.forEach(line => {
        const [name1, name2] = line.split("-");
        const cave1 = caves[name1] || new Cave(name1);
        const cave2 = caves[name2] || new Cave(name2);
        cave1.linkedCaves.push(cave2);
        cave2.linkedCaves.push(cave1);
        caves[name1] = cave1;
        caves[name2] = cave2;
    });
    return caves;
}

let res = parseInput(input.split("\n"));

function part1(caves: Record<string, Cave>) {
    const paths: Path[] = [new Path([caves["start"]])];
    const completePaths = [];

    while(paths.length > 0) {
        const pathToVisit = paths.pop()!;
        pathToVisit.lastCave().linkedCaves.forEach(cave => {
            if (cave.name === "end") {
                completePaths.push(new Path([...pathToVisit.caves, cave]));
            } else if (! (cave.isSmall() && pathToVisit.hasVisited(cave))) {
                paths.push(new Path([...pathToVisit.caves, cave]));
            }
        });
    }

    return completePaths.length;
}

console.log(part1(res));

function shouldVisit(path: Path, cave: Cave) {
    if (cave.name === "start" && path.hasVisited(cave)) { return false; }
    if (cave.isSmall() && path.hasVisitedSmallCaveTwice() && path.hasVisited(cave)) { return false; }
    return true;
}

function part2(caves: Record<string, Cave>) {
    const paths: Path[] = [new Path([caves["start"]])];
    const completePaths = [];

    while(paths.length > 0) {
        const pathToVisit = paths.pop()!;
        pathToVisit.lastCave().linkedCaves.forEach(cave => {
            if (cave.name === "end") {
                completePaths.push(new Path([...pathToVisit.caves, cave]));
            } else if (shouldVisit(pathToVisit, cave)) {
                paths.push(new Path([...pathToVisit.caves, cave]));
            }
        });
    }

    return completePaths.length;
}

res = parseInput(input.split("\n"));

console.log(part2(res));