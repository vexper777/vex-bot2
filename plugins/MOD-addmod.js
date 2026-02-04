const handler = async (m, { conn }) => {
    let who;
    if (m.isGroup)
        who = m.mentionedJid[0] || (m.quoted ? m.quoted.sender : null);
    else who = m.chat;

    if (!who)
        return m.reply('⚠️ Tagga l’utente da promuovere a MODERATORE.');

    // ✅ CREA L’UTENTE SE NON ESISTE
    let user = global.db.data.users[who];
    if (!user) {
        global.db.data.users[who] = {};
        user = global.db.data.users[who];
    }

    // Imposta MOD (premium permanente)
    user.premium = true;
    user.premiumTime = Infinity;

    // Foto profilo
    let pp;
    try {
        pp = await conn.profilePictureUrl(who, 'image');
    } catch {
        pp = 'https://i.ibb.co/3Fh9V6p/avatar-contact.png';
    }

    const name = '@' + who.split('@')[0];

    const caption = `
👑 MOD ATTIVATO 👑

👤 Utente: ${name}
🛡️ Stato: PERMANENTE
🚀 Accesso completo sbloccato

✨ Benvenuto nello staff dei moderatori!
`.trim();

    await conn.sendMessage(
        m.chat,
        {
            image: { url: pp },
            caption,
            mentions: [who]
        },
        { quoted: m }
    );
};

handler.help = ['addmod @user'];
handler.tags = ['owner'];
handler.command = ['addmod'];
handler.group = true;
handler.owner = true;

export default handler;