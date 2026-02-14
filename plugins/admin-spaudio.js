import fetch from 'node-fetch'

var handler = async (m, { conn, args, usedPrefix, command }) => {
    const url = (args[0] || '').trim()
    const spotifyPattern = /(open\.spotify\.com)/i

    if (!url || !spotifyPattern.test(url)) {
        await conn.reply(m.chat, `*Inserisci un link Spotify valido*\n\nEsempio:\n${usedPrefix + command} https://open.spotify.com/track/xxxxx`, m)
        return
    }

    try {
        // 1️⃣ Ottieni info Spotify
        const meta = await spotifyMeta(url)
        if (!meta) {
            await conn.reply(m.chat, "❌ Impossibile leggere il link Spotify.", m)
            return
        }

        // 2️⃣ Cerca il brano su YouTube
        const query = `${meta.title} ${meta.artist}`
        const yt = await ytSearch(query)
        if (!yt) {
            await conn.reply(m.chat, "❌ Brano non trovato.", m)
            return
        }

        // 3️⃣ Scarica audio
        const audio = await ytAudio(yt.url)
        if (!audio || !audio.download_url) {
            await conn.reply(m.chat, "❌ Errore download audio.", m)
            return
        }

        const caption = `🎧 ${meta.title}\n👤 ${meta.artist}`

        await conn.sendMessage(m.chat, {
            audio: { url: audio.download_url },
            mimetype: 'audio/mpeg',
            fileName: `${meta.title}.mp3`,
            caption
        }, { quoted: m })

    } catch (err) {
        console.error(err)
        await conn.reply(m.chat, "❌ Errore durante il download.", m)
    }
}

handler.help = ['spaudio']
handler.tags = ['download']
handler.command = /^(spaudio|spotifymp3|spmp3)$/i

export default handler