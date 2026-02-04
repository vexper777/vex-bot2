/**
 * MENU MOD – SOLO TESTO
 */

const handler = async (message, { conn, usedPrefix = '.' }) => {

    const menuText = `
🌟 *MENU MODERATORI*

════════════════════
🛠️ *COMANDI MOD*
➤ ${usedPrefix}tagmod
➤ ${usedPrefix}pingmod
➤ ${usedPrefix}delm
➤ ${usedPrefix}nukegp
➤ ${usedPrefix}warnmod
➤ ${usedPrefix}unwarnmod

════════════════════
📂 *ALTRI MENU*
➤ ${usedPrefix}menu
➤ ${usedPrefix}menuadmin
➤ ${usedPrefix}menuowner
➤ ${usedPrefix}menugruppo
➤ ${usedPrefix}funzioni 

════════════════════
🔖 Versione: *2.0*
💫 Usa i comandi sopra
`.trim();

    // INVIO SOLO TESTO
    await conn.sendMessage(message.chat, { text: menuText });
};

handler.help = ['menumod'];
handler.tags = ['menu'];
handler.command = /^(menumod)$/i;

export default handler;