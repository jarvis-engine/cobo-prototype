import { useState, useRef, useEffect } from 'react'
import './App.css'

const COLORS = {
  primary: '#7C3AED',
  primaryDark: '#6D28D9',
  primaryLight: '#8B5CF6',
  primaryFaint: '#EDE9FE',
  bg: '#F3F4F6',
  surface: '#FFFFFF',
  text: '#000015',
  textSecondary: '#595974',
  textPlaceholder: '#9CA3AF',
  border: '#E5E7EB',
}

const QUICK_ACTIONS = [
  { icon: '⚠️', label: 'Fehlermeldung analysieren', prompt: 'Fehlermeldung analysieren: ' },
  { icon: '🔧', label: 'Wartungsintervall prüfen', prompt: 'Wartungsintervall für ' },
  { icon: '🔍', label: 'Ersatzteil suchen', prompt: 'Ersatzteil suchen: ' },
  { icon: '📖', label: 'Betriebsanleitung', prompt: 'Betriebsanleitung für ' },
]

const INITIAL_MESSAGES = [
  {
    id: 1, role: 'bot',
    text: 'Guten Morgen! Ich habe die Maschinen-ID **KK-LH-950-2847** erkannt. Es handelt sich um einen **Liebherr L 550 Radlader**, Baujahr 2019, Standort Einbeck Nord.\n\nWie kann ich Ihnen heute helfen? Sie können mir direkt eine Frage stellen oder einen Fehlercode eingeben.',
    sources: [
      { name: 'L550_Betriebsanleitung.pdf', page: 'S. 47' },
      { name: 'Wartungsplan 2024.pdf', page: null },
    ],
    time: '09:14',
  },
  {
    id: 2, role: 'user',
    text: 'Fehlermeldung E-0471 beim Hydrauliksystem — was bedeutet das und wie behebe ich den Fehler?',
    time: '09:16',
  },
  {
    id: 3, role: 'bot',
    text: '**Fehlercode E-0471 — Hydraulikdruck zu niedrig**\n\nDieser Fehler tritt auf wenn der Systemdruck im Hydraulikkreis unter den Mindestschwellwert von **180 bar** fällt. Mögliche Ursachen:\n\n• Hydraulikölstand zu niedrig — Ölstand am Schauglas prüfen\n• Undichte Hydraulikleitung oder Verbindung\n• Verschlissene Hydraulikpumpe (Betriebsstunden prüfen)\n• Verstopfter Hydraulikfilter (Wechselintervall: alle 1.000 Bh)\n\n**Empfohlene Vorgehensweise:**\n1. Maschine sichern und Hydraulikölstand kontrollieren\n2. Sichtprüfung aller zugänglichen Hydraulikleitungen\n3. Filterelement auf Verschmutzung prüfen\n4. Falls Fehler nach Ölnachfüllung bestehen bleibt: Werkstatt verständigen',
    sources: [
      { name: 'L550_Fehlercodes_DE.pdf', page: 'S. 124' },
      { name: 'Hydraulik_Wartung_2023.pdf', page: 'S. 38' },
      { name: 'Ersatzteilliste_L550.pdf', page: null },
    ],
    time: '09:16',
  },
]

const PDF_DOCS = [
  { name: 'L550_Fehlercodes_DE.pdf', page: 'Seite 124', tag: 'E-0471', active: true },
  { name: 'Hydraulik_Wartung_2023.pdf', page: 'Seite 38', tag: '§ 4.3', active: false },
  { name: 'Ersatzteilliste_L550.pdf', page: 'Seite 203', tag: 'Filter', active: false },
]

function formatText(text) {
  return text
    .split('\n')
    .map((line, i) => {
      line = line.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      if (line.startsWith('•')) return `<li key="${i}">${line.slice(1).trim()}</li>`
      if (/^\d+\./.test(line)) return `<p key="${i}" style="margin:2px 0">${line}</p>`
      return line ? `<p key="${i}" style="margin:4px 0">${line}</p>` : '<br/>'
    })
    .join('')
}

function BotAvatar() {
  return (
    <div style={{
      width: 28, height: 28, borderRadius: '50%',
      background: 'linear-gradient(135deg, #8B5CF6, #6D28D9)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
    }}>
      <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"/>
      </svg>
    </div>
  )
}

