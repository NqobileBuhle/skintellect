import dotenv from "dotenv"
dotenv.config();
import express from "express";
import cookieParser from "cookie-parser";
import connectToDB from "./config/db.js";
import { PORT } from "./constants/env.const.js";
import { OK } from "./constants/http.codes.js"
import authRouter from "./routes/authRoutes.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";
import router from "./routes/userRoutes.js";




const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//testing
app.get("/", (req, res) => {
  res.status(OK).json({
    status: "success",
  });
});

//auth router
app.use("/api/users/auth", authRouter);
app.use("/api/users", router);

//handling errors
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, async () => {
  console.log(`connected at PORT : ${PORT}`);
  await connectToDB();
});