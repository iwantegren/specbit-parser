import { InputBitStream } from "./input-stream";

describe("InputBitStream", () => {
  describe("constructor", () => {
    it("should create InputBitStream with valid buffer", () => {
      // #fuzzy
      const buffer = new Uint8Array([0xff, 0x01, 0xa6]);
      const stream = new InputBitStream(buffer);
      expect(stream).toBeInstanceOf(InputBitStream);
    });

    it("should throw error when buffer is not provided", () => {
      // #fuzzy
      expect(() => new InputBitStream(null as any)).toThrow(
        "Buffer not provided"
      );
      expect(() => new InputBitStream(undefined as any)).toThrow(
        "Buffer not provided"
      );
    });
  });

  describe("readBits", () => {
    it("should read less than byte (1-7 bits)", () => {
      // #fuzzy
      const buffer = new Uint8Array([0xaa]); // 10101010
      const stream = new InputBitStream(buffer);
      expect(stream.readBits(3)).toBe(5n); // 101 = 5
      expect(stream.readBits(2)).toBe(1n); // 01 = 1 (corrected)
    });

    it("should read exactly one byte (8 bits)", () => {
      // #fuzzy
      const buffer = new Uint8Array([0xaa, 0x55]);
      const stream = new InputBitStream(buffer);
      expect(stream.readBits(8)).toBe(0xaan);
      expect(stream.readBits(8)).toBe(0x55n);
    });

    it("should read multiple bytes", () => {
      // #fuzzy
      const buffer = new Uint8Array([0xaa, 0x55, 0xff]);
      const stream = new InputBitStream(buffer);
      expect(stream.readBits(16)).toBe(0xaa55n);
      expect(stream.readBits(8)).toBe(0xffn);
    });

    it("should read bits across byte boundaries", () => {
      // #fuzzy
      const buffer = new Uint8Array([0xaa, 0x55]); // 10101010 01010101
      const stream = new InputBitStream(buffer);
      stream.readBits(6); // Read 101010
      expect(stream.readBits(6)).toBe(0x25n); // Read 100101 (corrected)
    });

    it("should throw error when reading more bits than available", () => {
      // #fuzzy
      const buffer = new Uint8Array([0xff]);
      const stream = new InputBitStream(buffer);
      expect(() => stream.readBits(9)).toThrow("No more bits left");
    });
  });

  describe("skipBits", () => {
    it("should skip specified number of bits", () => {
      // #fuzzy
      const buffer = new Uint8Array([0xaa, 0x55]);
      const stream = new InputBitStream(buffer);
      stream.skipBits(4);
      expect(stream.readBits(4)).toBe(0xan); // Should read 1010
    });

    it("should throw error when skipping more bits than available", () => {
      // #fuzzy
      const buffer = new Uint8Array([0xff]);
      const stream = new InputBitStream(buffer);
      expect(() => stream.skipBits(9)).toThrow("No more bits left");
    });
  });

  describe("remaining", () => {
    it("should return correct number of remaining bits", () => {
      // #fuzzy
      const buffer = new Uint8Array([0xaa, 0x55]); // 16 bits
      const stream = new InputBitStream(buffer);
      expect(stream.remaining()).toBe(16);

      stream.readBits(4);
      expect(stream.remaining()).toBe(12);

      stream.readBits(8);
      expect(stream.remaining()).toBe(4);
    });

    it("should return 0 when at end of buffer", () => {
      // #fuzzy
      const buffer = new Uint8Array([0xff]);
      const stream = new InputBitStream(buffer);
      stream.readBits(8);
      expect(stream.remaining()).toBe(0);
    });
  });

  describe("eof", () => {
    it("should return false when bits remain", () => {
      // #fuzzy
      const buffer = new Uint8Array([0xaa, 0x55]);
      const stream = new InputBitStream(buffer);
      expect(stream.eof()).toBe(false);

      stream.readBits(8);
      expect(stream.eof()).toBe(false);
    });

    it("should return true when at end of buffer", () => {
      // #fuzzy
      const buffer = new Uint8Array([0xff]);
      const stream = new InputBitStream(buffer);
      stream.readBits(8);
      expect(stream.eof()).toBe(true);
    });
  });

  describe("error handling", () => {
    it("should handle empty buffer", () => {
      // #fuzzy
      const buffer = new Uint8Array(0);
      const stream = new InputBitStream(buffer);
      expect(stream.eof()).toBe(true);
      expect(() => stream.readBits(1)).toThrow("No more bits left");
    });

    it("should handle single byte buffer", () => {
      // #fuzzy
      const buffer = new Uint8Array([0xff]);
      const stream = new InputBitStream(buffer);
      expect(stream.remaining()).toBe(8);
      expect(stream.readBits(8)).toBe(0xffn);
      expect(stream.eof()).toBe(true);
    });
  });
});
