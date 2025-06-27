import { Encoder } from "./encoder";
import { EncoderConfig, PacketPayload } from "./types";

export function encode(
  payload: PacketPayload,
  opts: Partial<EncoderConfig> = {}
): Uint8Array {
  return Encoder.create(payload, opts).getBuffer();
}
