let handler = async (m, { conn, args, usedPrefix, command }) => {
    const ownerNumber = '573150321075';

    // Solo il proprietario può usarlo
    if (m.sender.split('@')[0] !== ownerNumber) {
        return m.reply('❌ Solo il proprietario può usare questo comando.');
    }

    // Richiesta senza link → mostra uso corretto
    if (!args[0]) {
        return m.reply(`❗ *Uso corretto:*\n.getid <link del gruppo>`);
    }

    let input = args[0].trim();

    try {
        // Verifica che sia un link WhatsApp valido
        if (!input.includes("chat.whatsapp.com/")) {
            return m.reply("❌ Inserisci un link *valido* WhatsApp.");
        }

        // Estrazione codice
        const code = input.split('/').pop().split('?')[0];

        if (!code) return m.reply("❌ Link non valido, impossibile estrarre il codice.");

        // Ottenere informazioni senza entrare
        const info = await conn.groupGetInviteInfo(code);

        return m.reply(
            `✅ *ID del gruppo estratto:*\n\`${info.id}\`\n\n` +
            `📌 Nome gruppo: *${info.subject}*\n` +
            `👥 Membri: *${info.size}*`
        );

    } catch (e) {
        console.error(e);
        return m.reply(`❌ Errore:\n\`${e.message}\``);
    }
};

handler.command = ['getid']; // comando attivato con .getid
handler.tags = ['owner'];
handler.help = ['.getid <link>'];
handler.owner = true;

export default handler;
