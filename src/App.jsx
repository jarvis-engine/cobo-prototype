import { useState, useEffect } from 'react';
import './App.css';
import LoginScreen from './components/LoginScreen';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ChatArea from './components/ChatArea';
import ChatHistory from './components/ChatHistory';
import PdfPanel from './components/PdfPanel';
import ProfileModal from './components/ProfileModal';
import AdminPanel from './components/AdminPanel';
import LicensePanel from './components/LicensePanel';

const DS = { primary:'#7C3AED', dark:'#6D28D9', faint:'#EDE9FE', text:'#000015', secondary:'#595974', border:'#E5E7EB', surface:'#FFFFFF', bg:'#F3F4F6' };

const MOCK_HISTORY = [
  { id:'h1', title:'Liebherr Wartungsintervalle', preview:'Was sind die Wartungsintervalle...', dateGroup:'Heute', date:'27.02.2026' },
  { id:'h2', title:'Komatsu PC200 Technische Daten', preview:'Zeig mir die technischen Daten...', dateGroup:'Heute', date:'27.02.2026' },
  { id:'h3', title:'Hydrauliköl Volvo EC220E', preview:'Wie wechsle ich das Hydrauliköl...', dateGroup:'Gestern', date:'26.02.2026' },
  { id:'h4', title:'Sicherheitsvorschriften Heben', preview:'Welche Sicherheitsvorschriften gelten...', dateGroup:'Gestern', date:'26.02.2026' },
  { id:'h5', title:'Cat 320 Hydraulikdruck', preview:'Was ist der maximale Arbeitsdruck...', dateGroup:'Diese Woche', date:'25.02.2026' },
  { id:'h6', title:'Reifendruckwerte Baumaschinen', preview:'Welche Reifendruckwerte sind...', dateGroup:'Diese Woche', date:'24.02.2026' },
  { id:'h7', title:'Liebherr LTM 1200 Ausleger', preview:'Wie montiert man den Ausleger...', dateGroup:'Letzten Monat', date:'15.02.2026' },
];

function Toast({ message, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, []);
  return (
    <div style={{ position:'fixed', bottom:32, left:'50%', transform:'translateX(-50%)', background:DS.text, color:'white', padding:'12px 20px', borderRadius:12, fontSize:14, fontWeight:500, zIndex:1000, animation:'toastIn 0.3s ease', display:'flex', alignItems:'center', gap:10, boxShadow:'0 4px 20px rgba(0,0,0,0.2)', whiteSpace:'nowrap' }}>
      {message}
      <button onClick={onClose} style={{ background:'transparent', border:'none', color:'rgba(255,255,255,0.6)', cursor:'pointer', fontSize:16, padding:0, marginLeft:4 }}>×</button>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [activePanel, setActivePanel] = useState('chat');
  const [showProfile, setShowProfile] = useState(false);
  const [activeChatId, setActiveChatId] = useState('new');
  const [chatHistory, setChatHistory] = useState(MOCK_HISTORY);
  const [toast, setToast] = useState(null);

  const handleLogin = (userData) => setUser(userData);
  const handleLogout = () => { setUser(null); setActivePanel('chat'); };
  const handlePanelChange = (panel) => {
    if (panel === 'profile') { setShowProfile(true); return; }
    setActivePanel(panel);
  };

  const handleNewChat = () => {
    const newId = 'new_' + Date.now();
    setActiveChatId(newId);
  };

  const handleSaveProfile = (form) => {
    setUser(u => ({ ...u, ...form }));
  };

  const showToast = (msg) => setToast(msg);

  if (!user) return <LoginScreen onLogin={handleLogin} />;

  const panelTitles = {
    chat: { title:'cobo Chat', subtitle:'KI-gestützter Assistent für Baumaschinen' },
    history: { title:'Chat-Verlauf', subtitle:'Ihre bisherigen Gespräche' },
    pdf: { title:'Dokumentenverwaltung', subtitle:'Technische Handbücher & Betriebsanleitungen' },
    admin: { title:'Benutzerverwaltung', subtitle:`${user.role} · Vollzugriff` },
    license: { title:'Lizenz & Abonnement', subtitle:`${user.plan}-Plan aktiv` },
  };

  const pt = panelTitles[activePanel] || panelTitles.chat;

  return (
    <div style={{ display:'flex', height:'100vh', background:DS.bg }}>
      <Sidebar user={user} activePanel={activePanel} onPanelChange={handlePanelChange} onLogout={handleLogout} />

      {/* Main content */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', height:'100vh', overflow:'hidden' }}>
        <Header title={pt.title} subtitle={pt.subtitle} user={user} />

        <div style={{ flex:1, display:'flex', overflow:'hidden' }}>
          {/* Chat History sidebar (visible when chat or history panel) */}
          {(activePanel === 'chat' || activePanel === 'history') && (
            <ChatHistory
              history={chatHistory}
              activeId={activeChatId}
              onSelect={setActiveChatId}
              onNewChat={handleNewChat}
            />
          )}

          {/* Main panel */}
          {activePanel === 'chat' && (
            <>
              <ChatArea user={user} chatId={activeChatId} onToast={showToast} />
              {/* PDF right panel */}
              <div style={{ width:300, borderLeft:`1px solid ${DS.border}`, display:'flex', flexDirection:'column', height:'100%', flexShrink:0 }}>
                <div style={{ padding:'12px 16px', borderBottom:`1px solid ${DS.border}`, background:DS.surface }}>
                  <div style={{ fontSize:13, fontWeight:600, color:DS.text }}>Quellen & Dokumente</div>
                  <div style={{ fontSize:12, color:DS.secondary }}>Verfügbare Handbücher</div>
                </div>
                <PdfPanel user={user} />
              </div>
            </>
          )}

          {activePanel === 'history' && (
            <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', background:DS.bg }}>
              <div style={{ textAlign:'center', color:DS.secondary }}>
                <div style={{ fontSize:48, marginBottom:16 }}>📋</div>
                <h3 style={{ fontSize:18, fontWeight:600, color:DS.text, marginBottom:8 }}>Chat-Verlauf</h3>
                <p style={{ fontSize:14 }}>Wählen Sie einen Chat aus der linken Liste</p>
              </div>
            </div>
          )}

          {activePanel === 'pdf' && <PdfPanel user={user} />}
          {activePanel === 'admin' && <AdminPanel />}
          {activePanel === 'license' && <LicensePanel user={user} onPlanChange={plan => setUser(u => ({...u, plan}))} />}
        </div>
      </div>

      {showProfile && <ProfileModal user={user} onClose={() => setShowProfile(false)} onSave={handleSaveProfile} />}
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}
