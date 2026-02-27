import { useState, useRef, useEffect } from 'react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';

const DS = { primary:'#7C3AED', faint:'#EDE9FE', text:'#000015', secondary:'#595974', border:'#E5E7EB', surface:'#FFFFFF', bg:'#F3F4F6' };

const BOT_RESPONSES = [
  { text:'Die Wartungsintervalle für den Liebherr LTM 1090-4.2 sind wie folgt: Ölwechsel alle 500 Betriebsstunden, Filterwechsel alle 250 Stunden, Generalinspektion nach 2.000 Stunden. Bei starker Staubbelastung sollten die Intervalle um 20% verkürzt werden.', sources:['LTM 1090-4.2 Betriebsanleitung.pdf', 'Seite 124-127'], confidence:92 },
  { text:'Die technischen Daten des Komatsu PC200-8: Betriebsgewicht 20.100 kg, Motorleistung 110 kW (SAE J1349), max. Grabkraft 136 kN, Auslegerreichweite 9,4 m, Tieflöffelinhalt 0,8–1,0 m³. Der Hydraulikdruck beträgt 34,3 MPa.', sources:['Komatsu PC200-8 Wartungshandbuch.pdf', 'Seite 12-15'], confidence:88 },
  { text:'Beim Volvo EC220E Hydrauliköl-Wechsel: Zuerst das Öl auf Betriebstemperatur bringen, dann an der Ablassschraube am Hydrauliktank ablassen. Füllmenge: 155 Liter. Spezifikation: ISO VG 46. Ölwechsel alle 2.000 Betriebsstunden oder jährlich. Ölfilter gleichzeitig tauschen.', sources:['Volvo EC220E Technische Daten.pdf', 'Seite 45-48'], confidence:79 },
  { text:'Für Hebearbeiten über 10 Tonnen gelten folgende Sicherheitsvorschriften: Kranführerschein Klasse A erforderlich, schriftlicher Hebeplan notwendig, Windsicherung bei >10 m/s, Mindestabstand Hochspannung 5 m, Sicherheitsbeauftragter muss anwesend sein.', sources:['Sicherheitsvorschriften Hebearbeiten.pdf', 'Seite 8-12'], confidence:55 },
  { text:'Der maximale Arbeitsdruck der Haupthydraulikpumpe beim Cat 320 beträgt 350 bar (35 MPa). Der Standby-Druck liegt bei 30 bar. Die Pumpe leistet maximal 2 × 130 l/min. Bei Überschreitung des Maximaldrucks öffnet das Druckbegrenzungsventil automatisch.', sources:['Cat 320 Hydrauliksystem Überprüfung.pdf', 'Seite 22-25'], confidence:71 },
];

let botIdx = 0;

function TypingIndicator() {
  return (
    <div style={{ display:'flex', gap:12, padding:'12px 20px', alignItems:'flex-start' }}>
      <div style={{ width:36, height:36, borderRadius:12, background:`linear-gradient(135deg, #7C3AED, #8B5CF6)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, flexShrink:0 }}>🤖</div>
      <div style={{ background:DS.surface, border:`1px solid ${DS.border}`, borderRadius:'4px 16px 16px 16px', padding:'14px 18px', display:'flex', gap:5, alignItems:'center' }}>
        {[0,1,2].map(i => (
          <div key={i} style={{ width:7, height:7, borderRadius:'50%', background:DS.primary, animation:`blink 1.2s ease ${i*0.2}s infinite` }}/>
        ))}
      </div>
    </div>
  );
}

const WELCOME = {
  id: 'welcome',
  role: 'bot',
  text: 'Hallo! Ich bin cobo, Ihr KI-Assistent für Baumaschinen und technische Dokumentation. Ich kann Ihnen bei Wartungsfragen, technischen Daten und Sicherheitsvorschriften helfen. Was kann ich für Sie tun?',
  sources: [],
  confidence: 98,
  time: new Date().toLocaleTimeString('de-DE', { hour:'2-digit', minute:'2-digit' }),
};

export default function ChatArea({ user, chatId, onToast }) {
  const [messages, setMessages] = useState([WELCOME]);
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior:'smooth' });
  }, [messages, typing]);

  useEffect(() => {
    setMessages([WELCOME]);
  }, [chatId]);

  const handleSend = async (text) => {
    const userMsg = { id: Date.now(), role:'user', text, author: user.name, authorInitial: user.name.charAt(0).toUpperCase(), time: new Date().toLocaleTimeString('de-DE', { hour:'2-digit', minute:'2-digit' }) };
    setMessages(m => [...m, userMsg]);
    setTyping(true);
    await new Promise(r => setTimeout(r, 1200 + Math.random() * 800));
    const resp = BOT_RESPONSES[botIdx % BOT_RESPONSES.length];
    botIdx++;
    const botMsg = { id: Date.now()+1, role:'bot', ...resp, time: new Date().toLocaleTimeString('de-DE', { hour:'2-digit', minute:'2-digit' }) };
    setMessages(m => [...m, botMsg]);
    setTyping(false);
  };

  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', height:'100%', overflow:'hidden' }}>
      {/* Messages */}
      <div style={{ flex:1, overflowY:'auto', padding:'8px 0' }}>
        {messages.map(msg => (
          <ChatMessage key={msg.id} message={msg} onShare={() => onToast('🔗 Link kopiert — Chat geteilt!')} />
        ))}
        {typing && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>
      {/* Input */}
      <ChatInput onSend={handleSend} disabled={typing} />
    </div>
  );
}
