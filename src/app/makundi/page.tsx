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

export default async function MakundiPage() {
  const standings = await getStandings();

  return (
    <>
      <Nav />
      <div className="page-hero">
        <div className="container">
          <div className="section-label">Mchuano wa Kilimanjaro 2025</div>
          <h1 className="section-title">MSIMAMO WA <span>TIMU</span></h1>
          <p className="body-text">Jedwali la msimamo la timu zote zinazoshiriki Zuberi Cup 2025.</p>
        </div>
      </div>

      <section style={{ background: 'var(--black)', padding: '80px 40px' }}>
        <div className="container">
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
                            {t.team.split(' ').map(w => w[0]).join('').slice(0, 3)}
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

      <Footer />
    </>
  );
}
