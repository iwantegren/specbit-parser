import { defaultEncoderConfig, EncoderConfig, PacketPayload } from "./types";
import { OutputBitStream } from "./utils/output-stream";
import { BYTE, specBitLength, specByteLength } from "./utils/utils";

export class Encoder {
  private payload: PacketPayload;
  private opts: Required<EncoderConfig>;
  private _buffer: Uint8Array | null = null;

  private constructor(payload: PacketPayload, opts: Required<EncoderConfig>) {
    this.payload = payload;
    this.opts = opts;
  }

  public static create(
    payload: PacketPayload,
    opts?: Partial<EncoderConfig>
  ): Encoder {
    const config: Required<EncoderConfig> = {
      ...defaultEncoderConfig,
      ...(opts ?? {}),
    };
    return new Encoder(payload, config);
  }

  public encodeBuffer(): Uint8Array {
    if (this._buffer) return this._buffer;

    const bitLen = specBitLength(this.payload);

    let totalBytes: number;
    if (this.opts.byteAligned) {
      totalBytes = specByteLength(this.payload);
    } else {
      totalBytes = Math.ceil(bitLen / BYTE);
    }

    const obs = new OutputBitStream(totalBytes);
    for (const field of this.payload) {
      if (field.rsvd) {
        obs.writeBits(0n, field.length);
      } else {
        obs.writeBits(field.value, field.length);
      }
    }

    if (!this.opts.byteAligned) {
      const padBits = totalBytes * BYTE - bitLen;
      if (padBits > 0) obs.writeBits(0n, padBits);
    }

    this._buffer = obs.getBuffer();
    return this._buffer;
  }
}
