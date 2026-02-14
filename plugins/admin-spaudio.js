import fetch from 'node-fetch'

var handler = async (m, { conn, args, usedPrefix, command }) => {
    const url = (args[0] || '').trim()
    const spotifyPattern = /(open\.spotify\.com\/track\/|spotify:track:)/i

    if (!url || !spotifyPattern.test(url)) {
        return conn.reply(m.chat, `🎧 *Inserisci un link Spotify valido*\n\nEsempio:\n${usedPrefix + command} https://open.spotify.com/track/XXXX`, m)
    }

    try {
        await conn.reply(m.chat, "⏳ Convertendo Spotify in MP3...", m)

        const api = `https://spotifydl.info/api/convert?url=${encodeURIComponent(url)}`
        const res = await fetch(api)
        const json = await res.json()

        if (!json.success) {
            return conn.reply(m.chat, "❌ Brano non trovato.", m)
        }

        const title = json.metadata.title
        const artist = json.metadata.artist
        const mp3 = json.download.link

        await conn.sendMessage(m.chat, {
            audio: { url: mp3 },
            mimetype: "audio/mpeg",
            fileName: `${title}.mp3`,
            caption: `🎵 *${title}*\n👤 ${artist}`
        }, { quoted: m })

    } catch (e) {
        console.error(e)
        conn.reply(m.chat, "❌ Errore durante il download.", m)
    }
}

handler.help = ['spotdl']
handler.tags = ['download']
handler.command = /^(spotdl|spotify|mp3)$/i

export default handler