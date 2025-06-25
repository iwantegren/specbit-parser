import { BitStream } from "./bit-stream";
import { BYTE } from "./utils";

export class InputBitStream extends BitStream {
  constructor(buffer: Uint8Array) {
    if (!buffer) {
      throw new Error("Buffer not provided");
    }
    super(buffer);
  }

  protected readBit(): boolean {
    this.checkEof();

    const bit = (this.buffer[this.byteOffset] >> (7 - this.bitOffset)) & 1;

    this.moveBit();

    return !!bit;
  }

  protected readByte(): number {
    if (this.bitOffset !== 0) {
      throw new Error("Can read only whole byte");
    }

    const byte = this.buffer[this.byteOffset];
    this.moveByte();

    return byte;
  }

  protected tell(): number {
    return this.bitOffset + this.byteOffset * BYTE;
  }

  /**
   * Reads a specified number of bits from the stream and returns them as a bigint.
   * The bits are read from most significant to least significant.
   * @param bits The number of bits to read from the stream.
   * @returns A bigint containing the read bits.
   * @throws {Error} If there are not enough bits remaining in the buffer.
   */
  public readBits(bits: number): bigint {
    let result = 0n;
    let count = bits;

    while (this.bitOffset !== 0 && count > 0) {
      result = (result << 1n) | (this.readBit() ? 1n : 0n);
      --count;
    }

    while (count >= BYTE) {
      const b = this.readByte();
      result = (result << 8n) | BigInt(b);
      count -= BYTE;
    }

    while (count > 0) {
      result = (result << 1n) | (this.readBit() ? 1n : 0n);
      --count;
    }

    return result;
  }

  /**
   * Skips a specified number of bits in the stream.
   * @param length The number of bits to skip.
   * @throws {Error} If there are not enough bits remaining in the buffer.
   */
  public skipBits(length: number): void {
    this.readBits(length);
  }

  /**
   * Returns the number of bits remaining in the stream.
   * @returns The number of unread bits in the buffer.
   */
  public remaining(): number {
    return this.buffer.length * BYTE - this.tell();
  }
}
