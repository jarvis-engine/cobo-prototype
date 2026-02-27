import { useState } from 'react';

const DS = { primary:'#7C3AED', dark:'#6D28D9', faint:'#EDE9FE', text:'#000015', secondary:'#595974', border:'#E5E7EB', surface:'#FFFFFF', bg:'#F3F4F6' };

const Field = ({ label, value, onChange, type='text', options }) => {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ marginBottom:16 }}>
      <label style={{ fontSize:13, fontWeight:500, color:DS.text, display:'block', marginBottom:6 }}>{label}</label>
      {options ? (
        <select value={value} onChange={e => onChange(e.target.value)}
          style={{ width:'100%', padding:'9px 12px', border:`1px solid ${focused ? DS.primary : DS.border}`, borderRadius:8, fontSize:14, color:DS.text, outline:'none', background:DS.surface, fontFamily:'Inter, sans-serif', cursor:'pointer' }}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        >
          {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      ) : (
        <input type={type} value={value} onChange={e => onChange(e.target.value)}
          style={{ width:'100%', padding:'9px 12px', border:`1px solid ${focused ? DS.primary : DS.border}`, borderRadius:8, fontSize:14, color:DS.text, outline:'none', fontFamily:'Inter, sans-serif', transition:'border-color 0.2s' }}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        />
      )}
    </div>
  );
};

export default function ProfileModal({ user, onClose, onSave }) {
  const [form, setForm] = useState({ name: user.name, email: user.email, role: user.role, company: user.company, language: user.language || 'DE' });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    onSave(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.4)', backdropFilter:'blur(4px)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:500, animation:'fadeIn 0.2s ease' }}>
      <div style={{ background:DS.surface, borderRadius:16, width:480, maxHeight:'90vh', overflow:'auto', boxShadow:'0 20px 60px rgba(0,0,0,0.2)' }}>
        {/* Header */}
        <div style={{ padding:'20px 24px', borderBottom:`1px solid ${DS.border}`, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div>
            <h3 style={{ fontSize:18, fontWeight:700, color:DS.text }}>Profil bearbeiten</h3>
            <p style={{ fontSize:13, color:DS.secondary, marginTop:2 }}>Ihre persönlichen Informationen</p>
          </div>
          <button onClick={onClose} style={{ width:32, height:32, borderRadius:8, border:`1px solid ${DS.border}`, background:'transparent', cursor:'pointer', fontSize:18, color:DS.secondary, display:'flex', alignItems:'center', justifyContent:'center' }}>×</button>
        </div>

        {/* Avatar */}
        <div style={{ padding:'20px 24px 0', textAlign:'center' }}>
          <div style={{ width:72, height:72, borderRadius:'50%', background:`linear-gradient(135deg, ${DS.primary}, #8B5CF6)`, display:'inline-flex', alignItems:'center', justifyContent:'center', fontSize:28, color:'white', fontWeight:700, marginBottom:8 }}>
            {form.name.charAt(0).toUpperCase()}
          </div>
          <div style={{ fontSize:13, color:DS.secondary }}>
            <span style={{ fontSize:11, background:DS.faint, color:DS.primary, padding:'2px 10px', borderRadius:9999, fontWeight:600 }}>{form.role}</span>
          </div>
        </div>

        {/* Form */}
        <div style={{ padding:'16px 24px 24px' }}>
          <Field label="Name" value={form.name} onChange={v => setForm(f => ({...f, name:v}))} />
          <Field label="E-Mail" value={form.email} onChange={v => setForm(f => ({...f, email:v}))} type="email" />
          <Field label="Rolle" value={form.role} onChange={v => setForm(f => ({...f, role:v}))} options={[
            { value:'Admin', label:'Admin' }, { value:'Manager', label:'Manager' },
            { value:'Techniker', label:'Techniker' }, { value:'Viewer', label:'Viewer' }
          ]} />
          <Field label="Unternehmen" value={form.company} onChange={v => setForm(f => ({...f, company:v}))} />
          <Field label="Sprache" value={form.language} onChange={v => setForm(f => ({...f, language:v}))} options={[
            { value:'DE', label:'🇩🇪 Deutsch' }, { value:'EN', label:'🇬🇧 English' }, { value:'PL', label:'🇵🇱 Polski' }
          ]} />

          <div style={{ display:'flex', gap:10, marginTop:8 }}>
            <button onClick={onClose} style={{ flex:1, padding:'10px 0', border:`1px solid ${DS.border}`, background:'transparent', borderRadius:8, fontSize:14, cursor:'pointer', color:DS.text, fontFamily:'Inter, sans-serif' }}>
              Abbrechen
            </button>
            <button onClick={handleSave} style={{ flex:2, padding:'10px 0', background: saved ? '#10B981' : DS.primary, color:'white', border:'none', borderRadius:8, fontSize:14, fontWeight:600, cursor:'pointer', fontFamily:'Inter, sans-serif', transition:'background 0.3s', display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}>
              {saved ? '✓ Gespeichert!' : 'Änderungen speichern'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
