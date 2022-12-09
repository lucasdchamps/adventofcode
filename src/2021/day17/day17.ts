const XMIN = 29;
const XMAX = 73;
const YMIN = -248;
const YMAX = -194;
const MAXY = Math.max(Math.abs(YMAX), Math.abs(YMIN));

type Velocity = { x: number; y: number; }
type Position = { x: number; y: number; }

function applyStep(position: Position, velocity: Velocity) {
    let nextXVelocity = 0;
    if (velocity.x > 0) {
        nextXVelocity = velocity.x - 1;
    }
    if (velocity.x < 0) {
        nextXVelocity = velocity.x + 1;
    }
    return {
        position: {
            x: position.x + velocity.x,
            y: position.y + velocity.y
        },
        velocity: {
            x: nextXVelocity,
            y: velocity.y - 1
        }
    }
}

function isWithinTarget(position: Position) {
    return XMIN <= position.x && position.x <= XMAX && YMIN <= position.y && position.y <= YMAX;
}

function notEnoughXVelocity(prevPosition: Position, currPosition: Position) {
    return prevPosition.x < XMIN && YMIN <= prevPosition.y && currPosition.y < YMIN;
}

function notEnoughYVelocity(prevPosition: Position, currPosition: Position) {
    return prevPosition.y < YMIN && XMIN <= prevPosition.x && currPosition.x < XMIN;
}

function tooMuchXVelocity(prevPosition: Position, currPosition: Position) {
    return XMAX < currPosition.x;
}

function tooMuchYVelocity(prevPosition: Position, currPosition: Position) {
    return YMAX < prevPosition.y && currPosition.y < YMIN;
}

function highestPosition(velocity: Velocity) {
    let prevPosition = { x: 0, y: 0 };
    let currPosition = { x: 0, y: 0 };
    let highest = 0;

    while (! isWithinTarget(currPosition)) {
        if (notEnoughXVelocity(prevPosition, currPosition)) {
            return {
                notWithin: "notEnoughX",
                highest: 0
            };
        }
        if (notEnoughYVelocity(prevPosition, currPosition)) {
            return {
                notWithin: "notEnoughY",
                highest: 0
            };
        }
        if (tooMuchXVelocity(prevPosition, currPosition)) {
            return {
                notWithin: "tooMuchX",
                highest: 0
            };
        }
        if (tooMuchYVelocity(prevPosition, currPosition)) {
            return {
                notWithin: "tooMuchY",
                highest: 0
            };
        }

        prevPosition = currPosition;
        ({ position: currPosition, velocity } = applyStep(currPosition, velocity));
        if (currPosition.y > highest) {
            highest = currPosition.y;
        }
    }

    return { notWithin: null, highest };
}

function newVelocity(velocity: Velocity, cause: string | null) {
    if (cause === "notEnoughX") {
        return { x: velocity.x + 1, y: velocity.y };
    }
    if (cause === "notEnoughY") {
        return { x: velocity.x, y: velocity.y + 1 };
    }
    if (cause === "tooMuchX") {
        return { x: velocity.x - 1, y: velocity.y };
    }
    if (cause === "tooMuchY") {
        return { x: velocity.x, y: velocity.y - 1 };
    }

    return velocity;
}

function part1() {
    let velocity = { x: 1, y: 1 };
    let result = 1;
    let { notWithin, highest } = highestPosition(velocity);

    while(notWithin) {
        velocity = newVelocity(velocity, notWithin);
        ({ notWithin, highest } = highestPosition(velocity));
    }

    while(true) {
        if (highest > result) {
            result = highest;
            console.log(velocity);
            console.log(result);
        }

        velocity.y += 1;
        ({ notWithin, highest } = highestPosition(velocity));
    }
}

// console.log(part1());

function part2() {
    let velocity = { x: 1, y: 1 };
    let nbValidVelocities = 0;
    let { notWithin } = highestPosition(velocity);

    while(notWithin) {
        velocity = newVelocity(velocity, notWithin);
        ({ notWithin } = highestPosition(velocity));
    }

    while(velocity.x <= XMAX) {
        let newY = - MAXY;
        while(newY <= MAXY) {
            velocity.y = newY;
            ({ notWithin } = highestPosition(velocity));
            if (! notWithin) {
                nbValidVelocities += 1;
            }
            newY += 1;
        }
        
        velocity.x += 1;
    }

    return nbValidVelocities;
}

console.log(part2());
