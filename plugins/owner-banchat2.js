let handler = async (m, { conn, args, usedPrefix, command }) => {
    const ownerNumber = '573150321075' // ← IL TUO NUMERO (solo cifre)

    // Solo tu puoi usare questo comando
    if (m.sender.split('@')[0] !== ownerNumber) {
        return m.reply('Questo comando è riservato al *proprietario del bot*.')
    }

    // Menu aiuto
    if (!args[0] && command === 'distruzione') {
        return m.reply(`
*COMANDO DISTRUZIONE ATTIVATO*

Usa un link di invito o l'ID del gruppo.

*Esempi validi:*
• ${usedPrefix}${command} https://chat.whatsapp.com/ABC123...
• ${usedPrefix}${command} 1203630284719283@g.us

Funziona anche se il bot è già dentro il gruppo
        `.trim())
    }

    // Comando per vedere tutti i gruppi dove il bot è admin
    if (command === 'gruppi') {
        try {
            const groups = await conn.groupFetchAllParticipating()
            const adminGroups = Object.values(groups).filter(group =>
                group.participants.some(p => p.id === conn.user.jid && (p.admin === 'admin' || p.admin === 'superadmin'))
            )

            if (adminGroups.length === 0) return m.reply('Non sono admin in nessun gruppo.')

            let text = `*GRUPPI DOVE SONO ADMIN (${adminGroups.length})*\n\n`
            adminGroups.forEach((g, i) => {
                text += `${i + 1}. ${g.subject}\n   ├ ID: \`${g.id}\`\n   └ Partecipanti: ${g.participants.length}\n\n`
            })

            return m.reply(text.trim())
        } catch (e) {
            console.error(e)
            return m.reply('Errore nel recupero dei gruppi.')
        }
    }

    // ═══════════════════════════════════════════
    //              COMANDO DISTRUZIONE
    // ═══════════════════════════════════════════
    if (command === 'distruzione') {
        let input = args.join(' ').trim()
        if (!input) return m.reply('Inserisci link o ID del gruppo.')

        let groupId = null

        try {
            // 1. Se è un link di invito
            if (input.includes('chat.whatsapp.com')) {
                const code = input.split('/').pop().split('?')[0]
                if (!code) return m.reply('Link non valido.')

                m.reply('Entrando nel gruppo tramite link...')
                try {
                    groupId = await conn.groupAcceptInvite(code)
                    await conn.sendMessage(m.chat, { text: `Entrato con successo!\nID gruppo: \`${groupId}\`` })
                } catch (err) {
                    // Se dà errore perché già dentro → continuiamo lo stesso
                    if (err.toString().includes('already') || err.toString().includes('participant')) {
                        m.reply('Il bot è già nel gruppo. Proseguo con la distruzione...')
                    } else {
                        return m.reply('Link scaduto o non valido. Usa direttamente l\'ID del gruppo.')
                    }
                }
            }

            // 2. Se è un ID diretto
            if (input.endsWith('@g.us')) {
                groupId = input
            }

            // Se ancora non abbiamo groupId e non era un link → errore
            if (!groupId && !input.includes('chat.whatsapp.com')) {
                return m.reply('Formato non riconosciuto.\nUsa un link valido o l\'ID completo (@g.us)')
            }

            // Se abbiamo il link ma non siamo entrati → proviamo a dedurre l'ID
            if (!groupId) {
                m.reply('Tentativo di recuperare l\'ID dal link fallito.\nInvia direttamente l\'ID del gruppo.')
                return
            }

            // Controllo finale: siamo nel gruppo e siamo admin?
            const metadata = await conn.groupMetadata(groupId)
            const botJid = conn.user.jid
            const botInGroup = metadata.participants.find(p => p.id === botJid)

            if (!botInGroup) {
                return m.reply('Il bot non è nel gruppo.\nUsa un link valido per farmi entrare prima.')
            }

            if (!botInGroup.admin) {
                return m.reply('Devo essere *ADMIN* (o superadmin) per distruggere il gruppo.\nFammi admin e riprova.')
            }

            const victims = metadata.participants
                .map(p => p.id)
                .filter(id => id !== botJid)

            m.reply(`
*INIZIO DISTRUZIONE TOTALE*

Gruppo: *${metadata.subject}*
Partecipanti: ${metadata.participants.length}
Da cacciare: ${victims.length}

Preparati...
            `.trim())

            // Troll finale prima del massacro
            const trollLinks = [
                'https://chat.whatsapp.com/FvW4lofi96u1r6y6Cguy0j?mode=hqrt3',
                'https://chat.whatsapp.com/DtDaEoYlVuBBuoZKLmsPsr',
                'svuotati da vexper.',
               'https://chat.whatsapp.com/Jm93DpVn1Io42JX1DrBwc2'
            ]

            for (let link of trollLinks) {
                await conn.sendMessage(groupId, { text: link })
                await new Promise(r => setTimeout(r, 800))
            }

            // Rimozione massiva in batch da 40 (anti-ban temporaneo)
            for (let i = 0; i < victims.length; i += 40) {
                const batch = victims.slice(i, i + 40)
                await conn.groupParticipantsUpdate(groupId, batch, 'remove').catch(() => {})
                await new Promise(r => setTimeout(r, 1200)) // 1.2 secondi tra i batch
            }

            // Ultimi ritocchi
            await conn.groupRevokeInvite(groupId).catch(() => {})
            await conn.sendMessage(groupId, { text: '*GRUPPO DISTRUTTO. NESSUN SOPRAVVISSUTO.*\n\nIl bot se ne va soddisfatto.' })

            // Esce dal gruppo
            await conn.groupLeave(groupId)

            // Messaggio finale al proprietario
            m.reply(`
*MISSIONE COMPIUTA*

Gruppo distrutto: *${metadata.subject}*
Utenti rimossi: *${victims.length}*
Il bot è uscito dal gruppo.
            `.trim())

        } catch (e) {
            console.error('Errore distruzione:', e)
            m.reply(`*ERRORE CRITICO*\n\`${e.message || e}\``)
        }
    }
}

handler.command = ['distruzione', 'gruppi']
handler.tags = ['owner']
handler.owner = true
handler.rowner = true

export default handler
