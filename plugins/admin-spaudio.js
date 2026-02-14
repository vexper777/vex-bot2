import fetch from 'node-fetch'

var handler = async (m, { conn, args, usedPrefix, command }) => {
    const url = (args[0] || '').trim()
    const spotifyPattern = /(open\.spotify\.com\/track\/|spotify:track:)/i

    if (!url || !spotifyPattern.test(url)) {
        await conn.reply(m.chat, `🎧 *Inserisci un link Spotify valido*\n\nEsempio:\n${usedPrefix + command} https://open.spotify.com/track/XXXX`, m)
        return
    }

    try {
        await conn.reply(m.chat, "⏳ Scaricando MP3...", m)

        const api = `https://api.fabdl.com/spotify/get?url=${encodeURIComponent(url)}`
        const res = await fetch(api)
        const json = await res.json()

        if (!json.result || !json.result.download_url) {
            return conn.reply(m.chat, "❌ Brano non trovato.", m)
        }

        const data = json.result
        const mp3 = data.download_url

        const caption = `🎵 *${data.name}*\n👤 ${data.artist}\n💽 ${data.album}`

        await conn.sendMessage(m.chat, {
            audio: { url: mp3 },
            mimetype: "audio/mpeg",
            fileName: `${data.name}.mp3`,
            caption: caption
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