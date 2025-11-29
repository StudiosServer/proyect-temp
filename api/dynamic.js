import fs from "fs";
import path from "path";

const FOLDERS_PATH = path.join(process.cwd(), "folders");

// Genera el HTML dinámico
function generateHTML(folderName, files) {
  const cleanFolderName =
    folderName.charAt(0).toUpperCase() + folderName.slice(1);

  let rows = "";

  files.forEach((file) => {
    const cleanName = file.replace(".js", "");
    const displayName =
      cleanName.charAt(0).toUpperCase() + cleanName.slice(1);

    rows += `
        <tr class="button-false">
          <td class="ellipsis">
            <tt><span class="circle color-true"></span>${displayName}</tt>
          </td>
          <td align="center">
            <a href="/${folderName}/${cleanName}">
              <button class="build-button">Use</button>
            </a>
          </td>
        </tr>
    `;
  });

  return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Studio Server - ${cleanFolderName}</title>
<link rel="stylesheet" href="/res/style-funtio.css">
</head>

<body>
<center>
<div id="api-wrapper">
<div id="api-container">
<h1 id="header">${cleanFolderName}</h1>

<p>You can <b>search</b> simply by clicking the <b>Use</b> button.</p>
<hr>

<div class="table-wrapper">
<table class="table-api" cellspacing="0">
<tbody>
${rows}
</tbody>
</table>
</div>

<hr>
&copy; ${new Date().getFullYear()} Studio Server Developers.
</div>
</div>
</center>
</body>
</html>
`;
}

// MAIN HANDLER
export default async function handler(req, res) {
  try {
    const url = req.url.split("?")[0];

    // 1. Ruta / → home.html
    if (url === "/") {
      const filePath = path.join(process.cwd(), "public", "home.html");
      const home = fs.readFileSync(filePath, "utf8");
      res.setHeader("Content-Type", "text/html");
      return res.status(200).send(home);
    }

    // 2. Detecta carpeta y archivo
    const parts = url.split("/").filter((a) => a);

    const folder = parts[0];
    const file = parts[1];

    const folderPath = path.join(FOLDERS_PATH, folder);

    // Verificar si la carpeta existe
    if (!fs.existsSync(folderPath)) {
      return res.status(404).send("Not found");
    }

    // Si NO hay archivo → devolver HTML auto generado
    if (!file) {
      const allFiles = fs
        .readdirSync(folderPath)
        .filter((f) => f.endsWith(".js"));

      const html = generateHTML(folder, allFiles);
      res.setHeader("Content-Type", "text/html");
      return res.status(200).send(html);
    }

    // Ejecutar archivo JS dinámicamente
    const filePath = path.join(folderPath, `${file}.js`);

    if (!fs.existsSync(filePath)) {
      return res.status(404).send("API not found");
    }

    const module = await import(filePath);
    return module.default(req, res);

  } catch (err) {
    console.error(err);
    return res.status(500).send("Server error");
  }
}
