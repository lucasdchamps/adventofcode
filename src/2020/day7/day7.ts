import { readFileSync } from "fs";

const inputFile = readFileSync("src/day7/day7.input.txt", "utf8");

function computeBagParentMap(rules: string[]): Record<string, Set<string>> {
    const bagParentMap = {} as Record<string, Set<string>>;

    rules.forEach(rule => {
        const childs = getChilds(rule);
        const parent = getParent(rule);
        childs.forEach((child: string) => {
            bagParentMap[child] = bagParentMap[child] || new Set();
            bagParentMap[child].add(parent);
        });
    });

    return bagParentMap;

    function getChilds(rule: string): string[] {
        const childMatches = rule.match(/\d ([a-z ]+) bag/g);
        if (! childMatches) { return []; }

        return childMatches.map(childMatch => childMatch.split(" ").slice(1, -1).join(" "));
    }
    function getParent(rule: string): string {
        const parentMatch = rule.match(/^([a-z ]+) bags contain/);
        if (! parentMatch) { throw Error("Could not match parent"); }

        return parentMatch[1];
    }
}

function computeBagChildMap(rules: string[]): Record<string, Set<string>> {
    const bagChildMap = {} as Record<string, Set<string>>;

    rules.forEach(rule => {
        const childs = getChilds(rule);
        const parent = getParent(rule);
        bagChildMap[parent] = bagChildMap[parent] || new Set();
        childs.forEach(child => bagChildMap[parent].add(child));
    });

    return bagChildMap;

    function getChilds(rule: string): string[] {
        const childMatches = rule.match(/(\d [a-z ]+) bag/g);
        if (! childMatches) { return []; }

        return childMatches.map(childMatch => childMatch.split(" ").slice(0, -1).join(" "));
    }
    function getParent(rule: string): string {
        const parentMatch = rule.match(/^([a-z ]+) bags contain/);
        if (! parentMatch) { throw Error("Could not match parent"); }

        return parentMatch[1];
    }
}

function countBagParents(child: string, rules: string[]): number {
    const bagParentMap = computeBagParentMap(rules);
    const seen = new Set();
    const bagParents = new Set();
    let bagsToVisit = [child];

    while(bagsToVisit.length > 0) {
        const bagToVisit = bagsToVisit.shift();
        if (seen.has(bagToVisit)) { continue; }

        seen.add(bagsToVisit);
        const parents = bagParentMap[bagToVisit as string];
        if (! parents) { continue; }

        parents.forEach(parent => bagParents.add(parent));
        bagsToVisit = bagsToVisit.concat([...parents]);
    }

    return bagParents.size;
}

function countChildrenBags(parent: string, bagChildMap: Record<string, Set<string>>) {
    const parentCount = parseInt(parent.split(" ")[0], 10);
    const parentType = parent.split(" ").slice(1).join(" ");
    const children = [...bagChildMap[parentType]];
    if (! children.length) { return parentCount; }

    const childrenCounts: number[] = children.map(child => countChildrenBags(child, bagChildMap));
    return parentCount * (childrenCounts.reduce((a, b) => a + b) + 1);
}

const rules = inputFile.split("\n").slice(0, -1);
console.log(rules);
console.log(countBagParents("shiny gold", rules));

const bagChildMap = computeBagChildMap(rules);
console.log(countChildrenBags("1 shiny gold", bagChildMap) - 1);
