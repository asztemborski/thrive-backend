import { applyDecorators, Controller, ControllerOptions } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { isString } from '@libs/utilities';

export const PublicController = ({ path, ...options }: ControllerOptions): ClassDecorator => {
  return applyDecorators(ApiTags(isString(path) ? path : ''), Controller({ ...options, path: `public/${path}` }));
};
