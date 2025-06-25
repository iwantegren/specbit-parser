import { InputBitStream } from "./input-stream";
import { OutputBitStream } from "./output-stream";

describe("input-output stream", () => {
  describe("stream tests", () => {
    it("should handle buffer stream", () => {
      const originalBuffer = new Uint8Array([
        0x00, 0x11, 0x22, 0x33, 0x44, 0x55, 0x66, 0x77, 0x88, 0x99, 0xaa, 0xbb,
        0xcc, 0xdd, 0xee, 0xff,
      ]);

      const ins = new InputBitStream(originalBuffer);
      const outs = new OutputBitStream(originalBuffer.length);

      while (!ins.eof()) {
        const remaining = ins.remaining();
        const bitsToRead = Math.min(remaining, 16);
        if (bitsToRead > 0) {
          const bits = ins.readBits(bitsToRead);
          outs.writeBits(bits, bitsToRead);
        }
      }

      const outputBuffer = outs.getBuffer();

      expect(originalBuffer.length).toBe(outputBuffer.length);
      expect(originalBuffer.every((b, i) => b === outputBuffer[i])).toBe(true);
    });

    it("should handle mixed bit sizes stream", () => {
      const originalBuffer = new Uint8Array([0xaa, 0x55, 0xff]);

      const ins = new InputBitStream(originalBuffer);
      const outs = new OutputBitStream(originalBuffer.length);

      outs.writeBits(ins.readBits(3), 3);
      outs.writeBits(ins.readBits(5), 5);
      outs.writeBits(ins.readBits(8), 8);
      outs.writeBits(ins.readBits(4), 4);
      outs.writeBits(ins.readBits(4), 4);

      const outputBuffer = outs.getBuffer();

      expect(originalBuffer.length).toBe(outputBuffer.length);
      expect(originalBuffer.every((b, i) => b === outputBuffer[i])).toBe(true);
    });
  });
});
