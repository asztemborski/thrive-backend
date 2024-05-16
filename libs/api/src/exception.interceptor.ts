import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  NestInterceptor,
} from '@nestjs/common';
import { rethrow } from '@nestjs/core/helpers/rethrow';
import { catchError, Observable } from 'rxjs';

import { ExceptionBase } from '@libs/exceptions';
import { ApiErrorResponse } from '@libs/api/api-error.response';

const createErrorApiResponse = (error: ExceptionBase) => {
  return new BadRequestException(
    new ApiErrorResponse({
      title: error.message,
      code: error.code,
      statusCode: 400,
      errors: [],
    }),
  );
};

export class ExceptionInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<unknown> | Promise<Observable<unknown>> {
    return next.handle().pipe(
      catchError((error) => {
        if (error instanceof ExceptionBase) {
          error = createErrorApiResponse(error);
        }

        return rethrow(error);
      }),
    );
  }
}
