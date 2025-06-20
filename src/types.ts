export type ProtocolField = {
  name: string;
  length: number;
  rsvd?: boolean;
};

export type ProtocolSpec = ProtocolField[];
export type ProtocolSpecOutput = Record<string, bigint>;

export type ProtocolValue = ProtocolField & {
  value: bigint;
};

export type ProtocolPayload = ProtocolValue[];
