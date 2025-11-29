import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.statusCode = 405;
    return res.end("Método no permitido");
  }

  try {
    const imageUrl = "https://www.loliapi.com/acg/pp/";

    // Descargar la imagen en binario SIN GUARDAR
    const response = await axios.get(imageUrl, {
      responseType: "arraybuffer",
    });

    // Copiar el tipo de imagen del servidor externo
    const contentType = response.headers["content-type"] || "image/webp";
    res.setHeader("Content-Type", contentType);

    // Enviar la imagen directamente al cliente
    res.statusCode = 200;
    res.end(response.data);

    // Llamada secundaria en segundo plano (no bloquea)
    setImmediate(() => {
      axios
        .get("https://studioservercounterapimax.onrender.com/use")
        .catch(() => {});
    });

  } catch (error) {
    console.error("avatar.js ERROR:", error);
    res.statusCode = 500;
    res.end(JSON.stringify({ status: false }));
  }
}
