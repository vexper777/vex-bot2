// gp-play.js — PlayStation current game tracker
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const PLAYS_FILE = path.join(__dirname, '..', 'play_users.json')

if (!fs.existsSync(PLAYS_FILE)) fs.writeFileSync(PLAYS_FILE, '{}', 'utf8')

// ─── Funzioni utenti ─────────────────────
const loadPlays = () => JSON.parse(fs.readFileSync(PLAYS_FILE, 'utf8'))
const savePlays = (p) => fs.writeFileSync(PLAYS_FILE, JSON.stringify(p, null, 2))

const getPlay = (id) => loadPlays()[id] || null
const setPlay = (id, game) => {
  const plays = loadPlays()
  plays[id] = game
  savePlays(plays)
}

// ─── Handler ────────────────────────────
const handler = async (m, { conn, usedPrefix, command, text }) => {

  // 🔹 SETPLAY
  if (command === 'setplay') {
    const game = text.trim()
    if (!game) {
      return conn.sendMessage(m.chat, { text: `❌ Usa: ${usedPrefix}setplay <nome del gioco>` })
    }
    setPlay(m.sender, game)
    return conn.sendMessage(m.chat, { text: `✅ Il gioco corrente di *${m.pushName || 'tu'}* è stato impostato su: *${game}*` })
  }

  // 🔹 PLAY
  if (command === 'play') {
    // Se viene menzionato qualcuno, usa il primo menzionato; altrimenti mittente
    let targetId = m.mentionedJid?.[0] || m.sender
    const game = getPlay(targetId)

    if (!game) {
      return conn.sendMessage(m.chat, {
        text: `❌ L'utente non ha registrato un gioco.\nUsa: ${usedPrefix}setplay <nome del gioco>`,
        mentions: [targetId]
      })
    }

    const displayName = '@' + targetId.split('@')[0]

    return conn.sendMessage(m.chat, {
      text: `🎮 *${displayName}* sta giocando a: *${game}*`,
      mentions: [targetId]
    })
  }
}

handler.command = ['play1', 'setplay']

// Tutti i membri del gruppo possono usarlo
handler.group = true

export default handler