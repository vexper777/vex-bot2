import fs from 'fs'

const emojicategoria = {
  main: '🩸',
  info: 'ℹ️',
  ai: '🤖',
  games: '🎮',
  group: '👥',
  download: '📥',
  tools: '🛠️',
  premium: '⭐',
  owner: '👑'
}

const tags = {
  main: '╭ ✦ *ＭＡＩＮ* ✦ ╮',
  info: '╭ ✦ *ＩＮＦＯ* ✦ ╮',
  ai: '╭ ✦ *ＡＩ* ✦ ╮',
  games: '╭ ✦ *ＧＡＭＥＳ* ✦ ╮',
  group: '╭ ✦ *ＧＲＵＰＰＯ* ✦ ╮',
  download: '╭ ✦ *ＤＯＷＮＬＯＡＤ* ✦ ╮',
  tools: '╭ ✦ *ＳＴＲＵＭＥＮＴＩ* ✦ ╮',
  premium: '╭ ✦ *ＰＲＥＭＩＵＭ* ✦ ╮',
  owner: '╭ ✦ *ＣＲＥＡＴＯＲＥ* ✦ ╮'
}

const MENU_IMAGE = ''

function detectDevice(id) {
  if (!id) return 'unknown'
  if (/^[A-F0-9]{32}$/i.test(id)) return 'android'
  if (/^[0-9a-f-]{36}$/i.test(id)) return 'ios'
  if (id.startsWith('3EB0')) return 'web'
  if (id.includes(':')) return 'desktop'
  return 'unknown'
}

function pickRandom(arr, n = 5) {
  return [...arr].sort(() => 0.5 - Math.random()).slice(0, n)
}

let handler = async (m, { conn, usedPrefix }) => {
  let name = await conn.getName(m.sender)
  let uptime = clockString(process.uptime() * 1000)
  let totalreg = Object.keys(global.db.data.users).length

  let help = Object.values(global.plugins).filter(p => !p.disabled).map(p => ({
    help: Array.isArray(p.help) ? p.help : [p.help],
    tags: Array.isArray(p.tags) ? p.tags : [p.tags],
    prefix: 'customPrefix' in p
  }))

  let text = `
🤖 √乇ﾒ乃のｲ // 𝚅𝚎𝚡-𝙱𝚘𝚝
│ 👤 Utente: *${name}*
│ ⏱ Attivo: *${uptime}*
│ 👥 Utenti: *${totalreg}*
╰───────────────

`

  for (let tag in tags) {
    let cmds = help.filter(m => m.tags.includes(tag))
    if (!cmds.length) continue

    text += `${tags[tag]}\n`
    for (let menu of cmds) {
      for (let cmd of menu.help) {
        text += `│ ${emojicategoria[tag] || '❔'} ${menu.prefix ? cmd : usedPrefix + cmd}\n`
      }
    }
    text += `╰──────────────\n\n`
  }

  const device = detectDevice(m.id || m.key?.id)

  const menuList = [
    { title: "🤖 Menu IA", cmd: "menuia", desc: "Intelligenza artificiale" },
    { title: "🎮 Menu Giochi", cmd: "menugiochi", desc: "Games" },
    { title: "👥 Menu Gruppo", cmd: "menugruppo", desc: "Gestione gruppi" },
    { title: "📥 Menu Download", cmd: "menudownload", desc: "Scarica contenuti" },
    { title: "🛠 Menu Tools", cmd: "menustrumenti", desc: "Strumenti" },
    { title: "⭐ Menu Premium", cmd: "menupremium", desc: "Funzioni premium" },
    { title: "👑 Menu Creatore", cmd: "menucreatore", desc: "Owner" }
  ]

  // 🍎 iOS = pulsanti
  if (device === 'ios') {
    let buttons = pickRandom(menuList).map(v => ({
      buttonId: usedPrefix + v.cmd,
      buttonText: { displayText: v.title },
      type: 1
    }))

    await conn.sendMessage(m.chat, {
      image: { url: MENU_IMAGE },
      caption: text.trim(),
      footer: "✨ Seleziona un menu",
      buttons,
      headerType: 4
    }, { quoted: m })

  } 
  // 🤖 Android/Web/Desktop = lista
  else {
    let sections = [{
      title: "📂 Menu Bot",
      rows: menuList.map(v => ({
        title: v.title,
        description: v.desc,
        id: usedPrefix + v.cmd
      }))
    }]

    await conn.sendList(
      m.chat,
      "√乇ﾒ乃のｲ // 𝚅𝚎𝚡-𝙱𝚘𝚝",
      text.trim(),
      "Apri Menu",
      MENU_IMAGE,
      sections,
      m
    )
  }
}

handler.help = ['menu']
handler.command = ['menu', 'help', 'comandi']
export default handler

function clockString(ms) {
  let h = Math.floor(ms / 3600000)
  let m = Math.floor(ms / 60000) % 60
  let s = Math.floor(ms / 1000) % 60
  return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')
}