let handler = async (m, { conn }) => {
  try {
    const menuPremium = `
╭━━━『 √乇ﾒ乃のｲ // 𝚅𝚎𝚡-𝙱𝚘𝚝 』━━━
┃ 💎 .creamail — Genera una mail premium
┃ 💎 .mail [ID] — Controlla una mail
┃ 💎 .resetmail — Resetta la tua mail
┃ 💎 .nowa — Genera un numero WA
┃ 💎 .imgai (testo) — Crea immagini con AI
┃ 💎 .mistral (testo/media) — AI avanzata Mistral
┃ 💎 .nova (testo/media) — AI avanzata Nova
┃
╰━━━⸙⋆⸙⋆⸙━━━
🩸 √乇ﾒ乃のｲ // 𝚅𝚎𝚡-𝙱𝚘𝚝
`.trim()

    // Invia il menù come semplice messaggio di testo
    await conn.sendMessage(m.chat, {
      text: menuPremium,
      ...fake, // opzionale, se vuoi mantenere il contesto fake
      contextInfo: {
        ...fake.contextInfo,
        mentionedJid: [m.sender]
      }
    }, { quoted: m })

  } catch (e) {
    conn.reply(m.chat, '❌ Errore nel menu premium.', m)
    throw e
  }
}

handler.help = ['menuspremium']
handler.tags = ['menu']
handler.command = ['menupremium', 'menuprem']

export default handler