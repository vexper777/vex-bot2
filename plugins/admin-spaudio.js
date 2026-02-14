import fetch from 'node-fetch'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return conn.reply(m.chat, `『 🎧 』 Inserisci un link Spotify\n\nEsempio:\n${usedPrefix}${command} https://open.spotify.com/track/3n3Ppam7vgaVa1iaRUc9Lp`, m)
  }

  await conn.sendMessage(m.chat, { react: { text: "🎧", key: m.key } })

  try {
    // 1️⃣ Estrae titolo + artista dal link Spotify
    let sp = await fetch(`https://api.songdownloader.org/spotify?url=${encodeURIComponent(text)}`)
    let spjson = await sp.json()

    if (!spjson || !spjson.title) {
      return conn.reply(m.chat, '❌ Link Spotify non valido.', m)
    }

    let query = `${spjson.title} ${spjson.artist}`

    // 2️⃣ Cerca su YouTube
    let yt = await fetch(`https://api.songdownloader.org/search?q=${encodeURIComponent(query)}`)
    let ytjson = await yt.json()

    if (!ytjson || !ytjson[0]) {
      return conn.reply(m.chat, '❌ Brano non trovato su YouTube.', m)
    }

    let video = ytjson[0].url

    // 3️⃣ yt‑dlp → MP3
    let dl = await fetch(`https://api.songdownloader.org/ytdlp?url=${encodeURIComponent(video)}`)
    let mp3 = await dl.json()

    if (!mp3 || !mp3.audio) {
      return conn.reply(m.chat, '❌ Errore durante conversione audio.', m)
    }

    await conn.sendMessage(m.chat, {
      audio: { url: mp3.audio },
      mimetype: 'audio/mpeg',
      fileName: `${spjson.title}.mp3`,
      contextInfo: { ...global.fake.contextInfo }
    }, { quoted: m })

  } catch (e) {
    console.error(e)
    await conn.reply(m.chat, '❌ Errore di download.', m)
  }
}

handler.help = ['spotifymp3 <url>']
handler.tags = ['download']
handler.command = /^(spotifymp3|spmp3)$/i

export default handler