let handler = async (m, { conn, usedPrefix: _p }) => {

  let menu = `
ㅤ𝑴𝑬𝑵𝑼 𝑺𝑻𝑹𝑼𝑴𝑬𝑵𝑻𝑰 
╭━━━━━━━━━━━━━━━━━━━━━╮

│ 🧠 𝗔𝗜 & 𝗖𝗛𝗔𝗧
│ ──────────────────
│ 🛠️ ${_p}gpt (testo)
│ 🛠️ ${_p}claude
│ 🛠️ ${_p}gemini (testo)
│ 🛠️ ${_p}mistral (testo o media)
│ 🛠️ ${_p}nova (testo o media)
│ 🛠️ ${_p}imgai (testo)
│ 🛠️ ${_p}factcheck <testo>

│ ✉️ 𝗘𝗠𝗔𝗜𝗟
│ ─────────────
│ 🛠️ ${_p}creamail
│ 🛠️ ${_p}mail [ID]
│ 🛠️ ${_p}resetmail

│ 🎨 𝗦𝗧𝗜𝗖𝗞𝗘𝗥 & 𝗠𝗘𝗗𝗜𝗔
│ ─────────────────────
│ 🛠️ ${_p}s
│ 🛠️ ${_p}sticker
│ 🛠️ ${_p}stiker
│ 🛠️ ${_p}wm
│ 🛠️ ${_p}addaudio
│ 🛠️ ${_p}tomp3
│ 🛠️ ${_p}toaudio
│ 🛠️ ${_p}tourl
│ 🛠️ ${_p}tolink
│ 🛠️ ${_p}tagliamedia inizio fine
│ 🛠️ ${_p}songmix <a + b>
│ 🛠️ ${_p}titolo [posizione] | [testo]

│ 🖼️ 𝗘𝗗𝗜𝗧 𝗜𝗠𝗠𝗔𝗚𝗜𝗡𝗜
│ ─────────────────────
│ 🛠️ ${_p}removebg
│ 🛠️ ${_p}rimuovibg
│ 🛠️ ${_p}crop
│ 🛠️ ${_p}ritaglio
│ 🛠️ ${_p}autocrop
│ 🛠️ ${_p}rivela

│ 🧩 𝗧𝗘𝗦𝗧𝗢 & 𝗙𝗢𝗡𝗧
│ ─────────────────
│ 🛠️ ${_p}font [1-21] <testo>
│ 🛠️ ${_p}fontrandom <testo>
│ 🛠️ ${_p}brat <testo>
│ 🛠️ ${_p}bratvid <testo>

│ 🌍 𝗨𝗧𝗜𝗟𝗜𝗧𝗔̀
│ ─────────────
│ 🛠️ ${_p}ip <indirizzo>
│ 🛠️ ${_p}kcal
│ 🛠️ ${_p}maps <luogo>
│ 🛠️ ${_p}maps da <a> a <b>
│ 🛠️ ${_p}meteo
│ 🛠️ ${_p}lyrics <titolo> [artista]
│ 🛠️ ${_p}password

│ 📖 𝗥𝗘𝗟𝗜𝗚𝗜𝗢𝗡𝗘
│ ───────────────
│ 🛠️ ${_p}corano [sura:aya]
│ 🛠️ ${_p}bibbia [libro cap:vers]

│ 🗒️ 𝗡𝗢𝗧𝗘
│ ─────────
│ 🛠️ ${_p}nota
│ 🛠️ ${_p}addnota
│ 🛠️ ${_p}delnota
│ 🛠️ ${_p}editnota
│ 🛠️ ${_p}svuotanote

│ ⏱️ 𝗧𝗜𝗠𝗘𝗥
│ ──────────
│ 🛠️ ${_p}settimer <tempo> [motivo]
│ 🛠️ ${_p}timer
│ 🛠️ ${_p}deltimer [id]

│ 🌐 𝗤𝗥 & 𝗟𝗜𝗡𝗞
│ ──────────────
│ 🛠️ ${_p}qrcode
│ 🛠️ ${_p}leggiqr
│ 🛠️ ${_p}shorturl
│ 🛠️ ${_p}unshorten

│ 🗣️ 𝗟𝗜𝗡𝗚𝗨𝗔𝗚𝗚𝗜
│ ────────────────
│ 🛠️ ${_p}traduci [lingua] [testo]
│ 🛠️ ${_p}parla [lingua] [testo]
│ 🛠️ ${_p}trascrivi
│ 🛠️ ${_p}totext

╰━━━━━━━━━━━━━━━━━━━━━╯
√乇ﾒ乃のｲ // 𝚅𝚎𝚡-𝙱𝚘𝚝
`.trim()

  await conn.sendMessage(m.chat, {
    text: menu,
    contextInfo: {
      mentionedJid: [m.sender],
      forwardedNewsletterMessageInfo: {
        newsletterName: '🛠️ MENU STRUMENTI'
      }
    }
  }, { quoted: m })
}

handler.help = ['menustrumenti']
handler.tags = ['menu']
handler.command = ['menustrumenti', 'menutools']

export default handler