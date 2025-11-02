class ApiError extends Error {
  constructor(
    statusCode,
    message = "Something went wrong",
    errors = [],
    stack = "",
    data
  ) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.success = false;
    this.errors = errors;
    // if (stack) {
    //   this.stack = stack;
    // } else {
    //   Error.captureStackTrace(this, this.constructor);
    // }
  }
}

export { ApiError };
