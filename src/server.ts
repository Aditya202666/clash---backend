import express, { Request, Response, Application} from "express";
import "dotenv/config";
import cors from "cors";
import ejs from "ejs";
import path from "path";
import { fileURLToPath } from "url";

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
app.get("/", (req: Request, res: Response) => {
    res.render("welcome");
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

 