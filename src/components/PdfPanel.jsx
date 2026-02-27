import { useState } from 'react';

const DS = { primary:'#7C3AED', dark:'#6D28D9', faint:'#EDE9FE', text:'#000015', secondary:'#595974', border:'#E5E7EB', surface:'#FFFFFF', bg:'#F3F4F6' };

const mockDocs = [
  { id:1, name:'Liebherr LTM 1090-4.2 Betriebsanleitung', size:'12.4 MB', pages:486, date:'15.01.2026', category:'Betriebsanleitungen' },
  { id:2, name:'Komatsu PC200-8 Wartungshandbuch', size:'8.2 MB', pages:312, date:'22.01.2026', category:'Wartungshandbücher' },
  { id:3, name:'Volvo EC220E Technische Daten', size:'3.1 MB', pages:48, date:'03.02.2026', category:'Technische Daten' },
  { id:4, name:'Cat 320 Hydrauliksystem Überprüfung', size:'5.7 MB', pages:96, date:'10.02.2026', category:'Wartungshandbücher' },
  { id:5, name:'Sicherheitsvorschriften Hebearbeiten', size:'1.9 MB', pages:32, date:'14.02.2026', category:'Sicherheit' },
  { id:6, name:'Liebherr LTM 1200-5.1 Betriebsanleitung', size:'15.1 MB', pages:612, date:'18.02.2026', category:'Betriebsanleitungen' },
];

export default function PdfPanel({ user }) {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);

  const filtered = mockDocs.filter(d => d.name.toLowerCase().includes(search.toLowerCase()) || d.category.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100%', background:DS.bg }}>
      <div style={{ padding:'16px 20px', background:DS.surface, borderBottom:`1px solid ${DS.border}` }}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Dokumente durchsuchen..."
          style={{ width:'100%', padding:'9px 14px', border:`1px solid ${DS.border}`, borderRadius:9999, fontSize:14, outline:'none', background:DS.bg, fontFamily:'Inter, sans-serif', color:DS.text }}
          onFocus={e => e.target.style.borderColor = DS.primary}
          onBlur={e => e.target.style.borderColor = DS.border}
        />
      </div>
      <div style={{ flex:1, overflowY:'auto', padding:16, display:'flex', flexDirection:'column', gap:8 }}>
        {filtered.map(doc => (
          <div
            key={doc.id}
            onClick={() => setSelected(selected?.id === doc.id ? null : doc)}
            style={{ background:DS.surface, border:`1px solid ${selected?.id===doc.id ? DS.primary : DS.border}`, borderRadius:12, padding:'14px 16px', cursor:'pointer', transition:'all 0.15s', boxShadow: selected?.id===doc.id ? `0 0 0 2px ${DS.faint}` : 'none' }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)'}
            onMouseLeave={e => e.currentTarget.style.boxShadow = selected?.id===doc.id ? `0 0 0 2px ${DS.faint}` : 'none'}
          >
            <div style={{ display:'flex', alignItems:'flex-start', gap:12 }}>
              <div style={{ width:40, height:40, background:DS.faint, borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0 }}>📄</div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:13, fontWeight:600, color: selected?.id===doc.id ? DS.primary : DS.text, marginBottom:2, lineHeight:1.4 }}>{doc.name}</div>
                <div style={{ fontSize:11, color:DS.secondary, display:'flex', gap:10 }}>
                  <span>{doc.category}</span>
                  <span>{doc.pages} Seiten</span>
                  <span>{doc.size}</span>
                </div>
              </div>
            </div>
            {selected?.id === doc.id && (
              <div style={{ marginTop:12, paddingTop:12, borderTop:`1px solid ${DS.border}`, display:'flex', gap:8, animation:'fadeIn 0.2s ease' }}>
                <button style={{ flex:1, padding:'7px 0', background:DS.primary, color:'white', border:'none', borderRadius:8, fontSize:12, fontWeight:500, cursor:'pointer', fontFamily:'Inter, sans-serif' }}>
                  📖 Im Chat verwenden
                </button>
                <button style={{ flex:1, padding:'7px 0', background:DS.bg, color:DS.text, border:`1px solid ${DS.border}`, borderRadius:8, fontSize:12, fontWeight:500, cursor:'pointer', fontFamily:'Inter, sans-serif' }}>
                  ⬇️ Herunterladen
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Upload area */}
      {user?.role === 'Admin' && (
        <div style={{ padding:16, borderTop:`1px solid ${DS.border}` }}>
          <div style={{ border:`2px dashed ${DS.border}`, borderRadius:12, padding:'16px 12px', textAlign:'center', cursor:'pointer', transition:'all 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = DS.primary; e.currentTarget.style.background = DS.faint; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = DS.border; e.currentTarget.style.background = 'transparent'; }}
          >
            <div style={{ fontSize:24, marginBottom:6 }}>📎</div>
            <div style={{ fontSize:13, fontWeight:500, color:DS.text }}>Dokument hochladen</div>
            <div style={{ fontSize:11, color:DS.secondary, marginTop:2 }}>PDF, max. 50 MB</div>
          </div>
        </div>
      )}
    </div>
  );
}
