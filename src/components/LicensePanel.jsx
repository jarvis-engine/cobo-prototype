import { useState } from 'react';

const DS = { primary:'#7C3AED', dark:'#6D28D9', light:'#8B5CF6', faint:'#EDE9FE', text:'#000015', secondary:'#595974', border:'#E5E7EB', surface:'#FFFFFF', bg:'#F3F4F6' };

const plans = [
  { id:'Basic', price:49, requests:150, label:'Basic', icon:'🌱', features:['150 Anfragen/Monat','2 Benutzer','5 Dokumente','E-Mail Support'] },
  { id:'Professional', price:99, requests:400, label:'Professional', icon:'⚡', features:['400 Anfragen/Monat','10 Benutzer','50 Dokumente','Prioritäts-Support','Chat-Export'], popular:true },
  { id:'Business', price:199, requests:1200, label:'Business', icon:'🏢', features:['1.200 Anfragen/Monat','50 Benutzer','Unbegrenzte Dokumente','24/7 Support','API-Zugang','Custom Branding'] },
  { id:'Enterprise', price:350, requests:Infinity, label:'Enterprise', icon:'🚀', features:['Unbegrenzte Anfragen','Unbegrenzte Benutzer','Alles aus Business','Dedizierter Account Manager','SLA-Garantie','On-Premise Option'] },
];

