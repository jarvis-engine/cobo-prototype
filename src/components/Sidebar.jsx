import { useState } from 'react';

const DS = {
  primary: '#7C3AED', dark: '#6D28D9', light: '#8B5CF6', faint: '#EDE9FE',
  bg: '#F3F4F6', surface: '#FFFFFF', text: '#000015', secondary: '#595974',
  border: '#E5E7EB',
};

const NavIcon = ({ icon, label, active, onClick, badge }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div style={{ position:'relative' }}>
      <button
        onClick={onClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        title={label}
        style={{
          width:44, height:44, borderRadius:12, border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center',
          background: active ? DS.faint : hovered ? '#F5F3FF' : 'transparent',
          color: active ? DS.primary : DS.secondary,
          fontSize:20, transition:'all 0.15s', position:'relative',
        }}
      >
        {icon}
        {badge && <span style={{ position:'absolute', top:8, right:8, width:8, height:8, background:'#EF4444', borderRadius:'50%', border:'2px solid white' }}/>}
      </button>
      {hovered && (
        <div style={{ position:'absolute', left:'calc(100% + 10px)', top:'50%', transform:'translateY(-50%)', background:DS.text, color:'white', padding:'4px 10px', borderRadius:6, fontSize:12, whiteSpace:'nowrap', zIndex:100, pointerEvents:'none' }}>
          {label}
        </div>
      )}
    </div>
  );
};

export default function Sidebar({ user, activePanel, onPanelChange, onLogout }) {
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <div style={{
      width:64, height:'100vh', background:DS.surface, borderRight:`1px solid ${DS.border}`,
      display:'flex', flexDirection:'column', alignItems:'center', padding:'12px 0', gap:4,
      flexShrink:0, zIndex:10,
    }}>
      {/* Logo */}
      <div style={{ width:40, height:40, background:`linear-gradient(135deg, ${DS.primary}, ${DS.light})`, borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, marginBottom:12, boxShadow:`0 4px 12px ${DS.faint}` }}>
        🤖
      </div>

      {/* Nav */}
      <NavIcon icon="💬" label="Chat" active={activePanel === 'chat'} onClick={() => onPanelChange('chat')} />
      <NavIcon icon="📋" label="Chat-Verlauf" active={activePanel === 'history'} onClick={() => onPanelChange('history')} />
      <NavIcon icon="📄" label="Dokumente" active={activePanel === 'pdf'} onClick={() => onPanelChange('pdf')} />
      {(user.role === 'Admin' || user.role === 'Manager') && (
        <NavIcon icon="💳" label="Lizenz & Abonnement" active={activePanel === 'license'} onClick={() => onPanelChange('license')} />
      )}
      {user.role === 'Admin' && (
        <NavIcon icon="⚙️" label="Benutzerverwaltung" active={activePanel === 'admin'} onClick={() => onPanelChange('admin')} />
      )}

      {/* Spacer */}
      <div style={{ flex:1 }} />

      {/* User Avatar */}
      <div style={{ position:'relative' }}>
        <button
          onClick={() => setShowUserMenu(v => !v)}
          style={{
            width:40, height:40, borderRadius:'50%', border:'none', cursor:'pointer',
            background:`linear-gradient(135deg, ${DS.primary}, ${DS.light})`,
            color:'white', fontSize:16, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center',
            boxShadow: showUserMenu ? `0 0 0 3px ${DS.faint}` : 'none', transition:'box-shadow 0.2s',
          }}
        >
          {user.name.charAt(0).toUpperCase()}
        </button>

        {showUserMenu && (
          <div style={{
            position:'absolute', bottom:'calc(100% + 8px)', left:'calc(100% + 8px)',
            background:DS.surface, border:`1px solid ${DS.border}`, borderRadius:12,
            boxShadow:'0 8px 24px rgba(0,0,0,0.12)', padding:8, minWidth:200, zIndex:200,
            animation:'fadeIn 0.15s ease',
          }}>
            <div style={{ padding:'8px 12px', borderBottom:`1px solid ${DS.border}`, marginBottom:4 }}>
              <div style={{ fontWeight:600, fontSize:14, color:DS.text }}>{user.name}</div>
              <div style={{ fontSize:12, color:DS.secondary }}>{user.email}</div>
              <span style={{ fontSize:11, fontWeight:500, background:DS.faint, color:DS.primary, padding:'2px 8px', borderRadius:9999, display:'inline-block', marginTop:4 }}>
                {user.role}
              </span>
            </div>
            <button
              onClick={() => { setShowUserMenu(false); onPanelChange('profile'); }}
              style={{ width:'100%', padding:'8px 12px', background:'transparent', border:'none', cursor:'pointer', textAlign:'left', fontSize:14, color:DS.text, borderRadius:8, display:'flex', alignItems:'center', gap:8, fontFamily:'Inter, sans-serif' }}
              onMouseEnter={e => e.currentTarget.style.background = DS.bg}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              👤 Profil bearbeiten
            </button>
            <button
              onClick={() => { setShowUserMenu(false); onLogout(); }}
              style={{ width:'100%', padding:'8px 12px', background:'transparent', border:'none', cursor:'pointer', textAlign:'left', fontSize:14, color:'#EF4444', borderRadius:8, display:'flex', alignItems:'center', gap:8, fontFamily:'Inter, sans-serif' }}
              onMouseEnter={e => e.currentTarget.style.background = '#FEF2F2'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              🚪 Abmelden
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
