export class BigIntConverter {
  public static toUint(value: bigint): number {
    if (value < 0n) {
      throw new RangeError(
        `BigIntConverter.toUint31: negative value (${value}) not allowed`
      );
    }

    if (value >> 31n) {
      throw new RangeError(
        `BigIntConverter.toUint31: value (${value}) exceeds 31 bits`
      );
    }

    return Number(value);
  }
}
