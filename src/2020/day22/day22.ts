import { readFileSync } from "fs";

type Deck = Array<number>;
type GameResult = {
    winner: 1 | 2;
    deck1: Deck;
    deck2: Deck;
}

function parseDeck(deckString: string): Deck {
    return deckString.split("\n").slice(1).map(value => parseInt(value, 10));
}

function playCombat(deck1: Deck, deck2: Deck): GameResult {
    while(deck1.length > 0 && deck2.length > 0) {
        const card1 = deck1.shift()!;
        const card2 = deck2.shift()!;
        if (card1 > card2) {
            deck1.push(card1);
            deck1.push(card2);
        } else {
            deck2.push(card2);
            deck2.push(card1);
        }
    }

    if (deck1.length === 0) { return { winner: 2, deck1, deck2 }; }
    return { winner: 1, deck1, deck2 };
}

function playRecursiveCombat(deck1: Deck, deck2: Deck, seen: Set<string>): GameResult {
    while(deck1.length > 0 && deck2.length > 0) {
        const decksString = JSON.stringify([deck1, deck2]);
        if (seen.has(decksString)) { return { winner: 1, deck1, deck2 } }
        seen.add(decksString);

        const card1 = deck1.shift()!;
        const card2 = deck2.shift()!;
        if (card1 <= deck1.length && card2 <= deck2.length) {
            const gameResult = playRecursiveCombat(deck1.slice(0, card1), deck2.slice(0, card2), new Set());
            if (gameResult.winner === 1) {
                deck1.push(card1);
                deck1.push(card2);
            } else {
                deck2.push(card2);
                deck2.push(card1);
            }
        } else if (card1 > card2) {
            deck1.push(card1);
            deck1.push(card2);
        } else {
            deck2.push(card2);
            deck2.push(card1);
        }
    }

    if (deck1.length === 0) { return { winner: 2, deck1, deck2 }; }
    return { winner: 1, deck1, deck2 };
}

function computeScore(deck: Deck) {
    let score = 0;
    let multiplier = 1;
    for (let i = deck.length - 1; i >= 0; i -= 1) {
        score += deck[i] * multiplier;
        multiplier += 1;
    }
    return score;
}

const inputFile = readFileSync("src/day22/day22.input.txt", "utf8");
const deckStrings = inputFile.split("\n\n");
let [deck1, deck2] = deckStrings.map(parseDeck);
playCombat(deck1, deck2);
console.log(computeScore(deck2));

[deck1, deck2] = deckStrings.map(parseDeck);
const gameResult = playRecursiveCombat(deck1, deck2, new Set());
console.log(gameResult);
console.log(computeScore(deck1));
console.log(computeScore(deck2));
