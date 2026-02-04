const handler = async (m, { conn, text }) => {
  const users = global.db.data.users || {};

  let mods = Object.entries(users)
    .filter(([jid, user]) => user.premium === true)
    .map(([jid]) => jid);

  if (mods.length === 0)
    return m.reply('⚠️ Nessun moderatore trovato.');

  // Messaggio personalizzato opzionale
  let customMsg = text
    ? `📝 *${text}*\n\n`
    : '';

  let caption = `
👑 *LISTA MODERATORI* 👑

${customMsg}📊 Totale: ${mods.length}

${mods.map((jid, i) => `${i + 1}. @${jid.split('@')[0]}`).join('\n')}
`.trim();

  await conn.sendMessage(
    m.chat,
    {
      text: caption,
      mentions: mods
    },
    { quoted: m }
  );
};

handler.help = ['modlist (messaggio)'];
handler.tags = ['owner'];
handler.command = ['modlist'];
handler.group = true;
handler.admin = true; 

export default handler;