
type Cup = {
    value: number;
    next?: Cup;
    previous?: Cup;
}

const MAX_CUP = 1000000;

function findInCups(firstCup: Cup, value: number): Cup | null {
    if (firstCup.value === value) { return firstCup; }

    let cup = firstCup.next;
    while(cup) {
        if (cup.value === value) { return cup; }
        cup = cup.next as Cup;
    }

    return null;
}

function move(firstCup: Cup, allCups: Record<number, Cup>): Cup {
    const secondCup = firstCup.next as Cup;
    const thirdCup = secondCup.next as Cup;
    const fourthCup = thirdCup.next as Cup;
    const startingCups = buildStartingCups();

    const fifthCup = fourthCup!.next as Cup;
    const destinationCup = findDestinationCup();

    const lastCup = firstCup.previous as Cup;
    lastCup.next = firstCup;
    firstCup.next = undefined;
    fifthCup.previous = firstCup;

    const afterDestinationCup = destinationCup.next as Cup;
    destinationCup.next = secondCup;
    secondCup.previous = destinationCup;
    fourthCup.next = afterDestinationCup;
    afterDestinationCup.previous = fourthCup;

    return fifthCup;

    function findDestinationCup(): Cup {
        let minusLabel = firstCup.value - 1;

        while (minusLabel > 0 && findInCups(startingCups, minusLabel)) { minusLabel -= 1; }
        if (minusLabel > 0) { return allCups[minusLabel]; }

        let maxValue = MAX_CUP;
        while (findInCups(startingCups, maxValue)) { maxValue -= 1; }
        return allCups[maxValue];
    }

    function buildStartingCups(): Cup {
        return {
            value: firstCup!.value,
            next: {
                value: secondCup!.value,
                next: {
                    value: thirdCup!.value,
                    next: {
                        value: fourthCup!.value
                    }
                }
            }
        };
    }
}

const cups = [1,5,6,7,9,4,8,2,3];

const allCups: Record<number, Cup> = {};
const firstCup: Cup = { value: cups[0] };
let cup = firstCup;
for (let i = 1; i < cups.length; i += 1) {
    allCups[cup.value] = cup;
    const nextCup = { value: cups[i], previous: cup };
    cup.next = nextCup;
    cup = nextCup;
}
allCups[cup.value] = cup;

for (let i = 10; i <= MAX_CUP; i += 1) {
    allCups[cup.value] = cup;
    const nextCup = { value: i, previous: cup };
    cup.next = nextCup;
    cup = nextCup;
}
allCups[cup.value] = cup;
firstCup.previous = cup;
cup = firstCup;

for(let i = 0; i < 10000000; i += 1) {
    cup = move(cup, allCups);
}

while(cup.value !== 1) {
    cup = cup.next as Cup;
}
console.log(cup.next!.value);
console.log(cup.next!.next!.value);
console.log(cup.next!.value * cup.next!.next!.value);