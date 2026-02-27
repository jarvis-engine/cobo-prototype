import { useState } from 'react';

const DS = { primary:'#7C3AED', dark:'#6D28D9', light:'#8B5CF6', faint:'#EDE9FE', text:'#000015', secondary:'#595974', border:'#E5E7EB', surface:'#FFFFFF', bg:'#F3F4F6' };

const confidenceMeta = (score) => {
  if (score >= 85) return { label:'Hoch', color:'#10B981', bg:'#ECFDF5', border:'#A7F3D0' };
  if (score >= 60) return { label:'Mittel', color:'#F59E0B', bg:'#FFFBEB', border:'#FDE68A' };
  return { label:'Niedrig', color:'#EF4444', bg:'#FEF2F2', border:'#FECACA' };
};

function ConfidenceBadge({ score }) {
  const [tooltip, setTooltip] = useState(false);
  const meta = confidenceMeta(score);
  return (
    <div style={{ position:'relative', display:'inline-block' }}>
      <span
        onMouseEnter={() => setTooltip(true)}
        onMouseLeave={() => setTooltip(false)}
        style={{ fontSize:11, fontWeight:600, background:meta.bg, color:meta.color, border:`1px solid ${meta.border}`, padding:'2px 8px', borderRadius:9999, cursor:'help', display:'inline-flex', alignItems:'center', gap:4 }}
      >
        <span style={{ width:6, height:6, borderRadius:'50%', background:meta.color, display:'inline-block' }}/>
        {meta.label} · {score}%
      </span>
      {tooltip && (
        <div style={{ position:'absolute', bottom:'calc(100% + 6px)', left:0, background:DS.text, color:'white', padding:'8px 12px', borderRadius:8, fontSize:12, width:220, zIndex:50, lineHeight:1.5 }}>
          <strong>Konfidenz-Score: {score}%</strong><br/>
          Gibt an, wie sicher das Modell bei dieser Antwort ist. Hoch (≥85%), Mittel (60–84%), Niedrig (&lt;60%).
        </div>
      )}
    </div>
  );
}

export default function ChatMessage({ message, onShare }) {
  const [copied, setCopied] = useState(false);
  const isBot = message.role === 'bot';

  const handleShare = () => {
    navigator.clipboard.writeText(`https://cobo.vengine.tech/chat/${message.id}`).catch(() => {});
    onShare();
  };

  return (
    <div style={{ display:'flex', gap:12, padding:'12px 20px', animation:'fadeIn 0.3s ease', alignItems:'flex-start', flexDirection: isBot ? 'row' : 'row-reverse' }}>
      {/* Avatar */}
      <div style={{
        width:36, height:36, borderRadius:12, flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16,
        background: isBot ? `linear-gradient(135deg, ${DS.primary}, ${DS.light})` : '#E5E7EB',
        color: isBot ? 'white' : DS.secondary, fontWeight:700, fontSize: isBot ? 16 : 14,
      }}>
        {isBot ? '🤖' : message.authorInitial || '?'}
      </div>

      {/* Bubble */}
      <div style={{ maxWidth:'75%', display:'flex', flexDirection:'column', gap:6, alignItems: isBot ? 'flex-start' : 'flex-end' }}>
        <div style={{ fontSize:12, color:DS.secondary, display:'flex', gap:8, alignItems:'center' }}>
          <span style={{ fontWeight:500, color:DS.text }}>{isBot ? 'cobo' : message.author}</span>
          <span>{message.time}</span>
        </div>

        <div style={{
          background: isBot ? DS.surface : `linear-gradient(135deg, ${DS.primary}, ${DS.light})`,
          color: isBot ? DS.text : 'white',
          padding:'12px 16px', borderRadius: isBot ? '4px 16px 16px 16px' : '16px 4px 16px 16px',
          fontSize:14, lineHeight:1.65, border: isBot ? `1px solid ${DS.border}` : 'none',
          boxShadow: isBot ? '0 1px 4px rgba(0,0,0,0.06)' : '0 2px 8px rgba(124,58,237,0.25)',
        }}>
          {message.text}
        </div>

        {/* Sources + Confidence + Share */}
        {isBot && (
          <div style={{ display:'flex', flexWrap:'wrap', gap:6, alignItems:'center' }}>
            {message.sources?.map((s, i) => (
              <span key={i} style={{ fontSize:11, background:DS.faint, color:DS.primary, padding:'2px 8px', borderRadius:9999, fontWeight:500, cursor:'pointer', border:`1px solid ${DS.border}` }}>
                📄 {s}
              </span>
            ))}
            {message.confidence !== undefined && <ConfidenceBadge score={message.confidence} />}
            <button
              onClick={handleShare}
              title="Chat teilen"
              style={{ background:'transparent', border:`1px solid ${DS.border}`, color:DS.secondary, borderRadius:9999, padding:'2px 8px', fontSize:11, cursor:'pointer', display:'flex', alignItems:'center', gap:4, fontFamily:'Inter, sans-serif' }}
              onMouseEnter={e => { e.currentTarget.style.background = DS.faint; e.currentTarget.style.color = DS.primary; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = DS.secondary; }}
            >
              🔗 Teilen
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
