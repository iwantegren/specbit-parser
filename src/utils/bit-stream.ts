import { BYTE } from "./utils";

export class BitStream {
  protected bitOffset: number = 0;
  protected byteOffset: number = 0;

  constructor(protected buffer: Uint8Array) {}

  public eof(): boolean {
    return this.bitOffset + this.byteOffset * BYTE >= this.buffer.length * BYTE;
  }

  protected checkEof(): void {
    if (this.eof()) throw new Error("No more bits left");
  }

  protected moveBit(): void {
    ++this.bitOffset;

    if (this.bitOffset === BYTE) {
      this.bitOffset = 0;
      this.moveByte();
    }
  }

  protected moveByte(): void {
    ++this.byteOffset;
  }
}
