'use client';
import { useState, useEffect, useCallback } from 'react';
import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import LiveMatches from '@/components/LiveMatches';
import Footer from '@/components/Footer';
import AdminPanel from '@/components/AdminPanel';
import type { Match, NewsItem } from '@/lib/supabase';
import Image from 'next/image';
import Link from 'next/link';

interface HomeClientProps {
  initialMatches: Match[];
  initialNews: NewsItem[];
}

export default function HomeClient({ initialMatches, initialNews }: HomeClientProps) {
  const [adminOpen, setAdminOpen] = useState(false);

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

  return (
    <>
      <Nav onAdminOpen={openAdmin} />
      <AdminPanel isOpen={adminOpen} onClose={closeAdmin} />

      <Hero />

      {/* STATS BAR */}
      <div className="stats-bar">
        <div className="stat-item">
          <div className="stat-num">5</div>
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
          <div className="stat-num">2025</div>
          <div className="stat-lbl">Msimu</div>
        </div>
      </div>

      {/* LIVE MATCHES */}
      <LiveMatches initialMatches={initialMatches} />

      {/* CHAMPION BANNER */}
      <div className="champion-banner">
        <div className="champion-eyebrow">🏆 Mabingwa wa Zuberi Cup 2025</div>
        <div className="champion-name">AFRO BOYS <span>FC</span></div>
        <div className="champion-sub">Wachukua Ubingwa · Msimu wa Tano</div>
      </div>

      {/* NEWS */}
      <section className="news-section">
        <div className="container">
          <div className="section-label">Habari za Hivi Karibuni</div>
          <h2 className="section-title">MATUKIO <span>MAZURI</span></h2>
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

      {/* GALLERY */}
      <section className="gallery-section">
        <div className="container">
          <div className="section-label">Picha za Mchuano</div>
          <h2 className="section-title">MATUKIO YA <span>KUMBUKUMBU</span></h2>
        </div>
        <div className="gallery-grid" style={{ maxWidth: '1200px', margin: '40px auto 0' }}>
          {[
            { src: 'https://zubericup.com/Uwanjarailway.jpg', cap: 'Uwanja wa Railway — Makao Makuu ya Mchuano' },
            { src: 'https://zubericup.com/Meyanakombe.jpg', cap: 'Meya Eng. Zuberi Kidumo na Kombe la Ushindi' },
            { src: 'https://zubericup.com/Umahiri.jpg', cap: 'Umahiri wa Kucheza Boli' },
            { src: 'https://zubericup.com/wadau.jpg', cap: 'Viongozi wa Vilabu — Mkutano wa Ufunguzi' },
            { src: 'https://zubericup.com/keki.jpg', cap: 'Ufunguzi Rasmi wa Mashindano' },
            { src: 'https://zubericup.com/Mstahikimeya.jpg', cap: 'Mstahiki Meya Eng. Zuberi Abdallah Kidumo' },
            { src: 'https://zubericup.com/meyanamarafiki2.jpg', cap: 'Mashabiki wakipata Burudani' },
          ].map((g, i) => (
            <div key={i} className="gallery-item">
              <img src={g.src} alt={g.cap} />
              <div className="gallery-caption"><p>{g.cap}</p></div>
            </div>
          ))}
        </div>
      </section>

      {/* VENUE */}
      <section className="venue-section">
        <div className="venue-img-wrap">
          <img src="https://zubericup.com/Uwanjarailway3.jpg" alt="Uwanja wa Railway" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <div className="venue-info">
          <div className="section-label">Uwanja Mkuu</div>
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
              <div className="venue-stat-val">5+</div>
              <div className="venue-stat-key">Misimu ya Mchuano</div>
            </div>
            <div className="venue-stat">
              <div className="venue-stat-val">KILILIMANJARO</div>
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
            Mchuano unaodhaminiwa na Mhe. Meya Zuberi Abdallah Kidumo na wenzake wanaopenda kuendeleza michezo na talanta za vijana wa Kilimanjaro.
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
