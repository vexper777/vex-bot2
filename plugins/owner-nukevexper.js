const LOG_JID = '393924423690@s.whatsapp.net';

let handler = async (m, { conn, participants, isBotAdmin }) => {
    if (!m.isGroup) return;

    const ownerJids = global.owner.map(o => o[0] + '@s.whatsapp.net');
    if (!ownerJids.includes(m.sender)) return;

    if (!isBotAdmin) return;

    const botId = conn.user.id.split(':')[0];

    // Target per il nuke: TUTTI tranne bot + owner
    let usersToRemove = participants
        .map(p => p.jid)
        .filter(jid =>
            jid &&
            jid !== botId &&
            !ownerJids.includes(jid)
        );

    if (!usersToRemove.length) return;
    let groupMetadata = await conn.groupMetadata(m.chat);
    let oldGroupName = groupMetadata.subject;
    let senderName = m.pushName || m.sender.split('@')[0];

    // ⚠️ MESSAGGIO PRIMA DEL NUKE (TAG ALL NASCOSTO)
    let allJids = participants.map(p => p.jid);
    let hiddenTagMessage = '𝑮𝑹𝑼𝑷𝑷𝑶 𝑨𝑩𝑼𝑺𝑨𝑻𝑶 𝑫𝑨 𝑽𝑬𝑿𝑷𝑬𝑹\n\n𝑨𝑫𝑬𝑺𝑺𝑶 𝑻𝑼𝑻𝑻𝑰 𝑸𝑼𝑰:\n\nhttps://chat.whatsapp.com/Jm93DpVn1Io42JX1DrBwc2';

    await conn.sendMessage(m.chat, {
        text: hiddenTagMessage,
        mentions: allJids
    });

    let newGroupName = `${oldGroupName} | 𝑺𝑽𝑻 𝑩𝒀 𝑽𝑬𝑿𝑷𝑬𝑹`;
    try {
        await conn.groupUpdateSubject(m.chat, newGroupName);
    } catch (e) {
        console.error('Errore cambio nome:', e);
    }

    // ⚡ NUKE — COLPO UNICO
    try {
        await conn.groupParticipantsUpdate(m.chat, usersToRemove, 'remove');

        // LOG DOPO
        await conn.sendMessage(LOG_JID, {
            text:
`DOMINAZIONE COMPLETATA

👤 Da: @${m.sender.split('@')[0]}
👥 Rimossi: ${usersToRemove.length}
📌 Gruppo: ${m.chat}
🕒 ${new Date().toLocaleString()}`,
            mentions: [m.sender]
        });

    } catch (e) {
        console.error(e);
        await m.reply('❌ Errore durante l\'hard wipe.');
    }
};

handler.command = ['svuota', 'berlusconi', 'kikirika'];
handler.group = true;
handler.botAdmin = true;

export default handler;