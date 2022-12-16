import { readFileSync } from "fs";
import { prettyPrint, toInt } from "../../utils";

const rawInput = readFileSync("src/2022/day16/input.txt", "utf8");

class Valve {
    flowRate: number;
    nextValves: string[];

    constructor(flowRate: number, nextValves: string[]) {
        this.flowRate = flowRate;
        this.nextValves = nextValves;
    }
}

const input = parseInput(rawInput.split("\n"));
prettyPrint(input);
console.log(part1(input));
console.log(part2(input));

function part1(valves: Record<string, Valve>) {
    const distances = computeDistances(valves);
    const valvesWithFlow = Object.keys(valves).filter(v => valves[v].flowRate > 0);

    let best = 0;

    dfs(0, [], 0, "AA");

    return best;

    function dfs(released: number, opened: string[], timeSpent: number, current: string) {
        best = Math.max(released, best);

        for (const next of valvesWithFlow.filter(v => ! opened.includes(v))) {
            const newTimeSpent = timeSpent + distances[current][next] + 1;
            if (newTimeSpent >= 30) { continue; }
            const newOpened = [...opened, next];
            dfs(released + (30 - newTimeSpent) * valves[next].flowRate, newOpened, newTimeSpent, next);
        }
    }
}

// Floyd–Warshall
function computeDistances(valves: Record<string, Valve>) {
    const dist: Record<string, Record<string, number>> = {};
    for (const v of Object.keys(valves)) {
        dist[v] = {}
        for (const v2 of Object.keys(valves)) {
            if (v === v2) { dist[v][v2] = 0; }
            else if (valves[v].nextValves.includes(v2)) { dist[v][v2] = 1; }
            else { dist[v][v2] = 10000000000; }
        }
    }

    for (const v of Object.keys(valves)) {
        for (const v2 of Object.keys(valves)) {
            for (const v3 of Object.keys(valves)) {
                if (dist[v2][v3] > dist[v2][v] + dist[v][v3]) {
                    dist[v2][v3] = dist[v2][v] + dist[v][v3];
                }
            }
        }
    }

    return dist;
}

function part2(valves: Record<string, Valve>) {
    const distances = computeDistances(valves);
    const valvesWithFlow = Object.keys(valves).filter(v => valves[v].flowRate > 0);

    let best = 0;

    dfs(0, [], 0, "AA", true);

    return best;

    function dfs(released: number, opened: string[], timeSpent: number, current: string, isMe: boolean) {
        best = Math.max(released, best);

        for (const next of valvesWithFlow.filter(v => ! opened.includes(v))) {
            const newTimeSpent = timeSpent + distances[current][next] + 1;
            if (newTimeSpent >= 26) { continue; }
            const newOpened = [...opened, next];
            dfs(released + (26 - newTimeSpent) * valves[next].flowRate, newOpened, newTimeSpent, next, isMe);
        }

        if (isMe) {
            dfs(released, opened, 0, "AA", false);
        }
    }
}

function parseInput(lines: string[]): Record<string, Valve> {
    const result: Record<string, Valve> = {};

    for (const line of lines) {
        const name = line.match(/Valve ([A-Z]{2})/)![1]
        const flowRate = toInt(line.match(/flow rate=(\d+)/)![1]);
        const nextValves = line.match(/to valves? (.*)/)![1].split(", ");
        result[name] = new Valve(flowRate, nextValves);
    }

    return result;
}
