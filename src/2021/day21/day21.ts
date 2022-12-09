import { readFileSync } from "fs";
import { toInt } from "../../utils";

const input = readFileSync("src/2021/day21/day21.input.txt", "utf8");

class PossibleRoll {
    roll: number;
    occurrences = 1;

    constructor(roll: number) {
        this.roll = roll;
    }

    equals(other: PossibleRoll): boolean {
        return this.roll === other.roll
    }
}

const possibleRolls: PossibleRoll[] = [];
for (const roll1 of [1, 2, 3]) {
    for (const roll2 of [1, 2, 3]) {
        for (const roll3 of [1, 2, 3]) {
            const roll = new PossibleRoll(roll1 + roll2 + roll3);
            const existingRoll = possibleRolls.find(r => r.equals(roll));
            if (existingRoll) { existingRoll.occurrences += 1; }
            else { possibleRolls.push(roll); }
        }
    }
}
console.log(possibleRolls);

class DeterministicDie {
    value = 1;
    nbRolls = 0;

    roll() {
        const res = this.value;
        this.value += 1;
        if (this.value > 100) {
            this.value = 1;
        }
        this.nbRolls += 1;
        return res;
    }
}

class Player {
    index: number;
    score = 0;
    position: number;

    constructor(index: number, position: number) {
        this.index = index;
        this.position = position - 1;
    }

    play(die: DeterministicDie) {
        const dieResult = die.roll() + die.roll() + die.roll();
        this.position = (this.position + dieResult) % 10;
        this.score += this.position + 1;
    }

    hasWon() {
        return this.score >= 1000;
    }
}

class DiracPlayer {
    index: number;
    position: number;
    score = 0;

    constructor(index: number, position: number, score: number) {
        this.index = index;
        this.position = position;
        this.score = score;
    }

    play(dieResult: number) {
        this.position = (this.position + dieResult) % 10;
        this.score += this.position + 1;
    }

    hasWon() {
        return this.score >= 21;
    }

    copy() {
        return new DiracPlayer(this.index, this.position, this.score);
    }
}

function parseInput(lines: string[]) {
    return [
        new DiracPlayer(1, toInt(lines[0].split(": ")[1]) - 1, 0),
        new DiracPlayer(2, toInt(lines[1].split(": ")[1]) - 1, 0)
    ];
}

// let res = parseInput(input.split("\n"));

function part1(players: Player[]) {
    const die = new DeterministicDie();

    while (! players.find(player => player.hasWon())) {
        let player = players[0];
        player.play(die);
        if (player.hasWon()) {
            return players[1].score * die.nbRolls;
        }

        player = players[1];
        player.play(die);
        if (player.hasWon()) {
            return players[0].score * die.nbRolls;
        }
    }
    
    return 0;
}

// console.log(part1(res));

class DiracGame {
    player1: DiracPlayer;
    player2: DiracPlayer;
    winner: number;
    nbGames: number;

    constructor(player1: DiracPlayer, player2: DiracPlayer, nbGames: number, winner?: number) {
        this.player1 = player1;
        this.player2 = player2;
        this.nbGames = nbGames;
        if (winner) { this.winner = winner; }
    }

    copy() {
        return new DiracGame(this.player1.copy(), this.player2.copy(), this.nbGames, this.winner);
    }

    split() {
        const newDiracGames = [];

        for (const roll1 of possibleRolls) {
            for (const roll2 of possibleRolls) {
                const newDiracGame = this.copy();
                newDiracGame.nbGames *= roll1.occurrences;
                newDiracGame.play1(roll1.roll);
                if (! newDiracGame.winner) {
                    newDiracGame.nbGames *= roll2.occurrences;
                    newDiracGame.play2(roll2.roll);
                }
                newDiracGames.push(newDiracGame);
            }
        }

        return newDiracGames;
    }

    play1(roll: number) {
        this.player1.play(roll);
        if (this.player1.hasWon()) {
            this.winner = 1;
        }
    }
    play2(roll: number) {
        this.player2.play(roll);
        if (this.player2.hasWon()) {
            this.winner = 2;
        }
    }
}

function part2(players: DiracPlayer[]) {
    const diracGames = [new DiracGame(players[0], players[1], 1)];
    const winCounts: Record<number, number> = {
        1: 0,
        2: 0
    };

    while (diracGames.length) {
        const diracGame = diracGames.pop()!;
        if (diracGame.winner) {
            winCounts[diracGame.winner] += diracGame.nbGames;
            continue;
        }

        const newDiracGames = diracGame.split();
        for (const newDiracGame of newDiracGames) {
            diracGames.push(newDiracGame);
        }
    }

    winCounts[1] /= possibleRolls.length;
    console.log(Math.max(...Object.values(winCounts)));
    return winCounts;
}

const res = parseInput(input.split("\n"));

console.log(part2(res));

444356092776315
3110492649434205