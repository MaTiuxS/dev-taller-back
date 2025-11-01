import { CorsOptions } from "cors";

export const corsConfig: CorsOptions = {
  origin: (origin, callback) => {
    const whiteList = [process.env.FRONTEND_URL, process.env.N8N_URL];
    if (process.argv[2] === "--api") {
      whiteList.push(undefined);
    }

    if (!origin) return callback(null, true);
    const normalizedOrigin = origin.replace(/\/$/, "");

    if (whiteList.includes(normalizedOrigin)) {
      callback(null, true);
    } else {
      callback(new Error("Error de CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
