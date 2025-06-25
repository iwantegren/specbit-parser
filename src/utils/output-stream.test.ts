import { OutputBitStream } from "./output-stream";

describe("OutputBitStream", () => {
  describe("constructor", () => {
    it("should create OutputBitStream with valid capacity", () => {
      // #fuzzy
      const stream = new OutputBitStream(8);
      expect(stream).toBeInstanceOf(OutputBitStream);
    });

    it("should throw error when capacity is not provided", () => {
      // #fuzzy
      expect(() => new OutputBitStream(null as any)).toThrow(
        "Invalid stream capacity"
      );
      expect(() => new OutputBitStream(undefined as any)).toThrow(
        "Invalid stream capacity"
      );
    });

    it("should throw error when capacity is 0 or negative", () => {
      // #fuzzy
      expect(() => new OutputBitStream(0)).toThrow("Invalid stream capacity");
      expect(() => new OutputBitStream(-1)).toThrow("Invalid stream capacity");
    });
  });

  describe("writeBits", () => {
    it("should write less than byte (1-7 bits)", () => {
      // #fuzzy
      const stream = new OutputBitStream(1);
      stream.writeBits(5n, 3); // Write 101
      stream.writeBits(1n, 2); // Write 01
      const buffer = stream.getBuffer();
      expect(buffer[0]).toBe(0xa8); // 10101000 (corrected)
    });

    it("should write exactly one byte (8 bits)", () => {
      // #fuzzy
      const stream = new OutputBitStream(2);
      stream.writeBits(0xaan, 8);
      stream.writeBits(0x55n, 8);
      const buffer = stream.getBuffer();
      expect(buffer[0]).toBe(0xaa);
      expect(buffer[1]).toBe(0x55);
    });

    it("should write multiple bytes", () => {
      // #fuzzy
      const stream = new OutputBitStream(3);
      stream.writeBits(0xaa55n, 16);
      stream.writeBits(0xffn, 8);
      const buffer = stream.getBuffer();
      expect(buffer[0]).toBe(0xaa);
      expect(buffer[1]).toBe(0x55);
      expect(buffer[2]).toBe(0xff);
    });

    it("should write bits across byte boundaries", () => {
      // #fuzzy
      const stream = new OutputBitStream(2);
      stream.writeBits(0x2an, 6); // Write 101010
      stream.writeBits(0x25n, 6); // Write 100101 (across boundary)
      const buffer = stream.getBuffer();
      expect(buffer[0]).toBe(0xaa);
      expect(buffer[1]).toBe(0x50); // 01010000 (corrected)
    });

    it("should throw error when writing negative bigint", () => {
      // #fuzzy
      const stream = new OutputBitStream(1);
      expect(() => stream.writeBits(-1n, 8)).toThrow(
        "Cannot write negative bigint"
      );
    });

    it("should throw error when writing more bits than capacity", () => {
      // #fuzzy
      const stream = new OutputBitStream(1);
      expect(() => stream.writeBits(0xffffn, 16)).toThrow("No more bits left");
    });
  });

  describe("getBuffer", () => {
    it("should return buffer with correct size", () => {
      // #fuzzy
      const stream = new OutputBitStream(4);
      const buffer = stream.getBuffer();
      expect(buffer.length).toBe(4);
    });

    it("should return buffer with written data", () => {
      // #fuzzy
      const stream = new OutputBitStream(2);
      stream.writeBits(0xaa55n, 16);
      const buffer = stream.getBuffer();
      expect(buffer[0]).toBe(0xaa);
      expect(buffer[1]).toBe(0x55);
    });

    it("should return empty buffer when nothing written", () => {
      // #fuzzy
      const stream = new OutputBitStream(2);
      const buffer = stream.getBuffer();
      expect(buffer[0]).toBe(0);
      expect(buffer[1]).toBe(0);
    });
  });

  describe("error handling", () => {
    it("should handle writing to single byte buffer", () => {
      // #fuzzy
      const stream = new OutputBitStream(1);
      stream.writeBits(0xffn, 8);
      expect(stream.getBuffer()[0]).toBe(0xff);
    });

    it("should handle buffer overflow scenarios", () => {
      // #fuzzy
      const stream = new OutputBitStream(1);
      stream.writeBits(0xffn, 8);
      expect(() => stream.writeBits(1n, 1)).toThrow("No more bits left");
    });
  });
});
