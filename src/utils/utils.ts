import {
  defaultDecoderConfig,
  PacketPayload,
  PacketRecord,
  PacketSpec,
} from "../types";

export const BYTE = 8;

export function specBitLength(specs: PacketSpec): number {
  return specs.reduce((acc, field) => acc + field.length, 0);
}

export function specByteLength(specs: PacketSpec): number {
  const bitLength = specBitLength(specs);
  if (bitLength % BYTE > 0)
    throw new Error(
      `Spec have incomplete byte size. Total number of bits ${bitLength}`
    );

  return Math.ceil(bitLength / BYTE);
}

export function payloadToRecord(
  payload: PacketPayload,
  opts: { skipRsvd: boolean } = { skipRsvd: defaultDecoderConfig.skipRsvd }
): PacketRecord {
  return payload.reduce((acc, field) => {
    if (opts.skipRsvd && field.rsvd) return acc;
    acc[field.name] = field.value;
    return acc;
  }, {} as PacketRecord);
}

export function recordToPayload(
  record: PacketRecord,
  specs: PacketSpec
): PacketPayload {
  return specs.map((spec) => ({
    ...spec,
    value: record[spec.name],
  }));
}
