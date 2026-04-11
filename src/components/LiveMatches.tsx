'use client';
import { useEffect, useState, useRef, useCallback } from 'react';
import { supabase, type Match, type Scorer } from '@/lib/supabase';

interface Toast {
  id: number;
  scorer: string;
  team: string;
  score: string;
  minute: number;
}

function getInitials(name: string) {
  return name.split(' ').map(w => w[0]).join('').slice(0, 3).toUpperCase();
}

function MatchCard({ match }: { match: Match }) {
  const scA = (match.scorers || []).filter((s: Scorer) => s.team_side === 'A');
  const scB = (match.scorers || []).filter((s: Scorer) => s.team_side === 'B');

  return (
    <div className={`match-card ${match.status === 'live' ? 'live-card' : ''}`}>
      <div className="card-top">
        <div className="card-competition">Zuberi Cup 2026</div>
        <div className={`card-status ${match.status}`}>
          {match.status === 'live' ? 'LIVE' : match.status === 'ft' ? 'FT' : 'INAKUJA'}
        </div>
      </div>
      <div className="card-body">
        <div className="team-block">
          <div className="team-crest">{getInitials(match.team_a)}</div>
          <div className="team-name">{match.team_a}</div>
        </div>
        <div className="score-block">
          <div className="score-num">{match.status === 'upcoming' ? '—' : match.score_a}</div>
          <div className="score-sep">:</div>
          <div className="score-num">{match.status === 'upcoming' ? '—' : match.score_b}</div>
        </div>
        <div className="team-block">
          <div className="team-crest">{getInitials(match.team_b)}</div>
          <div className="team-name">{match.team_b}</div>
        </div>
      </div>
      <div className="match-footer">
        <div className="match-venue">📍 {match.venue}</div>
        <div className={`match-minute ${match.status}`}>
          {match.status === 'live' ? `${match.minute}'` : match.status === 'ft' ? 'IMEKWISHA' : '—'}
        </div>
      </div>
      {(scA.length > 0 || scB.length > 0) && (
        <div className="scorers-row">
          <div className="scorers-side">
            {scA.map((s: Scorer) => (
              <div key={s.id} className="scorer-item">
                ⚽ {s.player_name} <span className="scorer-min">{s.minute}'</span>
              </div>
            ))}
          </div>
          <div className="scorers-side right">
            {scB.map((s: Scorer) => (
              <div key={s.id} className="scorer-item">
                <span className="scorer-min">{s.minute}'</span> {s.player_name} ⚽
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function LiveMatches({ initialMatches }: { initialMatches: Match[] }) {
  const [matches, setMatches] = useState<Match[]>(initialMatches);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastIdRef = useRef(0);
  const prevMatchesRef = useRef<Match[]>(initialMatches);

  const showToast = useCallback((scorer: string, team: string, score: string, minute: number) => {
    const id = ++toastIdRef.current;
    setToasts(prev => [...prev, { id, scorer, team, score, minute }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 5000);
  }, []);

  // Fetch full match list (with scorers joined)
  const refreshMatches = useCallback(async () => {
    const res = await fetch('/api/matches');
    if (!res.ok) return;
    const data: Match[] = await res.json();
    // Detect new goals
    prevMatchesRef.current.forEach(prev => {
      const curr = data.find(m => m.id === prev.id);
      if (!curr) return;
      if (curr.score_a > prev.score_a) {
        const lastScorer = (curr.scorers || []).filter((s: Scorer) => s.team_side === 'A').slice(-1)[0];
        showToast(lastScorer?.player_name || 'Mshambuliaji', curr.team_a, `${curr.team_a} ${curr.score_a}–${curr.score_b} ${curr.team_b}`, lastScorer?.minute || curr.minute);
      }
      if (curr.score_b > prev.score_b) {
        const lastScorer = (curr.scorers || []).filter((s: Scorer) => s.team_side === 'B').slice(-1)[0];
        showToast(lastScorer?.player_name || 'Mshambuliaji', curr.team_b, `${curr.team_a} ${curr.score_a}–${curr.score_b} ${curr.team_b}`, lastScorer?.minute || curr.minute);
      }
    });
    prevMatchesRef.current = data;
    setMatches(data);
  }, [showToast]);

  useEffect(() => {
    // Supabase realtime subscription
    const matchSub = supabase
      .channel('matches-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'matches' }, () => refreshMatches())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'scorers' }, () => refreshMatches())
      .subscribe();

    // Fallback polling every 10s
    const interval = setInterval(refreshMatches, 10000);

    return () => {
      supabase.removeChannel(matchSub);
      clearInterval(interval);
    };
  }, [refreshMatches]);

  const liveMatches = matches.filter(m => m.status === 'live');
  const tickerItems = liveMatches.length > 0
    ? liveMatches.map(m => `${m.team_a} ${m.score_a}–${m.score_b} ${m.team_b} (${m.minute}')`)
    : ['Hakuna mechi za live kwa sasa · Angalia ratiba hapa chini'];

  const tickerContent = [...tickerItems, ...tickerItems].join('   ⚽   ');

  return (
    <>
      {/* Toast container */}
      <div id="goal-toast-container">
        {toasts.map(t => (
          <div key={t.id} className="goal-toast">
            <div className="toast-ball">⚽</div>
            <div className="toast-scorer">{t.scorer}</div>
            <div className="toast-team">{t.team} · {t.minute}&apos;</div>
            <div className="toast-score">{t.score}</div>
          </div>
        ))}
      </div>

      <div id="live-matches">
        {/* Ticker */}
        <div className="live-ticker">
          <div className="ticker-label">⚽ LIVE</div>
          <div className="ticker-wrap">
            <div className="ticker-track">
              <span className="ticker-item">{tickerContent}</span>
              <span className="ticker-item">{tickerContent}</span>
            </div>
          </div>
        </div>

        <div className="live-section">
          <div className="live-header">
            <div className="live-title-block">
              <div className="section-label">Matokeo ya Sasa</div>
              <h2 className="section-title">MECHI ZA <span>LEO</span></h2>
            </div>
            <div className="live-badge">
              {liveMatches.length > 0 && <div className="live-dot"></div>}
              <div className="live-badge-text">{liveMatches.length > 0 ? 'LIVE' : 'IMEKWISHA'}</div>
            </div>
          </div>

          <div className="matches-grid">
            {matches.length === 0 ? (
              <div style={{ color: 'var(--grey)', fontFamily: 'Barlow Condensed', letterSpacing: '2px', padding: '40px 0' }}>
                Hakuna mechi zilizopangwa kwa leo.
              </div>
            ) : (
              matches.map(m => <MatchCard key={m.id} match={m} />)
            )}
          </div>

          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <p style={{ fontFamily: 'Barlow Condensed', fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--grey)' }}>
              Inasasishwa moja kwa moja 
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
