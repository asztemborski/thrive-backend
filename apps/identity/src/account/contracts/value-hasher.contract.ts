export const IValueHasher = Symbol('__IDENTITY_VALUE_HASHER__');

export interface IValueHasher {
  hash(value: string): Promise<string>;
  verify(value: string, valueHash: string): Promise<boolean>;
}
