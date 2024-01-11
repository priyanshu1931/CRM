class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;

    // Convert statusCode to a string before using startsWith
    this.status = `${String(statusCode).startsWith('4') ? 'fail' : 'error'}`;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
