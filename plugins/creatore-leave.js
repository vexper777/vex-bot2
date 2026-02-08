let handler = async (m, { conn, text, command }) => {
  const isOwner = [...global.owner.map(([number]) => number), ...global.mods].map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(m.sender)
  if (!isOwner) {
    if (!m.isAdmin) {
      await m.reply('⚠️ Questo comando può essere usato solo da admin e owner del gruppo')
      return
    }
  }

  let id = text ? text : m.chat  
  let chat = global.db.data.chats[m.chat]
  
  await conn.reply(id, `mi sono rotto il cazzo di stare qua dentro ciao`) 
  await conn.groupLeave(id)
  
  try {
  } catch (e) {
    console.error('Errore durante l\'uscita:', e)
    await m.reply('Si è verificato un errore durante l\'uscita dal gruppo')
  }
}

handler.command = /^(out|leavegc|leave|voltati)$/i
handler.group = true
handler.owner = true
export default handler