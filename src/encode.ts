import { Encoder } from "./encoder";
import { PacketPayload } from "./types";

export function encode(payload: PacketPayload): Uint8Array {
  return Encoder.create(payload).encodeBuffer();
}
