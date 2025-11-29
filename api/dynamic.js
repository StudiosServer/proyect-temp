// /api/anime/index.js   (100% compatible con Vercel)

import fs from "fs";
import path from "path";

export default async function handler(req, res) {

    const folderName = "anime";

    // Ruta real en Vercel
    const folderPath = path.join(process.cwd(), "api", folderName);

    // Obtener archivos JS dentro de la carpeta
    const files = fs
        .readdirSync(folderPath)
        .filter(f => f.endsWith(".js") && f !== "index.js");

    // Generar filas de la tabla
    let rows = "";

    for (const file of files) {
        const name = path.parse(file).name;
        const displayName = name.charAt(0).toUpperCase() + name.slice(1);
        const route = `/api/${folderName}/${name}`;

        rows += `
        <tr class="button-false">
            <td class="ellipsis">
                <tt><span class="circle color-true"></span>${displayName}</tt>
            </td>
            <td align="center">
                <a href="${route}">
                    <button class="build-button">Use</button>
                </a>
            </td>
        </tr>`;
    }

    // HTML COMPLETO (Tu plantilla exacta)
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Studio Server - ${folderName}</title>
<link rel="shortcut icon" href="/res/favicon.png" type="image/png">

<style>
${readCss()}
</style>

<script>
${glitchScript(folderName)}
</script>

</head>

<body>
<center>
<div id="api-wrapper">
<div id="api-container">

<a href="/" style="text-decoration:none;color:black;">
<center><h1 id="header">${folderName}</h1></center>
</a>

<center><p id="fetching">You can <b>search</b> simply by clicking the <b>Use</b> button.</p></center>

<hr style="border: 0px; border-top: 1px dashed #222;">

<div class="table-wrapper">
<table class="table-api">
<tbody>
${rows}
</tbody>
</table>
</div>

<div class="texto-inferior">
<hr style="border: 0px; border-top: 1px dashed #222;">
&copy; <span id="year"></span> <b>Studio Server Developers</b>
</div>

</div>
</div>
</center>

<script>
document.getElementById("year").textContent = new Date().getFullYear();
</script>

</body>
</html>
`;

    res.setHeader("Content-Type", "text/html");
    res.status(200).send(html);
}

// ========================
// FUNCIONES DE APOYO
// ========================

// Lee tu CSS desde /public/res/style-funtio.css
function readCss() {
    try {
        return fs.readFileSync(path.join(process.cwd(), "public", "res", "style-funtio.css"), "utf8");
    } catch {
        return "body { font-family: monospace; }";
    }
}

function glitchScript(text) {
    return `
document.addEventListener('DOMContentLoaded', function() {
    const header = document.getElementById('header');
    const chars = "!@#<>$%^&*()-_=+[]{}|;:,.<>?\\~";
    const finalText = "${text}";
    const charTime = 50;
    const revealTime = 50;
    let glitching = true;
    const originalText = finalText.split('');
    const length = originalText.length;
    const halfLength = Math.ceil(length / 2);

    function getRandomChar() {
        return chars[Math.floor(Math.random() * chars.length)];
    }

    let glitchInterval = setInterval(() => {
        header.innerText = originalText.map(char =>
            glitching && Math.random() > 0.5 ? getRandomChar() : char
        ).join('');
    }, charTime);

    setTimeout(() => {
        clearInterval(glitchInterval);
        glitching = false;
        let step = 0;
        let revealInterval = setInterval(() => {
            if (step > halfLength) {
                clearInterval(revealInterval);
                header.innerText = finalText;
                return;
            }
            header.innerText = originalText.map((char, i) => {
                if (i < step || i >= length - step) return char;
                return getRandomChar();
            }).join('');
            step++;
        }, revealTime);
    }, 2000);
});
`;
}
