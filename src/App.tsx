import { useMemo, useState } from 'react';
import './App.css';
import { HORSES } from './data/horses';
import { loadHistory, loadOwnedIds, saveHistory, saveOwnedIds, type DrawHistory } from './lib/storage';

function App() {
  const [tab, setTab] = useState<'draw' | 'collection'>('draw');
  const [ownedIds, setOwnedIds] = useState<string[]>(() => loadOwnedIds());
  const [history, setHistory] = useState<DrawHistory[]>(() => loadHistory());
  const [lastDrawnId, setLastDrawnId] = useState<string | null>(null);
  const [lastWasNew, setLastWasNew] = useState(false);

  const lastDrawnHorse = useMemo(
    () => HORSES.find((h) => h.id === lastDrawnId) ?? null,
    [lastDrawnId],
  );

  const drawHorse = () => {
    const picked = HORSES[Math.floor(Math.random() * HORSES.length)];
    setLastDrawnId(picked.id);

    const isNew = !ownedIds.includes(picked.id);
    setLastWasNew(isNew);

    const nextHistory = [{ id: picked.id, drawnAt: new Date().toISOString() }, ...history].slice(0, 30);
    setHistory(nextHistory);
    saveHistory(nextHistory);

    if (isNew) {
      const nextOwned = [...ownedIds, picked.id];
      setOwnedIds(nextOwned);
      saveOwnedIds(nextOwned);
    }
  };

  const resetData = () => {
    if (!confirm('정말 초기화할까요? 도감/기록이 모두 삭제됩니다.')) return;
    setOwnedIds([]);
    setHistory([]);
    setLastDrawnId(null);
    setLastWasNew(false);
    saveOwnedIds([]);
    saveHistory([]);
  };

  return (
    <main className="container">
      <h1>🐴 말 뽑기 도감</h1>
      <p className="sub">총 {HORSES.length}종 · 획득 {ownedIds.length}종</p>

      <div className="tabs">
        <button className={tab === 'draw' ? 'active' : ''} onClick={() => setTab('draw')}>
          말 뽑기
        </button>
        <button className={tab === 'collection' ? 'active' : ''} onClick={() => setTab('collection')}>
          도감 보기
        </button>
      </div>

      {tab === 'draw' ? (
        <section className="panel">
          <button className="draw-btn" onClick={drawHorse}>말 뽑기 🎲</button>

          {lastDrawnHorse && (
            <article className="result-card">
              <img src={lastDrawnHorse.image} alt={lastDrawnHorse.name} />
              <h2>{lastDrawnHorse.name}</h2>
              <p>{lastWasNew ? '새로운 말을 획득했습니다!' : '이미 보유한 말입니다.'}</p>
            </article>
          )}

          <h3>최근 뽑기</h3>
          <ul className="history">
            {history.slice(0, 8).map((h, i) => {
              const horse = HORSES.find((x) => x.id === h.id);
              if (!horse) return null;
              return (
                <li key={`${h.drawnAt}-${i}`}>
                  {horse.name}
                  <span>{new Date(h.drawnAt).toLocaleString('ko-KR')}</span>
                </li>
              );
            })}
          </ul>

          <button className="reset-btn" onClick={resetData}>데이터 초기화</button>
        </section>
      ) : (
        <section className="grid panel">
          {HORSES.map((horse) => {
            const owned = ownedIds.includes(horse.id);
            return (
              <article key={horse.id} className={`horse-card ${owned ? 'owned' : 'locked'}`}>
                <img src={horse.image} alt={horse.name} />
                <strong>{owned ? horse.name : '?????'}</strong>
              </article>
            );
          })}
        </section>
      )}
    </main>
  );
}

export default App;
