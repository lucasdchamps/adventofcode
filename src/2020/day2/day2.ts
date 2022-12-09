import { DAY2_INPUT } from "./day2.input";

type MinOccurrences = number;
type MaxOccurrences = number;
type MandatoryLetter = string;
type Password = string;
type PasswordWithOccurrencePolicy = [MinOccurrences, MaxOccurrences, MandatoryLetter, Password];

function countValidPasswordsBasedOnOccurrences(passwordsWithPolicies: [PasswordWithOccurrencePolicy]) {
    return passwordsWithPolicies.filter(passwordWithPolicy => isValidPasswordBasedOnOccurrences(passwordWithPolicy)).length;
}

function isValidPasswordBasedOnOccurrences(passwordWithPolicy: PasswordWithOccurrencePolicy) {
    const [minOccurences, maxOccurences, mandatoryLetter, password] = passwordWithPolicy;
    const letterOccurences = password.split("").filter(letter => mandatoryLetter === letter).length;
    return minOccurences <= letterOccurences && letterOccurences <= maxOccurences;
}

console.log(countValidPasswordsBasedOnOccurrences(DAY2_INPUT as [PasswordWithOccurrencePolicy]));

type FirstPosition = number;
type SecondPosition = number;
type PasswordWithPositionPolicy = [FirstPosition, SecondPosition, MandatoryLetter, Password];

function countValidPasswordsBasedOnPositions(passwordsWithPolicies: [PasswordWithPositionPolicy]) {
    console.log(passwordsWithPolicies.filter(passwordWithPolicy => isValidPasswordBasedOnPositions(passwordWithPolicy)));
    return passwordsWithPolicies.filter(passwordWithPolicy => isValidPasswordBasedOnPositions(passwordWithPolicy)).length;
}

function isValidPasswordBasedOnPositions(passwordWithPolicy: PasswordWithPositionPolicy) {
    const [firstPosition, secondPosition, mandatoryLetter, password] = passwordWithPolicy;
    const letters = password.split('');

    const isLetterInFirstPosition = firstPosition - 1 < letters.length && letters[firstPosition - 1] === mandatoryLetter;
    const isLetterInSecondPosition = secondPosition - 1 < letters.length && letters[secondPosition - 1] === mandatoryLetter;

    return isLetterInFirstPosition && ! isLetterInSecondPosition || isLetterInSecondPosition && ! isLetterInFirstPosition;
}

console.log(countValidPasswordsBasedOnPositions(DAY2_INPUT as [PasswordWithPositionPolicy]));
