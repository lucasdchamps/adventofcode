type Index = string | number;

export class Counter {
    counter: Record<Index, number>;

    constructor(values: Index[]) {
        this.counter = {};
        for (const value of  values) {
            this.counter[value] = this.counter[value] ? this.counter[value] + 1 : 1;
        }
    }

    getCount(value: Index) {
        return this.counter[value] || 0;
    }

    setCount(value: Index, count: number) {
        this.counter[value] = count;
    }

    total() {
        return Object.values(this.counter).reduce((prev, curr) => prev + curr);
    }

    max() {
        return Math.max(...Object.values(this.counter));
    }

    min() {
        return Math.min(...Object.values(this.counter));
    }
}