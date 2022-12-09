
function playMemory(startingNumbers: number[]) {
    let turn = 1;
    let lastSpokenNumber = 0;
    const mem: Record<number, number> = {};

    while (turn <= 30000000) {
        const newNumber = findNewNumber();
        if (turn > 1) {
            mem[lastSpokenNumber] = turn - 1;
        }
        lastSpokenNumber = newNumber;
        turn += 1;
    }

    return lastSpokenNumber;

    function findNewNumber() {
        if (turn <= startingNumbers.length) { return startingNumbers[turn - 1]; }
        if (mem[lastSpokenNumber]) { return (turn - 1) - mem[lastSpokenNumber]; }
        return 0;
    }
}

const startingNumbers = [10,16,6,0,1,17];

console.log(playMemory(startingNumbers));