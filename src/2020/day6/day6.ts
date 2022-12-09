import { readFileSync } from 'fs';

const inputFile = readFileSync("src/day6/day6.input.txt", "utf8");

function sumDistinctAnswersPerGroup(groupsAnswers: string[]) {
    return groupsAnswers.map((groupAnswers: string) => getDistinctAnswers(groupAnswers).length).reduce((a: number, b: number) => a + b);
}

function getDistinctAnswers(groupAnswers: string) {
    const personsAnswers = groupAnswers.split("\n");
    const distinctAnswers = new Set();
    personsAnswers.forEach(personAnswers => {
        personAnswers.split("").forEach(answer => distinctAnswers.add(answer));
    })
    return [...distinctAnswers];
}

function sumCommonAnswersPerGroup(groupsAnswers: string[]) {
    return groupsAnswers.map((groupAnswers: string) => getCommonAnswers(groupAnswers).length).reduce((a: number, b: number) => a + b);
}

function getCommonAnswers(groupAnswers: string) {
    const personsAnswers = groupAnswers.split("\n");
    let commonAnswers = new Set(personsAnswers[0].split(""));

    for (let personIdx = 1; personIdx < personsAnswers.length; personIdx++) {
        const personAnswers = personsAnswers[personIdx].split("");
        commonAnswers = new Set(personAnswers.filter(answer => commonAnswers.has(answer)));
    }

    return [...commonAnswers];
}

const groupsAnswers = inputFile.split("\n\n");
console.log(sumDistinctAnswersPerGroup(groupsAnswers));
console.log(sumCommonAnswersPerGroup(groupsAnswers));
