import { encode, decode } from "./dist/index.js";

const encoded = encode();
console.log("encoded:", encoded);

const buffer = [0xFF, 0xFF]
const decoded = decode(buffer);
console.log("decoded:", decoded);
