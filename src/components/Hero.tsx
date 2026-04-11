import Link from 'next/link';

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-bg"></div>
      <div className="hero-pitch"></div>
      <svg className="hero-mountain" viewBox="0 0 900 200" fill="white" xmlns="http://www.w3.org/2000/svg">
        <polygon points="450,10 560,120 680,90 780,130 900,130 900,200 0,200 0,130 120,130 220,90 340,120" />
      </svg>
      <div className="hero-content">
        <div className="hero-eyebrow">Kilimanjaro Region · Msimu wa Sita · 2026</div>
        <h1 className="hero-title">ZUBERI<br /><span>CUP</span></h1>
        <p className="hero-subtitle">Mchuano mkuu unaoleta timu bora zaidi za Kilimanjaro</p>
        <div className="hero-btns">
          <Link className="btn-primary" href="/makundi">Angalia Msimamo</Link>
          <a className="btn-secondary" href="#live-matches">🔴 Mechi za Live</a>
        </div>
      </div>
      <div className="scroll-hint">
        <span>Soma zaidi</span>
        <div className="scroll-line"></div>
      </div>
    </section>
  );
}
