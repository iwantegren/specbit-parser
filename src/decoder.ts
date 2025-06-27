import { InputBitStream } from "./utils/input-stream.js";
import { payloadToRecord, specBitLength } from "./utils/utils.js";
import {
  PacketSpec,
  PacketPayload,
  PacketRecord,
  DecoderConfig,
  defaultDecoderConfig,
} from "./types.js";

export class Decoder {
  private buffer: Uint8Array;
  private specs: PacketSpec;
  private opts: Required<DecoderConfig>;

  private _payload: PacketPayload | null = null;

  private constructor(
    buffer: Uint8Array,
    specs: PacketSpec,
    opts: Required<DecoderConfig>
  ) {
    this.buffer = buffer;
    this.specs = specs;
    this.opts = opts;
  }

  public static create(
    buffer: Uint8Array,
    specs: PacketSpec,
    opts?: Partial<DecoderConfig>
  ): Decoder {
    const config: Required<DecoderConfig> = {
      ...defaultDecoderConfig,
      ...(opts ?? {}),
    };

    const stream = new InputBitStream(buffer);
    const remaining = stream.remaining();
    const expected = specBitLength(specs);

    if (config.strictLength) {
      if (remaining !== expected) {
        throw new Error(
          `Buffer length (${remaining}) doesn't match expected protocol length (${expected})`
        );
      }
    } else if (remaining < expected) {
      throw new Error(
        `Buffer length (${remaining}) is less than expected protocol length (${expected})`
      );
    }

    return new Decoder(buffer, specs, config);
  }

  public getPayload(): PacketPayload {
    if (this._payload) return this._payload;

    const stream = new InputBitStream(this.buffer);

    const result: PacketPayload = [];
    for (const spec of this.specs) {
      if (spec.rsvd) {
        stream.skipBits(spec.length);
        result.push({ ...spec, value: 0n });
        continue;
      }

      const value = stream.readBits(spec.length);
      result.push({ ...spec, value });
    }

    this._payload = result;
    return result;
  }

  public getRecord(): PacketRecord {
    return payloadToRecord(this.getPayload(), this.opts);
  }
}
