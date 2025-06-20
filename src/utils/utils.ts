import { ProtocolPayload } from "../types";

export const BYTE = 8;

export function configBitLength(
  configs: readonly { length: number }[]
): number {
  return configs.reduce((acc, field) => acc + field.length, 0);
}

export function configByteLength(
  configs: readonly { length: number }[]
): number {
  const bitLength = configBitLength(configs);
  if (bitLength % BYTE > 0)
    throw new Error(
      `Configs have incomplete byte size. Total number of bits ${bitLength}`
    );

  return Math.ceil(bitLength / BYTE);
}
