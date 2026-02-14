import fetch from 'node-fetch'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return conn.reply(m.chat, `『 🎵 』 Inserisci un link YouTube\n\nEsempio:\n${usedPrefix}${command} https://www.youtube.com/watch?v=dQw4w9WgXcQ`, m)
  }

  await conn.sendMessage(m.chat, { react: { text: "🎶", key: m.key } })

  try {
    // yt-dlp API
    let res = await fetch(`https://api.songdownloader.org/ytdlp?url=${encodeURIComponent(text)}`)
    let json = await res.json()

    if (!json || !json.audio) {
      return conn.reply(m.chat, '❌ Impossibile estrarre audio da questo video.', m)
    }

    await conn.sendMessage(m.chat, {
      audio: { url: json.audio },
      mimetype: 'audio/mpeg',
      fileName: `youtube_audio.mp3`,
      contextInfo: { ...global.fake.contextInfo }
    }, { quoted: m })

  } catch (e) {
    console.error(e)
    await conn.reply(m.chat, '❌ Errore durante il download.', m)
  }
}

handler.help = ['ytmp3 <url>']
handler.tags = ['download']
handler.command = /^(ytmp3|ytaudio)$/i

export default handler