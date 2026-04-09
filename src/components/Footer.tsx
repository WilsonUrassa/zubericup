import Link from 'next/link';

export default function Footer() {
  return (
    <footer>
      <div className="footer-grid" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div>
          <div className="footer-brand-name">ZUBERI CUP</div>
          <div className="footer-brand-sub">Mchuano mkuu unaoleta pamoja timu bora za Kilimanjaro. Unaodhaminiwa na Meya Zuberi Abdallah Kidumo.</div>
        </div>
        <div>
          <div className="footer-col-title">Viungo</div>
          <ul className="footer-links">
            <li><Link href="/">Nyumbani</Link></li>
            <li><Link href="/makundi">Msimamo</Link></li>
            <li><Link href="/meya">Kuhusu Meya</Link></li>
            <li><Link href="/jazafomu">Jaza Fomu</Link></li>
          </ul>
        </div>
        <div>
          <div className="footer-col-title">Mchuano</div>
          <ul className="footer-links">
            <li><a href="#live-matches">Mechi za Leo</a></li>
            <li><Link href="/makundi">Msimamo wa Timu</Link></li>
            <li><Link href="/">Matokeo</Link></li>
          </ul>
        </div>
        <div>
          <div className="footer-col-title">Wasiliana</div>
          <ul className="footer-links">
            <li><a href="#">Moshi, Kilimanjaro</a></li>
            <li><a href="#">Uwanja wa Railway</a></li>
            <li><Link href="/jazafomu">Jaza Fomu</Link></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div className="footer-copy">© 2025 Zuberi Cup Tournament · Haki zote zimehifadhiwa</div>
        <div className="social-links">
          <a className="social-link" href="#" title="Facebook">f</a>
          <a className="social-link" href="#" title="Instagram">ig</a>
          <a className="social-link" href="#" title="YouTube">▶</a>
        </div>
      </div>
    </footer>
  );
}
