import fetch from 'node-fetch'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    await conn.reply(m.chat, `『 🎧 』 \`Inserisci un link Spotify\`\n*✧ Esempio:*\n- *${usedPrefix}${command} https://open.spotify.com/track/3n3Ppam7vgaVa1iaRUc9Lp*`, m)
    return
  }

  await conn.sendMessage(m.chat, { react: { text: "🎧", key: m.key } })

  try {
    // 1️⃣ Prende info del brano da Spotify
    let s = await fetch(`https://api.fabdl.com/spotify/get?url=${encodeURIComponent(text)}`)
    let sp = await s.json()

    if (!sp.result || !sp.result.name) {
      return conn.reply(m.chat, '❌ Link Spotify non valido.', m)
    }

    let title = `${sp.result.name} ${sp.result.artists.join(" ")}`

    // 2️⃣ Cerca il brano su YouTube
    let yt = await fetch(`https://eliasar-yt-api.vercel.app/api/search/youtube?query=${encodeURIComponent(title)}`)
    let ytp = await yt.json()

    if (!ytp || !ytp.results || !ytp.results[0]) {
      return conn.reply(m.chat, '❌ Non riesco a trovare la canzone.', m)
    }

    let videoUrl = ytp.results[0].url

    // 3️⃣ Scarica audio da YouTube
    let dl = await fetch(`https://eliasar-yt-api.vercel.app/api/dl/yta?url=${encodeURIComponent(videoUrl)}`)
    let mp3 = await dl.json()

    if (!mp3 || !mp3.result || !mp3.result.url) {
      return conn.reply(m.chat, '❌ Errore nel download audio.', m)
    }

    const doc = {
      audio: { url: mp3.result.url },
      mimetype: 'audio/mpeg',
      fileName: `${sp.result.name}.mp3`,
      contextInfo: { ...global.fake.contextInfo }
    }

    await conn.sendMessage(m.chat, doc, { quoted: m })

  } catch (err) {
    console.error('Errore spotifymp3:', err)
    await conn.reply(m.chat, '❌ Errore durante il download.', m)
  }
}

handler.help = ['spotifymp3 <link>']
handler.tags = ['download']
handler.command = /^(spotifymp3|spmp3)$/i

export default handler