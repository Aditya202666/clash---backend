import express from "express";
import "dotenv/config";
import path from "path";
import { fileURLToPath } from "url";
import routes from "./routes/index.js";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const port = process.env.PORT || 3030;
// *middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// *view engine
app.set("view engine", "ejs");
app.set("views", path.resolve(__dirname, "./views"));
// *routes
app.use(routes);
// * error handler
app.use(errorHandlerMiddleware);
// app.get("/", async(req: Request, res: Response) => {
//     const html = await ejs.renderFile(path.resolve(__dirname, "./views/emails/welcome.ejs"), {username: "Aditya"});
//     // await sendMail("fiheb92510@amirei.com", "Welcome to Clash",html );
//     await emailQueue.add(emailQueueName, {to: "fiheb92510@amirei.com", subject: "Welcome to Clash", body: html} );
//     res.json({message: "Email sent successfully."});
// });
// * import jobs
import "./jobs/index.js";
import errorHandlerMiddleware from "./middlewares/errorHandlerMiddleware.js";
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
