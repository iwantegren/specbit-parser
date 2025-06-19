import { InputBitStream } from "./utils/input-stream.js";

export function decode(buffer: Uint8Array): object {
  const stream = new InputBitStream(buffer);

  let result = {};

  result = { key4bit: stream.readBits(4), ...result };
  result = { key1bit: stream.readBits(1), ...result };
  result = { key3bit: stream.readBits(3), ...result };
  result = { key8bit: stream.readBits(8), ...result };

  return result;
}
