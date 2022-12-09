const cardPublicKey = 12578151;
const doorPublicKey = 5051300;

let loopSize = 0;
let value = 1;

while(value !== cardPublicKey && value !== doorPublicKey) {
    value = value * 7;
    value = value % 20201227;
    loopSize += 1;
}

const publicKey = value === cardPublicKey ? doorPublicKey : cardPublicKey;
value = 1;
for (let i = 0; i < loopSize; i += 1) {
    value = value * publicKey;
    value = value % 20201227;
}
console.log(value);