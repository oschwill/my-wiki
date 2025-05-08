export class GlobalErrorResponse extends Error {
  constructor(statusCode = 400, code = 'UNKNOWN_ERROR') {
    super('globalErrorReponse');
    this.statusCode = statusCode;
    this.code = code;
  }
}