export default function LicensePanel({ user, onPlanChange }) {
  const [current, setCurrent] = useState(user.plan || 'Professional');
  const [used] = useState(user.requestsUsed || 247);
  const [confirming, setConfirming] = useState(null);
  const [changed, setChanged] = useState(false);

  const currentPlan = plans.find(p => p.id === current);
  const pct = currentPlan.requests === Infinity ? 30 : Math.round((used / currentPlan.requests) * 100);

  const handleChange = (planId) => {
    setConfirming(planId);
  };
  const confirmChange = () => {
    setCurrent(confirming);
    onPlanChange && onPlanChange(confirming);
    setConfirming(null);
    setChanged(true);
    setTimeout(() => setChanged(false), 3000);
  };

  return (
    <div style={{ flex:1, overflowY:'auto', background:DS.bg, padding:'24px 28px' }}>
      <h3 style={{ fontSize:20, fontWeight:700, marginBottom:4 }}>Lizenz & Abonnement</h3>
      <p style={{ fontSize:14, color:DS.secondary, marginBottom:24 }}>Verwalten Sie Ihr Abonnement und Nutzungslimits</p>

      {changed && (
        <div style={{ background:'#ECFDF5', border:'1px solid #A7F3D0', borderRadius:10, padding:'12px 16px', marginBottom:20, display:'flex', alignItems:'center', gap:10, animation:'fadeIn 0.3s ease' }}>
          <span>✅</span>
          <span style={{ fontSize:14, color:'#065F46', fontWeight:500 }}>Plan erfolgreich geändert!</span>
        </div>
      )}

      {/* Current usage */}
      <div style={{ background:DS.surface, border:`1px solid ${DS.border}`, borderRadius:16, padding:'20px 24px', marginBottom:24 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:16 }}>
          <div>
            <div style={{ fontSize:13, color:DS.secondary, marginBottom:4 }}>Aktuelles Abonnement</div>
            <div style={{ fontSize:22, fontWeight:700, color:DS.text, display:'flex', alignItems:'center', gap:8 }}>
              {currentPlan.icon} {currentPlan.label}
              <span style={{ fontSize:14, fontWeight:600, color:DS.primary }}>€{currentPlan.price}/Monat</span>
            </div>
          </div>
          <span style={{ fontSize:11, background:DS.faint, color:DS.primary, padding:'4px 12px', borderRadius:9999, fontWeight:600 }}>AKTIV</span>
        </div>

        {/* Usage meter */}
        <div>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
            <span style={{ fontSize:13, fontWeight:500, color:DS.text }}>Anfragen diesen Monat</span>
            <span style={{ fontSize:13, color:DS.secondary }}>
              {used} / {currentPlan.requests === Infinity ? '∞' : currentPlan.requests}
            </span>
          </div>
          <div style={{ height:10, background:DS.bg, borderRadius:9999, overflow:'hidden', border:`1px solid ${DS.border}` }}>
            <div style={{
              height:'100%',
              width:`${Math.min(pct, 100)}%`,
              background: pct > 80 ? 'linear-gradient(90deg, #F59E0B, #EF4444)' : `linear-gradient(90deg, ${DS.primary}, ${DS.light})`,
              borderRadius:9999, transition:'width 0.6s ease',
            }}/>
          </div>
          <div style={{ fontSize:12, color: pct > 80 ? '#D97706' : DS.secondary, marginTop:6 }}>
            {pct > 80 ? `⚠️ ${pct}% des Limits erreicht — Upgrade empfohlen` : `${pct}% genutzt — Reset am 01.03.2026`}
          </div>
        </div>
      </div>

      {/* Plan cards */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
        {plans.map(plan => (
          <div key={plan.id} style={{
            background:DS.surface, border:`2px solid ${current===plan.id ? DS.primary : DS.border}`,
            borderRadius:16, padding:'20px', position:'relative', transition:'all 0.2s',
            boxShadow: current===plan.id ? `0 0 0 3px ${DS.faint}` : 'none',
          }}>
            {plan.popular && (
              <div style={{ position:'absolute', top:-12, left:'50%', transform:'translateX(-50%)', background:DS.primary, color:'white', fontSize:11, fontWeight:600, padding:'3px 14px', borderRadius:9999, whiteSpace:'nowrap' }}>
                BELIEBT
              </div>
            )}
            {current===plan.id && (
              <div style={{ position:'absolute', top:12, right:12, fontSize:18 }}>✅</div>
            )}
            <div style={{ fontSize:24, marginBottom:8 }}>{plan.icon}</div>
            <div style={{ fontSize:17, fontWeight:700, color:DS.text, marginBottom:2 }}>{plan.label}</div>
            <div style={{ fontSize:22, fontWeight:800, color:DS.primary, marginBottom:12 }}>
              €{plan.price}<span style={{ fontSize:13, fontWeight:400, color:DS.secondary }}>/Monat</span>
            </div>
            <ul style={{ listStyle:'none', display:'flex', flexDirection:'column', gap:6, marginBottom:16 }}>
              {plan.features.map((f, i) => (
                <li key={i} style={{ fontSize:12, color:DS.text, display:'flex', gap:6, alignItems:'center' }}>
                  <span style={{ color:'#10B981' }}>✓</span> {f}
                </li>
              ))}
            </ul>
            {current !== plan.id && (
              <button
                onClick={() => handleChange(plan.id)}
                style={{ width:'100%', padding:'8px 0', background: plan.price > plans.find(p=>p.id===current)?.price ? DS.primary : DS.bg, color: plan.price > plans.find(p=>p.id===current)?.price ? 'white' : DS.text, border:`1px solid ${plan.price > plans.find(p=>p.id===current)?.price ? DS.primary : DS.border}`, borderRadius:9999, fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:'Inter, sans-serif' }}
              >
                {plan.price > plans.find(p=>p.id===current)?.price ? '⬆️ Upgrade' : '⬇️ Downgrade'}
              </button>
            )}
            {current === plan.id && (
              <div style={{ width:'100%', padding:'8px 0', textAlign:'center', fontSize:13, fontWeight:600, color:DS.primary }}>Aktueller Plan</div>
            )}
          </div>
        ))}
      </div>

      {/* Confirm dialog */}
      {confirming && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.4)', backdropFilter:'blur(4px)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:500 }}>
          <div style={{ background:DS.surface, borderRadius:16, padding:32, width:400, boxShadow:'0 20px 60px rgba(0,0,0,0.2)', animation:'fadeIn 0.2s ease' }}>
            <h4 style={{ fontSize:18, fontWeight:700, marginBottom:8 }}>Plan wechseln</h4>
            <p style={{ fontSize:14, color:DS.secondary, marginBottom:24 }}>
              Möchten Sie wirklich zum <strong>{confirming}</strong>-Plan wechseln?
              Die Änderung ist sofort wirksam.
            </p>
            <div style={{ display:'flex', gap:10 }}>
              <button onClick={() => setConfirming(null)} style={{ flex:1, padding:'10px 0', border:`1px solid ${DS.border}`, background:'transparent', borderRadius:8, fontSize:14, cursor:'pointer', fontFamily:'Inter, sans-serif' }}>Abbrechen</button>
              <button onClick={confirmChange} style={{ flex:2, padding:'10px 0', background:DS.primary, color:'white', border:'none', borderRadius:8, fontSize:14, fontWeight:600, cursor:'pointer', fontFamily:'Inter, sans-serif' }}>Bestätigen</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
