import os from 'os'
import { performance } from 'perf_hooks'

const handler = async (m, { conn, usedPrefix, isOwner, isAdmin }) => {
  try {
    const user = global.db.data.users[m.sender] || {}

    // 🔐 Permessi: owner OR admin OR premium/mod
    if (!isOwner && !isAdmin && !user.premium) {
      return m.reply('⛔ *Questo comando è riservato ai MOD / PREMIUM*')
    }

    const uptimeMs = process.uptime() * 1000
    const uptimeStr = clockString(uptimeMs)

    // Ping
    const startTime = performance.now()
    const endTime = performance.now()
    const speed = (endTime - startTime).toFixed(4)

    const textMsg = `⟦ 𝙿𝙸𝙽𝙶·𝙱𝙾𝚃 ⟧
│
├─ 🕒 𝚄𝙿𝚃𝙸𝙼𝙴  : ${uptimeStr}
└─ ⚡ 𝙿𝙸𝙽𝙶    : ${speed} ms`

    await conn.sendMessage(
      m.chat,
      {
        text: textMsg,
        footer: '𝑷𝑰𝑵𝑮 𝑩𝒀 𝑫𝑻𝑯-𝑩𝑶𝑻',
        buttons: [
          {
            buttonId: usedPrefix + 'pingmod',
            buttonText: { displayText: '📡 𝐑𝐢𝐟𝐚𝐢 𝐩𝐢𝐧𝐠' },
            type: 1
          }
        ],
        headerType: 1
      },
      { quoted: m }
    )

  } catch (err) {
    console.error('Errore pingmod:', err)
    m.reply('❌ Errore durante il ping.')
  }
}

function clockString(ms) {
  const d = Math.floor(ms / 86400000)
  const h = Math.floor(ms / 3600000) % 24
  const m = Math.floor(ms / 60000) % 60
  const s = Math.floor(ms / 1000) % 60
  return [d, h, m, s].map(v => v.toString().padStart(2, '0')).join(':')
}

handler.help = ['pingmod']
handler.tags = ['info']
handler.command = /^pingmod$/i
handler.group = true
handler.premium = false

export default handler