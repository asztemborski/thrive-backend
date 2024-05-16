import { registerAs } from '@nestjs/config';

import * as config from '../../auth.config.json';

export const EMAIL_CONFIG_TOKEN = 'email';

export interface EmailConfig {
  bannedEmailProviders: string[];
}

export default registerAs(EMAIL_CONFIG_TOKEN, () => ({
  bannedEmailProviders: config.emailConfig.bannedEmailProviders,
}));
