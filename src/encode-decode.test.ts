import { PacketSpec, PacketPayload } from "./types";
import { encode } from "./encode";
import { decode } from "./decode";

describe("stream", () => {
  describe("encode decode tests", () => {
    it("should encode and decode simple payload with basic spec", () => {
      const payload: PacketPayload = [
        { name: "id", length: 8, value: 123n },
        { name: "status", length: 4, value: 5n },
        { name: "value", length: 20, value: 1048575n },
      ];

      const encodedBuffer = encode(payload);
      const decodedPayload = decode(encodedBuffer, payload as PacketSpec);

      expect(decodedPayload).toEqual(payload);
    });

    it("should encode and decode complex payload with mixed field types", () => {
      const payload: PacketPayload = [
        { name: "header", length: 8, value: 0xaan },
        { name: "flags", length: 3, value: 7n },
        { name: "rsvd", length: 5, value: 0n, rsvd: true },
        { name: "data1", length: 16, value: 0x1234n },
        { name: "data2", length: 16, value: 0x5678n },
        { name: "checksum", length: 8, value: 0xffn },
      ];

      const encodedBuffer = encode(payload);
      const decodedPayload = decode(encodedBuffer, payload as PacketSpec);

      expect(decodedPayload).toEqual(payload);
    });

    it("should encode and decode large payload with nested structure", () => {
      const payload: PacketPayload = [
        { name: "version", length: 4, value: 1n },
        { name: "type", length: 4, value: 15n },
        { name: "length", length: 16, value: 1024n },
        { name: "timestamp", length: 32, value: 1640995200n },
        { name: "sequence", length: 16, value: 12345n },
        { name: "data", length: 64, value: 0x123456789abcdef0n },
        { name: "metadata", length: 32, value: 0xdeadbeefn },
        { name: "footer", length: 8, value: 0x55n },
      ];

      const encodedBuffer = encode(payload);
      const decodedPayload = decode(encodedBuffer, payload as PacketSpec);

      expect(decodedPayload).toEqual(payload);
    });
  });
});
