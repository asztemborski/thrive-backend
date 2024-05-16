export class ApiError {
  readonly path?: string;
  readonly message: string;

  constructor(properties: ApiError) {
    Object.assign(this, properties);
  }
}

export class ApiErrorResponse {
  readonly code?: string = 'Thrive.Exception';
  readonly statusCode: number;
  readonly title: string;
  readonly errors: ApiError[];

  constructor(properties: ApiErrorResponse) {
    Object.assign(this, properties);
  }
}
