import fetch from 'node-fetch'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return conn.reply(m.chat, `『 🎧 』 Inserisci un link Spotify\n\nEsempio:\n${usedPrefix}${command} https://open.spotify.com/track/3n3Ppam7vgaVa1iaRUc9Lp`, m)
  }

  await conn.sendMessage(m.chat, { react: { text: "🎧", key: m.key } })

  try {
    // API Spotify → MP3
    let res = await fetch(`https://api.guruapi.tech/spotifydl?url=${encodeURIComponent(text)}`)
    let json = await res.json()

    if (!json || !json.result || !json.result.download) {
      return conn.reply(m.chat, '❌ Impossibile scaricare questo brano Spotify.', m)
    }

    let { title, artist, download } = json.result

    await conn.sendMessage(m.chat, {
      audio: { url: download },
      mimetype: 'audio/mpeg',
      fileName: `${title} - ${artist}.mp3`,
      contextInfo: { ...global.fake.contextInfo }
    }, { quoted: m })

  } catch (e) {
    console.error(e)
    await conn.reply(m.chat, '❌ Errore API Spotify.', m)
  }
}

handler.help = ['spotifymp3 <url>']
handler.tags = ['download']
handler.command = /^(spotifymp3|spmp3)$/i

export default handler