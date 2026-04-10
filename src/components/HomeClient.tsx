'use client';
import { useState, useEffect, useCallback } from 'react';
import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import LiveMatches from '@/components/LiveMatches';
import Footer from '@/components/Footer';
import AdminPanel from '@/components/AdminPanel';
import type { Match, NewsItem } from '@/lib/supabase';
import Link from 'next/link';

interface HomeClientProps {
  initialMatches: Match[];
  initialNews: NewsItem[];
}

export default function HomeClient({ initialMatches, initialNews }: HomeClientProps) {
  const [adminOpen, setAdminOpen] = useState(false);
  const [activeGallery, setActiveGallery] = useState<number | null>(null);

  const openAdmin = useCallback(() => setAdminOpen(true), []);
  const closeAdmin = useCallback(() => setAdminOpen(false), []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        setAdminOpen(prev => !prev);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  const featured = initialNews.find(n => n.featured);
  const rest = initialNews.filter(n => !n.featured).slice(0, 2);

  const galleryItems = [
    { src: 'https://zubericup.com/Uwanjarailway.jpg', cap: 'Uwanja wa Railway', sub: 'Makao Makuu ya Mchuano' },
    { src: 'https://zubericup.com/Meyanakombe.jpg', cap: 'Meya Eng. Zuberi Kidumo', sub: 'na Kombe la Ushindi' },
    { src: 'https://zubericup.com/Umahiri.jpg', cap: 'Umahiri wa Boli', sub: 'Kipaji cha Vijana wa Kilimanjaro' },
    { src: 'https://zubericup.com/wadau.jpg', cap: 'Viongozi wa Vilabu', sub: 'Mkutano wa Ufunguzi' },
    { src: 'https://zubericup.com/keki.jpg', cap: 'Ufunguzi Rasmi', sub: 'Mashindano ya Zuberi Cup' },
    { src: 'https://zubericup.com/Mstahikimeya.jpg', cap: 'Mstahiki Meya', sub: 'Eng. Zuberi Abdallah Kidumo' },
    { src: 'https://zubericup.com/meyanamarafiki2.jpg', cap: 'Mashabiki & Furaha', sub: 'Burudani ya Kweli' },
  ];

  return (
    <>
      <style>{`
        /* ── GALLERY ── */
        .gallery-section { padding: 100px 0; background: #080b0f; }
        .gallery-masonry {
          max-width: 1200px;
          margin: 56px auto 0;
          padding: 0 24px;
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          grid-auto-rows: 80px;
          gap: 12px;
        }
        .g-item { position: relative; overflow: hidden; cursor: pointer; }
        .g-item:nth-child(1) { grid-column: 1 / 7; grid-row: 1 / 5; }
        .g-item:nth-child(2) { grid-column: 7 / 10; grid-row: 1 / 4; }
        .g-item:nth-child(3) { grid-column: 10 / 13; grid-row: 1 / 4; }
        .g-item:nth-child(4) { grid-column: 7 / 10; grid-row: 4 / 7; }
        .g-item:nth-child(5) { grid-column: 10 / 13; grid-row: 4 / 7; }
        .g-item:nth-child(6) { grid-column: 1 / 5; grid-row: 5 / 8; }
        .g-item:nth-child(7) { grid-column: 5 / 13; grid-row: 5 / 8; }

        .g-item img {
          width: 100%; height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          filter: brightness(0.75);
        }
        .g-item:hover img { transform: scale(1.07); filter: brightness(0.55); }

        .g-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 55%);
          pointer-events: none;
        }
        .g-caption {
          position: absolute; bottom: 0; left: 0; right: 0;
          padding: 20px 18px 18px;
          transform: translateY(6px);
          transition: transform 0.4s ease;
        }
        .g-item:hover .g-caption { transform: translateY(0); }
        .g-caption-title {
          font-family: 'Fraunces', Georgia, serif;
          font-size: clamp(13px, 1.4vw, 17px);
          font-weight: 700;
          color: #fff;
          letter-spacing: 0.02em;
          line-height: 1.2;
        }
        .g-caption-sub {
          font-size: 11px;
          color: #c8a84b;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          margin-top: 4px;
          opacity: 0;
          transition: opacity 0.4s ease 0.1s;
        }
        .g-item:hover .g-caption-sub { opacity: 1; }
        .g-badge {
          position: absolute; top: 14px; left: 14px;
          background: #c8a84b;
          color: #080b0f;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          padding: 4px 10px;
          pointer-events: none;
        }
        .g-expand {
          position: absolute; top: 14px; right: 14px;
          width: 32px; height: 32px;
          border: 1.5px solid rgba(255,255,255,0.4);
          background: rgba(0,0,0,0.3);
          display: flex; align-items: center; justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: none;
        }
        .g-item:hover .g-expand { opacity: 1; }
        .g-expand svg { width: 14px; height: 14px; stroke: #fff; }

        @media (max-width: 768px) {
          .gallery-masonry {
            grid-template-columns: 1fr 1fr;
            grid-auto-rows: 200px;
          }
          .g-item:nth-child(1) { grid-column: 1 / 3; grid-row: auto; }
          .g-item:nth-child(n) { grid-column: auto; grid-row: auto; }
          .g-item:nth-child(odd):last-child { grid-column: 1 / 3; }
        }

        /* ── LIGHTBOX ── */
        .lightbox {
          position: fixed; inset: 0; z-index: 9999;
          background: rgba(0,0,0,0.95);
          display: flex; align-items: center; justify-content: center;
          animation: lbIn 0.25s ease;
        }
        @keyframes lbIn { from { opacity: 0 } to { opacity: 1 } }
        .lightbox img {
          max-width: 90vw; max-height: 85vh;
          object-fit: contain;
          border: 1px solid rgba(200,168,75,0.3);
        }
        .lightbox-close {
          position: fixed; top: 24px; right: 28px;
          font-size: 32px; color: #fff; cursor: pointer;
          opacity: 0.7; transition: opacity 0.2s;
          background: none; border: none;
          font-family: sans-serif; line-height: 1;
        }
        .lightbox-close:hover { opacity: 1; }
        .lightbox-cap {
          position: fixed; bottom: 32px; left: 50%; transform: translateX(-50%);
          text-align: center;
        }
        .lightbox-cap strong {
          display: block;
          font-family: 'Fraunces', Georgia, serif;
          color: #fff; font-size: 16px;
        }
        .lightbox-cap span {
          color: #c8a84b; font-size: 11px;
          letter-spacing: 0.12em; text-transform: uppercase;
        }
        .lightbox-nav {
          position: fixed; top: 50%; transform: translateY(-50%);
          background: rgba(200,168,75,0.15);
          border: 1px solid rgba(200,168,75,0.4);
          color: #c8a84b; font-size: 22px;
          width: 48px; height: 48px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: background 0.2s;
        }
        .lightbox-nav:hover { background: rgba(200,168,75,0.35); }
        .lightbox-prev { left: 20px; }
        .lightbox-next { right: 20px; }

        /* ── MANDELA SECTION ── */
        .mandela-section {
          padding: 100px 0;
          background: linear-gradient(170deg, #050709 0%, #0a0f15 50%, #050709 100%);
          position: relative;
          overflow: hidden;
        }
        .mandela-section::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, #c8a84b, transparent);
        }
        .mandela-section::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, #c8a84b, transparent);
        }
        .mandela-bg-text {
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          font-family: 'Fraunces', Georgia, serif;
          font-size: clamp(80px, 14vw, 200px);
          font-weight: 900;
          color: rgba(200,168,75,0.03);
          white-space: nowrap;
          pointer-events: none;
          letter-spacing: -0.02em;
        }
        .mandela-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
          position: relative;
          z-index: 1;
        }
        .mandela-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          align-items: center;
          margin-top: 64px;
        }
        @media (max-width: 900px) {
          .mandela-layout { grid-template-columns: 1fr; gap: 48px; }
        }
        .mandela-images {
          display: grid;
          grid-template-columns: 1fr 1fr;
          grid-template-rows: 260px 180px;
          gap: 10px;
        }
        .mandela-img-main {
          grid-column: 1 / 3;
          position: relative;
          overflow: hidden;
        }
        .mandela-img-a, .mandela-img-b {
          position: relative;
          overflow: hidden;
        }
        .mandela-img-main img,
        .mandela-img-a img,
        .mandela-img-b img {
          width: 100%; height: 100%;
          object-fit: cover;
          display: block;
          filter: brightness(0.65) saturate(0.85);
          transition: transform 0.6s ease, filter 0.4s ease;
        }
        .mandela-img-main:hover img,
        .mandela-img-a:hover img,
        .mandela-img-b:hover img {
          transform: scale(1.05);
          filter: brightness(0.8) saturate(1);
        }
        .mandela-img-tag {
          position: absolute; bottom: 12px; left: 12px;
          background: rgba(200,168,75,0.9);
          color: #080b0f;
          font-size: 9px; font-weight: 800;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          padding: 5px 12px;
        }
        .mandela-stamp {
          position: absolute; top: -1px; right: -1px;
          background: #c8a84b;
          color: #080b0f;
          font-size: 9px; font-weight: 900;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 6px 14px;
        }
        .mandela-content { }
        .mandela-eyebrow {
          display: inline-flex; align-items: center; gap: 10px;
          font-size: 10px; font-weight: 800;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #c8a84b;
          margin-bottom: 20px;
        }
        .mandela-eyebrow::before {
          content: '';
          width: 28px; height: 1px;
          background: #c8a84b;
        }
        .mandela-title {
          font-family: 'Fraunces', Georgia, serif;
          font-size: clamp(32px, 4vw, 52px);
          font-weight: 900;
          color: #fff;
          line-height: 1.05;
          letter-spacing: -0.01em;
          margin-bottom: 24px;
        }
        .mandela-title span { color: #c8a84b; }
        .mandela-divider {
          width: 48px; height: 3px;
          background: linear-gradient(90deg, #c8a84b, transparent);
          margin-bottom: 24px;
        }
        .mandela-text {
          color: rgba(255,255,255,0.65);
          font-size: 15px;
          line-height: 1.8;
          margin-bottom: 16px;
        }
        .mandela-progress {
          margin-top: 36px;
          display: flex; flex-direction: column; gap: 18px;
        }
        .mp-item { }
        .mp-header {
          display: flex; justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }
        .mp-label {
          font-size: 11px; font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.8);
        }
        .mp-pct {
          font-family: 'Fraunces', Georgia, serif;
          font-size: 14px; font-weight: 700;
          color: #c8a84b;
        }
        .mp-bar-bg {
          height: 4px;
          background: rgba(255,255,255,0.08);
          position: relative;
          overflow: hidden;
        }
        .mp-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #c8a84b, #e8c870);
          position: relative;
        }
        .mp-bar-fill::after {
          content: '';
          position: absolute;
          right: 0; top: 0; bottom: 0;
          width: 20px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4));
          animation: shimmer 2s ease-in-out infinite;
        }
        @keyframes shimmer {
          0%, 100% { opacity: 0 }
          50% { opacity: 1 }
        }
        .mandela-badges {
          display: flex; flex-wrap: wrap; gap: 10px;
          margin-top: 36px;
        }
        .m-badge {
          border: 1px solid rgba(200,168,75,0.3);
          color: rgba(255,255,255,0.7);
          font-size: 10px; font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 8px 16px;
          transition: all 0.2s;
        }
        .m-badge:hover {
          border-color: #c8a84b;
          color: #c8a84b;
          background: rgba(200,168,75,0.08);
        }
        .m-badge.active {
          background: #c8a84b;
          border-color: #c8a84b;
          color: #080b0f;
        }
      `}</style>

      <Nav onAdminOpen={openAdmin} />
      <AdminPanel isOpen={adminOpen} onClose={closeAdmin} />
      <Hero />

      {/* STATS BAR */}
      <div className="stats-bar">
        <div className="stat-item">
          <div className="stat-num">6</div>
          <div className="stat-lbl">Misimu</div>
        </div>
        <div className="stat-item">
          <div className="stat-num">16</div>
          <div className="stat-lbl">Timu</div>
        </div>
        <div className="stat-item">
          <div className="stat-num">1000+</div>
          <div className="stat-lbl">Mashabiki</div>
        </div>
        <div className="stat-item">
          <div className="stat-num">2026</div>
          <div className="stat-lbl">Msimu</div>
        </div>
      </div>

      {/* LIVE MATCHES */}
      <LiveMatches initialMatches={initialMatches} />

      {/* CHAMPION BANNER */}
      <div className="champion-banner">
        <div className="champion-eyebrow">🏆 Mabingwa wa Zuberi Cup 2025</div>
        <div className="champion-name">AFRO BOYS <span>FC</span></div>
        <div className="champion-sub">Wachukua Ubingwa · Msimu wa Tano · Zuberi Cup 2026 Inakuja!</div>
      </div>

      {/* NEWS */}
      <section className="news-section">
        <div className="container">
          <div className="section-label">Habari za Hivi Karibuni</div>
          <h2 className="section-title">MATUKIO <span>2026</span></h2>
        </div>
        <div className="news-grid" style={{ maxWidth: '1200px', margin: '40px auto 0' }}>
          {featured && (
            <div className="news-card featured">
              {featured.image_url && (
                <img className="news-img" src={featured.image_url} alt={featured.title} />
              )}
              <div className="news-overlay"></div>
              <div className="news-tag">{featured.tag}</div>
              <div className="news-meta">{featured.news_date}</div>
              <div className="news-headline">{featured.title}</div>
              <div className="news-desc">{featured.description}</div>
            </div>
          )}
          {rest.map(n => (
            <div key={n.id} className="news-card">
              {n.image_url && (
                <img className="news-img" src={n.image_url} alt={n.title} />
              )}
              <div className="news-overlay"></div>
              <div className="news-tag">{n.tag}</div>
              <div className="news-meta">{n.news_date}</div>
              <div className="news-headline">{n.title}</div>
              <div className="news-desc">{n.description}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── GALLERY ── */}
      <section className="gallery-section">
        <div className="container">
          <div className="section-label">Picha za Mchuano</div>
          <h2 className="section-title">MATUKIO YA <span>KUMBUKUMBU</span></h2>
        </div>

        <div className="gallery-masonry">
          {galleryItems.map((g, i) => (
            <div
              key={i}
              className="g-item"
              onClick={() => setActiveGallery(i)}
              role="button"
              aria-label={g.cap}
            >
              <img src={g.src} alt={g.cap} loading="lazy" />
              <div className="g-overlay" />
              {i === 0 && <div className="g-badge">Picha Kuu</div>}
              <div className="g-expand">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="2">
                  <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="g-caption">
                <div className="g-caption-title">{g.cap}</div>
                <div className="g-caption-sub">{g.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* LIGHTBOX */}
      {activeGallery !== null && (
        <div className="lightbox" onClick={() => setActiveGallery(null)}>
          <button className="lightbox-close" onClick={() => setActiveGallery(null)}>×</button>
          <button
            className="lightbox-nav lightbox-prev"
            onClick={e => { e.stopPropagation(); setActiveGallery((activeGallery - 1 + galleryItems.length) % galleryItems.length); }}
          >‹</button>
          <img
            src={galleryItems[activeGallery].src}
            alt={galleryItems[activeGallery].cap}
            onClick={e => e.stopPropagation()}
          />
          <button
            className="lightbox-nav lightbox-next"
            onClick={e => { e.stopPropagation(); setActiveGallery((activeGallery + 1) % galleryItems.length); }}
          >›</button>
          <div className="lightbox-cap">
            <strong>{galleryItems[activeGallery].cap}</strong>
            <span>{galleryItems[activeGallery].sub}</span>
          </div>
        </div>
      )}

      {/* ── MANDELA STADIUM SECTION ── */}
      <section className="mandela-section">
        <div className="mandela-bg-text">MANDELA</div>
        <div className="mandela-inner">
          <div className="container" style={{ padding: 0 }}>
            <div className="section-label">Miradi ya Miundombinu</div>
            <h2 className="section-title">UWANJA WA <span>MANDELA</span></h2>
          </div>

          <div className="mandela-layout">
            {/* Images side */}
            <div className="mandela-images">
              <div className="mandela-img-main">
                <img src="https://zubericup.com/Uwanjarailway3.jpg" alt="Uwanja wa Mandela - Mtazamo Mkuu" />
                <div className="mandela-img-tag">Mradi Mkuu · 2026</div>
                <div className="mandela-stamp">INAJENGWA</div>
              </div>
              <div className="mandela-img-a">
                <img src="https://zubericup.com/Uwanjarailway.jpg" alt="Viwango vya Kimataifa" />
                <div className="mandela-img-tag">Viwango vya FIFA</div>
              </div>
              <div className="mandela-img-b">
                <img src="https://zubericup.com/Mstahikimeya.jpg" alt="Meya Zuberi Kidumo" />
                <div className="mandela-img-tag">Msimamizi Mkuu</div>
              </div>
            </div>

            {/* Content side */}
            <div className="mandela-content">
              <div className="mandela-eyebrow">Ujenzi wa Hadhi ya Kimataifa</div>
              <h3 className="mandela-title">
                Tukiandaa<br />
                <span>Zuberi Cup 2026</span><br />
                kwa Ustawi
              </h3>
              <div className="mandela-divider" />
              <p className="mandela-text">
                Matengenezo makubwa ya Uwanja wa Mandela yanaendelea kwa kasi, 
                yakilenga kufikia viwango vya kimataifa na kuhakikisha Zuberi Cup 2026 
                inafanyika katika mazingira bora na ya kipekee.
              </p>
              <p className="mandela-text">
                Chini ya uongozi wa Mhe. Meya Eng. Zuberi Abdallah Kidumo na ufadhili 
                wa Raz Builders Construction Company, uwanja huu utakuwa kielelezo cha 
                maendeleo ya michezo katika Mkoa wa Kilimanjaro.
              </p>

              {/* Progress bars */}
              <div className="mandela-progress">
                <div className="mp-item">
                  <div className="mp-header">
                    <span className="mp-label">Ujenzi wa Msingi</span>
                    <span className="mp-pct">85%</span>
                  </div>
                  <div className="mp-bar-bg">
                    <div className="mp-bar-fill" style={{ width: '85%' }} />
                  </div>
                </div>
                <div className="mp-item">
                  <div className="mp-header">
                    <span className="mp-label">Viti vya Mashabiki</span>
                    <span className="mp-pct">60%</span>
                  </div>
                  <div className="mp-bar-bg">
                    <div className="mp-bar-fill" style={{ width: '60%' }} />
                  </div>
                </div>
                <div className="mp-item">
                  <div className="mp-header">
                    <span className="mp-label">Mwanga & Teknolojia</span>
                    <span className="mp-pct">40%</span>
                  </div>
                  <div className="mp-bar-bg">
                    <div className="mp-bar-fill" style={{ width: '40%' }} />
                  </div>
                </div>
              </div>

              {/* Feature badges */}
              <div className="mandela-badges">
                <span className="m-badge active">🏟 Uwezo: 5,000+</span>
                <span className="m-badge">⚽ Kiwango cha FIFA</span>
                <span className="m-badge">💡 Mwanga wa LED</span>
                <span className="m-badge">🎥 VAR Ready</span>
                <span className="m-badge">♿ Upatikanaji Wote</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VENUE — Railway */}
      <section className="venue-section">
        <div className="venue-img-wrap">
          <img src="https://zubericup.com/Uwanjarailway3.jpg" alt="Uwanja wa Railway" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <div className="venue-info">
          <div className="section-label">Uwanja Mkuu wa Sasa</div>
          <h2 className="section-title">UWANJA WA<br /><span>RAILWAY</span></h2>
          <div className="gold-line"></div>
          <p className="body-text">Uwanja wa Railway ndio uwanja mkuu unaotumika kwa mechi za muhimu za Zuberi Cup. Umekuwa ukishuhudia mechi nyingi za kumbukumbu tangu mwanzo wa mashindano.</p>
          <p className="body-text">Umekarabatiwa hivi karibuni kwa viwango vya kimataifa, ukihakikisha uzoefu bora kwa wachezaji na mashabiki wote.</p>
          <div className="venue-stats">
            <div className="venue-stat">
              <div className="venue-stat-val">1,000</div>
              <div className="venue-stat-key">Uwezo wa Watu</div>
            </div>
            <div className="venue-stat">
              <div className="venue-stat-val">Moshi</div>
              <div className="venue-stat-key">Manispaa</div>
            </div>
            <div className="venue-stat">
              <div className="venue-stat-val">6+</div>
              <div className="venue-stat-key">Misimu ya Mchuano</div>
            </div>
            <div className="venue-stat">
              <div className="venue-stat-val">KILIMANJARO</div>
              <div className="venue-stat-key">Mkoa wa Kilimanjaro</div>
            </div>
          </div>
        </div>
      </section>

      {/* SPONSOR */}
      <section className="sponsor-section">
        <div className="container">
          <div className="section-label">Wadhamini</div>
          <h2 className="section-title">WANAOTUSAIDIA <span>KUKUA</span></h2>
          <p className="body-text" style={{ maxWidth: '520px', margin: '0 auto', textAlign: 'center' }}>
            Mchuano unaodhaminiwa na Mhe. Meya Zuberi Abdallah Kidumo na wenzake wanaopenda kuendeleza michezo na talanta za vijana wa Kilimanjaro — kuelekea Zuberi Cup 2026.
          </p>
          <div className="sponsor-strip">
            <div className="sponsor-pill active">Meya Zuberi Kidumo</div>
            <div className="sponsor-pill">Raz Builders Construction Company</div>
            <div className="sponsor-pill">Enganarok Safaris</div>
            <div className="sponsor-pill">Wadau wa Michuanao</div>
          </div>
          <div style={{ marginTop: '48px' }}>
            <Link className="btn-primary" href="/jazafomu">Jiunge Nawe · Jaza Fomu Sasa</Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}