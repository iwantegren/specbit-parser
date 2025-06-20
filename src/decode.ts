import { ProtocolField } from "./types.js";
import { InputBitStream } from "./utils/input-stream.js";
import { configBitLength } from "./utils/utils.js";

export function decode(
  buffer: Uint8Array,
  config: ProtocolField[],
  strictLength: boolean = true // allow buffer length differs from configs
): Record<string, bigint> {
  const stream = new InputBitStream(buffer);

  if (strictLength) {
    const streamLength = stream.remaining();
    const configLength = configBitLength(config);
    if (streamLength !== configLength) {
      throw new Error(
        `Buffer length (${streamLength}) doesn't match expected protocol length (${configLength})`
      );
    }
  }

  const result: Record<string, bigint> = {};

  try {
    for (const field of config) {
      if (field.rsvd) {
        stream.skipBits(field.length);
        continue;
      }

      result[field.name] = stream.readBits(field.length);
    }
  } catch (e) {
    console.warn(e);
  } finally {
    return result;
  }
}
