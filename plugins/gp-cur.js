// gp-cur.js — Last.fm CUR + SETUSER
import fetch from 'node-fetch'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const USERS_FILE = path.join(__dirname, '..', 'lastfm_users.json')

if (!fs.existsSync(USERS_FILE)) fs.writeFileSync(USERS_FILE, '{}', 'utf8')

// ─── Config ──────────────────────────────
const LASTFM_API_KEY = '36f859a1fc4121e7f0e931806507d5f9'

// ─── Funzioni utenti ─────────────────────
const loadUsers = () => JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'))
const saveUsers = (u) => fs.writeFileSync(USERS_FILE, JSON.stringify(u, null, 2))

const getUser = (id) => loadUsers()[id] || null
const setUser = (id, name) => {
  const users = loadUsers()
  users[id] = name
  saveUsers(users)
}

// ─── Funzioni API Last.fm ───────────────
async function fetchNoCache(url) {
  const res = await fetch(url)
  return await res.json()
}

async function getRecentTrack(user) {
  const url = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${user}&api_key=${LASTFM_API_KEY}&format=json&limit=2&_=${Date.now()}`
  const json = await fetchNoCache(url)
  return json?.recenttracks?.track?.[0]
}

async function getTrackInfo(user, artist, track) {
  const url = `https://ws.audioscrobbler.com/2.0/?method=track.getinfo&api_key=${LASTFM_API_KEY}&artist=${encodeURIComponent(artist)}&track=${encodeURIComponent(track)}&username=${user}&format=json`
  const json = await fetchNoCache(url)
  return json?.track
}

// ─── Funzioni popolarità ───────────────
function popularityBar(listeners) {
  const max = 500000
  const level = Math.min(10, Math.round((listeners / max) * 10))
  return '█'.repeat(level) + '░'.repeat(10 - level)
}

function popularityLabel(listeners) {
  if (listeners < 5000) return '🖤 Underground'
  if (listeners < 50000) return '✨ Niche'
  if (listeners < 200000) return '🔥 Popolare'
  return '🌍 HIT'
}

// ─── Handler ────────────────────────────
const handler = async (m, { conn, usedPrefix, command, text }) => {

  // 🔹 SETUSER
  if (command === 'setuser') {
    const username = text.trim()
    if (!username) {
      return conn.sendMessage(m.chat, { text: `❌ Usa: ${usedPrefix}setuser <username>` })
    }
    setUser(m.sender, username)
    return conn.sendMessage(m.chat, { text: `✅ Username Last.fm *${username}* salvato!` })
  }

  // 🔹 CUR
  if (command === 'cur') {
    // Se viene menzionato qualcuno, usa il primo menzionato; altrimenti mittente
    let targetId = m.mentionedJid?.[0] || m.sender
    const user = getUser(targetId)

    if (!user) {
      return conn.sendMessage(m.chat, {
        text: `❌ L'utente non ha registrato un username Last.fm.\nUsa: ${usedPrefix}setuser <username>`,
        mentions: [targetId]
      })
    }

    const track = await getRecentTrack(user)
    if (!track) return m.reply('❌ Nessuna traccia trovata')

    const artist = track.artist['#text']
    const title = track.name
    const album = track.album?.['#text'] || '—'
    const image = track.image?.find(i => i.size === 'extralarge')?.['#text']

    const info = await getTrackInfo(user, artist, title)

    const playcount = Number(info?.userplaycount || 0)
    const durationMs = Number(info?.duration || 0)
    const minutes = durationMs
      ? Math.round((playcount * durationMs) / 60000)
      : 0

    const tags = info?.toptags?.tag
      ?.slice(0, 4)
      .map(t => `#${t.name}`)
      .join(' ') || '—'

    const listeners = Number(info?.listeners || 0)

    const displayName = '@' + targetId.split('@')[0]

    const caption = `
🎧 *In riproduzione di ${displayName}*

🎵 *${title}*
🎤 ${artist}
💿 ${album}

⏱️ Minuti ascoltati da te: *${minutes}*
🎨 Mood: ${tags}

🔥 Popolarità: ${popularityBar(listeners)}
📊 Listener: *${listeners}*
🏷️ Stato: *${popularityLabel(listeners)}*
`.trim()

    return conn.sendMessage(m.chat, {
      image: image ? { url: image } : undefined,
      caption,
      mentions: [targetId]
    }, { quoted: m })
  }
}

handler.command = ['cur', 'setuser']

// Tutti i membri del gruppo possono usarlo
handler.group = true

export default handler