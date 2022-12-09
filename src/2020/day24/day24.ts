import { readFileSync } from "fs";

type Location = {
    north: number;
    east: number;
}

type Color = "white" | "black";

type Tiles = Record<string, Color>;

function flipTile(color = "white") {
    return color === "white" ? "black" : "white";
}

function flipTiles(tileFlips: Array<string>): Tiles {
    const tiles: Tiles = {};

    tileFlips.forEach(tileFlip => {
        const location = getTileLocation(tileFlip);
        tiles[location] = flipTile(tiles[location]);
    });

    return tiles;

    function getTileLocation(loc: string): string {
        let i = 0;
        const tileLocation = { north: 0, east: 0 };

        while(i < loc.length) {
            if (loc[i] === "e") {
                tileLocation.east += 1;
            } else if (loc[i] === "w") {
                tileLocation.east -= 1;
            } else if (loc[i] === "n") {
                tileLocation.north += 1;
                i += 1;
                if (loc[i] === "e") {
                    tileLocation.east += 0.5;
                } else if (loc[i] === "w") {
                    tileLocation.east -= 0.5;
                }
            } else if (loc[i] === "s") {
                tileLocation.north -= 1;
                i += 1;
                if (loc[i] === "e") {
                    tileLocation.east += 0.5;
                } else if (loc[i] === "w") {
                    tileLocation.east -= 0.5;
                }
            }
            i += 1;
        }

        return JSON.stringify(tileLocation);
    }
}

function flipSimultaneously(tiles: Tiles) {
    const flips: Record<string, Color> = {};
    let locations = [...Object.keys(tiles)];

    while(locations.length) {
        const location = locations.shift() as string;
        if (flips[location]) {
            continue;
        }

        const color = tiles[location] || "white";

        const adjacentLocations = getAdjacentLocations(JSON.parse(location));
        const nbAdjacentBlacks = adjacentLocations.map(l => tiles[l]).filter(c => c === "black").length;

        if (tiles[location] && (color === "black" || nbAdjacentBlacks > 0)) {
            locations = [...locations, ...adjacentLocations];
        }

        if(color === "black" && (nbAdjacentBlacks === 0 || nbAdjacentBlacks > 2)) {
            flips[location] = "white";
        } else if (color === "white" && nbAdjacentBlacks === 2) {
            flips[location] = "black";
        } else {
            flips[location] = color;
        }
    }

    for(const [location, nextColor] of Object.entries(flips)) {
        tiles[location] = nextColor;
    }

    function getAdjacentLocations(loc: Location): Array<string> {
        return [
            { north: loc.north, east: loc.east + 1 },
            { north: loc.north, east: loc.east - 1 },
            { north: loc.north + 1, east: loc.east + 0.5 },
            { north: loc.north + 1, east: loc.east - 0.5 },
            { north: loc.north - 1, east: loc.east + 0.5 },
            { north: loc.north - 1, east: loc.east - 0.5 },
        ].map(adjacentLoc => JSON.stringify(adjacentLoc));
    }
}

const inputFile = readFileSync("src/day24/day24.input.txt", "utf8");
const tileFlips = inputFile.split("\n");
const tiles = flipTiles(tileFlips);
console.log(Object.values(tiles).filter(c => c === "black").length);

for (let i = 0; i < 100; i++) {
    flipSimultaneously(tiles);

    if(i > 0 && i % 10 === 0) {
        console.log("10 done");
    }
}

console.log(Object.values(tiles).filter(c => c === "black").length);
