import fetch from 'node-fetch'
import cheerio from 'cheerio'

var handler = async (m, { conn, args, usedPrefix, command }) => {
    const url = (args[0] || '').trim()
    const spotifyPattern = /(open\.spotify\.com)/i

    if (!url || !spotifyPattern.test(url)) {
        await conn.reply(m.chat, `*Inserisci un link Spotify valido*\n\nEsempio:\n${usedPrefix + command} https://open.spotify.com/track/xxxxx`, m)
        return
    }

    try {
        // 1) Legge titolo e artista da Spotify
        const meta = await getSpotifyMeta(url)
        if (!meta) {
            await conn.reply(m.chat, "❌ Impossibile leggere il link Spotify.", m)
            return
        }

        // 2) Cerca su YouTube
        const query = `${meta.title} ${meta.artist}`
        const yt = await ytSearch(query)
        if (!yt) {
            await conn.reply(m.chat, "❌ Brano non trovato su YouTube.", m)
            return
        }

        // 3) Scarica MP3
        const audioURL = await ytDownload(yt.url)
        if (!audioURL) {
            await conn.reply(m.chat, "❌ Errore nel download dell’audio.", m)
            return
        }

        const caption = `🎧 ${meta.title}\n👤 ${meta.artist}`

        await conn.sendMessage(m.chat, {
            audio: { url: audioURL },
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

// ===============================
// 🔧 FUNZIONI
// ===============================

// Legge titolo e artista dal link Spotify usando l'embed
async function getSpotifyMeta(url) {
    try {
        const embed = url.replace('/track/', '/embed/track/')
        const res = await fetch(embed)
        const html = await res.text()
        const $ = cheerio.load(html)

        const title = $('meta[property="og:title"]').attr('content')
        const artist = $('meta[property="og:description"]').attr('content')

        if (!title || !artist) return null
        return { title, artist }
    } catch (e) {
        return null
    }
}

// Cerca il brano su YouTube
async function ytSearch(query) {
    try {
        const res = await fetch(`https://ytsearcher.vercel.app/api/search?q=${encodeURIComponent(query)}`)
        const json = await res.json()
        if (!json.videos || !json.videos[0]) return null

        return {
            title: json.videos[0].title,
            url: json.videos[0].url
        }
    } catch {
        return null
    }
}

// Scarica audio MP3 da YouTube
async function ytDownload(url) {
    try {
        const res = await fetch("https://www.y2mate.guru/api/convert", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url, format: "mp3" })
        })

        const json = await res.json()
        return json.download_url
    } catch {
        return null
    }
}