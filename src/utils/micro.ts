export function toInt(n: string): number {
    return parseInt(n);
}

export function prettyPrint(obj: any): void {
    console.log(JSON.stringify(obj, null, 2));
}
