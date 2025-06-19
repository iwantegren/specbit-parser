export type InputBuffer = Uint8Array;

export enum ProtocolFieldType {
  INTEGER = "integer",
  FLOAT = "float",
  STRING = "string",
  BOOLEAN = "boolean",
}

export type ProtocolFieldConfig = {
  name: string;
  type?: ProtocolFieldType;
  length: number;
  rsvd?: boolean;
};

export type ProtocolConfig = {
  fields: ProtocolFieldConfig[];
};
