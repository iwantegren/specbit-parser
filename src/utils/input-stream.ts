import { BitStream } from "./bit-stream";
import { BYTE } from "./utils";

export class InputBitStream extends BitStream {
  constructor(buffer: Uint8Array) {
    if (!buffer) {
      throw new Error("Buffer not provided");
    }
    super(buffer);
  }

  public readBit(): boolean {
    this.checkEof();

    const bit = (this.buffer[this.byteOffset] >> (7 - this.bitOffset)) & 1;

    this.moveBit();

    if (this.eof()) console.debug(`EOF`);

    return !!bit;
  }

  protected readByte(): number {
    if (this.bitOffset !== 0) {
      throw new Error("Can read only whole byte");
    }

    const byte = this.buffer[this.byteOffset];
    this.moveByte();

    console.debug(`byte ${this.eof() ? "EOF" : ""}`);
    return byte;
  }

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
      count--;
    }

    console.debug(`readBits ${bits}`);
    return result;
  }

  public skipBits(length: number): void {
    this.readBits(length);
  }

  public seekToStart(position: number): void {
    this.bitOffset = 0;
    this.byteOffset = 0;
  }

  public tell(): number {
    return this.bitOffset + this.byteOffset * BYTE;
  }

  public remaining(): number {
    return this.buffer.length * BYTE - this.tell();
  }
}
