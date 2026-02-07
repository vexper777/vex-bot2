import fetch from 'node-fetch'

const handler = async (m, { conn }) => {
  let who;
  if (m.isGroup)
    who = m.mentionedJid[0] || (m.quoted ? m.quoted.sender : null);
  else who = m.chat;

  if (!who)
    return m.reply('⚠️ Tagga l’utente a cui vuoi rimuovere il *MODERATORE*.');

  const user = global.db.data.users[who];
  if (!user)
    return m.reply('❌ Questo utente non è presente nel database.');

  if (!user.premium)
    return m.reply('ℹ️ Questo utente non è un MODERATORE.');

  // Rimuove moderatore
  user.premium = false;
  user.premiumTime = 0;

  // Foto profilo → thumbnail
  let thumb;
  try {
    const ppUrl = await conn.profilePictureUrl(who, 'image');
    const res = await fetch(ppUrl);
    thumb = await res.buffer();
  } catch {
    const res = await fetch('https://i.ibb.co/3Fh9V6p/avatar-contact.png');
    thumb = await res.buffer();
  }

  const name = '@' + who.split('@')[0];

  const caption = `
🚫 *MODERATORE RIMOSSO* 🚫

👤 Utente: ${name}
🛡️ Stato: *DISATTIVATO*
🔒 Accesso da moderatore revocato

⚠️ I privilegi di moderatore sono stati rimossi.
`.trim();

  await conn.sendMessage(
    m.chat,
    {
      text: caption,
      mentions: [who],
      contextInfo: {
        jpegThumbnail: thumb
      }
    },
    { quoted: m }
  );
};

handler.help = ['delmod @user'];
handler.tags = ['owner'];
handler.command = ['delmod'];
handler.group = true;
handler.owner = true;

export default handler;