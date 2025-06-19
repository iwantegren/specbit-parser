const BYTE = 8;

export class InputBitStream {
  private bitOffset: number = 0;
  private byteOffset: number = 0;

  constructor(private readonly buffer: Uint8Array) {
    if (!this.buffer) {
      throw new Error("Buffer not provided");
    }

    console.log("buffer: ", this.buffer);
  }

  public readBit(): boolean {
    this.checkEof();

    const bit = (this.buffer[this.byteOffset] >> (7 - this.bitOffset)) & 1;

    this.moveBit();

    if (this.eof()) console.debug(`EOF`);

    return !!bit;
  }

  private readByte(): number {
    if (this.bitOffset !== 0) {
      throw new Error("Can read only whole byte");
    }

    const byte = this.buffer[this.byteOffset];
    this.moveByte();

    console.debug(`byte ${this.eof() ? "EOF" : ""}`);
    return byte;
  }

  public readBits(bits: number): BigInt {
    let result = 0n;
    let count = bits;

    while (this.bitOffset !== 0 && count > 0) {
      result = (result << 1n) | (this.readBit() ? 1n : 0n);
      --count;
    }

    while (count >= 8) {
      const b = this.readByte();
      result = (result << 8n) | BigInt(b);
      count -= 8;
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

  public eof(): boolean {
    return this.bitOffset + this.byteOffset * BYTE >= this.buffer.length * BYTE;
  }

  private checkEof(): void {
    if (this.eof()) throw new Error("No more bits left");
  }

  private moveBit(): void {
    ++this.bitOffset;

    if (this.bitOffset === 8) {
      this.bitOffset = 0;
      this.moveByte();
    }
  }

  private moveByte(): void {
    ++this.byteOffset;
  }
}
