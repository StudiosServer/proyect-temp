import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ruta absoluta a /folders
const foldersPath = path.join(__dirname, "..", "folders");

// Cargar dinámicamente todos los módulos
function loadHandlers() {
  const handlers = {};

  const folders = fs.readdirSync(foldersPath);

  for (const folder of folders) {
    const fullFolder = path.join(foldersPath, folder);

    if (fs.statSync(fullFolder).isDirectory()) {
      const files = fs.readdirSync(fullFolder);

      for (const file of files) {
        if (file.endsWith(".js")) {
          const routeName = file.replace(".js", ""); // ej: apiphotos
          const routePath = `/${folder}/${routeName}`; // ej: /fotos/apiphotos

          const modulePath = path.join(fullFolder, file);

          handlers[routePath] = import(modulePath);
        }
      }
    }
  }

  return handlers;
}

export default async function handler(req, res) {
  const handlers = loadHandlers();  // Se carga en cada request (compatible Vercel)
  const url = req.url;

  if (handlers[url]) {
    const mod = await handlers[url];

    if (mod.default) return mod.default(req, res);

    res.statusCode = 500;
    return res.end("El módulo no tiene export default");
  }

  res.statusCode = 404;
  res.end("Ruta dinámica no encontrada");
}
