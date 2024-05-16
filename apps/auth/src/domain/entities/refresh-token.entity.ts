import { EntityBase } from '@libs/ddd';

type RefreshTokenProperties = {
  token: string;
  userId: string;
  expiresAt: Date;
};

export class RefreshToken extends EntityBase<RefreshTokenProperties> {
  constructor(properties: RefreshTokenProperties) {
    super({ ...properties, id: properties.token });
  }

  get expired(): boolean {
    return this.properties.expiresAt < new Date();
  }

  get token(): string {
    return this.properties.token;
  }
}
