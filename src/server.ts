import express, { Request, Response, Application} from "express";
import "dotenv/config";
import cors from "cors";
import ejs from "ejs";
import path from "path";
import { fileURLToPath } from "url";
import { sendMail } from "./config/nodemailer.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app: Application = express();
const port = process.env.PORT || 3000;


// *middleware

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// *view engine

app.set("view engine", "ejs");
app.set("views", path.resolve(__dirname, "./views"));


// *routes
app.get("/", async(req: Request, res: Response) => {
    const html = await ejs.renderFile(path.resolve(__dirname, "./views/emails/welcome.ejs"), {username: "Aditya"});
    await sendMail("fiheb92510@amirei.com", "Welcome to Clash",html );
    res.json({message: "Email sent successfully."});
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

 