let handler = async (m, { conn, usedPrefix }) => {
  let nomeDelBot = global.db.data.nomedelbot || ``

  const messageOptions = {
    contextInfo: {
      forwardingScore: 999,
      isForwarded: true,
      forwardedNewsletterMessageInfo: {
        newsletterJid:'',
        serverMessageId: '',
        newsletterName: `${nomeDelBot}`
      }
    }
  }

  await conn.sendMessage(m.chat, {
    text: `𝙘𝙝𝙚 𝙘𝙖𝙯𝙯𝙤 𝙥𝙚𝙣𝙨𝙖𝙫𝙞 𝙘𝙤𝙜𝙡𝙞𝙤𝙣𝙚😂
`,
    ...messageOptions
  })
}

handler.help = ['autoadmin']
handler.tags = ['fun']
handler.command = /^(autoadmin)$/i

export default handler