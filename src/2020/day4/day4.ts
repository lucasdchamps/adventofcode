import { DAY4_INPUT } from "./day4.input";

const MANDATORY_FIELDS = new Set(["byr", "iyr", "eyr", "hgt", "hcl", "ecl", "pid"]);

type Passport = {
    byr: string;
    iyr: string;
    eyr: string;
    hgt: string;
    hcl: string;
    ecl: string;
    pid: string;
    cid?: string;
}

function countValidPassports(passportSequences: string[]) {
    return passportSequences.filter(isValidPassport).length;
}

function isValidPassport(passportSequence: string) {
    if (! hasAllMandatoryFields(passportSequence)) { return false; }

    const passport = buildPassport(passportSequence);
    return isBirthYearValid(passport) &&
        isIssueYearValid(passport) &&
        isExpirationYearValid(passport) &&
        isHeightValid(passport) &&
        isHairColorValid(passport) &&
        isEyeColorValid(passport) &&
        isPassportIdValid(passport)
}

function hasAllMandatoryFields(passportSequence: string) {
    const pairs = passportSequence.split(" ");
    const fields = pairs.map(pair => pair.split(":")[0]).filter(field => MANDATORY_FIELDS.has(field));
    return fields.length === MANDATORY_FIELDS.size;
}

function buildPassport(passportSequence: string): Passport {
    const pairs = passportSequence.split(" ");
    const keyValues = pairs.map(pair => pair.split(":"));
    return Object.fromEntries(keyValues) as Passport;
}

function isBirthYearValid(passport: Passport) {
    const birthYear = parseInt(passport.byr, 10);
    return 1920 <= birthYear && birthYear <= 2002;
}
function isIssueYearValid(passport: Passport) {
    const issueYear = parseInt(passport.iyr, 10);
    return 2010 <= issueYear && issueYear <= 2020;
}
function isExpirationYearValid(passport: Passport) {
    const expirationYear = parseInt(passport.eyr, 10);
    return 2020 <= expirationYear && expirationYear <= 2030;
}
function isHeightValid(passport: Passport) {
    const heightUnitMatch = passport.hgt.match(/(cm|in)/);
    if (! heightUnitMatch) { return false; }

    const heightMatch = passport.hgt.match(/\d+/);
    if (! heightMatch) { return false; }

    const heightUnit = heightUnitMatch[0];
    const height = parseInt(heightMatch[0], 10);
    if (heightUnit === "cm") { return isCmHeightValid(); }
    if (heightUnit === "in") { return isInHeightValid(); }

    function isCmHeightValid() {
        return 150 <= height && height <= 193;
    }

    function isInHeightValid() {
        return 59 <= height && height <= 76;
    }
}
function isHairColorValid(passport: Passport) {
    return !! passport.hcl.match(/^#[0-9a-f]{6}$/);
}
function isEyeColorValid(passport: Passport) {
    return ["amb", "blu", "brn", "gry", "grn", "hzl", "oth"].includes(passport.ecl);
}
function isPassportIdValid(passport: Passport) {
    return !! passport.pid.match(/^[0-9]{9}$/);
}

console.log(countValidPassports(DAY4_INPUT));
