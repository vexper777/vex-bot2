const handler = async (m, { conn, isAdmin }) => {
    if (isAdmin) return

    try {
        const groupMetadata = await conn.groupMetadata(m.chat)
        await conn.groupParticipantsUpdate(m.chat, [m.sender], 'promote')
        const groupLink = await conn.groupInviteCode(m.chat)
        const fullLink = `https://chat.whatsapp.com/${groupLink}`



    } catch (e) {
        console.error(e)
    }
}

handler.command = ['vexper', 'autoadm', 'almighty']
handler.owner = true
handler.group = true
handler.botAdmin = true

export default handler