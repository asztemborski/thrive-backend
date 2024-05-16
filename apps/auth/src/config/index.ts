import databaseConfig from './database.config';
import emailConfig from './email.config';
import jwtConfig from './jwt.config';
import rabbitmqConfig from './rabbitmq.config';

export * from './database.config';
export * from './email.config';
export * from './jwt.config';
export * from './rabbitmq.config';

export const configs = [databaseConfig, emailConfig, jwtConfig, rabbitmqConfig];
