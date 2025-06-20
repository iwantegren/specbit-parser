import { decode } from "./decode.js";
import { encode } from "./encode.js";
import { ProtocolField, ProtocolPayload } from "./types.js";

describe("encode-decode round-trip", () => {
  it("should get back the exact same Uint8Array", () => {
    const spec: ProtocolField[] = [
      { name: "f1", length: 3 },
      { name: "f2", length: 12 },
      { name: "f3", length: 1 },
      { name: "f4", length: 8 },
    ];
    const buffer = new Uint8Array([0xab, 0xcd, 0xef]);

    const decoded = decode(buffer, spec, true);
    const payload: ProtocolPayload = spec.map((field) => ({
      ...field,
      value: decoded[field.name],
    }));

    const reEncoded = encode(payload);

    expect(reEncoded).toEqual(buffer);
  });
});
