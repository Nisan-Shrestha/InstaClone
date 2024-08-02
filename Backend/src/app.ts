import express from "express";

import cookieParser from "cookie-parser";
import cors from "cors";
import config from "./config";
import { genericErrorHandler } from "./middleware/errorHandler";
import { requestLogger } from "./middleware/logger";
import router from "./routes/index";

const app = express();


app.use(express.json());
app.use(
  cors({
    origin:true,
    // Frontend domain
    credentials: true, // Allow credentials
  })
);
app.use(cookieParser());
app.use(requestLogger);
app.use(router);
// app.use(notFoundError);
app.use(genericErrorHandler);

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});
