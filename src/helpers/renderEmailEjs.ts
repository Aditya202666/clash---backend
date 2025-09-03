import ejs from "ejs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const renderEmailEjs = async (
  filename: string,
  payload: Record<string, any>
): Promise<string> => {
  const html = await ejs.renderFile(
    path.resolve(__dirname, `../views/emails/${filename}.ejs`),
    payload
  );

  // console.log( path.resolve(__dirname, `../views/emails/${filename}.ejs`))

  return html;
};
