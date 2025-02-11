import express, { type Express, type Request, type Response } from "express";
import dotenv from "dotenv";
import http from "http";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import compression from "compression";
import mongoose from "mongoose";
import router from "./router";

dotenv.config();

const Port = process.env.PORT || 3002;
const MongoUrl = process.env.MONGO_URI || "mongodb://localhost:27017/test";

const app: Express = express();

// CORS middleware
app.use(cors({
    credentials: true,
}));

// Compression middleware
app.use(compression());

// Cookie parser middleware
app.use(cookieParser());

// Body parser middleware
app.use(bodyParser.json());

app.get("/", (req: Request, res: Response) => {
    res.send("Hello World");
});

//server
const server = http.createServer(app);

// Start server
server.listen(Port, () => {
    console.log(`Server running on port ${Port}`);
});

// Set mongoose to use ES6 Promises for native Promise
mongoose.Promise = Promise;

// Connect to MongoDB
mongoose.connect(MongoUrl);

mongoose.connection.on("error", (err: Error) => {
    console.error(`MongoDB connection error: ${err}`);
});

app.use("/", router());