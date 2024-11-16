import { StatusCodes } from 'http-status-codes';

export class HttpError extends Error {
    constructor(statusCode, message, errorCode = 'UNKNOWN_ERROR', data = null) {
      super(message);
      this.name = this.constructor.name;
      this.statusCode = statusCode;
      this.errorCode = errorCode;
      this.data = data;
    }
  }

  export class NotFoundError extends HttpError {
    constructor(message = 'Resource not found', data = null) {
      super(StatusCodes.NOT_FOUND, message, 'NOT_FOUND', data);
    }
  }
  
  export class BadRequestError extends HttpError {
    constructor(message = 'Bad request', data = null) {
      super(StatusCodes.BAD_REQUEST, message, 'BAD_REQUEST', data);
    }
  }
  
  export class UnauthorizedError extends HttpError {
    constructor(message = 'Unauthorized access', data = null) {
      super(StatusCodes.UNAUTHORIZED, message, 'UNAUTHORIZED', data);
    }
  }
  
  export class ValidationError extends HttpError {
    constructor(message = 'Validation failed', data = null) {
      super(StatusCodes.BAD_REQUEST, message, 'VALIDATION_ERROR', data);
    }
  }
  
  export class ConflictError extends HttpError {
    constructor(message = 'Resource conflict', data = null) {
      super(StatusCodes.CONFLICT, message, 'CONFLICT', data);
    }
  }
  
  export class InternalServerError extends HttpError {
    constructor(message = 'Internal server error', data = null) {
      super(StatusCodes.INTERNAL_SERVER_ERROR, message, 'INTERNAL_SERVER_ERROR', data);
    }
  }