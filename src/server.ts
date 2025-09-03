import express, { Request, Response, Application } from "express";
import "dotenv/config";
import cors from "cors";
import helmet from "helmet";
import path from "path";
import { fileURLToPath } from "url";
import { createServer, Server as HttpServer} from "http"

import routes from "./routes/index.js";
import errorHandlerMiddleware from "./middlewares/errorHandlerMiddleware.js";
import { renderEmailEjs } from "./helpers/renderEmailEjs.js";
import { initSocket, setupSocket } from "./socket.js";
import { globalRateLimiter } from "./config/rateLimiter.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app: Application = express();
const port = process.env.PORT || 3030;

const httpServer: HttpServer = createServer(app);

//  * initialize socket
const io = initSocket(httpServer);
setupSocket(io);


// *middleware
app.use(cors({origin: process.env.CLIENT_APP_URL,}));
app.use(helmet());
app.use(globalRateLimiter); 
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// *view engine

app.set("view engine", "ejs");
app.set("views", path.resolve(__dirname, "./views"));

// *routes
app.use(routes);

// * Global error handler
app.use(errorHandlerMiddleware);

app.get("/", async (req: Request, res: Response) => {
  const html = await renderEmailEjs("auth/verify-email", {
    url: "https://google.com",
    name: "Amir",
  });
  // await emailQueue.add(emailQueueName, {to: "fiheb92510@amirei.com", subject: "Welcome to Clash", body: html} );

  res.render("emails/auth/reset-password", {
    url: `${process.env.CLIENT_APP_URL}/login`,
  });
});


httpServer.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
