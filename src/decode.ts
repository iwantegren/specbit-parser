import { Decoder } from "./decoder.js";
import {
  DecoderConfig,
  PacketPayload,
  PacketRecord,
  PacketSpec,
} from "./types.js";

export function decode(
  buffer: Uint8Array,
  config: PacketSpec,
  opts: Partial<DecoderConfig> = {}
): PacketPayload {
  return Decoder.create(buffer, config, opts).getPayload();
}
