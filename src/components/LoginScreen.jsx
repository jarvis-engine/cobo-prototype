import { useState } from 'react';

const DS = {
  primary: '#7C3AED',
  dark: '#6D28D9',
  light: '#8B5CF6',
  faint: '#EDE9FE',
  surface: '#FFFFFF',
  text: '#000015',
  secondary: '#595974',
  border: '#E5E7EB',
};

const ACCESS_PASSWORD = 'venginetest';

export default function LoginScreen({ onLogin }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!password) { setError('Bitte Passwort eingeben.'); return; }
    setLoading(true);
    setError('');
    await new Promise(r => setTimeout(r, 600));
    if (password !== ACCESS_PASSWORD) {
      setError('Falsches Passwort.');
      setLoading(false);
      return;
    }
    onLogin({
      name: 'vengine Team',
      email: 'team@vengine.tech',
      role: 'Techniker',
      company: 'vengine GmbH',
      language: 'DE',
      plan: 'Professional',
      requestsUsed: 0,
      requestsTotal: 400,
    });
    setLoading(false);
  };

  return (
    <div style={{
      width: '100vw', height: '100vh',
      background: `linear-gradient(135deg, ${DS.dark} 0%, ${DS.light} 100%)`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexDirection: 'column', gap: 32
    }}>
      <div style={{ textAlign: 'center', color: 'white' }}>
        <div style={{
          width: 64, height: 64,
          background: 'rgba(255,255,255,0.15)', borderRadius: 16,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 16px', fontSize: 32,
          backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)'
        }}>
          🤖
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.5px' }}>cobo</h1>
        <p style={{ fontSize: 14, opacity: 0.75, marginTop: 4 }}>KI-Assistent für Baumaschinen</p>
      </div>

      <div style={{
        background: DS.surface, borderRadius: 16,
        padding: '40px 48px', width: 420,
        boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
      }}>
        <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8, color: DS.text }}>Demo-Zugang</h2>
        <p style={{ fontSize: 14, color: DS.secondary, marginBottom: 28 }}>
          Passwort eingeben, um die Demo zu starten
        </p>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ fontSize: 13, fontWeight: 500, color: DS.text, display: 'block', marginBottom: 6 }}>Passwort</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••••••"
              autoFocus
              style={{
                width: '100%', padding: '10px 14px',
                border: `1px solid ${DS.border}`, borderRadius: 8,
                fontSize: 14, color: DS.text, outline: 'none',
                transition: 'border-color 0.2s', fontFamily: 'Inter, sans-serif',
                boxSizing: 'border-box'
              }}
              onFocus={e => e.target.style.borderColor = DS.primary}
              onBlur={e => e.target.style.borderColor = DS.border}
            />
          </div>

          {error && (
            <p style={{
              fontSize: 13, color: '#EF4444',
              background: '#FEF2F2', padding: '8px 12px',
              borderRadius: 8, border: '1px solid #FECACA', margin: 0
            }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', padding: '12px',
              background: loading ? DS.light : DS.primary,
              color: 'white', border: 'none', borderRadius: 8,
              fontSize: 15, fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s', fontFamily: 'Inter, sans-serif', marginTop: 4
            }}
            onMouseEnter={e => !loading && (e.target.style.background = DS.dark)}
            onMouseLeave={e => !loading && (e.target.style.background = DS.primary)}
          >
            {loading ? 'Einen Moment...' : '→ Demo starten'}
          </button>
        </form>
      </div>

      <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>
        © 2026 vengine GmbH · cobo v2.1.0
      </p>
    </div>
  );
}
