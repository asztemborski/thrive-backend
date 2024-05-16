export type Primitive = number | string | boolean;

export type DomainPrimitive<T extends Primitive> = {
  value: T;
};

type ValueObjectProperties<T> = T extends Primitive ? DomainPrimitive<T> : T;

export abstract class ValueObject<T> {
  protected readonly properties: Readonly<ValueObjectProperties<T>>;

  constructor(properties: ValueObjectProperties<T>) {
    this.validate(properties);
    this.properties = Object.freeze(properties);
  }

  equals(valueObject: ValueObject<T>): boolean {
    if (valueObject === null || valueObject === undefined) return false;

    return JSON.stringify(this) === JSON.stringify(valueObject);
  }

  unpack(): Readonly<ValueObjectProperties<T>> | T {
    if (this.isDomainPrimitive(this.properties)) {
      return this.properties.value;
    }

    return this.properties;
  }

  protected abstract validate(props: ValueObjectProperties<T>): void;

  protected isDomainPrimitive(value: unknown): value is DomainPrimitive<T & Primitive> {
    return typeof value === 'object' && value !== null && 'value' in value;
  }
}
