export interface IValueHasher {
  hash(value: string): Promise<string>;
  verify(value: string, valueHash: string): Promise<boolean>;
}
