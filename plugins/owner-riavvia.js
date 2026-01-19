const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const handler = async (m, { conn }) => {

    // Avviso iniziale
    await conn.sendMessage(m.chat, { text: "🔄 Mi sto riavviando aspetta" }, { quoted: m });

    await delay(1000);
    await conn.sendMessage(m.chat, { text: "🚀🚀🚀🚀" });

    await delay(1000);
    await conn.sendMessage(m.chat, { text: "🚀🚀🚀🚀🚀🚀" });

    await delay(1000);
    await conn.sendMessage(m.chat, { text: "✅ Riavvio riuscito con successo!" });

    // Chiude il processo (ChatUnity lo riapre automaticamente)
    process.exit(0);
};

handler.help = ["riavvia"];
handler.tags = ["owner"];
handler.command = ["riavvia", "reiniciar"];
handler.owner = true;

export default handler;