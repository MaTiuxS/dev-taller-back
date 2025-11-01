import express, { Application } from "express";
import "dotenv/config";
import router from "./routes/routes";
import morgan from "morgan";
import cors from "cors";
import { corsConfig } from "./config/cors";
const app: Application = express();

app.set("etag", false); // desactiva ETag
app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-store"); // no caches para /api
  res.removeHeader("Last-Modified");
  next();
  req;
});

// Read data from Json
app.use(express.json());

app.use(cors(corsConfig));
app.options("*", cors(corsConfig));

// Logger
app.use(morgan("dev"));

// Routing
app.use("/api", router);

export default app;
