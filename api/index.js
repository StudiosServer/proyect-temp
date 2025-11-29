import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default async function handler(req, res) {
  if (req.url === '/' || req.url === '/home') {
    const filePath = join(__dirname, '../public/home.html');
    try {
      const html = fs.readFileSync(filePath, 'utf-8');
      res.setHeader('Content-Type', 'text/html');
      res.statusCode = 200;
      res.end(html);
    } catch (err) {
      res.statusCode = 500;
      res.end('Error al cargar la página');
    }
  } else {
    res.statusCode = 404;
    res.end('Página no encontrada');
  }
}
