import { AuthenticateCommandHandler } from './authenticate';
import { RefreshCommandHandler } from './refresh/refresh.command-handler';
import { LogoutCommandHandler } from './logout';
import { LogoutAllCommandHandler } from './logout-all/logout-all.command-handler';
import { ValidateCommandHandler } from './validate';

export const commandHandlers = [
  AuthenticateCommandHandler,
  RefreshCommandHandler,
  LogoutCommandHandler,
  LogoutAllCommandHandler,
  ValidateCommandHandler,
];
