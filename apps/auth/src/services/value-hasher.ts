import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

import { IValueHasher } from '../contracts';

@Injectable()
export class ValueHasher implements IValueHasher {
  async hash(value: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(value, salt);
  }

  async verify(value: string, valueHash: string): Promise<boolean> {
    return await bcrypt.compare(value, valueHash);
  }
}
