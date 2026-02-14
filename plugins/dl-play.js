const handler = async (m, { conn, text }) => {
  if (!text) return conn.reply(m.chat, "🎵 Scrivi una canzone", m);

  try {
    await conn.reply(m.chat, "🔎 Cerco...", m);

    const video = await searchYouTube(text);
    const audioUrl = await getAudioStream(video.videoId);

    await conn.sendMessage(
      m.chat,
      {
        audio: { url: audioUrl },
        mimetype: "audio/mp4",
        fileName: `${video.title}.m4a`
      },
      { quoted: m }
    );

  } catch (e) {
    console.error(e);
    conn.reply(m.chat, "❌ Errore nel recupero audio", m);
  }
};

handler.command = ["play"];
export default handler;