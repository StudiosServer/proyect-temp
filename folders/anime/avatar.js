import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.statusCode = 405;
    return res.end("Método no permitido");
  }

  try {
    // Petición a la API externa que devuelve una imagen
    const response = await axios.get(
      "https://api.studioserver.org/anime/avatar",
      {
        responseType: "arraybuffer" // Necesario para recibir imagen en binario
      }
    );

    // Copiamos el tipo de imagen recibido de la API
    const contentType = response.headers["content-type"];
    res.setHeader("Content-Type", contentType);

    // Enviamos la imagen al cliente
    res.statusCode = 200;
    res.end(response.data);

  } catch (error) {
    console.error("Error en /anime/avatar:", error);
    res.statusCode = 500;
    res.end("Error al obtener la imagen");
  }
}
