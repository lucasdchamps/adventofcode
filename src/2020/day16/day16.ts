import { readFileSync } from "fs";

interface Rule {
    name: string;
    ranges: Array<[number, number]>
}

function parseRules(rulesString: string): Rule[] {
    return rulesString.split("\n").map(line => ({
        name: line.split(":")[0],
        ranges: parseRanges(line.split(": ")[1])
    }));

    function parseRanges(rangesString: string): Array<[number, number]> {
        return rangesString
            .split(" or ")
            .map(range =>
                range.split("-").map(number => parseInt(number, 10))
            ) as Array<[number, number]>;
    }
}

function doesValueCheckRule(value: number, rule: Rule) {
    return rule.ranges.some(range => isValueInRange(value, range));
}
function isValueInRange(value: number, range: [number, number]) {
    return range[0] <= value && value <= range[1];
}

function mapTicketToMatchingRule(tickets: number[][], rules: Rule[]): string[][][] {
    return tickets
        .map(ticket => ticket
            .map(value => rules
                .filter(rule => doesValueCheckRule(value, rule)).map(rule => rule.name)
            )
        );
}

function mapPositionToRule(ticketRulesMatch: string[][][]) {
    const positionRules = [];
    let positionIndex = 0;
    while (positionIndex < ticketRulesMatch[0].length) {
        positionRules.push(new Set(ticketRulesMatch[0][positionIndex]));

        for (let ticketIndex = 1; ticketIndex < ticketRulesMatch.length; ticketIndex += 1) {
            const ticketRules = new Set(ticketRulesMatch[ticketIndex][positionIndex]);
            positionRules[positionIndex] = new Set([...positionRules[positionIndex]].filter(r => ticketRules.has(r)));
        }

        positionIndex += 1;
    }
    return positionRules;
}

function eliminatePositionRules(positionRules: Array<Set<string>>) {
    let newPositionRules = [...positionRules];
    const seen = new Set();
    let positionWithSingleRule = newPositionRules.find(positionRule => ! seen.has(positionRule) && positionRule.size === 1);

    while(positionWithSingleRule) {
        seen.add(positionWithSingleRule);
        newPositionRules = newPositionRules.map(positionRule => {
            if (seen.has(positionRule)) { return positionRule; }
            return new Set([...positionRule].filter(r => ! positionWithSingleRule!.has(r)))
        });
        positionWithSingleRule = newPositionRules.find(positionRule => ! seen.has(positionRule) && positionRule.size === 1);
    }
    
    return newPositionRules;
}

const inputFile = readFileSync("src/day16/day16.input.txt", "utf8");
const [rulesString, ticketString, otherTicketsString] = inputFile.split("\n\n");
const rules = parseRules(rulesString);
console.log(rules[0]);

const otherTickets = otherTicketsString
    .split("\n").slice(1)
    .map(line => line.split(",").map(value => parseInt(value, 10)));
console.log(otherTickets);

console.log(otherTickets.flat()
    .filter(value => ! rules.some(rule => doesValueCheckRule(value, rule)))
    .reduce((a, b) => a + b)
);

const validTickets: number[][] = otherTickets
    .filter(ticket => ticket
        .every(value => rules.some(rule => doesValueCheckRule(value, rule)))
    );
const ticketRulesMatch: string[][][] = mapTicketToMatchingRule(validTickets, rules);

const positionRules = mapPositionToRule(ticketRulesMatch);
console.log(eliminatePositionRules(positionRules));

const ticketValues = ticketString.split("\n").slice(1)[0].split(",").map(num => parseInt(num, 10));
console.log(ticketValues[6] * ticketValues[10] * ticketValues[11] * ticketValues[12] * ticketValues[15] * ticketValues[17]);
