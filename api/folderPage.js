import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Constructor de HTML
export default function folderPage(folderName, files) {
  const prettyFolder = folderName.charAt(0).toUpperCase() + folderName.slice(1);

  // Convertir nombres de archivos js → Nombre bonito y ruta
  const rowsHTML = files.map(file => {
    const base = file.replace(".js", "");
    const pretty = base.charAt(0).toUpperCase() + base.slice(1);

    return `
<tr class="button-false">
  <td class="ellipsis">
    <tt><span class="circle color-true"></span>${pretty}</tt>
  </td>
  <td align="center">
    <a href="./${base}">
      <button class="build-button">Use</button>
    </a>
  </td>
</tr>`;
  }).join("");

  // HTML final
  return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Studio Server - ${prettyFolder}</title>
<link rel="shortcut icon" href="/res/favicon.png" type="image/png">
<link href="https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/res/style-funtio.css">

<script>
document.addEventListener('DOMContentLoaded', function() {
    const header = document.getElementById('header');
    const chars = "!@#<>$%^&*()-_=+[]{}|;:,.<>?\\\`~";
    const finalText = "${prettyFolder}";
    const charTime = 50;
    const revealTime = 50;
    let glitching = true;
    const originalText = finalText.split('');
    const length = originalText.length;
    const halfLength = Math.ceil(length / 2);

    function getRandomChar() {
        return chars[Math.floor(Math.random() * chars.length)];
    }

    function glitchText(element, finalText, charTime, revealTime) {
        let glitchInterval = setInterval(() => {
            let newText = originalText.map((char, i) => {
                return glitching && Math.random() > 0.5 ? getRandomChar() : char;
            }).join('');
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
                    if (i < revealStep || i >= length - revealStep) {
                        return char;
                    }
                    return getRandomChar();
                }).join('');
                element.innerText = revealedText;
                revealStep++;
            }, revealTime);
        }, 2000);
    }

    glitchText(header, finalText, charTime, revealTime);
});
</script>

<style>
${generateStyles()}
</style>

</head>
<body>

<center>
  <div id="api-wrapper">
    <div id="api-container">

      <a href="/" style="text-decoration:none;color:black;">
        <center><h1 id="header">${prettyFolder}</h1></center>
      </a>

      <center><p id="fetching">You can <b>search</b> simply by clicking the <b>Use</b> button.</p></center>

      <hr style="border:0;border-top:1px dashed #222;">

      <div class="table-wrapper">
        <table class="table-api" cellspacing="0">
          <tbody>
            ${rowsHTML}
          </tbody>
        </table>
      </div>

      <div class="texto-inferior">
        <hr style="border:0;border-top:1px dashed #222;">
        &copy; <span id="year"></span> 
        <a href="https://developer.studioserver.org/" style="text-decoration:none;color:black;">
          <b>Studio Server Developers</b>
        </a>
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
}

function generateStyles() {
return `
/* TODAS LAS MISMA QUE ME DISTE — PEGADAS TAL CUAL */
${/* PEGADO DE TU CSS EXACTO */""}
.share-tech-mono-regular, body {
  font-family: "Share Tech Mono", monospace;
}
body {
  margin:0;padding:0;
  display:flex;
  justify-content:center;
  align-items:center;
  min-height:100vh;
  background-image:url("/res/background.png");
  background-attachment:fixed;
  background-color:#fff;
}
#api-wrapper { width:100%; display:flex; justify-content:center; }
#api-container {
  width:300px; height:428px; padding:20px; 
  overflow:hidden; overflow-y:auto; 
  border:1px dashed #222;
  position:relative;
}
.table-api td, .table-api th { padding:10px; }
.circle {
  width:10px; height:10px; border-radius:50%;
  display:inline-block; margin-right:6px;
  animation:1s infinite blink;
}
@keyframes blink { 0%,100%{opacity:0;} 50%{opacity:1;} }
.build-button {
  padding:6px 10px;
  background:#eee;
  color:#333;
  border-radius:6px;
  cursor:pointer;
}
.build-button:hover { background:#333; color:white; }
`;
}
