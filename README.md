# SpecBit Parser

[![npm version](https://badge.fury.io/js/specbit-parser.svg)](https://badge.fury.io/js/specbit-parser)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8+-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)

A TypeScript library for bit-level protocol parsing and encoding with configurable field specifications

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Usage](#usage)
  - [Simple Functions](#simple-functions)
  - [Class Instances](#class-instances)
    - [Decoder Class](#decoder-class)
    - [Encoder Class](#encoder-class)
- [Concepts & Terminology](#concepts--terminology)
  - [FieldSpec & PacketSpec](#fieldspec--packetspec)
  - [Input & Output Types](#input--output-types)
    - [Uint8Array](#uint8array)
    - [FieldPayload & PacketPayload](#fieldpayload--packetpayload)
    - [PacketRecord](#packetrecord)
- [Utility Functions](#utility-functions)
  - [payloadToRecord](#payloadtorecordpayload-packetpayload-opts-skiprsvd-boolean-packetrecord)
  - [recordToPayload](#recordtopayloadrecord-packetrecord-specs-packetspec-packetpayload)

## Introduction

Binary protocol parsing often requires precise bit-level control to handle complex packet structures, reserved fields, and variable-length data. SpecBit Parser provides a flexible and type-safe solution for defining protocol specifications and efficiently encoding/decoding binary data at the bit level.

## Features

- 🔧 **Configurable Field Specifications**: Define custom bit-length fields with names and types
- 🚫 **Reserved Field Support**: Mark fields as reserved to skip during parsing
- 📦 **Byte Alignment**: Optional byte-alignment validation for protocol compliance
- 🔄 **Bidirectional**: Both encoding and decoding with consistent APIs
- 🧪 **Comprehensive Testing**: Full test coverage with edge case validation

## Installation

```bash
npm install specbit-parser
# or
yarn add specbit-parser
# or
pnpm add specbit-parser
```

## Quick Start

```typescript
import { decode, payloadToRecord, type PacketSpec } from "specbit-parser";

// Define your protocol specification
const protocolSpec: PacketSpec = [
  { name: "version", length: 4 },
  { name: "flags", length: 4 },
  { name: "payload", length: 16 },
  { name: "checksum", length: 8 },
];

const buffer = new Uint8Array([0xff, 0xff, 0xff, 0xff]);
const result = decode(buffer, protocolSpec);

console.log(result);
// Output: [
//   { name: "version", length: 4, value: 15n },
//   { name: "flags", length: 4, value: 15n },
//   { name: "payload", length: 16, value: 65535n },
//   { name: "checksum", length: 8, value: 255n },
// ]

// Optionally, convert to a JSON record
const record = payloadToRecord(result, { skipRsvd: true });

console.log(record);
// Output: { version: 15n, flags: 15n, payload: 65535n, checksum: 255n }
```

## Usage

The library provides two usage patterns: simple functions for quick operations and class instances for more control and reuse.

### Simple Functions

For quick one-off operations, use the simple functions `decode` and `encode`

```typescript
function decode(
  buffer: Uint8Array,
  config: PacketSpec,
  opts: Partial<DecoderConfig> = {}
): PacketPayload;
```

```typescript
function encode(
  payload: PacketPayload,
  opts: Partial<EncoderConfig> = {}
): Uint8Array;
```

### Class Instances

For more control and reuse, use the `Decoder` and `Encoder` classes:

#### Decoder Class

The `Decoder` class provides methods to decode binary data according to a protocol specification.

**Creation:**

```typescript
import { Decoder } from 'specbit-parser';

const decoder = Decoder.create(buffer, specs, options?);
```

**Methods:**

- `getPayload()`: Returns `PacketPayload` (array of fields with values)
- `getRecord()`: Returns `PacketRecord` (object with field names as keys)

**Configuration:**

```typescript
type DecoderConfig = {
  strictLength: boolean; // Default: true
  skipRsvd: boolean; // Default: true
};
```

**`strictLength`** (default: `true`)

- When `true`: Validates that buffer length exactly matches protocol specification
- When `false`: Allows extra bits in buffer (ignored during parsing)
- Throws error if buffer is too short in both modes

**`skipRsvd`** (default: `true`)

- When `true`: Excludes reserved fields from `getRecord()` results
- When `false`: Includes reserved fields with value `0n` in results

**Example:**

```typescript
const specs = [
  { name: "version", length: 4 },
  { name: "data", length: 12 },
];
const buffer = new Uint8Array([0xff, 0xff]);

const decoder = Decoder.create(buffer, specs);

const payload = decoder.getPayload();
console.log(payload);
// Output: [{ name: "version", length: 4, value: 15n }, { name: "data", length: 12, value: 8191n }]

const record = decoder.getRecord();
console.log(record);
// Output: { version: 15n, data: 8191n }
```

**Payload vs Record:**

- `Payload` preserves field metadata (length, reserved status) along with values
- `Record` provides a simple key-value interface for accessing field values

#### Encoder Class

The `Encoder` class provides methods to encode field values back to binary data.

**Creation:**

```typescript
import { Encoder } from 'specbit-parser';

const encoder = Encoder.create(payload, options?);
```

**Methods:**

- `getBuffer()`: Returns `Uint8Array` containing the encoded binary data

**Configuration:**

```typescript
type EncoderConfig = {
  byteAligned: boolean; // Default: true
};
```

**`byteAligned`** (default: `true`)

- When `true`: Ensures output buffer size is byte-aligned (8-bit multiples)
- When `false`: Allows bit-level alignment, padding with zeros if needed

**Example:**

```typescript
const payload = [
  { name: "version", length: 4, value: 15n },
  { name: "data", length: 12, value: 8191n },
];

const encoder = Encoder.create(payload);

const buffer = encoder.getBuffer();
console.log(buffer);
// Output: Uint8Array [ 255, 255 ]
```

## Concepts & Terminology

### FieldSpec & PacketSpec

A field specification defines a single field in your protocol:

```typescript
type FieldSpec = {
  name: string; // Field identifier
  length: number; // Number of bits
  rsvd?: boolean; // Mark as reserved
};
```

```typescript
type PacketSpec = FieldSpec[];
```

### Input & Output Types

The library uses several key data types for encoding and decoding operations:

#### `Uint8Array`

The primary input/output format for binary data. All encoding and decoding operations work with `Uint8Array` buffers.

#### `FieldPayload & PacketPayload`

Represents a single field with its decoded value, including FieldSpec metadata:

```typescript
type FieldPayload = {
  // Field spec
  name: string;
  length: number;
  rsvd?: boolean;

  // Decoded value
  value: bigint;
};
```

```typescript
type PacketPayload = FieldPayload[];
```

#### `PacketRecord`

A plain object record mapping field names to their values:

```typescript
type PacketRecord = Record<string, bigint>;
```

This provides a convenient key-value interface for accessing decoded field values.

### Utility Functions

The library provides utility functions for data conversion and specification analysis:

#### `payloadToRecord(payload: PacketPayload, opts: { skipRsvd: boolean }): PacketRecord`

Converts a payload array to a record object, with optional reserved field filtering.

```typescript
import { payloadToRecord } from "specbit-parser";

const payload = [
  { name: "version", length: 4, value: 1n },
  { name: "reserved", length: 4, rsvd: true, value: 0n },
  { name: "data", length: 8, value: 123n },
];

const record = payloadToRecord(payload, { skipRsvd: true });
console.log(record);
// Output: { version: 1n, data: 123n }
```

#### `recordToPayload(record: PacketRecord, specs: PacketSpec): PacketPayload`

Converts a record object back to a payload array using the original specification.

```typescript
import { recordToPayload } from "specbit-parser";

const record = { version: 1n, data: 123n };
const specs = [
  { name: "version", length: 4 },
  { name: "data", length: 8 },
];

const payload = recordToPayload(record, specs);
console.log(payload);
// Output: [{ name: "version", length: 4, value: 1n }, { name: "data", length: 8, value: 123n }]
```

**Author:** Ivan Bilan <iwantegren@gmail.com>

**Repository:** [https://github.com/iwantegren/specbit-parser](https://github.com/iwantegren/specbit-parser)
