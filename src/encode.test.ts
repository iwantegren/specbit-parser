import { decode } from "./decode.js";
import { encode } from "./encode.js";
import { FieldSpec } from "./types.js";

describe("encode-decode round-trip", () => {
  it("should get back the exact same Uint8Array", () => {
    const spec: FieldSpec[] = [
      { name: "f1", length: 3 },
      { name: "f2", length: 12 },
      { name: "f3", length: 1 },
      { name: "f4", length: 8 },
    ];
    const buffer = new Uint8Array([0xab, 0xcd, 0xef]);

    const decoded = decode(buffer, spec, {
      strictLength: true,
    });

    const reEncoded = encode(decoded);

    expect(reEncoded).toEqual(buffer);
  });
});
