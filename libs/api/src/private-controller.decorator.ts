import { applyDecorators, Controller, ControllerOptions } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { isString } from '@libs/utilities';

export const PrivateController = ({ path, ...options }: ControllerOptions): ClassDecorator => {
  return applyDecorators(
    ApiTags(isString(path) ? path : ''),
    ApiBearerAuth(),
    Controller({ ...options, path: `private/${path}` }),
  );
};
