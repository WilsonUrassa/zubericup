'use client';
import { useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface NavProps {
  onAdminOpen?: () => void;
}

export default function Nav({ onAdminOpen }: NavProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogoDoubleClick = useCallback(() => {
    onAdminOpen?.();
  }, [onAdminOpen]);

  return (
    <>
      <nav>
        <div className="nav-logo" onDoubleClick={handleLogoDoubleClick} title="Double-click for admin">
          <Image
            src="https://zubericup.com/logo.png"
            alt="Zuberi Cup"
            width={44}
            height={44}
            style={{ borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--gold)' }}
          />
          <div className="nav-brand">Zuberi Cup</div>
        </div>

        <ul className="nav-links">
          <li><Link href="/">Nyumbani</Link></li>
          <li><Link href="/makundi">Msimamo</Link></li>
          <li><a href="#live-matches">Matokeo Live</a></li>
          <li><Link href="/meya">Meya</Link></li>
        </ul>

        <Link className="nav-cta" href="/jazafomu">Jaza Fomu</Link>

        <button
          className="nav-hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </nav>

      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        <Link href="/" onClick={() => setMenuOpen(false)}>Nyumbani</Link>
        <Link href="/makundi" onClick={() => setMenuOpen(false)}>Msimamo</Link>
        <a href="#live-matches" onClick={() => setMenuOpen(false)}>Matokeo Live</a>
        <Link href="/meya" onClick={() => setMenuOpen(false)}>Meya</Link>
        <Link href="/jazafomu" onClick={() => setMenuOpen(false)}>Jaza Fomu</Link>
      </div>
    </>
  );
}
