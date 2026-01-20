import yts from "yt-search";
import { spawn } from "child_process";
import fs from "fs";
import os from "os";
import path from "path";

function downloadYTDLPToFile(url, format = "best", filename) {
  return new Promise((resolve, reject) => {
    const args = ["-f", format, "-o", filename];

    if (format === "bestaudio") {
      args.push("--extract-audio", "--audio-format", "m4a", "--audio-quality", "0");
    }

    args.push(url);

    const ytdlp = spawn("yt-dlp", args);

    let error = [];
    ytdlp.stderr.on("data", chunk => error.push(chunk));

    ytdlp.on("close", code => {
      if (code !== 0) return reject(Buffer.concat(error).toString());
      resolve(filename);
    });
  });
}

const handler = async (m, { conn, text, command }) => {
  if (!text) return conn.reply(m.chat, "Inserisci un titolo o link YouTube", m);

  let search = await yts(text);
  let vid = search.videos[0];
  if (!vid) return conn.reply(m.chat, "Nessun risultato trovato", m);

  let url = vid.url;
  let thumb = vid.thumbnail;
  const tempDir = os.tmpdir();

  try {
    if (command === "playaudio-dl") {
      await conn.reply(m.chat, "🎵 Ora Scarico l’audio…", m);
      const audioFile = path.join(tempDir, `${vid.title}.m4a`.replace(/[/\\?%*:|"<>]/g, "_"));
      await downloadYTDLPToFile(url, "bestaudio", audioFile);

      await conn.sendMessage(
        m.chat,
        { audio: fs.readFileSync(audioFile), mimetype: "audio/mp4", fileName: path.basename(audioFile) },
        { quoted: m }
      );

      fs.unlinkSync(audioFile); // pulisce il file temporaneo
      return;
    }

    if (command === "playvideo-dl") {
      await conn.reply(m.chat, "🎬 Scarico il video…", m);
      const videoFile = path.join(tempDir, `${vid.title}.mp4`.replace(/[/\\?%*:|"<>]/g, "_"));
      await downloadYTDLPToFile(url, "best[ext=mp4]", videoFile);

      await conn.sendMessage(
        m.chat,
        { video: fs.readFileSync(videoFile), mimetype: "video/mp4", fileName: path.basename(videoFile) },
        { quoted: m }
      );

      fs.unlinkSync(videoFile);
      return;
    }

    // 🔥 Bottoni
    await conn.sendMessage(
      m.chat,
      {
        image: { url: thumb },
        caption: `🎶 *${vid.title}*\n\n⏱ Durata: ${vid.timestamp}\n👁️ Visualizzazioni: ${vid.views}\n\nScegli cosa scaricare:`,
        buttons: [
          { buttonId: `.playaudio-dl ${url}`, buttonText: { displayText: "🎵 Scarica Audio" }, type: 1 },
          { buttonId: `.playvideo-dl ${url}`, buttonText: { displayText: "🎬 Scarica Video" }, type: 1 }
        ],
        headerType: 4
      },
      { quoted: m }
    );

  } catch (e) {
    console.error(e);
    return conn.reply(m.chat, "❗ Errore durante il download", m);
  }
};

handler.command = ["play", "playaudio-dl", "playvideo-dl"];
export default handler;