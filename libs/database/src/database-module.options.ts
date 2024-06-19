import { ConfigurableModuleBuilder } from '@nestjs/common';
import { DatabaseConfig } from '@libs/database/index';

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN, OPTIONS_TYPE, ASYNC_OPTIONS_TYPE } =
  new ConfigurableModuleBuilder<DatabaseConfig>()
    .setExtras(
      {
        tag: 'default',
      },
      (definition, extras) => ({
        ...definition,
        tag: extras.tag,
      }),
    )
    .build();
