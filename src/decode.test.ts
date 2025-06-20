import { decode } from "../src/decode";
import type { ProtocolField } from "../src/types";

describe("decode", () => {
  const config: ProtocolField[] = [
    { name: "first", length: 4 },
    { name: "second", length: 4 },
    { name: "third", length: 8 },
  ];

  it("decodes properly with matching buffer length", () => {
    const buffer = new Uint8Array([0b10100001, 0b11110000]);
    const result = decode(buffer, config);

    expect(result).toEqual({
      first: 0b1010n,
      second: 0b0001n,
      third: 0b11110000n,
    });
  });

  it("skips reserved fields", () => {
    const reservedConfig: ProtocolField[] = [
      { name: "a", length: 4 },
      { name: "rsvd", rsvd: true, length: 4 },
      { name: "b", length: 1 },
      { name: "c", length: 7 },
    ];

    const buffer = new Uint8Array([0b11001111, 0b11110000]);
    const result = decode(buffer, reservedConfig);

    expect(result).toEqual({
      a: 0b1100n,
      b: 0b1n,
      c: 0b1110000n,
    });
  });

  it("throws error if buffer length mismatches and strictLength=true", () => {
    const shortBuffer = new Uint8Array([0b10100000]);
    expect(() => decode(shortBuffer, config, true)).toThrow(
      /Buffer length .* doesn't match expected protocol length/
    );
  });

  it("allows length mismatch when strictLength=false", () => {
    const shortBuffer = new Uint8Array([0b10100001, 0b11110000]); // Provide full but test logic anyway
    const partialConfig: ProtocolField[] = [
      { name: "first", length: 4 },
      { name: "second", length: 4 },
      { name: "third", length: 16 },
    ];
    const result = decode(shortBuffer, partialConfig, false);

    expect(result.first).toBe(0b1010n);
    expect(result.second).toBe(0b0001n);

    expect(typeof result.third === "bigint" || result.third === undefined).toBe(
      true
    );
  });

  it("handles invalid buffer gracefully inside try/catch", () => {
    const brokenBuffer = new Uint8Array([0b11110000]); // Too short
    const brokenConfig: ProtocolField[] = [
      { name: "x", length: 16 }, // exceeds buffer
    ];

    const result = decode(brokenBuffer, brokenConfig, false);
    expect(typeof result).toBe("object");
    expect(result.x === undefined || typeof result.x === "bigint").toBe(true);
  });

  it("ignores extra bits in buffer when strictLength is false", () => {
    const config: ProtocolField[] = [
      { name: "first", length: 4 },
      { name: "second", length: 4 },
      { name: "third", length: 8 },
    ];

    // Config length = 4 + 4 + 8 = 16 bits = 2 bytes
    // Buffer = 3 bytes (24 bits) — extra byte at the end
    const buffer = new Uint8Array([
      0b10100001, // first + second
      0b11110000, // third
      0b11001100, // extra (ignored)
    ]);

    const result = decode(buffer, config, false);

    expect(result).toEqual({
      first: 0b1010n,
      second: 0b0001n,
      third: 0b11110000n,
    });
  });
});
