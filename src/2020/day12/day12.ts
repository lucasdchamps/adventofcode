import { readFileSync } from "fs";

interface Instruction {
    type: string;
    value: number
}

function parseInstructions(inputFile: string): Instruction[] {
    const lines = inputFile.split("\n");
    return lines.map(line => {
        const type = line.split("")[0];
        const value = parseInt(line.split("").slice(1).join(""));
        return { type, value };
    });
}

const NEW_DIRECTION_MAP: Record<string, Record<number, Record<string, string>>> = {
    "R": {
        90: {
            "N": "E",
            "E": "S",
            "S": "W",
            "W": "N"
        },
        180: {
            "N": "S",
            "E": "W",
            "S": "N",
            "W": "E"
        },
        270: {
            "N": "W",
            "E": "N",
            "S": "E",
            "W": "S"
        }
    },
    "L": {
        90: {
            "N": "W",
            "E": "N",
            "S": "E",
            "W": "S"
        },
        180: {
            "N": "S",
            "E": "W",
            "S": "N",
            "W": "E"
        },
        270: {
            "N": "E",
            "E": "S",
            "S": "W",
            "W": "N"
        }
    }
}

function moveShip(instructions: Instruction[]) {
    let eastPosition = 0;
    let northPosition = 0;
    let direction = "E";

    instructions.forEach(applyInstruction);

    return [eastPosition, northPosition];

    function applyInstruction(instruction: Instruction) {
        if (instruction.type === "N") { northPosition += instruction.value; }
        if (instruction.type === "S") { northPosition -= instruction.value; }
        if (instruction.type === "E") { eastPosition += instruction.value; }
        if (instruction.type === "W") { eastPosition -= instruction.value; }
        if (instruction.type === "F") {
            applyInstruction({ type: direction, value: instruction.value });
        }
        if (instruction.type === "R" || instruction.type === "L") {
            direction = NEW_DIRECTION_MAP[instruction.type][instruction.value][direction];
        }
    }
}

function moveShipAndWaypoint(instructions: Instruction[]) {
    let shipEastPosition = 0;
    let shipNorthPosition = 0;
    let wayPointEastPosition = 10;
    let wayPointNorthPosition = 1;

    instructions.forEach(applyInstruction);

    return [shipEastPosition, shipNorthPosition];

    function applyInstruction(instruction: Instruction) {
        debugger;
        if (["N", "E", "S", "W"].includes(instruction.type)) {
            const [eastPosition, northPosition] = moveShip([instruction]);
            wayPointEastPosition += eastPosition;
            wayPointNorthPosition += northPosition;
        }
        if (instruction.type === "F") {
            const [eastPosition, northPosition] = moveShip([
                { type: "E", value: instruction.value * wayPointEastPosition },
                { type: "N", value: instruction.value * wayPointNorthPosition }
            ]);
            shipEastPosition += eastPosition;
            shipNorthPosition += northPosition;
        }
        if (instruction.type === "R" || instruction.type === "L") {
            let northDirection = wayPointNorthPosition > 0 ? "N" : "S";
            let eastDirection = wayPointEastPosition > 0 ? "E" : "W";
            northDirection = NEW_DIRECTION_MAP[instruction.type][instruction.value][northDirection];
            eastDirection = NEW_DIRECTION_MAP[instruction.type][instruction.value][eastDirection];
            const eastPosition = wayPointEastPosition;
            const northPosition = wayPointNorthPosition;

            if (northDirection === "E") { wayPointEastPosition = Math.abs(northPosition); }
            if (northDirection === "W") { wayPointEastPosition = -Math.abs(northPosition); }
            if (northDirection === "N") { wayPointNorthPosition = Math.abs(northPosition); }
            if (northDirection === "S") { wayPointNorthPosition = -Math.abs(northPosition); }

            if (eastDirection === "E") { wayPointEastPosition = Math.abs(eastPosition); }
            if (eastDirection === "W") { wayPointEastPosition = -Math.abs(eastPosition); }
            if (eastDirection === "N") { wayPointNorthPosition = Math.abs(eastPosition); }
            if (eastDirection === "S") { wayPointNorthPosition = -Math.abs(eastPosition); }
        }
    }
}

const inputFile = readFileSync("src/day12/day12.input.txt", "utf8");
const instructions = parseInstructions(inputFile);
console.log("instructions", instructions);
const [eastPosition, northPosition] = moveShip(instructions);
console.log("eastPosition", eastPosition);
console.log("northPosition", northPosition);
console.log("manhattan distance", Math.abs(eastPosition) + Math.abs(northPosition));
const [eastPosition2, northPosition2] = moveShipAndWaypoint(instructions);
console.log("eastPosition", eastPosition2);
console.log("northPosition", northPosition2);
console.log("manhattan distance", Math.abs(eastPosition2) + Math.abs(northPosition2));