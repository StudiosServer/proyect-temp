import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.statusCode = 405;
    return res.end("Método no permitido");
  }

  try {
    // Petición a tu API externa que devuelve una imagen
    const response = await axios.get(
      "https://api.studioserver.org/anime/loli",
      {
        responseType: "arraybuffer" // NECESARIO para manejar imágenes
      }
    );

    // Copiamos el tipo de contenido original (image/png, image/jpeg, etc.)
    const contentType = response.headers["content-type"];
    res.setHeader("Content-Type", contentType);

    // Enviar la imagen al cliente
    res.statusCode = 200;
    res.end(response.data);

  } catch (error) {
    console.error("Error en apiphotos:", error);
    res.statusCode = 500;
    res.end("Error al obtener la imagen");
  }
}
