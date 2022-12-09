import { readFileSync } from "fs";

type Expression = Array<number | "(" | ")" | "+" | "*">

function parseExpressions(inputFile: string): Array<Expression> {
    return inputFile.split("\n").map(parseExpression);

    function parseExpression(line: string): Expression {
        return line.split(" ").map(elem => {
            if (elem !== "(" && elem !== ")" && elem !== "+" && elem !== "*") {
                return parseInt(elem, 10)
            }
            return elem;
        })
    }
}

function evaluateExpressionWithoutParentheses(expression: Expression) {
    let value = expression[0] as number;
    let index = 2;

    while(index < expression.length) {
        const operator = expression[index - 1] as "+" | "*";
        const operand = expression[index] as number;
        value = evaluateOperation(operator, operand);
        index += 2;
    }

    return value;

    function evaluateOperation(operator: "+" | "*", operand: number) {
        if (operator === "+") { return value + operand; }
        return value * operand;
    }
}

function evaluateAdvancedExpression(expression: Expression): number {
    let value = expression[0] as number;
    let index = 2;

    while(index < expression.length) {
        const operator = expression[index - 1] as "+" | "*";
        const operand = expression[index] as number;
        if (operator === "*") {
            const rightValue = evaluateAdvancedExpression(expression.slice(index));
            return value * rightValue;
        } else {
            value += operand;
        }
        index += 2;
    }

    return value;
}

function evaluateExpression(expression: Expression, index = 0) {
    const simplifiedExpression: Expression = [];

    while(index < expression.length) {
        if (expression[index] === ")") {
            return [index, evaluateAdvancedExpression(simplifiedExpression)];
        } else if (expression[index] === "(") {
            const parenthesesResult = evaluateExpression(expression, index + 1);
            index = parenthesesResult[0];
            simplifiedExpression.push(parenthesesResult[1]);
        } else {
            simplifiedExpression.push(expression[index]);
        }
        index += 1;
    }

    return [index, evaluateAdvancedExpression(simplifiedExpression)];
}

const inputFile = readFileSync("src/day18/day18.input.txt", "utf8");
const expressions = parseExpressions(inputFile);

console.log(evaluateExpression(parseExpressions("( ( 2 + 4 * 9 ) * ( 6 + 9 * 8 + 6 ) + 6 ) + 2 + 4 * 2")[0]));
console.log(expressions
    .map(expression => evaluateExpression(expression, 0))
    .map(res => res[1])
    .reduce((a, b) => a + b)
);