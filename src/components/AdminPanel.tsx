'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import type { Match } from '@/lib/supabase';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminPanel({ isOpen, onClose }: AdminPanelProps) {
  const [token, setToken] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [pwError, setPwError] = useState(false);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(false);

  // New match form state
  const [newMatch, setNewMatch] = useState({
    team_a: '', team_b: '', score_a: 0, score_b: 0, minute: 0, status: 'upcoming', venue: 'Uwanja wa Railway'
  });

  // Scorer inputs per match
  const [scorerInputs, setScorerInputs] = useState<Record<number, { name: string; minute: string }>>({});

  const pwInputRef = useRef<HTMLInputElement>(null);

  const loadMatches = useCallback(async (tok: string) => {
    const res = await fetch('/api/matches', { headers: { 'x-admin-token': tok } });
    if (res.ok) setMatches(await res.json());
  }, []);

  useEffect(() => {
    if (isOpen && !token) setTimeout(() => pwInputRef.current?.focus(), 100);
    if (isOpen && token) loadMatches(token);
  }, [isOpen, token, loadMatches]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.ctrlKey && e.shiftKey && e.key === 'A') isOpen ? onClose() : undefined;
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  const handleLogin = async () => {
    setLoading(true);
    const res = await fetch('/api/admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    setLoading(false);
    if (res.ok) {
      const { token: tok } = await res.json();
      setToken(tok);
      setPwError(false);
    } else {
      setPwError(true);
      setTimeout(() => setPwError(false), 2000);
    }
  };

  const saveMatch = async (m: Match) => {
    await fetch(`/api/matches/${m.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'x-admin-token': token! },
      body: JSON.stringify({
        team_a: m.team_a, team_b: m.team_b,
        score_a: m.score_a, score_b: m.score_b,
        minute: m.minute, status: m.status, venue: m.venue,
      }),
    });
    loadMatches(token!);
  };

  const deleteMatch = async (id: number) => {
    if (!confirm('Futa mechi hii?')) return;
    await fetch(`/api/matches/${id}`, {
      method: 'DELETE',
      headers: { 'x-admin-token': token! },
    });
    loadMatches(token!);
  };

  const addGoal = async (matchId: number, side: 'A' | 'B') => {
    const input = scorerInputs[matchId] || { name: '', minute: '0' };
    const m = matches.find(x => x.id === matchId);
    await fetch('/api/scorers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-token': token! },
      body: JSON.stringify({
        match_id: matchId,
        team_side: side,
        player_name: input.name || 'Mshambuliaji',
        minute: parseInt(input.minute) || m?.minute || 0,
      }),
    });
    setScorerInputs(prev => ({ ...prev, [matchId]: { name: '', minute: '0' } }));
    loadMatches(token!);
  };

  const removeScorer = async (scorerId: number) => {
    await fetch(`/api/scorers?id=${scorerId}`, {
      method: 'DELETE',
      headers: { 'x-admin-token': token! },
    });
    loadMatches(token!);
  };

  const addMatch = async () => {
    if (!newMatch.team_a || !newMatch.team_b) return;
    await fetch('/api/matches', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-token': token! },
      body: JSON.stringify(newMatch),
    });
    setNewMatch({ team_a: '', team_b: '', score_a: 0, score_b: 0, minute: 0, status: 'upcoming', venue: 'Uwanja wa Railway' });
    loadMatches(token!);
  };

  const updateLocalMatch = (id: number, field: string, value: string | number) => {
    setMatches(prev => prev.map(m => m.id === id ? { ...m, [field]: value } : m));
  };

  if (!isOpen) return null;

  return (
    <div id="admin-overlay" className="visible" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div id="admin-panel">
        <button className="admin-close" onClick={onClose}>✕</button>

        {!token ? (
          /* LOGIN SCREEN */
          <div id="admin-login">
            <div className="admin-pw-title">🔐 ADMIN ACCESS</div>
            <div style={{ fontFamily: 'Barlow Condensed', fontSize: '12px', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--grey)', marginBottom: '8px' }}>
              Ingiza Nywila
            </div>
            <input
              ref={pwInputRef}
              id="admin-pw-input"
              type="password"
              placeholder="••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              style={{ borderColor: pwError ? 'var(--red)' : undefined }}
            />
            <button className="btn-admin primary" onClick={handleLogin} disabled={loading}>
              {loading ? 'Inaangalia...' : 'Ingia'}
            </button>
            {pwError && <div className="admin-pw-error" style={{ display: 'block' }}>Nywila si sahihi</div>}
          </div>
        ) : (
          /* ADMIN CONTENT */
          <div id="admin-content">
            <div className="admin-title">⚽ UDHIBITI WA MECHI</div>
            <div className="admin-subtitle">Zuberi Cup 2025 · Live Match Control</div>

            <div className="admin-matches">
              {matches.map((m, idx) => {
                const scInput = scorerInputs[m.id] || { name: '', minute: String(m.minute) };
                const scA = (m.scorers || []).filter(s => s.team_side === 'A');
                const scB = (m.scorers || []).filter(s => s.team_side === 'B');
                return (
                  <div key={m.id} className="admin-match-row">
                    <div className="admin-match-label">MECHI {idx + 1} · ID {m.id}</div>
                    <div className="admin-fields">
                      <div className="admin-field">
                        <label>Timu A</label>
                        <input type="text" value={m.team_a} onChange={e => updateLocalMatch(m.id, 'team_a', e.target.value)} />
                      </div>
                      <div className="admin-field">
                        <label>Goli A</label>
                        <input type="number" value={m.score_a} min={0} onChange={e => updateLocalMatch(m.id, 'score_a', +e.target.value)} />
                      </div>
                      <div className="admin-field">
                        <label>Goli B</label>
                        <input type="number" value={m.score_b} min={0} onChange={e => updateLocalMatch(m.id, 'score_b', +e.target.value)} />
                      </div>
                      <div className="admin-field">
                        <label>Timu B</label>
                        <input type="text" value={m.team_b} onChange={e => updateLocalMatch(m.id, 'team_b', e.target.value)} />
                      </div>
                      <div className="admin-field">
                        <label>Dakika</label>
                        <input type="number" value={m.minute} min={0} max={120} onChange={e => updateLocalMatch(m.id, 'minute', +e.target.value)} />
                      </div>
                      <div className="admin-field">
                        <label>Hali</label>
                        <select value={m.status} onChange={e => updateLocalMatch(m.id, 'status', e.target.value)}>
                          <option value="upcoming">Inakuja</option>
                          <option value="live">LIVE</option>
                          <option value="ft">Imekwisha</option>
                        </select>
                      </div>
                    </div>

                    <div className="admin-bottom-row">
                      <button className="btn-admin primary" onClick={() => saveMatch(m)}>💾 Hifadhi</button>
                      <button className="btn-admin danger" onClick={() => deleteMatch(m.id)}>🗑 Futa Mechi</button>
                    </div>

                    {/* Goal logger */}
                    <div style={{ marginTop: '16px' }}>
                      <div style={{ fontFamily: 'Barlow Condensed', fontSize: '10px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--grey)', marginBottom: '8px' }}>
                        ONGEZA GOLI
                      </div>
                      <div className="admin-goal-input">
                        <div className="admin-field">
                          <label>Jina la Mpiga Goli</label>
                          <input
                            type="text"
                            placeholder="J. Mwangi"
                            value={scInput.name}
                            onChange={e => setScorerInputs(prev => ({ ...prev, [m.id]: { ...scInput, name: e.target.value } }))}
                          />
                        </div>
                        <div className="admin-field">
                          <label>Dakika</label>
                          <input
                            type="number"
                            value={scInput.minute}
                            min={1}
                            max={120}
                            onChange={e => setScorerInputs(prev => ({ ...prev, [m.id]: { ...scInput, minute: e.target.value } }))}
                          />
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                        <button className="btn-admin green" onClick={() => addGoal(m.id, 'A')}>⚽ Goli — {m.team_a}</button>
                        <button className="btn-admin green" onClick={() => addGoal(m.id, 'B')}>⚽ Goli — {m.team_b}</button>
                      </div>
                    </div>

                    {/* Scorer log */}
                    {(scA.length > 0 || scB.length > 0) && (
                      <div className="goal-log" style={{ marginTop: '12px' }}>
                        <div style={{ fontFamily: 'Barlow Condensed', fontSize: '10px', letterSpacing: '2px', color: 'var(--grey)', marginBottom: '4px' }}>
                          MAGOLI YALIYOORODHESHWA:
                        </div>
                        {[...scA, ...scB].sort((a, b) => a.minute - b.minute).map(s => (
                          <div key={s.id} className="goal-log-item">
                            <span className="goal-log-min">{s.minute}&apos;</span>
                            {s.player_name} ({s.team_side})
                            <button className="goal-log-remove" onClick={() => removeScorer(s.id)}>×</button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <hr className="admin-divider" />

            {/* Add new match */}
            <div style={{ fontFamily: 'Barlow Condensed', fontSize: '11px', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '14px' }}>
              ONGEZA MECHI MPYA
            </div>
            <div className="admin-fields">
              <div className="admin-field">
                <label>Timu A</label>
                <input type="text" placeholder="Eagle FC" value={newMatch.team_a} onChange={e => setNewMatch(p => ({ ...p, team_a: e.target.value }))} />
              </div>
              <div className="admin-field">
                <label>Goli A</label>
                <input type="number" value={newMatch.score_a} min={0} onChange={e => setNewMatch(p => ({ ...p, score_a: +e.target.value }))} />
              </div>
              <div className="admin-field">
                <label>Goli B</label>
                <input type="number" value={newMatch.score_b} min={0} onChange={e => setNewMatch(p => ({ ...p, score_b: +e.target.value }))} />
              </div>
              <div className="admin-field">
                <label>Timu B</label>
                <input type="text" placeholder="Pasua FC" value={newMatch.team_b} onChange={e => setNewMatch(p => ({ ...p, team_b: e.target.value }))} />
              </div>
              <div className="admin-field">
                <label>Dakika</label>
                <input type="number" value={newMatch.minute} min={0} max={120} onChange={e => setNewMatch(p => ({ ...p, minute: +e.target.value }))} />
              </div>
              <div className="admin-field">
                <label>Hali</label>
                <select value={newMatch.status} onChange={e => setNewMatch(p => ({ ...p, status: e.target.value }))}>
                  <option value="upcoming">Inakuja</option>
                  <option value="live">LIVE</option>
                  <option value="ft">Imekwisha</option>
                </select>
              </div>
            </div>
            <div style={{ marginTop: '12px' }}>
              <button className="btn-admin green" onClick={addMatch}>+ Ongeza Mechi</button>
            </div>
            <div className="admin-hint">* Bonyeza Ctrl+Shift+A au Double-click logo kufungua/kufunga panel hii</div>
          </div>
        )}
      </div>
    </div>
  );
}
