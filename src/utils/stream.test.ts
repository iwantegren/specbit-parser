import { InputBitStream } from "./input-stream";
import { OutputBitStream } from "./output-stream";

describe("stream", () => {
  it("input to output stream should produce the same result", () => {
    const buffer = new Uint8Array([
      0xff, 0x01, 0xa6, 0x52, 0x32, 0x11, 0x92, 0xf1,
    ]);
    const ins = new InputBitStream(buffer);
    const outs = new OutputBitStream(buffer.length);

    outs.writeBits(ins.readBits(8), 8);
    outs.writeBits(ins.readBits(16), 16);
    outs.writeBits(ins.readBits(13), 13);
    while (!ins.eof()) {
      outs.writeBit(ins.readBit());
    }

    const outBuf = outs.getBuffer();

    expect(buffer.length).toEqual(outBuf.length);
    expect(buffer.every((b, i) => b === outBuf[i]));
  });
});
