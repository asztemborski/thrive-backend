import { DynamicModule, Module, Provider } from '@nestjs/common';

import { DatabaseService } from '@libs/database/database.service';
import { DatabaseConfig } from '@libs/database/database.config';
import { DATABASE_CLIENT, DATABASE_CONFIG } from '@libs/database/database.di-tokens';

const clientProvider: Provider = {
  provide: DATABASE_CLIENT,
  useFactory: async (databaseService: DatabaseService) => databaseService.getClient(),
  inject: [DatabaseService],
};

@Module({
  providers: [DatabaseService, clientProvider],
  exports: [DatabaseService, clientProvider],
})
export class DatabaseModule {
  static forRoot(config: DatabaseConfig): DynamicModule {
    const configProvider: Provider = {
      provide: DATABASE_CONFIG,
      useValue: config,
    };

    return {
      module: DatabaseModule,
      providers: [configProvider],
      exports: [configProvider],
    };
  }
}
