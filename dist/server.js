import express from "express";
import "dotenv/config";
import path from "path";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const port = process.env.PORT || 3000;
// *middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// *view engine
app.set("view engine", "ejs");
app.set("views", path.resolve(__dirname, "./views"));
// *routes
app.get("/", (req, res) => {
    res.render("welcome");
});
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
