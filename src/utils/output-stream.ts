import { BitStream } from "./bit-stream";
import { BYTE } from "./utils";

export class OutputBitStream extends BitStream {
  constructor(capacity: number) {
    if (!capacity || capacity <= 0) {
      throw new Error("Invalid stream capacity");
    }
    super(new Uint8Array(capacity));
  }

  protected writeBit(bit: boolean): void {
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

  /**
   * Writes a specified number of bits from a bigint value to the stream.
   * The bits are written from most significant to least significant.
   * @param value The bigint value to write bits from. Must be non-negative.
   * @param count The number of bits to write from the value.
   * @throws {Error} If value is negative or if there is not enough space in the buffer.
   */
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

  /**
   * Returns the underlying buffer containing all written data.
   * @returns A Uint8Array containing the written data.
   */
  public getBuffer(): Uint8Array {
    return this.buffer;
  }
}
