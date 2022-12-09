
class QueueElement {
    element: any;
    priority: number;

    constructor(element: any, priority: number) {
        this.element = element;
        this.priority = priority;
    }
}

export class PriorityQueue {
    items: QueueElement[] = [];

    add(element: any, priority: number) {
        this.items.push(new QueueElement(element, priority));
    }

    enqueue(element: any, priority: number){
        const queueElement = new QueueElement(element, priority);

        let added = false;
        for(let i = 0; i < this.items.length; i++){
            if(queueElement.priority > this.items[i].priority){
                this.items.splice(i, 0, queueElement);

                added = true;
                break;
            }
        }

        if(! added){
            this.items.push(queueElement);
        }
    }

    remove(element: any) {
        const elementIndex = this.items.findIndex(item => item.element === element);
        this.items.splice(elementIndex, 1);
    }

    //Remove element from the queue
    dequeue() {
        return this.items.pop();
    }

    isEmpty() {
        return this.items.length == 0;
    }

    size() {
        return this.items.length;
    }

    print() {
        for(let i = 0; i < this.items.length; i++){
            console.log(`${this.items[i].element} - ${this.items[i].priority}`);
        }
    }
}
