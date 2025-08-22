import express, { Request, Response, Application } from "express";
import "dotenv/config";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import routes from "./routes/index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app: Application = express();
const port = process.env.PORT || 3030;

// *middleware

app.use(cors({origin: process.env.CLIENT_APP_URL,}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// *view engine

app.set("view engine", "ejs");
app.set("views", path.resolve(__dirname, "./views"));

// *routes
app.use(routes);

// * error handler
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

// * import jobs
import "./jobs/index.js";
import { emailQueue, emailQueueName } from "./jobs/emailJob.js";
import { error } from "console";
import errorHandlerMiddleware from "./middlewares/errorHandlerMiddleware.js";
import { renderEmailEjs } from "./helpers/renderEmailEjs.js";
import { name } from "ejs";

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
