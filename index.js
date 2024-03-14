import express from "express";
import authRoute from "./routes/auth.js";
import studentRoute from "./routes/student.js";
import bookRoute from "./routes/book.js";
import transactionRoute from "./routes/transaction.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoute);
app.use("/api/student", studentRoute);
app.use("/api/book", bookRoute);
app.use("/api/transaction", transactionRoute);

app.listen(port, () => {
  console.log("server is running");
});
