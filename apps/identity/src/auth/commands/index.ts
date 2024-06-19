import { AuthenticateCommandHandler } from './authenticate/authenticate.command-handler';
import { RefreshCommandHandler } from './refresh/refresh.command-handler';

export const commandHandlers = [AuthenticateCommandHandler, RefreshCommandHandler];
