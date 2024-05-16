import { v4 as uuid } from 'uuid';

export type EntityId = string;

export type BaseEntityProps = {
  id: EntityId;
};

export type CreateBaseEntityProps = {
  id?: EntityId;
};

export abstract class EntityBase<TEntityProps> {
  private _id: EntityId;

  protected readonly properties: TEntityProps;

  constructor(properties: TEntityProps & CreateBaseEntityProps) {
    this.properties = properties;
    this.id = properties.id ?? uuid();
  }

  private set id(value: string) {
    this._id = value;
  }

  get id(): EntityId {
    return this._id;
  }

  getProperties(): BaseEntityProps & TEntityProps {
    const props = {
      id: this._id,
      ...this.properties,
    };

    return Object.freeze(props);
  }
}
