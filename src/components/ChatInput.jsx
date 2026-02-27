import { useState, useRef } from 'react';

const DS = { primary:'#7C3AED', dark:'#6D28D9', light:'#8B5CF6', faint:'#EDE9FE', text:'#000015', secondary:'#595974', placeholder:'#9CA3AF', border:'#E5E7EB', surface:'#FFFFFF' };

const VOICE_SAMPLES = [
  'Was sind die Wartungsintervalle für den Liebherr LTM 1090-4.2?',
  'Zeig mir die technischen Daten des Komatsu PC200-8.',
  'Wie wechsle ich das Hydrauliköl beim Volvo EC220E?',
  'Welche Sicherheitsvorschriften gelten bei Hebearbeiten über 10 Tonnen?',
  'Was ist der maximale Arbeitsdruck der Hydraulikpumpe beim Cat 320?',
];

export default function ChatInput({ onSend, disabled }) {
  const [text, setText] = useState('');
  const [recording, setRecording] = useState(false);
  const [detectedLang, setDetectedLang] = useState(null);
  const textareaRef = useRef(null);

  const handleSend = () => {
    if (!text.trim() || disabled) return;
    onSend(text.trim());
    setText('');
    setDetectedLang(null);
    if (textareaRef.current) { textareaRef.current.style.height = 'auto'; }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const handleInput = (e) => {
    setText(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
  };

  const handleMic = async () => {
    if (recording) return;
    setRecording(true);
    await new Promise(r => setTimeout(r, 2000));
    const sample = VOICE_SAMPLES[Math.floor(Math.random() * VOICE_SAMPLES.length)];
    setText(sample);
    setDetectedLang('🇩🇪 Deutsch erkannt');
    setRecording(false);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
      textareaRef.current.focus();
    }
  };

  return (
    <div style={{ padding:'12px 20px 20px', background:'white', borderTop:`1px solid ${DS.border}` }}>
      {recording && (
        <div style={{ display:'flex', alignItems:'center', gap:8, padding:'8px 12px', background:'#FEF2F2', borderRadius:8, marginBottom:10, border:'1px solid #FECACA', animation:'fadeIn 0.2s ease' }}>
          <span style={{ width:10, height:10, background:'#EF4444', borderRadius:'50%', animation:'pulse 1s infinite', display:'inline-block' }}/>
          <span style={{ fontSize:13, color:'#991B1B', fontWeight:500 }}>Aufnahme läuft...</span>
          <span style={{ fontSize:12, color:'#B91C1C' }}>Sprechen Sie jetzt</span>
        </div>
      )}
      {detectedLang && !recording && (
        <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:8, animation:'fadeIn 0.2s ease' }}>
          <span style={{ fontSize:11, background:DS.faint, color:DS.primary, padding:'2px 10px', borderRadius:9999, fontWeight:500 }}>{detectedLang}</span>
        </div>
      )}
      <div style={{ display:'flex', alignItems:'flex-end', gap:10, background:DS.faint, borderRadius:12, padding:'8px 8px 8px 16px', border:`1px solid ${DS.border}`, transition:'border-color 0.2s' }}
        onFocusCapture={e => e.currentTarget.style.borderColor = DS.primary}
        onBlurCapture={e => e.currentTarget.style.borderColor = DS.border}
      >
        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder="Frage zu Baumaschinen oder Dokumenten stellen..."
          disabled={disabled || recording}
          rows={1}
          style={{ flex:1, border:'none', background:'transparent', resize:'none', outline:'none', fontSize:14, color:DS.text, fontFamily:'Inter, sans-serif', lineHeight:1.5, padding:'4px 0', maxHeight:120, overflowY:'auto' }}
        />
        <div style={{ display:'flex', gap:4, alignItems:'flex-end', paddingBottom:2 }}>
          {/* Mic button */}
          <button
            onClick={handleMic}
            disabled={disabled || recording}
            title="Spracheingabe"
            style={{
              width:36, height:36, borderRadius:10, border:'none', cursor: disabled||recording ? 'not-allowed' : 'pointer',
              background: recording ? '#EF4444' : 'transparent',
              color: recording ? 'white' : DS.secondary,
              fontSize:18, display:'flex', alignItems:'center', justifyContent:'center', transition:'all 0.15s',
            }}
            onMouseEnter={e => !recording && !disabled && (e.currentTarget.style.background = 'rgba(124,58,237,0.08)')}
            onMouseLeave={e => !recording && (e.currentTarget.style.background = 'transparent')}
          >
            🎙️
          </button>
          {/* Send button */}
          <button
            onClick={handleSend}
            disabled={!text.trim() || disabled}
            title="Senden (Enter)"
            style={{
              width:36, height:36, borderRadius:10, border:'none', cursor: !text.trim()||disabled ? 'not-allowed' : 'pointer',
              background: !text.trim()||disabled ? DS.border : DS.primary,
              color: !text.trim()||disabled ? DS.secondary : 'white',
              fontSize:16, display:'flex', alignItems:'center', justifyContent:'center', transition:'all 0.2s',
            }}
          >
            ➤
          </button>
        </div>
      </div>
      <p style={{ fontSize:11, color:DS.placeholder, textAlign:'center', marginTop:8 }}>
        cobo kann Fehler machen. Wichtige Informationen bitte immer überprüfen.
      </p>
    </div>
  );
}
