import { decodeRecord } from "../src/decode";
import type { FieldSpec, PacketRecord } from "../src/types";

describe("decodeRecord", () => {
  const config: FieldSpec[] = [
    { name: "first", length: 4 },
    { name: "second", length: 4 },
    { name: "third", length: 8 },
  ];

  it("decodes properly with matching buffer length", () => {
    const buffer = new Uint8Array([0b10100001, 0b11110000]);
    const result = decodeRecord(buffer, config);

    expect(result).toEqual({
      first: 0b1010n,
      second: 0b0001n,
      third: 0b11110000n,
    });
  });

  it("skips reserved fields", () => {
    const reservedConfig: FieldSpec[] = [
      { name: "a", length: 4 },
      { name: "rsvd", rsvd: true, length: 4 },
      { name: "b", length: 1 },
      { name: "c", length: 7 },
    ];

    const buffer = new Uint8Array([0b11001111, 0b11110000]);
    const result = decodeRecord(buffer, reservedConfig);

    expect(result).toEqual({
      a: 0b1100n,
      b: 0b1n,
      c: 0b1110000n,
    });
  });

  it("throws error if buffer length mismatches and strictLength=true", () => {
    const shortBuffer = new Uint8Array([0b10100000]);
    expect(() =>
      decodeRecord(shortBuffer, config, {
        strictLength: true,
      })
    ).toThrow(/Buffer length .* doesn't match expected protocol length/);
  });

  it("doesn't create a decoder instance if buffer is too short", () => {
    const brokenBuffer = new Uint8Array([0b11110000]); // Too short
    const brokenConfig: FieldSpec[] = [
      { name: "x", length: 16 }, // exceeds buffer
    ];

    let result: PacketRecord | undefined;
    try {
      result = decodeRecord(brokenBuffer, brokenConfig, {
        strictLength: false,
      });
    } catch (e) {
      console.log(e);
    }

    expect(result).toBeUndefined();
  });

  it("ignores extra bits in buffer when strictLength is false", () => {
    const config: FieldSpec[] = [
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

    const result = decodeRecord(buffer, config, {
      strictLength: false,
    });

    expect(result).toEqual({
      first: 0b1010n,
      second: 0b0001n,
      third: 0b11110000n,
    });
  });
});
