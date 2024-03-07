import express from "express";
import authRoute from "./routes/auth.js";
import studentRoute from "./routes/student.js";
import cookieParser from "cookie-parser";

const app = express();
const port = process.env.PORT || 3001

app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoute);
app.use("/api/student", studentRoute);

app.listen(port, () => {
  console.log("server is running");
});
