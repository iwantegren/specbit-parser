export class OutputBitStream {
  private buffer: Uint8Array;
  private offset: number;

  constructor() {
    this.buffer = new Uint8Array();
    this.offset = 0;
  }
}
