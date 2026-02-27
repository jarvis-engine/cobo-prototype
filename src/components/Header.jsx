const DS = { primary:'#7C3AED', text:'#000015', secondary:'#595974', border:'#E5E7EB', surface:'#FFFFFF', faint:'#EDE9FE' };

export default function Header({ title, subtitle, user }) {
  return (
    <div style={{ height:60, background:DS.surface, borderBottom:`1px solid ${DS.border}`, display:'flex', alignItems:'center', padding:'0 20px', gap:12, flexShrink:0 }}>
      <div style={{ flex:1 }}>
        <h2 style={{ fontSize:16, fontWeight:600, color:DS.text, margin:0 }}>{title}</h2>
        {subtitle && <p style={{ fontSize:12, color:DS.secondary, margin:0 }}>{subtitle}</p>}
      </div>
      <div style={{ display:'flex', alignItems:'center', gap:8 }}>
        <span style={{ fontSize:12, color:DS.secondary }}>
          <span style={{ fontWeight:500, color:DS.text }}>{user?.company}</span>
        </span>
        <div style={{ width:1, height:20, background:DS.border }} />
        <span style={{ fontSize:11, background:DS.faint, color:DS.primary, padding:'3px 10px', borderRadius:9999, fontWeight:500 }}>
          {user?.plan || 'Professional'}
        </span>
      </div>
    </div>
  );
}
