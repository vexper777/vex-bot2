let handler = async (m, { conn, isAdmin, participants }) => {
    if (!isAdmin) return m.reply("❌ *Solo gli admin possono usare questo comando!*")

    // Prende in automatico il link del gruppo
    let code = await conn.groupInviteCode(m.chat)
    let link = `https://chat.whatsapp.com/${code}`

    // Primo messaggio
    await conn.sendMessage(m.chat, { 
        text: "*𝗤𝗨𝗘𝗦𝗧𝗢 𝗚𝗥𝗨𝗣𝗣𝗢 𝗘’ 𝗦𝗧𝗔𝗧𝗢 𝗗𝗢𝗠𝗜𝗡𝗔𝗧𝗢 𝗗𝗔 VEXPER* 🔥" 
    })

    // Menzioni invisibili
    let mentions = participants.map(u => u.id)

    // Secondo messaggio con tag invisibili
    await conn.sendMessage(m.chat, { 
        text: `𝘾𝙄 𝙏𝙍𝘼𝙎𝙁𝙀𝙍𝙄𝘼𝙈𝙊 𝙌𝙐𝙄: ${link}`,
        mentions
    })
}

handler.command = /^nuke$/i
export default handler