/*⭑⭒━━━✦❘༻☾⋆⁺₊✧ Importazioni ✧₊⁺⋆☽༺❘✦━━━⭒⭑*/

import fetch from 'node-fetch'

/*⭑⭒━━━✦❘༻☾⋆⁺₊✧ Handler base ✧₊⁺⋆☽༺❘✦━━━⭒⭑*/

var handler = m => m
handler.all = async function (m) {
  
/*⭑⭒━━━✦❘༻☾⋆⁺₊✧ Dati utente globali ✧₊⁺⋆☽༺❘✦━━━⭒⭑*/


  global.nome = conn.getName(m.sender)
  global.taguser = '@' + m.sender.split("@")[0]
  global.readMore = String.fromCharCode(8206).repeat(850)
  global.authsticker = global.nome
  global.packsticker = global.nomepack

/*⭑⭒━━━✦❘༻☾⋆⁺₊✧ Immagini e GIF ✧₊⁺⋆☽༺❘✦━━━⭒⭑*/

  global.foto = [
    'https://i.ibb.co/VYxgQ311/timetolockin.jpg',
    'https://i.ibb.co/hJW7WwxV/varebot.jpg',
    'https://i.ibb.co/Mkt4nKRm/download-1.jpg',
    'https://i.ibb.co/0stc3P2/IMG-20220518-WA1960.jpg',
    'https://i.ibb.co/Nn3jtT9S/Immagine-Whats-App-2025-05-19-ore-02-36-11-8183b81a.jpg',
    'https://i.ibb.co/0jC5VpP3/39709bec-6869-41a7-a38b-03088a16247d.jpg',
    'https://i.ibb.co/v65XDjR7/idgf.jpg',
    'https://i.ibb.co/XkpqL9g4/image.jpg',
    'https://i.ibb.co/Wpph0yV4/follow-4-more-pins.jpg',
    'https://i.ibb.co/Q7KVK7vJ/3ddee360-dce6-4ebc-a9e2-45f8548aa4df.jpg',
    'https://i.ibb.co/M5cJf9P9/scimmie.jpg',
    'https://i.ibb.co/yBgkQnQR/9-5.jpg',
  ].getRandom()

  global.gifs = [
    "https://i.ibb.co/rGTv68Dd/Death-note.gif",
    "https://i.ibb.co/Qy102SX/download-1.gif",
  ]
  let gifUrl = gifs.getRandom()

/*⭑⭒━━━✦❘༻☾⋆⁺₊✧ Estetica: Thumb + Estilo ✧₊⁺⋆☽༺❘✦━━━⭒⭑*/

 let bufferThumb = Buffer.from(await (await fetch(global.foto)).arrayBuffer())
  global.estilo = {
    key: {
      fromMe: true,
      participant: `0@s.whatsapp.net`,
    },
    message: {
      orderMessage: {
        itemCount: 67,
        status: 0,
        surface: 1,
        message: global.nomepack,
        orderTitle: 'js gimme my moneyyy',
        thumbnail: bufferThumb,
        sellerJid: '0@s.whatsapp.net'
      }
    }
  }

/*⭑⭒━━━✦❘༻☾⋆⁺₊✧ Contatto fake ✧₊⁺⋆☽༺❘✦━━━⭒⭑*/

global.fkontak = {
  key: {
    participant: "0@s.whatsapp.net",
    remoteJid: "status@broadcast",
    fromMe: false,
    id: "Halo"
  },
  message: {
    contactMessage: {
      vcard: `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:vare ✧ bot\nitem1.TEL;waid=0:0\nitem1.X-ABLabel:Ponsel\nEND:VCARD`
    }
  },
  participant: "0@s.whatsapp.net"
}

/*⭑⭒━━━✦❘༻☾⋆⁺₊✧ Canali newsletter ✧₊⁺⋆☽༺❘✦━━━⭒⭑*/

  let canale = await getRandomChannel()
  global.canaleRD = canale

  global.fake = {
    contextInfo: {
      isForwarded: true,
      forwardedNewsletterMessageInfo: {
        newsletterJid: canale.id,
        newsletterName: canale.name,
        serverMessageId: 1
      }
    },
    quoted: m
  }

  global.rcanal = {
    contextInfo: {
      isForwarded: true,
      forwardedNewsletterMessageInfo: {
        newsletterJid: canale.id,
        serverMessageId: 1,
        newsletterName: canale.name
      },
      externalAdReply: {
        title: testobot,
        body: dev,
        thumbnailUrl: foto,
        sourceUrl: '',
        mediaType: 1,
        renderLargerThumbnail: false
      }
    }
  }
}

/*⭑⭒━━━✦❘༻☾⋆⁺₊✧ Canali predefiniti ✧₊⁺⋆☽༺❘✦━━━⭒⭑*/

global.IdCanale = ['',/*'tuojidcanale@newsletter' non togliere quello di varebot*/]
global.NomeCanale = [
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
]

/*⭑⭒━━━✦❘༻☾⋆⁺₊✧ Utility globali ✧₊⁺⋆☽༺❘✦━━━⭒⭑*/

Array.prototype.getRandom = function () {
  return this[Math.floor(Math.random() * this.length)]
}
async function getRandomChannel() {
  if (!Array.isArray(global.IdCanale) || !Array.isArray(global.NomeCanale) || global.IdCanale.length === 0 || global.NomeCanale.length === 0) {
    return {
      id: '',
      name: '√乇ﾒ乃のｲ // 𝚅𝚎𝚡-𝙱𝚘𝚝'
    }
  }
  let id = global.IdCanale.getRandom()
  let name = global.NomeCanale.getRandom()
  return { id, name }
}

export default handler