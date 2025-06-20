import { BitStream } from "./bit-stream";
import { BYTE } from "./utils";

export class OutputBitStream extends BitStream {
  constructor(capacity: number) {
    if (!capacity || capacity <= 0) {
      throw new Error("Invalid stream capacity");
    }
    super(new Uint8Array(capacity));
  }

  public writeBit(bit: boolean): void {
    this.checkEof();

    if (bit) {
      this.buffer[this.byteOffset] |= 1 << (7 - this.bitOffset);
    }

    this.moveBit();
  }

  protected writeByte(value: number): void {
    this.checkEof();

    if (this.bitOffset !== 0) {
      throw new Error("Cannot write a whole byte unless bitOffset is 0");
    }

    this.buffer[this.byteOffset] = value & 0xff;
    this.moveByte();
  }

  public writeBits(value: bigint, count: number): void {
    if (value < 0n) {
      throw new Error("Cannot write negative bigint");
    }
    let remaining = count;

    while (this.bitOffset !== 0 && remaining > 0) {
      const bitPos = BigInt(remaining - 1);
      const bit = ((value >> bitPos) & 1n) === 1n;
      this.writeBit(bit);
      --remaining;
    }

    while (remaining >= BYTE) {
      const shift = BigInt(remaining - BYTE);
      const nextByte = Number((value >> shift) & 0xffn);
      this.writeByte(nextByte);
      remaining -= BYTE;
    }

    while (remaining > 0) {
      const bitPos = BigInt(remaining - 1);
      const bit = ((value >> bitPos) & 1n) === 1n;
      this.writeBit(bit);
      --remaining;
    }
  }

  public getBuffer(): Uint8Array {
    return this.buffer;
  }
}
