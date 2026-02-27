const DS = { primary:'#7C3AED', dark:'#6D28D9', faint:'#EDE9FE', text:'#000015', secondary:'#595974', border:'#E5E7EB', surface:'#FFFFFF', bg:'#F3F4F6' };

export default function ChatHistory({ history, activeId, onSelect, onNewChat }) {
  const grouped = history.reduce((acc, chat) => {
    const key = chat.dateGroup;
    if (!acc[key]) acc[key] = [];
    acc[key].push(chat);
    return acc;
  }, {});

  return (
    <div style={{ width:260, background:DS.surface, borderRight:`1px solid ${DS.border}`, display:'flex', flexDirection:'column', height:'100%', flexShrink:0 }}>
      {/* New chat button */}
      <div style={{ padding:'12px 16px', borderBottom:`1px solid ${DS.border}` }}>
        <button
          onClick={onNewChat}
          style={{ width:'100%', padding:'9px 0', background:DS.primary, color:'white', border:'none', borderRadius:9999, fontSize:13, fontWeight:600, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:6, fontFamily:'Inter, sans-serif', transition:'background 0.15s' }}
          onMouseEnter={e => e.currentTarget.style.background = DS.dark}
          onMouseLeave={e => e.currentTarget.style.background = DS.primary}
        >
          ✏️ Neuer Chat
        </button>
      </div>

      {/* List */}
      <div style={{ flex:1, overflowY:'auto', padding:'8px 0' }}>
        {Object.entries(grouped).map(([group, chats]) => (
          <div key={group}>
            <div style={{ padding:'8px 16px 4px', fontSize:11, fontWeight:600, color:DS.secondary, textTransform:'uppercase', letterSpacing:0.5 }}>{group}</div>
            {chats.map(chat => (
              <button
                key={chat.id}
                onClick={() => onSelect(chat.id)}
                style={{
                  width:'100%', padding:'10px 16px', background: activeId===chat.id ? DS.faint : 'transparent',
                  border:'none', cursor:'pointer', textAlign:'left', borderRadius:0, transition:'background 0.1s',
                  borderLeft: activeId===chat.id ? `3px solid ${DS.primary}` : '3px solid transparent',
                  fontFamily:'Inter, sans-serif',
                }}
                onMouseEnter={e => activeId!==chat.id && (e.currentTarget.style.background = DS.bg)}
                onMouseLeave={e => activeId!==chat.id && (e.currentTarget.style.background = 'transparent')}
              >
                <div style={{ fontSize:13, fontWeight: activeId===chat.id ? 600 : 400, color: activeId===chat.id ? DS.primary : DS.text, marginBottom:2, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                  {chat.title}
                </div>
                <div style={{ fontSize:11, color:DS.secondary, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                  {chat.preview}
                </div>
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
