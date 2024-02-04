import express from "express";
import dotenv from "dotenv";
import product from "./routes/productRoute.js";
import user from "./routes/userRoute.js";
import cart from "./routes/cartRoute.js";
import order from "./routes/orderRoute.js";
import errorMiddleware from "./middlewares/error.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import bodyParser from "body-parser";
import fileUpload from "express-fileupload";
import payment from "./routes/paymentRoute.js";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

export const app = express();

dotenv.config({ path: "data/config.env" });

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
//middlewares
app.use(express.static(path.resolve(__dirname, "build")));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());

// Routes
app.use("/api/v1/product", product);
app.use("/api/v1", user);
app.use("/api/v1", cart);
app.use("/api/v1", order);
app.use("/api/v1", payment);
app.use("/api/v1/getkey", (req, res) => {
  res.status(200).json({ key: process.env.RAZORPAY_API_KEY });
});

//error middleware
app.use(errorMiddleware);

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "build", "index.html"));
});
