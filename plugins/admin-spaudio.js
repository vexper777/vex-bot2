import fetch from 'node-fetch'

var handler = async (m, { conn, args, usedPrefix, command }) => {
    const url = (args[0] || '').trim()
    const spotifyPattern = /(open\.spotify\.com\/track\/|spotify:track:)/i

    if (!url || !spotifyPattern.test(url)) {
        return conn.reply(m.chat, `🎧 *Inserisci un link Spotify valido*\n\nEsempio:\n${usedPrefix + command} https://open.spotify.com/track/XXXX`, m)
    }

    try {
        await conn.reply(m.chat, "⏳ Cerco il brano su Spotify + YouTube...", m)

        const api = `https://api.akuari.my.id/downloader/spotify?link=${encodeURIComponent(url)}`
        const res = await fetch(api)
        const json = await res.json()

        if (!json.status || !json.result) {
            return conn.reply(m.chat, "❌ Brano non trovato.", m)
        }

        const data = json.result

        const title = data.title
        const artist = data.artist
        const mp3 = data.audio

        const caption = `🎵 *${title}*\n👤 ${artist}`

        await conn.sendMessage(m.chat, {
            audio: { url: mp3 },
            mimetype: "audio/mpeg",
            fileName: `${title}.mp3`,
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