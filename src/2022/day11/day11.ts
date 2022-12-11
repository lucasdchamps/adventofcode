class Monkey {
    id: number;
    items: number[];
    operation: (input: number) => number;
    test: (input: number) => number;
    numberInspections: number;

    constructor(id: number, items: number[], operation: (input: number) => number, test: (input: number) => number) {
        this.id = id;
        this.items = items;
        this.operation = operation;
        this.test = test;
        this.numberInspections = 0;
    }

    inspectItem() {
        let item = this.items.shift()!;
        item = this.divideByThree(this.operation(item));
        this.numberInspections += 1;

        return { item, nextMonkeyIndex: this.test(item) };
    }

    inspectItem2() {
        let item = this.items.shift()!;
        item = this.operation(item);
        item = item % (23 * 19 * 13 * 17);
        this.numberInspections += 1;

        return { item, nextMonkeyIndex: this.test(item) };
    }

    inspectItem3() {
        let item = this.items.shift()!;
        item = this.operation(item);
        item = item % (13 * 11 * 2 * 5 * 7 * 3 * 19 * 17);
        this.numberInspections += 1;

        return { item, nextMonkeyIndex: this.test(item) };
    }

    divideByThree(item: number) {
        return Math.floor(item / 3);
    }

    log() {
        console.log(`Monkey ${this.id}: ${this.items.join(", ")}`);
    }
}

const exampleMonkeys = [
    new Monkey(0, [79, 98], (input) => input * 19, (input) => input % 23 === 0 ? 2 : 3),
    new Monkey(1, [54, 65, 75, 74], (input) => input + 6, (input) => input % 19 === 0 ? 2 : 0),
    new Monkey(2, [79, 60, 97], (input) => input * input, (input) => input % 13 === 0 ? 1 : 3),
    new Monkey(3, [74], (input) => input + 3, (input) => input % 17 === 0 ? 0 : 1)
];

const myMonkeys = [
    new Monkey(0, [63, 84, 80, 83, 84, 53, 88, 72], (input) => input * 11, (input) => input % 13 === 0 ? 4 : 7),
    new Monkey(1, [67, 56, 92, 88, 84], (input) => input + 4, (input) => input % 11 === 0 ? 5 : 3),
    new Monkey(2, [52], (input) => input * input, (input) => input % 2 === 0 ? 3 : 1),
    new Monkey(3, [59, 53, 60, 92, 69, 72], (input) => input + 2, (input) => input % 5 === 0 ? 5 : 6),
    new Monkey(4, [61, 52, 55, 61], (input) => input + 3, (input) => input % 7 === 0 ? 7 : 2),
    new Monkey(5, [79, 53], (input) => input + 1, (input) => input % 3 === 0 ? 0 : 6),
    new Monkey(6, [59, 86, 67, 95, 92, 77, 91], (input) => input + 5, (input) => input % 19 === 0 ? 4 : 0),
    new Monkey(7, [58, 83, 89], (input) => input * 19, (input) => input % 17 === 0 ? 2 : 1)
]

// console.log(part1(exampleMonkeys));
console.log(part2(myMonkeys));

function part1(monkeys: Monkey[]) {
    for (let i = 0; i < 20; i++) {
        for (const monkey of monkeys) {
            while (monkey.items.length) {
                const { item, nextMonkeyIndex } = monkey.inspectItem();
                monkeys[nextMonkeyIndex].items.push(item);
            }
        }
    }

    return monkeys.sort((m1, m2) => m2.numberInspections - m1.numberInspections).map(m => m.numberInspections);
}

function part2(monkeys: Monkey[]) {
    for (let i = 0; i < 10000; i++) {
        for (const monkey of monkeys) {
            while (monkey.items.length) {
                const { item, nextMonkeyIndex } = monkey.inspectItem3();
                const nextMonkey = monkeys[nextMonkeyIndex];
                nextMonkey.items.push(item);
            }
        }
    }

    return monkeys.sort((m1, m2) => m2.numberInspections - m1.numberInspections).map(m => m.numberInspections);
}
