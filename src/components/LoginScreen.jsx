import { useState } from 'react';

const DS = {
  primary: '#7C3AED',
  dark: '#6D28D9',
  light: '#8B5CF6',
  faint: '#EDE9FE',
  bg: '#F3F4F6',
  surface: '#FFFFFF',
  text: '#000015',
  secondary: '#595974',
  placeholder: '#9CA3AF',
  border: '#E5E7EB',
};

export default function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) { setError('Bitte E-Mail und Passwort eingeben.'); return; }
    setLoading(true);
    setError('');
    await new Promise(r => setTimeout(r, 1200));
    // Mock login
    const role = email.includes('admin') ? 'Admin' : email.includes('manager') ? 'Manager' : 'Techniker';
    onLogin({ name: email.split('@')[0].replace('.', ' '), email, role, company: 'Kurt König Baumaschinen GmbH', language: 'DE', plan: 'Professional', requestsUsed: 247, requestsTotal: 400 });
    setLoading(false);
  };

  return (
    <div style={{ width:'100vw', height:'100vh', background: `linear-gradient(135deg, ${DS.dark} 0%, ${DS.light} 100%)`, display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:32 }}>
      {/* Logo */}
      <div style={{ textAlign:'center', color:'white', animation:'fadeIn 0.6s ease' }}>
        <div style={{ width:64, height:64, background:'rgba(255,255,255,0.15)', borderRadius:16, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px', fontSize:32, backdropFilter:'blur(10px)', border:'1px solid rgba(255,255,255,0.2)' }}>
          🤖
        </div>
        <h1 style={{ fontSize:28, fontWeight:700, letterSpacing:'-0.5px' }}>cobo</h1>
        <p style={{ fontSize:14, opacity:0.75, marginTop:4 }}>KI-Assistent für Baumaschinen</p>
      </div>

      {/* Card */}
      <div style={{ background:DS.surface, borderRadius:16, padding:'40px 48px', width:420, boxShadow:'0 20px 60px rgba(0,0,0,0.2)', animation:'fadeIn 0.6s ease 0.1s both' }}>
        <h2 style={{ fontSize:20, fontWeight:600, marginBottom:8, color:DS.text }}>Willkommen zurück</h2>
        <p style={{ fontSize:14, color:DS.secondary, marginBottom:28 }}>Melden Sie sich mit Ihrem Konto an</p>

        <form onSubmit={handleLogin} style={{ display:'flex', flexDirection:'column', gap:16 }}>
          <div>
            <label style={{ fontSize:13, fontWeight:500, color:DS.text, display:'block', marginBottom:6 }}>E-Mail-Adresse</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="name@unternehmen.de"
              style={{ width:'100%', padding:'10px 14px', border:`1px solid ${DS.border}`, borderRadius:8, fontSize:14, color:DS.text, outline:'none', transition:'border-color 0.2s', fontFamily:'Inter, sans-serif' }}
              onFocus={e => e.target.style.borderColor = DS.primary}
              onBlur={e => e.target.style.borderColor = DS.border}
            />
          </div>
          <div>
            <label style={{ fontSize:13, fontWeight:500, color:DS.text, display:'block', marginBottom:6 }}>Passwort</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{ width:'100%', padding:'10px 14px', border:`1px solid ${DS.border}`, borderRadius:8, fontSize:14, color:DS.text, outline:'none', transition:'border-color 0.2s', fontFamily:'Inter, sans-serif' }}
              onFocus={e => e.target.style.borderColor = DS.primary}
              onBlur={e => e.target.style.borderColor = DS.border}
            />
          </div>
          {error && <p style={{ fontSize:13, color:'#EF4444', background:'#FEF2F2', padding:'8px 12px', borderRadius:8, border:'1px solid #FECACA' }}>{error}</p>}
          <button
            type="submit"
            disabled={loading}
            style={{ width:'100%', padding:'12px', background: loading ? DS.light : DS.primary, color:'white', border:'none', borderRadius:8, fontSize:15, fontWeight:600, cursor: loading ? 'not-allowed' : 'pointer', transition:'all 0.2s', display:'flex', alignItems:'center', justifyContent:'center', gap:8, fontFamily:'Inter, sans-serif', marginTop:4 }}
            onMouseEnter={e => !loading && (e.target.style.background = DS.dark)}
            onMouseLeave={e => !loading && (e.target.style.background = DS.primary)}
          >
            {loading ? (
              <>
                <span style={{ width:16, height:16, border:'2px solid rgba(255,255,255,0.3)', borderTopColor:'white', borderRadius:'50%', display:'inline-block', animation:'spin 0.8s linear infinite' }}/>
                Anmeldung läuft...
              </>
            ) : (
              <>
                <span>🔐</span> Mit Keycloak anmelden
              </>
            )}
          </button>
        </form>

        <div style={{ marginTop:24, padding:'12px 16px', background:DS.faint, borderRadius:8, fontSize:12, color:DS.secondary }}>
          <strong style={{ color:DS.primary }}>Demo-Zugänge:</strong> admin@demo.de / manager@demo.de / user@demo.de — Passwort: beliebig
        </div>
      </div>

      <p style={{ color:'rgba(255,255,255,0.5)', fontSize:12 }}>© 2026 vengine GmbH · cobo v2.1.0</p>
    </div>
  );
}
