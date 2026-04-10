import Nav from '@/components/Nav';
import Footer from '@/components/Footer';

export default function MeyaPage() {
  return (
    <>
      <Nav />

      {/* PAGE HERO */}
      <div className="page-hero">
        <div className="container">
          <div className="section-label">Mstahiki Meya</div>
          <h1 className="section-title">ENG. ZUBERI<br /><span>ABDALLAH KIDUMO</span></h1>
          <p className="body-text">Mstahiki Meya wa Manispaa ya Moshi na mwanzilishi wa Zuberi Cup.</p>
        </div>
      </div>

      {/* PROFILE */}
      <section style={{ background: 'var(--black)', padding: '80px 40px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>
          <div style={{ position: 'relative', aspectRatio: '3/4', overflow: 'hidden' }}>
            <img
              src="https://zubericup.com/meya.jpg"
              alt="Meya Zuberi Abdallah Kidumo"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div style={{
              position: 'absolute', inset: 0, border: '2px solid var(--gold)',
              transform: 'translate(12px, 12px)', pointerEvents: 'none',
            }} />
          </div>
          <div>
            <div className="section-label">Kuhusu Meya</div>
            <h2 className="section-title">KIONGOZI WA <span>MOSHI</span></h2>
            <div className="gold-line"></div>

            <p className="body-text">
              Mhe. Eng. Zuberi Abdallah Kidumo ni Mstahiki Meya wa Manispaa ya Moshi, mkoa wa Kilimanjaro. Ni mhandisi aliyebobea katika maendeleo ya miundombinu na aliyeweka misingi ya maendeleo katika wilaya yake.
            </p>
            <p className="body-text">
              Kama kiongozi anayependa michezo na maendeleo ya vijana, alianzisha Zuberi Cup mwaka 2021 kwa lengo la kutoa fursa kwa vijana wa Kilimanjaro kucheza mpira wa miguu kwa viwango vya juu.
            </p>
            <p className="body-text">
              Chini ya uongozi wake, mchuano umekua kutoka timu 16 mwaka wa kwanza hadi timu 40 msimu wa 2025, ukivutia mashabiki zaidi ya 1,000 kila mwaka.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '32px' }}>
              {[
                { val: '5', key: 'Misimu ya Mchuano' },
                { val: '40', key: 'Timu 2025' },
                { val: '1000+', key: 'Mashabiki' },
                { val: '2021', key: 'Mwaka wa Kuanzishwa' },
              ].map(s => (
                <div key={s.key} className="venue-stat">
                  <div className="venue-stat-val">{s.val}</div>
                  <div className="venue-stat-key">{s.key}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* GALLERY from meya events */}
      <section style={{ background: 'var(--dark)', padding: '80px 40px' }}>
        <div className="container">
          <div className="section-label">Matukio</div>
          <h2 className="section-title">PICHA ZA <span>MEYA - MDHAMINI MKUU WA MASHINDANO.</span></h2>
        </div>
        <div style={{ maxWidth: '1200px', margin: '40px auto 0', display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '3px' }}>
          {[
            { src: 'https://zubericup.com/Mstahikimeya.jpg', cap: 'Mstahiki Meya akisimama na timu' },
            { src: 'https://zubericup.com/Meyanakombe.jpg', cap: 'Meya na Kombe la Ushindi' },
            { src: 'https://zubericup.com/meyanamarafiki2.jpg', cap: 'Meya na mashabiki' },
            { src: 'https://zubericup.com/keki.jpg', cap: 'Ufunguzi Rasmi' },
            { src: 'https://zubericup.com/wadau.jpg', cap: 'Mkutano wa Wadau' },
            { src: 'https://zubericup.com/washindi.jpg', cap: 'Ushindi wa Afro Boys FC' },
          ].map((g, i) => (
            <div key={i} className="gallery-item" style={{ height: '260px' }}>
              <img src={g.src} alt={g.cap} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div className="gallery-caption"><p>{g.cap}</p></div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </>
  );
}
