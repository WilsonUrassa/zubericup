'use client';
import { useState } from 'react';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';

export default function JazaFormuPage() {
  const [form, setForm] = useState({
    team_name: '',
    coach_name: '',
    phone: '',
    location: '',
    players_count: '11',
    notes: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch('/api/registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, players_count: parseInt(form.players_count) }),
      });
      const data = await res.json();
      if (!res.ok) { setErrorMsg(data.error || 'Hitilafu imetokea'); setStatus('error'); return; }
      setStatus('success');
      setForm({ team_name: '', coach_name: '', phone: '', location: '', players_count: '11', notes: '' });
    } catch {
      setErrorMsg('Tatizo la mtandao. Jaribu tena.');
      setStatus('error');
    }
  };

  return (
    <>
      <Nav />

      <div className="page-hero">
        <div className="container">
          <div className="section-label">Zuberi Cup 2025</div>
          <h1 className="section-title">JAZA <span>FOMU</span></h1>
          <p className="body-text">Jiandikishe kushiriki Zuberi Cup msimu ujao. Jaza fomu hapa chini na tutawasiliana nawe.</p>
        </div>
      </div>

      <section style={{ background: 'var(--black)', padding: '80px 40px' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          {status === 'success' && (
            <div className="success-msg">
              ✅ Asante! Fomu yako imekubaliwa. Tutawasiliana nawe hivi karibuni.
            </div>
          )}
          {status === 'error' && (
            <div className="error-msg">⚠️ {errorMsg}</div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label htmlFor="team_name">Jina la Timu *</label>
                <input
                  id="team_name" name="team_name" type="text"
                  placeholder="mfano: Eagle FC" required
                  value={form.team_name} onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="coach_name">Jina la Kocha *</label>
                <input
                  id="coach_name" name="coach_name" type="text"
                  placeholder="Jina kamili la kocha" required
                  value={form.coach_name} onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Nambari ya Simu *</label>
                <input
                  id="phone" name="phone" type="tel"
                  placeholder="+255 7XX XXX XXX" required
                  value={form.phone} onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="location">Eneo / Mtaa</label>
                <input
                  id="location" name="location" type="text"
                  placeholder="mfano: Moshi, Kilimanjaro"
                  value={form.location} onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="players_count">Idadi ya Wachezaji</label>
                <select id="players_count" name="players_count" value={form.players_count} onChange={handleChange}>
                  {[11, 12, 13, 14, 15, 16, 17, 18].map(n => (
                    <option key={n} value={n}>{n} wachezaji</option>
                  ))}
                </select>
              </div>
              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label htmlFor="notes">Maelezo Zaidi (hiari)</label>
                <textarea
                  id="notes" name="notes"
                  placeholder="Andika chochote unachohitaji tuelewe kuhusu timu yako..."
                  value={form.notes} onChange={handleChange}
                  rows={4}
                />
              </div>
            </div>

            <div style={{ marginTop: '32px', display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
              <button
                type="submit"
                className="btn-primary"
                disabled={status === 'loading'}
                style={{ opacity: status === 'loading' ? 0.7 : 1 }}
              >
                {status === 'loading' ? 'Inatuma...' : 'Tuma Fomu'}
              </button>
              <span style={{ fontFamily: 'Barlow Condensed', fontSize: '12px', color: 'var(--grey)', letterSpacing: '1px' }}>
                * Sehemu zinazohitajika
              </span>
            </div>
          </form>

          {/* Info box */}
          <div style={{
            marginTop: '60px', background: 'rgba(26,107,42,0.15)',
            border: '1px solid rgba(232,180,22,0.2)', padding: '28px',
          }}>
            <div style={{ fontFamily: 'Bebas Neue', fontSize: '22px', color: 'var(--gold)', letterSpacing: '2px', marginBottom: '16px' }}>
              MAELEZO YA MCHUANO
            </div>
            {[
              ['📅 Msimu', '2025 — Tarehe itajulishwa'],
              ['📍 Uwanja', 'Uwanja wa Railway, Moshi'],
              ['⚽ Timu', 'Hadi timu 16 zinashiriki'],
              ['🏆 Tuzo', 'Kombe + Medali + Zawadi maalum'],
              ['📞 Maswali', 'Piga simu au tuma ujumbe'],
            ].map(([icon, val]) => (
              <div key={icon} style={{ display: 'flex', gap: '12px', marginBottom: '12px', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '16px' }}>{icon}</span>
                <span style={{ fontFamily: 'Barlow Condensed', fontSize: '14px', color: 'var(--cream)', letterSpacing: '1px' }}>{val}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
