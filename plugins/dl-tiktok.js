import fetch from 'node-fetch'

var handler = async (m, { conn, args, usedPrefix, command }) => {
    const url = (args[0] || '').trim()
    const tiktokPattern = /(tiktok\.com|vm\.tiktok\.com|tiktokcdn\.com)/i

    if (!url || !tiktokPattern.test(url)) {
        await conn.reply(m.chat, `*Inserisci un link TikTok valido*\n\nEsempio:\n${usedPrefix + command} https://www.tiktok.com/@user/video/123456789`, m)
        return
    }

    try {
        const tiktokData = await tiktokdl(url)
        if (!tiktokData || !tiktokData.data) {
            await conn.reply(m.chat, "❌ Errore API.", m)
            return
        }

        const data = tiktokData.data

        // trova URL video
        const videoURL = data.play || data.wmplay || data.playAddr || data.videoUrl || data.url

        if (!videoURL) {
            await conn.reply(m.chat, "❌ Impossibile trovare il video.", m)
            return
        }

        // solo descrizione
        const caption = data.title || "Nessuna descrizione"

        await conn.sendMessage(m.chat, {
            video: { url: videoURL },
            caption: caption
        }, { quoted: m })

    } catch (err) {
        console.error(err)
        await conn.reply(m.chat, "❌ Errore durante il download.", m)
    }
}

handler.help = ['tiktok']
handler.tags = ['download']
handler.command = /^(tiktok|tt|ttdl)$/i

export default handler

async function tiktokdl(url) {
    try {
        const api = `https://www.tikwm.com/api/?url=${encodeURIComponent(url)}&hd=1`
        const res = await fetch(api, { timeout: 20000 })
        if (!res.ok) return null
        return await res.json()
    } catch (e) {
        console.error('tiktokdl error:', e)
        return null
    }
}