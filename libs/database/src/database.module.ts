import { DynamicModule, Global } from '@nestjs/common';

import { DatabaseService } from '@libs/database/database.service';
import { DATABASE_CLIENT } from '@libs/database/database.di-tokens';
import {
  ASYNC_OPTIONS_TYPE,
  ConfigurableModuleClass,
  MODULE_OPTIONS_TOKEN,
  OPTIONS_TYPE,
} from '@libs/database/database-module.options';
import { DatabaseConfig } from '@libs/database/database.config';

@Global()
export class DatabaseModule extends ConfigurableModuleClass {
  static forRoot(options: typeof OPTIONS_TYPE): DynamicModule {
    const { providers = [], exports = [], ...rest } = super.register(options);

    const databaseProviders = [
      DatabaseService,
      {
        provide: DATABASE_CLIENT,
        useFactory: (databaseService: DatabaseService) => databaseService.getClient(options),
        inject: [DatabaseService],
      },
    ];

    return {
      ...rest,
      providers: [...providers, ...databaseProviders],
      exports: [...exports, DATABASE_CLIENT],
    };
  }

  static forRootAsync(options: typeof ASYNC_OPTIONS_TYPE): DynamicModule {
    const { providers = [], exports = [], ...rest } = super.registerAsync(options);

    const databaseAsyncProviders = [
      DatabaseService,
      {
        provide: DATABASE_CLIENT,
        useFactory: (databaseService: DatabaseService, config: DatabaseConfig) => databaseService.getClient(config),
        inject: [DatabaseService, MODULE_OPTIONS_TOKEN],
      },
    ];

    return {
      ...rest,
      providers: [...providers, ...databaseAsyncProviders],
      exports: [...exports, DATABASE_CLIENT],
    };
  }
}
