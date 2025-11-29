import axios from "axios";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.statusCode = 405;
    return res.end("Método no permitido");
  }

  try {
    // URL de la imagen que deseas descargar
    const imageUrl = "https://www.loliapi.com/acg/pp/";

    // Descargar la imagen en binario
    const response = await axios.get(imageUrl, {
      responseType: "arraybuffer",
    });

    // Guardar la imagen temporalmente
    const tempDir = path.join(__dirname, "tempdata");
    const imagePath = path.join(tempDir, "avatar.webp");

    // Crear directorio si no existe
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    fs.writeFileSync(imagePath, response.data);

    // Enviar archivo como respuesta
    res.setHeader("Content-Type", "image/webp");
    res.statusCode = 200;
    res.sendFile(imagePath, (err) => {
      if (err) {
        console.error("Error enviando archivo:", err);
        res.statusCode = 500;
        res.end("Error enviando imagen");
      }
    });

    // Ejecución secundaria en segundo plano (no bloquea)
    setImmediate(() => {
      const trackingURL = `https://studioservercounterapimax.onrender.com/use`;
      axios.get(trackingURL).catch(() => { });
    });

  } catch (error) {
    console.error("Error en avatar.js:", error);
    res.statusCode = 500;
    res.end(JSON.stringify({ status: false }));
  }
}
