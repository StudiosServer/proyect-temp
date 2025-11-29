// dynamic.js — Generador automático de páginas HTML
import fs from "fs";
import path from "path";

export default function setupDynamicPages(app, baseDir) {

    // Ruta principal dinámica ejemplo: /anime
    app.get("/:folder", (req, res, next) => {
        const folderName = req.params.folder;
        const folderPath = path.join(baseDir, folderName);

        // Si NO existe, seguir con los siguientes middlewares
        if (!fs.existsSync(folderPath)) return next();

        // Leer archivos .js del directorio
        const files = fs.readdirSync(folderPath)
            .filter(f => f.endsWith(".js"));

        // Construir filas de la tabla dinámicamente
        let rows = "";

        for (const file of files) {
            const name = path.parse(file).name; // sin .js  
            const displayName = name.charAt(0).toUpperCase() + name.slice(1);
            const route = `./${name}`;

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

        // Construir el HTML completo
        const html = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Studio Server - ${folderName}</title>
<link rel="shortcut icon" href="/res/favicon.png" type="image/png">
<script>
    document.addEventListener('DOMContentLoaded', function() {
        const header = document.getElementById('header');
        const chars = "!@#<>$%^&*()-_=+[]{}|;:,.<>?\\~";
        const finalText = "${folderName}";
        const charTime = 50;
        const revealTime = 50;
        let glitching = true;
        const originalText = finalText.split('');
        const length = originalText.length;
        const halfLength = Math.ceil(length / 2);

        function getRandomChar() {
            return chars[Math.floor(Math.random() * chars.length)];
        }

        function glitchText(element) {
            let glitchInterval = setInterval(() => {
                let newText = originalText.map(char =>
                    glitching && Math.random() > 0.5 ? getRandomChar() : char
                ).join('');
                element.innerText = newText;
            }, charTime);

            setTimeout(() => {
                clearInterval(glitchInterval);
                glitching = false;
                let revealStep = 0;
                let revealInterval = setInterval(() => {
                    if (revealStep > halfLength) {
                        clearInterval(revealInterval);
                        element.innerText = finalText;
                        return;
                    }
                    let revealedText = originalText.map((char, i) => {
                        if (i < revealStep || i >= length - revealStep) return char;
                        return getRandomChar();
                    }).join('');
                    header.innerText = revealedText;
                    revealStep++;
                }, revealTime);
            }, 2000);
        }

        glitchText(header);
    });
</script>

<link rel="stylesheet" href="/res/style-funtio.css">

<style>
/* (Aquí va todo tu CSS EXACTO) */
${fs.readFileSync("./html-style.css", "utf8") || ""}
</style>

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
&copy; <span id="year"></span> <a href="https://developer.studioserver.org/" style="text-decoration:none;color:black;"><b>Studio Server Developers</b></a>
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

        res.send(html);
    });
}