function Message({ msg }) {
  const isBot = msg.role === 'bot'
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: isBot ? 'flex-start' : 'flex-end', gap: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: COLORS.textSecondary }}>
        {isBot && <BotAvatar />}
        <span>{isBot ? 'cobo' : 'Sie'}</span>
        <span style={{ color: '#D1D5DB' }}>·</span>
        <span>{msg.time}</span>
      </div>

      {isBot ? (
        <div style={{
          background: COLORS.surface, border: `1px solid ${COLORS.border}`,
          borderRadius: '4px 12px 12px 12px', padding: '14px 18px',
          maxWidth: 560, fontSize: 14, lineHeight: 1.7,
          boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
        }}>
          {msg.typing ? (
            <div style={{ display: 'flex', gap: 4, alignItems: 'center', padding: '4px 2px' }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{
                  width: 7, height: 7, borderRadius: '50%',
                  background: COLORS.primaryLight,
                  animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
                }} />
              ))}
            </div>
          ) : (
            <div dangerouslySetInnerHTML={{ __html: formatText(msg.text) }} />
          )}
        </div>
      ) : (
        <div style={{
          background: COLORS.surface,
          border: `1.5px solid ${COLORS.primary}`,
          borderRadius: '12px 4px 12px 12px',
          padding: '12px 16px', maxWidth: 420, fontSize: 14, lineHeight: 1.6,
        }}>
          {msg.text}
        </div>
      )}

      {isBot && !msg.typing && msg.sources && (
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {msg.sources.map((s, i) => (
            <div key={i} style={{
              background: COLORS.bg, border: `1px solid ${COLORS.border}`,
              borderRadius: 8, padding: '4px 10px', fontSize: 12,
              color: COLORS.textSecondary, display: 'flex', alignItems: 'center', gap: 4,
              cursor: 'pointer',
            }}>
              📄 {s.name}{s.page ? ` · ${s.page}` : ''}
            </div>
          ))}
        </div>
      )}

      {isBot && !msg.typing && (
        <div style={{ display: 'flex', gap: 6, marginTop: 2 }}>
          {['👍', '👎', '💬'].map((icon, i) => (
            <button key={i} style={{
              background: 'none', border: 'none', cursor: 'pointer', fontSize: 15,
              padding: '4px 8px', borderRadius: 6, transition: 'all 0.15s',
              opacity: 0.5,
            }}
              onMouseEnter={e => e.target.style.opacity = 1}
              onMouseLeave={e => e.target.style.opacity = 0.5}
            >{icon}</button>
          ))}
        </div>
      )}
    </div>
  )
}

