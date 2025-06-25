import { Decoder } from "./decoder.js";
import { DecoderConfig, FieldSpec, PacketPayload } from "./types.js";

export function decodeRecord(
  buffer: Uint8Array,
  config: FieldSpec[],
  opts: Partial<DecoderConfig> = {}
): Record<string, bigint> {
  return Decoder.create(buffer, config, opts).decodeRecord();
}

export function decode(
  buffer: Uint8Array,
  config: FieldSpec[],
  opts: Partial<DecoderConfig> = {}
): PacketPayload {
  return Decoder.create(buffer, config, opts).decodePayload();
}
