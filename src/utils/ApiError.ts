class ApiError extends Error {
  public statusCode: number;
  public success: boolean;

  constructor(statusCode = 500, message = "Something went wrong!") {
    super(message);

    this.statusCode = statusCode;
    this.success = false;

    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

export default ApiError;
