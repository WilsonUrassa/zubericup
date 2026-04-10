import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import { createServiceClient } from '@/lib/supabase-server';

export const revalidate = 60;

interface TeamStat {
  team: string;
  p: number; w: number; d: number; l: number;
  gf: number; ga: number; gd: number; pts: number;
}

async function getStandings(): Promise<TeamStat[]> {
  try {
    const db = createServiceClient();
    const { data: matches } = await db
      .from('matches')
      .select('team_a,team_b,score_a,score_b,status')
      .eq('status', 'ft');

    const table: Record<string, TeamStat> = {};
    const ensure = (name: string) => {
      if (!table[name]) table[name] = { team: name, p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0 };
    };

    (matches || []).forEach((m) => {
      ensure(m.team_a);
      ensure(m.team_b);
      const a = table[m.team_a];
      const b = table[m.team_b];
      a.p++; b.p++;
      a.gf += m.score_a; a.ga += m.score_b;
      b.gf += m.score_b; b.ga += m.score_a;
      if (m.score_a > m.score_b) { a.w++; a.pts += 3; b.l++; }
      else if (m.score_b > m.score_a) { b.w++; b.pts += 3; a.l++; }
      else { a.d++; b.d++; a.pts++; b.pts++; }
    });

    return Object.values(table)
      .map(t => ({ ...t, gd: t.gf - t.ga }))
      .sort((a, b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf);
  } catch {
    return [];
  }
}

// ── Tournament data from zubericup.com/makundi ──
const round16 = [
  { date: '30/08/2025', home: 'Msobibo',         away: 'Shirimatunda FC',  winner: 'Msobibo' },
  { date: '31/08/2025', home: 'Mandela Rangers',  away: 'Afro Boys FC',    winner: 'Afro Boys FC' },
  { date: '01/09/2025', home: 'Msaranga FC',      away: 'La Familia FC',   winner: 'Msaranga FC' },
  { date: '02/09/2025', home: 'KIA Sports FC',    away: 'KCMC',            winner: 'KCMC' },
  { date: '03/09/2025', home: 'Pasua Big Stars',  away: 'Machava FC',      winner: 'Pasua Big Stars' },
  { date: '04/09/2025', home: 'Kili Wonders',     away: 'Matindigani FC',  winner: 'Kili Wonders' },
  { date: '05/09/2025', home: 'Green Eagles',     away: 'Kili Big Stars FC',winner: 'Green Eagles' },
  { date: '06/09/2025', home: 'Hugos FC',         away: 'Bogini FC',       winner: 'Hugos FC' },
];

const quarterFinals = [
  { date: '07/09/2025', home: 'Msobibo FC',    away: 'Msaranga FC',    winner: 'Msaranga FC' },
  { date: '08/09/2025', home: 'Afro Boys FC',  away: 'KCMC FC',        winner: 'Afro Boys FC' },
  { date: '09/09/2025', home: 'Pasua BS FC',   away: 'Green Eagle FC', winner: 'Pasua BS FC' },
  { date: '10/09/2025', home: 'Kili Wonders FC',away: 'Hugos FC',      winner: 'Kili Wonders FC' },
];

const semiFinals = [
  { date: '14/09/2025', home: 'Msaranga FC',  away: 'Pasua BS',        winner: 'Pasua BS' },
  { date: '15/09/2025', home: 'Afro Boys FC', away: 'Kili Wonders FC', winner: 'Afro Boys FC' },
];

const finals = [
  { place: '3rd',   date: '25/09/2025', home: 'Msaranga FC',   away: 'Kili Wonders FC', winner: 'Msaranga FC',  label: 'MSHINDI WA TATU' },
  { place: 'final', date: '26/09/2025', home: 'Afro Boys FC',  away: 'Pasua BS FC',     winner: 'Afro Boys FC', label: 'FAINALI' },
];

type MatchType = { date: string; home: string; away: string; winner: string };

function MatchCard({ m, highlight }: { m: MatchType; highlight?: boolean }) {
  const homeWon = m.winner === m.home;
  const awayWon = m.winner === m.away;
  return (
    <div style={{
      background: highlight ? 'rgba(200,168,75,0.08)' : 'rgba(255,255,255,0.03)',
      border: highlight ? '1px solid rgba(200,168,75,0.4)' : '1px solid rgba(255,255,255,0.06)',
      padding: '14px 18px',
      transition: 'border-color 0.2s',
    }}>
      <div style={{ fontSize: '10px', color: 'rgba(200,168,75,0.7)', letterSpacing: '0.14em', marginBottom: '10px', fontFamily: 'Barlow Condensed' }}>
        📅 {m.date}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {/* Home */}
        <div style={{
          flex: 1, textAlign: 'right',
          fontFamily: 'Barlow Condensed', fontSize: '14px', letterSpacing: '0.06em',
          fontWeight: homeWon ? 800 : 400,
          color: homeWon ? '#c8a84b' : 'rgba(255,255,255,0.55)',
          textTransform: 'uppercase',
        }}>
          {m.home}
        </div>
        {/* VS pill */}
        <div style={{
          flexShrink: 0,
          background: 'rgba(255,255,255,0.06)',
          color: 'rgba(255,255,255,0.3)',
          fontSize: '10px', fontWeight: 800, letterSpacing: '0.1em',
          padding: '4px 10px',
          fontFamily: 'Bebas Neue',
        }}>VS</div>
        {/* Away */}
        <div style={{
          flex: 1, textAlign: 'left',
          fontFamily: 'Barlow Condensed', fontSize: '14px', letterSpacing: '0.06em',
          fontWeight: awayWon ? 800 : 400,
          color: awayWon ? '#c8a84b' : 'rgba(255,255,255,0.55)',
          textTransform: 'uppercase',
        }}>
          {m.away}
        </div>
      </div>
      {/* Winner tag */}
      <div style={{ textAlign: 'center', marginTop: '10px' }}>
        <span style={{
          display: 'inline-block',
          background: 'rgba(200,168,75,0.15)',
          color: '#c8a84b',
          fontSize: '9px', fontWeight: 800, letterSpacing: '0.18em',
          textTransform: 'uppercase',
          padding: '3px 10px',
          fontFamily: 'Barlow Condensed',
        }}>
          ✓ {m.winner}
        </span>
      </div>
    </div>
  );
}

function RoundSection({ title, eyebrow, matches, cols = 2 }: {
  title: string; eyebrow: string; matches: MatchType[]; cols?: number;
}) {
  return (
    <div style={{ marginBottom: '64px' }}>
      {/* Round header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '28px' }}>
        <div style={{ flex: 1, height: '1px', background: 'rgba(200,168,75,0.2)' }} />
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '10px', color: '#c8a84b', letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: 'Barlow Condensed', marginBottom: '4px' }}>{eyebrow}</div>
          <div style={{ fontFamily: 'Bebas Neue', fontSize: '28px', color: '#fff', letterSpacing: '0.06em' }}>{title}</div>
        </div>
        <div style={{ flex: 1, height: '1px', background: 'rgba(200,168,75,0.2)' }} />
      </div>
      {/* Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gap: '12px',
      }}>
        {matches.map((m, i) => (
          <MatchCard key={i} m={m} />
        ))}
      </div>
    </div>
  );
}

export default async function MakundiPage() {
  const standings = await getStandings();

  return (
    <>
      <Nav />

      <style>{`
        @media (max-width: 700px) {
          .bracket-grid-2 { grid-template-columns: 1fr !important; }
          .bracket-grid-4 { grid-template-columns: 1fr 1fr !important; }
          .podium-row { flex-direction: column !important; align-items: center !important; }
        }
      `}</style>

      <div className="page-hero">
        <div className="container">
          <div className="section-label">Mchuano wa Kilimanjaro 2026</div>
          <h1 className="section-title">MSIMAMO WA <span>TIMU</span></h1>
          <p className="body-text">Jedwali la msimamo na matokeo ya mechi zote za Zuberi Cup 2025.</p>
        </div>
      </div>

      {/* ── STANDINGS TABLE ── */}
      <section style={{ background: 'var(--black)', padding: '80px 40px 40px' }}>
        <div className="container">
          <div style={{ marginBottom: '40px' }}>
            <div className="section-label">Jedwali la Msimamo</div>
            <h2 className="section-title">MSIMAMO <span>2025</span></h2>
          </div>

          {standings.length === 0 ? (
            <p style={{ color: 'var(--grey)', fontFamily: 'Barlow Condensed', letterSpacing: '2px' }}>
              Bado hakuna mechi zilizokamilika. Angalia tena baadaye.
            </p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'Barlow Condensed' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--gold-dark)', color: 'var(--gold)', fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase' }}>
                    <th style={{ textAlign: 'left', padding: '12px 16px' }}>#</th>
                    <th style={{ textAlign: 'left', padding: '12px 16px' }}>Timu</th>
                    <th style={{ padding: '12px 16px' }}>P</th>
                    <th style={{ padding: '12px 16px' }}>W</th>
                    <th style={{ padding: '12px 16px' }}>D</th>
                    <th style={{ padding: '12px 16px' }}>L</th>
                    <th style={{ padding: '12px 16px' }}>GF</th>
                    <th style={{ padding: '12px 16px' }}>GA</th>
                    <th style={{ padding: '12px 16px' }}>GD</th>
                    <th style={{ padding: '12px 16px', color: 'var(--gold)' }}>PTS</th>
                  </tr>
                </thead>
                <tbody>
                  {standings.map((t, i) => (
                    <tr
                      key={t.team}
                      style={{
                        background: i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent',
                        borderBottom: '1px solid rgba(255,255,255,0.05)',
                        color: i === 0 ? 'var(--gold)' : 'var(--cream)',
                        fontSize: '15px',
                        fontWeight: i < 4 ? 700 : 400,
                      }}
                    >
                      <td style={{ padding: '14px 16px', color: 'var(--grey)' }}>{i + 1}</td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{
                            width: 32, height: 32, borderRadius: '50%', background: 'var(--green)',
                            display: 'grid', placeItems: 'center', fontSize: '12px', color: 'var(--gold)',
                            fontFamily: 'Bebas Neue', flexShrink: 0, border: '1px solid rgba(232,180,22,0.3)'
                          }}>
                            {t.team.split(' ').map((w: string) => w[0]).join('').slice(0, 3)}
                          </div>
                          {t.team}
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'center' }}>{t.p}</td>
                      <td style={{ padding: '14px 16px', textAlign: 'center', color: 'var(--green-light)' }}>{t.w}</td>
                      <td style={{ padding: '14px 16px', textAlign: 'center', color: 'var(--grey)' }}>{t.d}</td>
                      <td style={{ padding: '14px 16px', textAlign: 'center', color: 'var(--red)' }}>{t.l}</td>
                      <td style={{ padding: '14px 16px', textAlign: 'center' }}>{t.gf}</td>
                      <td style={{ padding: '14px 16px', textAlign: 'center' }}>{t.ga}</td>
                      <td style={{ padding: '14px 16px', textAlign: 'center', color: t.gd >= 0 ? 'var(--green-light)' : 'var(--red)' }}>
                        {t.gd > 0 ? '+' : ''}{t.gd}
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'center', fontFamily: 'Bebas Neue', fontSize: '22px', color: 'var(--gold)' }}>{t.pts}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div style={{ marginTop: '48px', display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
            {[
              { color: 'var(--gold)', label: 'Mabingwa / Champions League' },
              { color: 'var(--green-light)', label: 'Nafasi ya Mbele' },
              { color: 'var(--red)', label: 'Hatarini kushuka' },
            ].map(leg => (
              <div key={leg.label} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: 12, height: 12, background: leg.color, borderRadius: 2 }}></div>
                <span style={{ fontFamily: 'Barlow Condensed', fontSize: '12px', letterSpacing: '1px', color: 'var(--grey)' }}>{leg.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TOURNAMENT BRACKET ── */}
      <section style={{ background: '#050709', padding: '80px 40px' }}>
        <div className="container">

          {/* Section header */}
          <div style={{ marginBottom: '64px', textAlign: 'center' }}>
            <div className="section-label">Matokeo ya Mechi Zote</div>
            <h2 className="section-title">MCHANGANUO WA <span>MASHINDANO</span></h2>
            <p className="body-text" style={{ maxWidth: '500px', margin: '16px auto 0' }}>
              Njia yote ya ushindi — kuanzia Raundi ya 16 hadi Fainali ya Zuberi Cup 2025.
            </p>
          </div>

          {/* Round of 16 */}
          <div style={{ marginBottom: '64px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '28px' }}>
              <div style={{ flex: 1, height: '1px', background: 'rgba(200,168,75,0.2)' }} />
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '10px', color: '#c8a84b', letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: 'Barlow Condensed', marginBottom: '4px' }}>Hatua ya Kwanza</div>
                <div style={{ fontFamily: 'Bebas Neue', fontSize: '28px', color: '#fff', letterSpacing: '0.06em' }}>RAUNDI YA 16</div>
              </div>
              <div style={{ flex: 1, height: '1px', background: 'rgba(200,168,75,0.2)' }} />
            </div>
            <div className="bracket-grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
              {round16.map((m, i) => (
                <div key={i} style={{
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  padding: '14px 16px',
                }}>
                  <div style={{ fontSize: '9px', color: 'rgba(200,168,75,0.6)', letterSpacing: '0.14em', marginBottom: '10px', fontFamily: 'Barlow Condensed' }}>
                    Mechi {i + 1} · {m.date}
                  </div>
                  <div style={{ fontFamily: 'Barlow Condensed', fontSize: '13px', letterSpacing: '0.05em', textTransform: 'uppercase', fontWeight: m.winner === m.home ? 800 : 400, color: m.winner === m.home ? '#c8a84b' : 'rgba(255,255,255,0.5)', marginBottom: '6px' }}>
                    {m.home}
                  </div>
                  <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.2)', fontFamily: 'Bebas Neue', letterSpacing: '0.1em', marginBottom: '6px' }}>VS</div>
                  <div style={{ fontFamily: 'Barlow Condensed', fontSize: '13px', letterSpacing: '0.05em', textTransform: 'uppercase', fontWeight: m.winner === m.away ? 800 : 400, color: m.winner === m.away ? '#c8a84b' : 'rgba(255,255,255,0.5)', marginBottom: '10px' }}>
                    {m.away}
                  </div>
                  <div style={{ background: 'rgba(200,168,75,0.1)', color: '#c8a84b', fontSize: '9px', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', padding: '3px 8px', display: 'inline-block', fontFamily: 'Barlow Condensed' }}>
                    ✓ {m.winner}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quarter Finals */}
          <div style={{ marginBottom: '64px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '28px' }}>
              <div style={{ flex: 1, height: '1px', background: 'rgba(200,168,75,0.2)' }} />
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '10px', color: '#c8a84b', letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: 'Barlow Condensed', marginBottom: '4px' }}>Hatua ya Pili</div>
                <div style={{ fontFamily: 'Bebas Neue', fontSize: '28px', color: '#fff', letterSpacing: '0.06em' }}>ROBO FAINALI — 8 BORA</div>
              </div>
              <div style={{ flex: 1, height: '1px', background: 'rgba(200,168,75,0.2)' }} />
            </div>
            <div className="bracket-grid-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', maxWidth: '800px', margin: '0 auto' }}>
              {quarterFinals.map((m, i) => <MatchCard key={i} m={m} />)}
            </div>
          </div>

          {/* Semi Finals */}
          <div style={{ marginBottom: '64px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '28px' }}>
              <div style={{ flex: 1, height: '1px', background: 'rgba(200,168,75,0.2)' }} />
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '10px', color: '#c8a84b', letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: 'Barlow Condensed', marginBottom: '4px' }}>Hatua ya Tatu</div>
                <div style={{ fontFamily: 'Bebas Neue', fontSize: '28px', color: '#fff', letterSpacing: '0.06em' }}>NUSU FAINALI</div>
              </div>
              <div style={{ flex: 1, height: '1px', background: 'rgba(200,168,75,0.2)' }} />
            </div>
            <div className="bracket-grid-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', maxWidth: '700px', margin: '0 auto' }}>
              {semiFinals.map((m, i) => <MatchCard key={i} m={m} />)}
            </div>
          </div>

          {/* Finals */}
          <div style={{ marginBottom: '64px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '28px' }}>
              <div style={{ flex: 1, height: '1px', background: 'rgba(200,168,75,0.2)' }} />
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '10px', color: '#c8a84b', letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: 'Barlow Condensed', marginBottom: '4px' }}>Hatua ya Mwisho</div>
                <div style={{ fontFamily: 'Bebas Neue', fontSize: '28px', color: '#fff', letterSpacing: '0.06em' }}>MECHI ZA MWISHO</div>
              </div>
              <div style={{ flex: 1, height: '1px', background: 'rgba(200,168,75,0.2)' }} />
            </div>
            <div className="bracket-grid-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', maxWidth: '700px', margin: '0 auto' }}>
              {finals.map((m, i) => (
                <div key={i} style={{
                  background: i === 1 ? 'rgba(200,168,75,0.1)' : 'rgba(255,255,255,0.03)',
                  border: i === 1 ? '1px solid rgba(200,168,75,0.5)' : '1px solid rgba(255,255,255,0.06)',
                  padding: '18px',
                  position: 'relative',
                }}>
                  {i === 1 && (
                    <div style={{
                      position: 'absolute', top: '-1px', left: '50%', transform: 'translateX(-50%)',
                      background: '#c8a84b', color: '#080b0f',
                      fontSize: '9px', fontWeight: 900, letterSpacing: '0.14em',
                      textTransform: 'uppercase', padding: '4px 14px',
                      fontFamily: 'Barlow Condensed',
                    }}>🏆 {m.label}</div>
                  )}
                  {i === 0 && (
                    <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.14em', textTransform: 'uppercase', fontFamily: 'Barlow Condensed', marginBottom: '10px' }}>
                      {m.label}
                    </div>
                  )}
                  <div style={{ marginTop: i === 1 ? '18px' : '0' }}>
                    <div style={{ fontSize: '10px', color: 'rgba(200,168,75,0.7)', letterSpacing: '0.14em', marginBottom: '10px', fontFamily: 'Barlow Condensed' }}>
                      📅 {m.date}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ flex: 1, textAlign: 'right', fontFamily: 'Barlow Condensed', fontSize: '14px', letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: m.winner === m.home ? 800 : 400, color: m.winner === m.home ? '#c8a84b' : 'rgba(255,255,255,0.55)' }}>
                        {m.home}
                      </div>
                      <div style={{ flexShrink: 0, background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.3)', fontSize: '10px', fontWeight: 800, padding: '4px 10px', fontFamily: 'Bebas Neue' }}>VS</div>
                      <div style={{ flex: 1, fontFamily: 'Barlow Condensed', fontSize: '14px', letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: m.winner === m.away ? 800 : 400, color: m.winner === m.away ? '#c8a84b' : 'rgba(255,255,255,0.55)' }}>
                        {m.away}
                      </div>
                    </div>
                    <div style={{ textAlign: 'center', marginTop: '10px' }}>
                      <span style={{ display: 'inline-block', background: 'rgba(200,168,75,0.15)', color: '#c8a84b', fontSize: '9px', fontWeight: 800, letterSpacing: '0.18em', textTransform: 'uppercase', padding: '3px 10px', fontFamily: 'Barlow Condensed' }}>
                        ✓ {m.winner}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── PODIUM ── */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(200,168,75,0.08), rgba(200,168,75,0.02))',
            border: '1px solid rgba(200,168,75,0.3)',
            padding: '48px 32px',
            textAlign: 'center',
            marginTop: '32px',
          }}>
            <div style={{ fontSize: '10px', color: '#c8a84b', letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: 'Barlow Condensed', marginBottom: '8px' }}>Matokeo ya Mwisho</div>
            <div style={{ fontFamily: 'Bebas Neue', fontSize: '14px', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em', marginBottom: '40px' }}>ZUBERI CUP 2025 — ORODHA YA USHINDI</div>

            <div className="podium-row" style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
              {[
                { pos: '🥇', rank: '1', label: 'MABINGWA', team: 'AFRO BOYS FC', gold: true },
                { pos: '🥈', rank: '2', label: 'WAPILI', team: 'PASUA BS FC', gold: false },
                { pos: '🥉', rank: '3', label: 'WATATU', team: 'MSARANGA FC', gold: false },
                { pos: '4️⃣', rank: '4', label: 'WA NNE', team: 'KILI WONDERS FC', gold: false },
              ].map((p) => (
                <div key={p.rank} style={{
                  background: p.gold ? 'rgba(200,168,75,0.15)' : 'rgba(255,255,255,0.03)',
                  border: p.gold ? '1px solid rgba(200,168,75,0.6)' : '1px solid rgba(255,255,255,0.08)',
                  padding: '28px 24px',
                  minWidth: '160px',
                  textAlign: 'center',
                }}>
                  <div style={{ fontSize: '32px', marginBottom: '8px' }}>{p.pos}</div>
                  <div style={{ fontSize: '9px', color: p.gold ? '#c8a84b' : 'rgba(255,255,255,0.4)', letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: 'Barlow Condensed', marginBottom: '8px' }}>{p.label}</div>
                  <div style={{ fontFamily: 'Bebas Neue', fontSize: p.gold ? '22px' : '18px', color: p.gold ? '#c8a84b' : 'rgba(255,255,255,0.8)', letterSpacing: '0.05em' }}>{p.team}</div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      <Footer />
    </>
  );
}