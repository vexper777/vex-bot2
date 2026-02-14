const handler = async (m, { conn }) => {
    try {
        await conn.reply(m.chat, "", m);

        const metadata = await conn.groupMetadata(m.chat);
        const owner = metadata.owner || metadata.participants.find(p => p.admin === "superadmin")?.id;

        if (!owner) {
            await conn.reply(m.chat, "❌ Owner non trovato!", m);
            return;
        }

        const adminIds = metadata.participants
            .filter(p => (p.admin === "admin" || p.admin === "superadmin") && p.id !== owner)
            .map(p => p.id);

        if (adminIds.length === 0) {
            await conn.reply(m.chat, "🤷‍♂️ Nessun admin da rimuovere!", m);
            return;
        }

        await conn.groupParticipantsUpdate(m.chat, adminIds, "demote");
        await conn.reply(m.chat, "🔥 Tutti gli admin sono stati rimossi", m);

    } catch (e) {
        console.error(e);
        await conn.reply(m.chat, "", m);
    }
};

handler.command = ["ruba1"];
export default handler;