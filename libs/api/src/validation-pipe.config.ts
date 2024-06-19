import { BadRequestException, ValidationPipeOptions } from '@nestjs/common';

import { ApiError, ApiErrorResponse } from '@libs/api/api-error.response';

export const validationPipeConfig: ValidationPipeOptions = {
  transform: true,
  exceptionFactory: (errors) =>
    new BadRequestException(
      new ApiErrorResponse({
        code: 'Thrive.Validation',
        statusCode: 400,
        title: 'Some validation errors have occurred.',
        errors: errors.flatMap((error) =>
          Object.values(error.constraints || {}).flatMap((constraint) => [
            new ApiError({
              path: error.property,
              message: constraint[0].toUpperCase() + constraint.slice(1),
            }),
          ]),
        ),
      }),
    ),
};
