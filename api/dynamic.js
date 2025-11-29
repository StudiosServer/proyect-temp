import fs from "fs/promises";
import path from "path";

export default async function handler(req, res) {
    try {
        const folderName = req.query.folder;   // /api/dynamic?folder=anime
        const baseDir = path.join(process.cwd(), "folders", folderName);

        let files;
        try {
            files = await fs.readdir(baseDir);
        } catch (e) {
            return res.status(404).send("Folder not found");
        }

        const jsFiles = files.filter(f => f.endsWith(".js"));

        const rowsHtml = jsFiles.map(file => {
            const cleanName = file.replace(".js", "");
            const displayName =
                cleanName.charAt(0).toUpperCase() + cleanName.slice(1);

            return `
<tr class="button-false">
   <td class="ellipsis">
      <tt><span class="circle color-true"></span>${displayName}</tt>
   </td>
   <td align="center">
      <a href="./${cleanName}">
         <button class="build-button">Use</button>
      </a>
   </td>
</tr>`;
        }).join("\n");

        const html = `
<!DOCTYPE html>
<html lang="en">
   <head>
<script>
${/* TODA TU ANIMACIÓN */""}
        document.addEventListener('DOMContentLoaded', function() {
            const header = document.getElementById('header');
            const chars = "!@#<>$%^&*()-_=+[]{}|;:,.<>?\\\`~";
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

<link rel="shortcut icon" href="/res/favicon.png" type="image/png">
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Studio Server - ${folderName}</title>
<link rel="stylesheet" href="/res/style-funtio.css">

   </head>
   <body>

      <center>
         <div id="api-wrapper">
            <div id="api-container">
               <a href="/" style="text-decoration: none; color: black;">
                  <center>
                     <h1 id="header">${folderName}</h1>
                  </center>
               </a>

               <center><p id="fetching">You can <b>search</b> simply by clicking the <b>Use</b> button.</p></center>

               <hr style="border: 0px; border-top: 1px dashed #222;">

               <div class="table-wrapper">
                  <table class="table-api">
                     <tbody>
                        ${rowsHtml}
                     </tbody>
                  </table>
               </div>

               <div class="texto-inferior">
                  <hr style="border: 0px; border-top: 1px dashed #222;">
                  &copy; <span id="year">${new Date().getFullYear()}</span>
                  <a href="https://developer.studioserver.org/" style="text-decoration: none; color: black;"><b>Studio Server Developers</b></a>
               </div>
            </div>
         </div>
      </center>

   </body>
</html>
`;

        res.setHeader("Content-Type", "text/html");
        return res.send(html);

    } catch (e) {
        console.error(e);
        res.status(500).send("Internal server error");
    }
}
