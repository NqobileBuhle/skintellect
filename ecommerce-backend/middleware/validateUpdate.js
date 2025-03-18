import { BAD_REQUEST } from "../../constants/http.codes.js";
import updateUserSchema from "../../schemas/updateUserSchema.js";
import HttpError from "../../utils/httpError.js";

// Middleware to validate request body
const validateUpdate = (req, res, next) => {
  const result = updateUserSchema.safeParse(req.body);

  if (!result.success) {
    return next(new HttpError(result.error.errors[0].message, BAD_REQUEST)); // Bad Request
  }

  next();
};
export default validateUpdate;
// Usage in your route handler
//router.patch("/users/:id", validateUpdate, updateOneDoc(User));