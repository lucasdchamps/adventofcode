import { readFileSync } from "fs";

type Food = {
    ingredients: Array<string>;
    allergens: Array<string>;
}

function parseFoods(inputFile: string): Array<Food> {
    return inputFile.split("\n").map(parseFood);

    function parseFood(line: string): Food {
        const ingredients = line.split(" (")[0].split(" ");
        const allergens = line.match(/ \(contains (.*)\)/)![1].split(", ");
        return {
            ingredients,
            allergens
        }
    }
}

function computeAllergenIngredientsMap(foods: Array<Food>): Record<string, Array<Set<string>>> {
    const allergenIngredientsMap: Record<string, Array<Set<string>>> = {};

    foods.forEach(food => {
        food.allergens.forEach(allergen => {
            if (! allergenIngredientsMap[allergen]) {
                allergenIngredientsMap[allergen] = [];
            }
            allergenIngredientsMap[allergen].push(new Set(food.ingredients));
        })
    })

    return allergenIngredientsMap;
}

function reduceAllergenIngredientMap(allergenIngredientsMap: Record<string, Array<Set<string>>>): Record<string, Set<string>> {
    const reducedMap: Record<string, Set<string>> = {};

    for (const [allergen, ingredientSets] of Object.entries(allergenIngredientsMap)) {
        reducedMap[allergen] = ingredientSets[0];
        for (const ingredientSet of ingredientSets) {
            reducedMap[allergen] = new Set([...reducedMap[allergen]].filter(x => ingredientSet.has(x)));
        }
    }

    return reducedMap;
}

function associateAllergenToIngredient(reducedMap: Record<string, Set<string>>): Record<string, string> {
    const associatedAllergens: Record<string, string> = {};
    let allergenToAssociate = findAllergenToAssociate();

    while(allergenToAssociate) {
        const associatedIngredient = [...reducedMap[allergenToAssociate]][0];
        associatedAllergens[allergenToAssociate] = associatedIngredient;
        removeIngredient(associatedIngredient);
        allergenToAssociate = findAllergenToAssociate();
    }

    return associatedAllergens;

    function findAllergenToAssociate() {
        return Object.keys(reducedMap).find(allergen =>
            reducedMap[allergen].size === 1 && ! associatedAllergens[allergen]
        )
    }
    function removeIngredient(ingredient: string) {
        Object.values(reducedMap).forEach(ingredientsSet => ingredientsSet.delete(ingredient));
    }
}

function computeDangerousIngredientList(associatedAllergens: Record<string, string>): string {
    const foodAllergenCouples: Array<[string, string]> = [];
    for(const [allergen, food] of Object.entries(associatedAllergens)) {
        foodAllergenCouples.push([food, allergen]);
    }
    foodAllergenCouples.sort((couple1, couple2) => {
        if (couple1[1] < couple2[1]) { return -1; }
        if (couple1[1] > couple2[1]) { return 1; }
        return 0;
    });
    return foodAllergenCouples.map(couple => couple[0]).join(",");
}

const inputFile = readFileSync("src/day21/day21.input.txt", "utf8");
const foods = parseFoods(inputFile);

const allergenIngredientsMap = computeAllergenIngredientsMap(foods);
const reducedAllergenIngredientMap = reduceAllergenIngredientMap(allergenIngredientsMap);
const associatedAllergens = associateAllergenToIngredient(reducedAllergenIngredientMap);
console.log(associatedAllergens);

const foodsWithAllergens = Object.values(associatedAllergens);
const allFoodsAppearances = foods.map(food => food.ingredients).flat();
const foodsWithoutAllergenAppearances = allFoodsAppearances.filter(food => ! foodsWithAllergens.includes(food));
console.log(foodsWithoutAllergenAppearances.length);

console.log(computeDangerousIngredientList(associatedAllergens));