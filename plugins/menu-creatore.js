import moment from 'moment-timezone'

const defaultMenu = {
  before: ``,

  header: `
╔══════════════════════════════╗
      𓆩√乇ﾒ乃のｲ // 𝚅𝚎𝚡-𝙱𝚘𝚝𓆪 
     「 𝐌𝐄𝐍𝐔 𝐂𝐑𝐄𝐀𝐓𝐎𝐑𝐄 」
╚══════════════════════════════╝

🕊️  𝐆𝐞𝐬𝐭𝐢𝐨𝐧𝐞 𝐔𝐭𝐞𝐧𝐭𝐢
────────────────────
%_paddprem @user <giorni>
%_pdelprem @user
%_pbanuser @user
%_punbanuser @user
%_psban @user
%_ptoglieuro quantità|@utente

🕊️  𝐆𝐞𝐬𝐭𝐢𝐨𝐧𝐞 𝐂𝐡𝐚𝐭
────────────────────
%_pbanchat
%_punbanchat
%_psbanchat
%_pgroups
%_pgrouplist
%_pjoin <link> <giorni|inf>

🕊️  𝐂𝐨𝐦𝐚𝐧𝐝𝐢 𝐁𝐨𝐭
────────────────────
%_pnomebot
%_psetbotbio <testo>
%_psetprefix <prefisso>
%_presetprefix
%_psetpfp <img>
%_psetbanner
%_peditmsg
%_psavemedia
%_pgetplugin

🕊️  𝐀𝐦𝐦𝐢𝐧𝐢𝐬𝐭𝐫𝐚𝐳𝐢𝐨𝐧𝐞
────────────────────
%_paggiorna
%_pcleardb
%_pbughunt
%_pinfinito
%_pnowa
%_punbancmd @user comando

🕊️  𝐂𝐨𝐦𝐮𝐧𝐢𝐜𝐚𝐳𝐢𝐨𝐧𝐞
────────────────────
%_pbroadcast <testo>
%_pbc <testo>
%_pcomunicagp
%_psuggerimento
%_pspam

🕊️  𝐄𝐜𝐨𝐧𝐨𝐦𝐢𝐚 & 𝐏𝐫𝐞𝐬𝐭𝐢𝐭𝐢
────────────────────
%_pprestito
%_prichiediprestito

🕊️  𝐄𝐯𝐞𝐧𝐭𝐢 & 𝐒𝐭𝐚𝐟𝐟
────────────────────
%_ptavolarotonda
%_priunione
%_pprogramma <tempo|comando>
`.trim(),

  body: ``,
  footer: ``,

  after: `
╔══════════════════════════════╗
     𓆩√乇ﾒ乃のｲ // 𝚅𝚎𝚡-𝙱𝚘𝚝𓆪
╚══════════════════════════════╝
`.trim()
}

let handler = async (m, { conn, usedPrefix: _p }) => {
  try {
    let text = defaultMenu.header + "\n" + defaultMenu.after
    text = text.replace(/%_p/g, _p)

    await m.react('🕊️')
    await conn.sendMessage(m.chat, {
      text: text
    }, { quoted: m })

  } catch (e) {
    console.error(e)
    conn.reply(m.chat, 'Errore nel menu creatore', m)
  }
}

handler.help = ['menucreatore']
handler.tags = ['menu']
handler.command = ['menuowner', 'menucreatore']

export default handler