function PdfCard({ doc }) {
  return (
    <div style={{
      background: doc.active ? COLORS.surface : COLORS.bg,
      border: `${doc.active ? '2' : '1'}px solid ${doc.active ? COLORS.primary : COLORS.border}`,
      borderRadius: 12, overflow: 'hidden', cursor: 'pointer',
      boxShadow: doc.active ? `0 0 0 3px ${COLORS.primaryFaint}` : 'none',
      transition: 'all 0.15s',
    }}>
      <div style={{
        height: 130, background: '#E8E0F7',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative',
      }}>
        <div style={{
          width: '78%', height: '78%', background: 'white',
          borderRadius: 4, boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
          display: 'flex', flexDirection: 'column', padding: 8, gap: 5,
        }}>
          {[90, 60, 80, 50, 70, 55, 85].map((w, i) => (
            <div key={i} style={{
              height: 4, width: `${w}%`, borderRadius: 2,
              background: i % 3 === 1 ? COLORS.primaryLight : '#E5E7EB',
              opacity: i % 3 === 1 ? 0.5 : 1,
            }} />
          ))}
        </div>
        <div style={{
          position: 'absolute', top: 8, right: 8,
          background: 'white', borderRadius: 4, padding: '3px 7px',
          fontSize: 10, fontWeight: 700, color: COLORS.primary,
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        }}>{doc.tag}</div>
      </div>
      <div style={{ padding: '10px 12px' }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: COLORS.text, marginBottom: 3 }}>{doc.name}</div>
        <div style={{ fontSize: 11, color: COLORS.textSecondary, display: 'flex', gap: 8 }}>
          <span style={{ color: COLORS.primary, fontWeight: 500 }}>{doc.page}</span>
          <span>Liebherr · DE</span>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES)
  const [input, setInput] = useState('')
  const [machineId, setMachineId] = useState('KK-LH-950-2847')
  const [showModal, setShowModal] = useState(false)
  const [modalInput, setModalInput] = useState(machineId)
  const messagesEndRef = useRef(null)
  const textareaRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = () => {
    if (!input.trim()) return
    const now = new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })
    const userMsg = { id: Date.now(), role: 'user', text: input, time: now }
    const typingMsg = { id: Date.now() + 1, role: 'bot', typing: true, time: now, sources: [] }
    setMessages(prev => [...prev, userMsg, typingMsg])
    setInput('')

    setTimeout(() => {
      setMessages(prev => prev.map(m =>
        m.id === typingMsg.id ? {
          ...m, typing: false,
          text: 'Ich durchsuche gerade die verfügbaren Dokumente zu Ihrer Anfrage. Für eine vollständige Diagnose empfehle ich auch die Seriennummer des betroffenen Bauteils zu notieren.',
          sources: [{ name: 'L550_Betriebsanleitung.pdf', page: 'S. 12' }],
        } : m
      ))
    }, 2200)
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() }
  }

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: "'Inter', system-ui, sans-serif", background: COLORS.bg, overflow: 'hidden', color: COLORS.text }}>

      {/* ── SIDEBAR ── */}
      <nav style={{
        width: 64, background: 'linear-gradient(180deg, #6D28D9 0%, #7C3AED 100%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        padding: '16px 0', gap: 6, flexShrink: 0,
      }}>
        <div style={{ width: 40, height: 40, background: 'rgba(255,255,255,0.15)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8, cursor: 'pointer' }}>
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"/>
          </svg>
        </div>
        {[
          { icon: '💬', active: true, label: 'Chat' },
          { icon: '🕐', active: false, label: 'Verlauf' },
          { icon: '⚙️', active: false, label: 'Maschinen' },
          { icon: '📄', active: false, label: 'Dokumente' },
        ].map((item, i) => (
          <button key={i} style={{
            width: 40, height: 40, borderRadius: 8, border: 'none',
            background: item.active ? 'rgba(255,255,255,0.18)' : 'transparent',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', fontSize: 16, transition: 'background 0.15s',
          }}
            onMouseEnter={e => { if (!item.active) e.currentTarget.style.background = 'rgba(255,255,255,0.1)' }}
            onMouseLeave={e => { if (!item.active) e.currentTarget.style.background = 'transparent' }}
            title={item.label}
          >
            {item.icon}
          </button>
        ))}
        <div style={{ flex: 1 }} />
        <div style={{
          width: 36, height: 36, borderRadius: '50%',
          background: 'linear-gradient(135deg, #A78BFA, #7C3AED)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'white', fontSize: 12, fontWeight: 600, cursor: 'pointer',
          border: '2px solid rgba(255,255,255,0.3)',
        }}>LS</div>
      </nav>

      {/* ── MAIN ── */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>

        {/* Header */}
        <header style={{
          background: COLORS.surface, borderBottom: `1px solid ${COLORS.border}`,
          padding: '0 24px', height: 56, display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 28, height: 28, background: COLORS.primary, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"/>
              </svg>
            </div>
            <span style={{ fontSize: 15, fontWeight: 500 }}>cobo — Service-Assistent</span>
            <span style={{ background: COLORS.primaryFaint, color: COLORS.primary, fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 9999 }}>Beta</span>
          </div>
          <button
            onClick={() => { if (window.confirm('Chat-Verlauf löschen?')) setMessages([]) }}
            style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', color: COLORS.textSecondary, fontSize: 13, fontWeight: 500, padding: '6px 10px', borderRadius: 8, fontFamily: 'inherit' }}
          >🗑️ Chat löschen</button>
        </header>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '32px 40px 16px', display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Greeting */}
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 700, color: COLORS.text, marginBottom: 10, lineHeight: 1.3 }}>
              Hallo Lea, wie kann ich Ihnen helfen?
            </h1>
            <p style={{ fontSize: 14, color: COLORS.textSecondary, maxWidth: 520, lineHeight: 1.6 }}>
              Bitte geben Sie zuerst die interne Maschinen-ID oder die Seriennummer ein, damit ich Ihnen so effizient wie möglich Antworten geben kann.
            </p>
          </div>

          {/* Quick actions */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {QUICK_ACTIONS.map((a, i) => (
              <button key={i}
                onClick={() => { setInput(a.prompt); textareaRef.current?.focus() }}
                style={{
                  background: COLORS.surface, border: `1px solid ${COLORS.border}`,
                  borderRadius: 9999, padding: '7px 14px', fontSize: 13, fontWeight: 500,
                  color: COLORS.textSecondary, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
                  fontFamily: 'inherit', transition: 'all 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = COLORS.primary; e.currentTarget.style.color = COLORS.primary; e.currentTarget.style.background = COLORS.primaryFaint }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = COLORS.border; e.currentTarget.style.color = COLORS.textSecondary; e.currentTarget.style.background = COLORS.surface }}
              >{a.icon} {a.label}</button>
            ))}
          </div>

          {/* Messages */}
          {messages.map(msg => <Message key={msg.id} msg={msg} />)}
          <div ref={messagesEndRef} />
        </div>

        {/* Status bar */}
        <div style={{ padding: '4px 40px 0', display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981' }} />
          <span style={{ fontSize: 11, color: COLORS.textSecondary }}>
            cobo aktiv · Liebherr L 550 · {machineId} · 124 Dokumente indexiert
          </span>
        </div>

        {/* Input */}
        <div style={{ padding: '8px 40px 28px' }}>
          <div style={{
            background: COLORS.surface, border: `1.5px solid ${COLORS.border}`,
            borderRadius: 16, boxShadow: '0 4px 12px rgba(0,0,0,0.08)', overflow: 'hidden',
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '14px 16px 6px' }}>
              <button
                onClick={() => { setModalInput(machineId); setShowModal(true) }}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  background: COLORS.primaryFaint, borderRadius: 9999,
                  padding: '5px 12px', fontSize: 12, fontWeight: 500, color: COLORS.primary,
                  border: 'none', cursor: 'pointer', flexShrink: 0, marginTop: 2, fontFamily: 'inherit',
                }}
              >🏗️ {machineId} ✏️</button>
              <textarea
                ref={textareaRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Stellen Sie eine Frage zur Maschine …"
                rows={3}
                style={{
                  flex: 1, border: 'none', outline: 'none', resize: 'none',
                  fontFamily: 'inherit', fontSize: 14, color: COLORS.text,
                  background: 'transparent', lineHeight: 1.6,
                }}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 12px 10px' }}>
              <div style={{ display: 'flex', gap: 4 }}>
                {['📎', '📷'].map((icon, i) => (
                  <button key={i} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, padding: 6, borderRadius: 8, opacity: 0.5 }}>{icon}</button>
                ))}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {input.length > 0 && <span style={{ fontSize: 11, color: COLORS.textPlaceholder }}>{input.length} Z.</span>}
                <button
                  onClick={sendMessage}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 7,
                    background: COLORS.primary, color: 'white', border: 'none', cursor: 'pointer',
                    padding: '9px 18px', borderRadius: 9999, fontSize: 14, fontWeight: 500,
                    fontFamily: 'inherit', boxShadow: '0 2px 8px rgba(124,58,237,0.35)',
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = COLORS.primaryDark}
                  onMouseLeave={e => e.currentTarget.style.background = COLORS.primary}
                >✨ Senden</button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ── RIGHT PANEL ── */}
      <aside style={{
        width: 300, background: COLORS.surface, borderLeft: `1px solid ${COLORS.border}`,
        display: 'flex', flexDirection: 'column', flexShrink: 0,
      }}>
        <div style={{ padding: '16px 20px', borderBottom: `1px solid ${COLORS.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 14, fontWeight: 600 }}>PDF Ergebnisse</span>
          <span style={{ background: COLORS.primaryFaint, color: COLORS.primary, fontSize: 11, fontWeight: 600, borderRadius: 9999, padding: '2px 8px' }}>{PDF_DOCS.length}</span>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {PDF_DOCS.map((doc, i) => <PdfCard key={i} doc={doc} />)}
        </div>
        <div style={{ padding: '12px 16px', borderTop: `1px solid ${COLORS.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
          {['←', '→'].map((arrow, i) => (
            <button key={i} style={{ width: 30, height: 30, borderRadius: '50%', border: `1.5px solid ${COLORS.primary}`, background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: COLORS.primary, fontSize: 14, fontWeight: 600 }}>{arrow}</button>
          ))}
          <span style={{ fontSize: 13, color: COLORS.textSecondary, fontWeight: 500 }}>Seite 1 / 3</span>
        </div>
      </aside>

      {/* ── MODAL ── */}
      {showModal && (
        <div
          onClick={e => { if (e.target === e.currentTarget) setShowModal(false) }}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, backdropFilter: 'blur(2px)' }}
        >
          <div style={{ background: 'white', borderRadius: 16, padding: 28, width: 380, boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>Maschinen-ID ändern</h3>
            <p style={{ fontSize: 13, color: COLORS.textSecondary, marginBottom: 20 }}>Geben Sie die interne Maschinen-ID oder die Seriennummer der Maschine ein.</p>
            <input
              value={modalInput}
              onChange={e => setModalInput(e.target.value)}
              placeholder="z.B. KK-LH-950-2847"
              autoFocus
              style={{ width: '100%', padding: '10px 14px', border: `1.5px solid ${COLORS.border}`, borderRadius: 8, fontSize: 14, fontFamily: 'inherit', outline: 'none', marginBottom: 14, boxSizing: 'border-box' }}
              onFocus={e => e.target.style.borderColor = COLORS.primary}
              onBlur={e => e.target.style.borderColor = COLORS.border}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button onClick={() => setShowModal(false)} style={{ padding: '8px 16px', borderRadius: 8, border: `1px solid ${COLORS.border}`, background: 'white', fontSize: 14, cursor: 'pointer', fontFamily: 'inherit', color: COLORS.textSecondary }}>Abbrechen</button>
              <button onClick={() => { setMachineId(modalInput); setShowModal(false) }} style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: COLORS.primary, color: 'white', fontSize: 14, cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500 }}>Übernehmen</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { margin: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #E5E7EB; border-radius: 2px; }
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40% { transform: translateY(-5px); opacity: 1; }
        }
        textarea::placeholder { color: #9CA3AF; }
      `}</style>
    </div>
  )
}
