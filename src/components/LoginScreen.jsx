import { useEffect } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

const DS = {
  primary: '#7C3AED',
  dark: '#6D28D9',
  light: '#8B5CF6',
  surface: '#FFFFFF',
  text: '#000015',
  secondary: '#595974',
};

export default function LoginScreen({ onLogin, authError, setAuthError }) {
  const handleSuccess = (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      const email = decoded.email || '';

      if (!email.endsWith('@vengine.tech')) {
        setAuthError('Nur @vengine.tech Konten sind erlaubt.');
        return;
      }

      const name = decoded.name || email.split('@')[0];
      onLogin({
        name,
        email,
        role: 'Techniker',
        company: 'vengine GmbH',
        language: 'DE',
        plan: 'Professional',
        requestsUsed: 0,
        requestsTotal: 400,
        avatar: decoded.picture,
      });
    } catch {
      setAuthError('Anmeldung fehlgeschlagen. Bitte erneut versuchen.');
    }
  };

  const handleError = () => {
    setAuthError('Google-Anmeldung fehlgeschlagen. Bitte erneut versuchen.');
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
        <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8, color: DS.text }}>Willkommen</h2>
        <p style={{ fontSize: 14, color: DS.secondary, marginBottom: 28 }}>
          Melden Sie sich mit Ihrem vengine-Konto an
        </p>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <GoogleLogin
            onSuccess={handleSuccess}
            onError={handleError}
            useOneTap={false}
            theme="outline"
            size="large"
            text="signin_with"
            locale="de"
          />
        </div>

        {authError && (
          <p style={{
            marginTop: 16, fontSize: 13, color: '#EF4444',
            background: '#FEF2F2', padding: '8px 12px',
            borderRadius: 8, border: '1px solid #FECACA',
            textAlign: 'center'
          }}>
            {authError}
          </p>
        )}

        <div style={{
          marginTop: 24, padding: '10px 14px',
          background: '#F9FAFB', borderRadius: 8,
          fontSize: 12, color: DS.secondary, textAlign: 'center',
          border: '1px solid #E5E7EB'
        }}>
          Nur <strong>@vengine.tech</strong> Konten sind zugelassen
        </div>
      </div>

      <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>
        © 2026 vengine GmbH · cobo v2.1.0
      </p>
    </div>
  );
}
