import { readFileSync } from "fs";
import { prettyPrint, toInt } from "../../utils";

const rawInput = readFileSync("src/2022/day19/input.txt", "utf8");

type BluePrint = {
    id: number;
    oreRobotCost: { ore: number };
    clayRobotCost: { ore: number };
    obsidianRobotCost: { ore: number; clay: number };
    geodeRobotCost: { ore: number; obsidian: number };
}

const input = parseInput(rawInput.split("\n"));
prettyPrint(input);
console.log(part1(input));
console.log(part2(input));

function largestNumberOfGeodes(blueprint: BluePrint, time = 24) {
    let states = [{
            robots: [1, 0, 0, 0],
            resources: [0, 0, 0, 0],
    }];
    let maxNbGeodes = 0;
    const maxOreCost = Math.max(...[blueprint.oreRobotCost.ore, blueprint.clayRobotCost.ore, blueprint.obsidianRobotCost.ore, blueprint.geodeRobotCost.ore]);

    for (let i = 0; i < time; i++) {
        const nextStates = [];

        let maxGeodeBots = 0;
        for (const state of states) {
            maxNbGeodes = Math.max(maxNbGeodes, state.resources[3] + state.robots[3]);
            maxGeodeBots = Math.max(maxGeodeBots, state.robots[3]);

            if (state.resources[2] >= blueprint.geodeRobotCost.obsidian && state.resources[0] >= blueprint.geodeRobotCost.ore) {
                nextStates.push({
                    robots: [state.robots[0], state.robots[1], state.robots[2], state.robots[3] + 1],
                    resources: [
                        state.resources[0] + state.robots[0] - blueprint.geodeRobotCost.ore,
                        state.resources[1] + state.robots[1],
                        state.resources[2] + state.robots[2] - blueprint.geodeRobotCost.obsidian,
                        state.resources[3] + state.robots[3]
                    ]
                });
                continue;
            }
            if (state.robots[2] < blueprint.geodeRobotCost.obsidian && state.resources[1] >= blueprint.obsidianRobotCost.clay && state.resources[0] >= blueprint.obsidianRobotCost.ore) {
                nextStates.push({
                    robots: [state.robots[0], state.robots[1], state.robots[2] + 1, state.robots[3]],
                    resources: [
                        state.resources[0] + state.robots[0] - blueprint.obsidianRobotCost.ore,
                        state.resources[1] + state.robots[1] - blueprint.obsidianRobotCost.clay,
                        state.resources[2] + state.robots[2],
                        state.resources[3] + state.robots[3]
                    ]
                });
            }
            if (state.robots[1] < blueprint.obsidianRobotCost.clay && state.resources[0] >= blueprint.clayRobotCost.ore) {
                nextStates.push({
                    robots: [state.robots[0], state.robots[1] + 1, state.robots[2], state.robots[3]],
                    resources: [
                        state.resources[0] + state.robots[0] - blueprint.clayRobotCost.ore,
                        state.resources[1] + state.robots[1],
                        state.resources[2] + state.robots[2],
                        state.resources[3] + state.robots[3]
                    ]
                });
            }
            if (state.robots[0] < maxOreCost && state.resources[0] >= blueprint.oreRobotCost.ore) {
                nextStates.push({
                    robots: [state.robots[0] + 1, state.robots[1], state.robots[2], state.robots[3]],
                    resources: [
                        state.resources[0] + state.robots[0] - blueprint.oreRobotCost.ore,
                        state.resources[1] + state.robots[1],
                        state.resources[2] + state.robots[2],
                        state.resources[3] + state.robots[3]
                    ]
                });
            }
            if (state.resources[0] < maxOreCost) {
                nextStates.push({
                    robots: state.robots,
                    resources: [
                        state.resources[0] + state.robots[0],
                        state.resources[1] + state.robots[1],
                        state.resources[2] + state.robots[2],
                        state.resources[3] + state.robots[3]
                    ]
                });
            }
        }

        states = nextStates.filter(s => s.robots[3] >= maxGeodeBots);
    }

    return maxNbGeodes;
}

function part1(blueprints: BluePrint[]) {
    return blueprints.map(b => b.id * largestNumberOfGeodes(b)).reduce((acc, val) => acc + val, 0);
}

function part2(blueprints: BluePrint[]) {
    return largestNumberOfGeodes(blueprints[0], 32) * largestNumberOfGeodes(blueprints[1], 32) * largestNumberOfGeodes(blueprints[2], 32);
}

function parseInput(lines: string[]): BluePrint[] {
    const result = [];

    for (const line of lines) {
        result.push({
            id: toInt(line.match(/Blueprint (\d+)/)![1]),
            oreRobotCost: { ore: toInt(line.match(/ore robot costs (\d+) ore/)![1]) },
            clayRobotCost: { ore: toInt(line.match(/clay robot costs (\d+) ore/)![1]) },
            obsidianRobotCost: {
                ore: toInt(line.match(/obsidian robot costs (\d+) ore/)![1]),
                clay: toInt(line.match(/obsidian robot costs .* (\d+) clay/)![1])
            },
            geodeRobotCost: {
                ore: toInt(line.match(/geode robot costs (\d+) ore/)![1]),
                obsidian: toInt(line.match(/geode robot costs .* (\d+) obsidian/)![1])
            }
        });
    }

    return result;
}
