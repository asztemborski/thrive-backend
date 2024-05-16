export const isString = (value: unknown): value is string => {
  return typeof value === 'string';
};

export const isArray = (value: unknown): value is unknown[] => {
  return Array.isArray(value);
};

export const isObject = (value: unknown): value is { [key: string]: unknown } => {
  return value !== null && !isArray(value) && typeof value === 'object';
};

export const isEmpty = (value: unknown): value is never => {
  if (isString(value)) {
    return value.trim().length === 0;
  }

  if (isArray(value)) {
    return value.length === 0;
  }

  if (isObject(value)) {
    return Object.keys(value).length === 0;
  }

  throw new Error(
    `Checked value must be type of string | array | object. Provided value:
       ${value === null ? 'null' : typeof value}`,
  );
};
