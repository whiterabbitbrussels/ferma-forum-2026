# Google Calendar Sync Setup — FERMA Forum 2026

## Come Configurare la Sincronizzazione Automatica

### Step 1: Creare lo Script su Google Apps Script

1. Vai a https://script.google.com/
2. Crea un nuovo progetto
3. Copia il codice da `google-apps-script.js` in questo repository
4. Incolla il codice nell'editor
5. Premi **Save**

### Step 2: Deployare come Web App

1. Clicca su **Deploy** (pulsante in alto)
2. Seleziona **"New deployment"**
3. Scegli **Type: "Web app"**
4. Impostazioni:
   - **Execute as:** Il tuo account (whiterabbitbrussels@gmail.com)
   - **Who has access:** "Anyone"
5. Clicca **Deploy**
6. **Copia l'URL deployment** (esempio: `https://script.google.com/macros/d/ABC123.../usercopy`)

### Step 3: Configurare la Dashboard

Ci sono 2 opzioni:

#### Opzione A: Sync Manuale (una volta)
1. Apri la dashboard: https://ferma-forum-2026.vercel.app
2. Scorri in fondo e clicca **"↻ Sync from Google Calendar"**
3. Incolla l'URL del deployment di Google Apps Script
4. Premi OK
5. La timesheet si populate automaticamente con gli eventi FRM di oggi

#### Opzione B: Auto-Sync al Caricamento (consigliato)
- Modifica il file `index.html` della dashboard
- Alla linea ~1240, aggiungi il tuo deployment URL:
```javascript
const AUTO_SYNC_URL = 'https://script.google.com/macros/d/ABC123.../usercopy';
```
- La timesheet si aggiorna automaticamente al caricamento della pagina

---

## Come Taggare gli Eventi nel Calendario

Nel tuo Google Calendar (whiterabbitbrussels@gmail.com), crea eventi con:

**Titolo Format:** `FRM - [Nome Task]` oppure `FERMA Forum 2026 - [Nome Task]`

Esempi:
- `FRM - Creative Universe Concept` → Appears come "Creative Universe Concept"
- `FERMA Forum - Logo Design & Rationale` → Appears come "Logo Design & Rationale"
- `FRM Forum 2026 - Design Review` → Appears come "Design Review"

**Durata:** L'ora di inizio/fine dell'evento determina le ore lavorate
- Es: 09:00 - 11:30 = 2.5 ore

**Descrizione:** Opzionale (apparirà nella colonna "Notes" della timesheet)

---

## Troubleshooting

### "Script non eseguito" Error
- Assicurati di eseguire il deploy come **Web App**
- Controlla che **"Who has access"** sia impostato a **"Anyone"**

### "Calendar not found"
- Verifica che la linea 2 dello script usi il tuo email: `whiterabbitbrussels@gmail.com`
- Controlla che il calendario sia condiviso con il tuo account

### Non vedi gli eventi
- Assicurati che gli eventi abbiano **"FRM"** o **"FERMA"** nel titolo
- Gli eventi devono essere **di oggi**
- Prova a fare manual sync prima di abilitare auto-sync

---

## URL Deployment Pubblico

Una volta deployato, condividi questo URL (non contiene credenziali):
```
https://script.google.com/macros/d/ABC123.../usercopy
```

Questa URL è safe da condividere — non espone il calendar di White Rabbit, solo il JSON dei dati filtrati.
