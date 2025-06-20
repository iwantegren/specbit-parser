import { ProtocolPayload } from "./types";
import { OutputBitStream } from "./utils/output-stream";
import { configByteLength } from "./utils/utils";

export function encode(payload: ProtocolPayload): Uint8Array {
  const totalBytes = configByteLength(payload);

  const obs = new OutputBitStream(totalBytes);

  for (const field of payload) {
    if (field.rsvd) {
      obs.writeBits(0n, field.length);
    } else {
      obs.writeBits(field.value, field.length);
    }
  }

  return obs.getBuffer();
}
