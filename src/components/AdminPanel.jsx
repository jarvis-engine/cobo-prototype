import { useState } from 'react';

const DS = { primary:'#7C3AED', dark:'#6D28D9', faint:'#EDE9FE', text:'#000015', secondary:'#595974', border:'#E5E7EB', surface:'#FFFFFF', bg:'#F3F4F6' };

const initUsers = [
  { id:1, name:'Klaus Müller', email:'k.mueller@kurtkoenig.de', role:'Admin', status:'aktiv' },
  { id:2, name:'Petra Schneider', email:'p.schneider@kurtkoenig.de', role:'Manager', status:'aktiv' },
  { id:3, name:'Hans Weber', email:'h.weber@kurtkoenig.de', role:'Techniker', status:'aktiv' },
  { id:4, name:'Maria Fischer', email:'m.fischer@kurtkoenig.de', role:'Techniker', status:'aktiv' },
  { id:5, name:'Thomas Bauer', email:'t.bauer@kurtkoenig.de', role:'Viewer', status:'inaktiv' },
  { id:6, name:'Anna Schmidt', email:'a.schmidt@kurtkoenig.de', role:'Techniker', status:'aktiv' },
  { id:7, name:'Robert Schulz', email:'r.schulz@kurtkoenig.de', role:'Manager', status:'aktiv' },
];

const roleColors = { Admin: { color:'#7C3AED', bg:'#EDE9FE' }, Manager: { color:'#2563EB', bg:'#EFF6FF' }, Techniker: { color:'#059669', bg:'#ECFDF5' }, Viewer: { color:'#D97706', bg:'#FFFBEB' } };

export default function AdminPanel() {
  const [users, setUsers] = useState(initUsers);
  const [search, setSearch] = useState('');

  const filtered = users.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));

  const toggleStatus = (id) => setUsers(us => us.map(u => u.id===id ? {...u, status: u.status==='aktiv' ? 'inaktiv' : 'aktiv'} : u));
  const setRole = (id, role) => setUsers(us => us.map(u => u.id===id ? {...u, role} : u));

  const stats = { total: users.length, active: users.filter(u => u.status==='aktiv').length, admins: users.filter(u => u.role==='Admin').length };

  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', height:'100%', background:DS.bg, overflow:'auto' }}>
      <div style={{ padding:'24px 28px', background:DS.surface, borderBottom:`1px solid ${DS.border}` }}>
        <h3 style={{ fontSize:20, fontWeight:700, marginBottom:4 }}>Benutzerverwaltung</h3>
        <p style={{ fontSize:14, color:DS.secondary }}>Verwalten Sie Rollen und Zugriffsrechte</p>

        {/* Stats */}
        <div style={{ display:'flex', gap:16, marginTop:20 }}>
          {[
            { label:'Benutzer gesamt', value:stats.total, icon:'👥' },
            { label:'Aktiv', value:stats.active, icon:'✅' },
            { label:'Inaktiv', value:stats.total-stats.active, icon:'⏸️' },
            { label:'Admins', value:stats.admins, icon:'🔑' },
          ].map(s => (
            <div key={s.label} style={{ background:DS.bg, border:`1px solid ${DS.border}`, borderRadius:12, padding:'12px 16px', flex:1, textAlign:'center' }}>
              <div style={{ fontSize:20, marginBottom:4 }}>{s.icon}</div>
              <div style={{ fontSize:22, fontWeight:700, color:DS.primary }}>{s.value}</div>
              <div style={{ fontSize:12, color:DS.secondary }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding:'20px 28px' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Benutzer suchen..."
            style={{ padding:'8px 14px', border:`1px solid ${DS.border}`, borderRadius:9999, fontSize:14, outline:'none', background:DS.surface, width:280, fontFamily:'Inter, sans-serif' }}
            onFocus={e => e.target.style.borderColor = DS.primary}
            onBlur={e => e.target.style.borderColor = DS.border}
          />
          <button style={{ padding:'8px 16px', background:DS.primary, color:'white', border:'none', borderRadius:9999, fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:'Inter, sans-serif' }}>
            + Benutzer einladen
          </button>
        </div>

        <div style={{ background:DS.surface, borderRadius:12, border:`1px solid ${DS.border}`, overflow:'hidden' }}>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead>
              <tr style={{ background:DS.bg, borderBottom:`1px solid ${DS.border}` }}>
                {['Name', 'E-Mail', 'Rolle', 'Status', 'Aktion'].map(h => (
                  <th key={h} style={{ padding:'12px 16px', textAlign:'left', fontSize:12, fontWeight:600, color:DS.secondary, textTransform:'uppercase', letterSpacing:0.4 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((user, i) => (
                <tr key={user.id} style={{ borderBottom: i < filtered.length-1 ? `1px solid ${DS.border}` : 'none', transition:'background 0.1s' }}
                  onMouseEnter={e => e.currentTarget.style.background = DS.bg}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding:'14px 16px' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                      <div style={{ width:32, height:32, borderRadius:'50%', background:`linear-gradient(135deg, ${DS.primary}, #8B5CF6)`, display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontWeight:600, fontSize:13, flexShrink:0 }}>
                        {user.name.charAt(0)}
                      </div>
                      <span style={{ fontSize:14, fontWeight:500, color:DS.text }}>{user.name}</span>
                    </div>
                  </td>
                  <td style={{ padding:'14px 16px', fontSize:13, color:DS.secondary }}>{user.email}</td>
                  <td style={{ padding:'14px 16px' }}>
                    <select value={user.role} onChange={e => setRole(user.id, e.target.value)}
                      style={{ padding:'4px 10px', borderRadius:9999, fontSize:12, fontWeight:600, border:`1px solid ${roleColors[user.role]?.bg}`, background: roleColors[user.role]?.bg, color: roleColors[user.role]?.color, cursor:'pointer', outline:'none', fontFamily:'Inter, sans-serif' }}
                    >
                      {['Admin','Manager','Techniker','Viewer'].map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </td>
                  <td style={{ padding:'14px 16px' }}>
                    <span style={{ fontSize:12, fontWeight:500, background: user.status==='aktiv' ? '#ECFDF5' : '#F3F4F6', color: user.status==='aktiv' ? '#059669' : DS.secondary, padding:'3px 10px', borderRadius:9999 }}>
                      {user.status==='aktiv' ? '● Aktiv' : '○ Inaktiv'}
                    </span>
                  </td>
                  <td style={{ padding:'14px 16px' }}>
                    <button onClick={() => toggleStatus(user.id)}
                      style={{ padding:'5px 12px', background:'transparent', border:`1px solid ${DS.border}`, borderRadius:8, fontSize:12, cursor:'pointer', color:DS.text, fontFamily:'Inter, sans-serif', transition:'all 0.15s' }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = DS.primary; e.currentTarget.style.color = DS.primary; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = DS.border; e.currentTarget.style.color = DS.text; }}
                    >
                      {user.status==='aktiv' ? 'Deaktivieren' : 'Aktivieren'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
