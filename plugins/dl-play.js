import { spawn } from "child_process";
import fs from "fs";
import os from "os";
import path from "path";

function downloadAudio(url, filename) {
  return new Promise((resolve, reject) => {
    const args = [
      "-f", "bestaudio",
      "--extract-audio",
      "--audio-format", "m4a",
      "--audio-quality", "0",
      "-o", filename,
      url
    ];

    const ytdlp = spawn("yt-dlp", args);

    let error = [];
    ytdlp.stderr.on("data", chunk => error.push(chunk));

    ytdlp.on("close", code => {
      if (code !== 0) return reject(Buffer.concat(error).toString());
      resolve(filename);
    });
  });
}

function searchYT(query) {
  return new Promise((resolve, reject) => {
    const ytdlp = spawn("yt-dlp", [
      "--dump-json",
      "--flat-playlist",
      "--default-search",
      "ytsearch1:",
      query
    ]);

    let out = [];
    let err = [];

    ytdlp.stdout.on("data", d => out.push(d));
    ytdlp.stderr.on("data", d => err.push(d));

    ytdlp.on("close", code => {
      if (code !== 0) return reject(Buffer.concat(err).toString());

      try {
        const json = JSON.parse(Buffer.concat(out).toString().trim());
        resolve({
          title: json.title,
          url: json.webpage_url || json.url
        });
      } catch {
        reject("Nessun risultato");
      }
    });
  });
}

const handler = async (m, { conn, text }) => {
  if (!text) return conn.reply(m.chat, "🎵 Inserisci il nome di una canzone", m);

  let video;
  try {
    video = await searchYT(text);
  } catch {
    return conn.reply(m.chat, "❌ Nessun risultato trovato", m);
  }

  const tempFile = path.join(
    os.tmpdir(),
    `${video.title}.m4a`.replace(/[/\\?%*:|"<>]/g, "_")
  );

  try {
    await conn.reply(m.chat, "🎧 Sto scaricando l'audio...", m);

    await downloadAudio(video.url, tempFile);

    await conn.sendMessage(
      m.chat,
      {
        audio: fs.readFileSync(tempFile),
        mimetype: "audio/mp4",
        fileName: `${video.title}.m4a`
      },
      { quoted: m }
    );

    fs.unlinkSync(tempFile);
  } catch (e) {
    console.error(e);
    conn.reply(m.chat, "❌ Errore durante il download", m);
  }
};

handler.command = ["play"];
export default handler;