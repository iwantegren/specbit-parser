export type FieldSpec = {
  name: string;
  length: number;
  rsvd?: boolean;
};

export type FieldPayload = FieldSpec & {
  value: bigint;
};

export type PacketSpec = FieldSpec[];
export type PacketPayload = FieldPayload[];
export type PacketRecord = Record<string, bigint>;

export type DecoderConfig = {
  strictLength: boolean;
  skipRsvd: boolean;
};

export const defaultDecoderConfig: DecoderConfig = {
  strictLength: true,
  skipRsvd: true,
};

export type EncoderConfig = {
  byteAligned: boolean;
};

export const defaultEncoderConfig: EncoderConfig = {
  byteAligned: true,
};
