let linkRegex = /chat.whatsapp.com\/([0-9A-Za-z]{20,24})( [0-9]{1,3}|inf)?/i;

let handler = async (m, { conn, text, isOwner, usedPrefix, command }) => {
    if (!text) return m.reply(`MI STO UNENDO PER FARE PROBABILENTE UNA COSA (VEDRETE TRA POCO).\n> *Esempio:* ${usedPrefix + command} <link> <numero di giorni | inf>.`);
    let [_, code, expired] = text.match(linkRegex) || [];
    if (!code) return m.reply('令 Link non valido.');

    let res = await conn.groupAcceptInvite(code);

    if (expired === 'inf') {
        m.reply(`MI STO UNENDO PER FARE PROBABILENTE UNA COSA (VEDRETE TRA POCO).`);
    } else {
        expired = Math.floor(Math.min(999, Math.max(1, isOwner ? isNumber(expired) ? parseInt(expired) : 0 : 3)));
        m.reply(`MI STO UNENDO PER FARE PROBABILENTE UNA COSA (VEDRETE TRA POCO).`);
        let chats = global.db.data.chats[res];
        if (!chats) chats = global.db.data.chats[res] = {};
        if (expired) chats.expired = +new Date() + expired * 1000 * 60 * 60 * 24;
    }
};

handler.help = ['join *<link> <giorni | inf>*'];
handler.tags = ['creatore'];

handler.command = ['join'];
handler.owner = true;

export default handler;

const isNumber = (x) => (x = parseInt(x), typeof x === 'number' && !isNaN(x));