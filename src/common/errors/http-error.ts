export class HttpError extends Error {
  constructor(
      public readonly statusCode: number,
      message: string,
      public readonly details: unknown = null
  ) {
    super(message);

    this.name = this.constructor.name;

    Error.captureStackTrace?.(this, this.constructor);
  }
}
