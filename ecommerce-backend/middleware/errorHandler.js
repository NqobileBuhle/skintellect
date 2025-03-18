import { ZodError } from "zod";
import { NODE_ENV } from "../constants/env.const.js";
import HttpError from "../utils/httpError.js";
import {
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
} from "../constants/http.codes.js";

const notFound = (req, res, next) => {
  const error = new HttpError(`${req.originalUrl} : Not Found`, NOT_FOUND); // Use 404 directly
  next(error);
};

const handleZodError = (err) => {
  const errors = err.issues.map((issue) => ({
    path: issue.path.join("."),
    message: issue.message,
  }));

  return {
    statusCode: BAD_REQUEST,
    body: {
      errors,
      message: "Validation Error", // Generic message, individual messages are in the errors array
    },
  };
};

const errorHandler = (err, req, res, next) => {
  console.error(err); // Log the full error for debugging purposes

  if (err instanceof HttpError) {
    return res.status(err.statusCode).json({
      message: err.message,
      stack: NODE_ENV === "development" ? err.stack : undefined, // Only include stack in development
    });
  }

  if (err instanceof ZodError) {
    const { statusCode, body } = handleZodError(err);
    return res.status(statusCode).json(body);
  }

  // Generic error response. IT NOT JUST INTERNAL SERVER ERROR
  return res.status(INTERNAL_SERVER_ERROR).json({
    message: "Internal Server Error",
    // Don't include stack traces in production for security reasons
    stack: NODE_ENV === "development" ? err.stack : undefined,
  });
};

export { errorHandler, notFound };