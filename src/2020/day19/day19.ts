import { readFileSync } from "fs";

type Rule = number[][] | Set<string>;

function parseRules(rulesString: string) {
    const rulesLines = rulesString.split("\n");
    const rules = new Array(rulesLines.length);

    rulesLines.forEach(line => {
        const [indexString, ruleValue] = line.split(": ");
        const index = parseInt(indexString, 10);
        rules[index] = parseRuleValue(ruleValue);
    });

    return rules;

    function parseRuleValue(ruleValue: string) {
        if (ruleValue === "\"a\"") {
            return new Set("a");
        }
        if (ruleValue === "\"b\"") {
            return new Set("b");
        }

        if (!ruleValue.match(/\|/)) {
            return [ruleValue.split(" ").map(value => parseInt(value, 10))];
        } else {
            return ruleValue.split(" | ")
                .map(values => values.split(" ").map(value => parseInt(value, 10)));
        }
    }
}

function findMatches(message: string, rules: Array<Rule>, index = 0): Array<string> | null {
    if (rules[index] instanceof Set) {
        if ((rules[index] as Set<string>).has(message[0])) {
            return [message[0]];
        }
        return null;
    }

    const rule = rules[index] as number[][];
    const otherRulesMatches = [];
    for (let i = 0; i < rule.length; i += 1) {
        const matches = findMatchesRecursive(message, rule[i]);
        if (matches !== null) {
            otherRulesMatches.push(matches);
        }
    }

    if (otherRulesMatches.length > 0) {
        return otherRulesMatches.flat();
    }
    return null;

    function findMatchesRecursive(subMessage: string, otherRules: number[]) {
        let matches = findMatches(subMessage, rules, otherRules[0]);
        if (matches === null) {
            return null;
        }

        let rulesIndex = 1;
        while (rulesIndex < otherRules.length) {
            let nextCycleMatches: string[] = [];
            let matchesIndex = 0;
            while (matchesIndex < matches.length) {
                const match = matches[matchesIndex];
                const nextMatches = findMatches(subMessage.slice(match.length), rules, otherRules[rulesIndex]);
                if (nextMatches !== null) {
                    const nextMatchesStrings = nextMatches.map(nextMatch => `${match}${nextMatch}`) as string[];
                    nextCycleMatches = [
                        ...nextCycleMatches,
                        ...nextMatchesStrings
                    ];
                }
                matchesIndex += 1;
            }

            matches = [...nextCycleMatches];
            rulesIndex += 1;
        }

        if (rulesIndex === otherRules.length && matches.length > 0) {
            return matches;
        }
        return null;
    }
}

const inputFile = readFileSync("src/day19/day19.input.txt", "utf8");
const [rulesString, messagesString] = inputFile.split("\n\n");
const rules = parseRules(rulesString);

const messages = messagesString.split("\n");
console.log(messages.filter(message => {
    const matches = findMatches(message, rules);
    return matches && matches.includes(message);
}).length);
