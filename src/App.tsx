import { useMemo, useState } from 'react';
import './App.css';
import { HORSES } from './data/horses';
import { loadHistory, loadOwnedIds, saveHistory, saveOwnedIds, type DrawHistory } from './lib/storage';

type Tab = 'home' | 'draw' | 'collection';
type CollectionFilter = 'all' | 'owned' | 'locked';

function App() {
  const [tab, setTab] = useState<Tab>('home');
  const [filter, setFilter] = useState<CollectionFilter>('all');
  const [ownedIds, setOwnedIds] = useState<string[]>(() => loadOwnedIds());
  const [history, setHistory] = useState<DrawHistory[]>(() => loadHistory());
  const [lastDrawnId, setLastDrawnId] = useState<string | null>(null);
  const [lastWasNew, setLastWasNew] = useState(false);

  const progress = Math.round((ownedIds.length / HORSES.length) * 100);

  const lastDrawnHorse = useMemo(
    () => HORSES.find((h) => h.id === lastDrawnId) ?? null,
    [lastDrawnId],
  );

  const filteredHorses = useMemo(() => {
    if (filter === 'owned') return HORSES.filter((h) => ownedIds.includes(h.id));
    if (filter === 'locked') return HORSES.filter((h) => !ownedIds.includes(h.id));
    return HORSES;
  }, [filter, ownedIds]);

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
    <main className="mobile-app">
      <header className="top-header">
        <h1>🐴 말 뽑기 도감</h1>
        <p>픽셀 포니 20종을 모아보세요</p>
      </header>

      {tab === 'home' && (
        <section className="screen">
          <article className="card hero-card">
            <img src={lastDrawnHorse?.image ?? HORSES[0].image} alt="대표 말" />
            <div>
              <h2>{lastDrawnHorse?.name ?? '오늘의 포니'}</h2>
              <p>뽑기로 새로운 말을 모으고 도감을 완성해보세요.</p>
            </div>
          </article>

          <article className="card progress-card">
            <div className="progress-head">
              <strong>수집률</strong>
              <span>
                {ownedIds.length}/{HORSES.length}
              </span>
            </div>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
          </article>

          <button className="primary-btn" onClick={() => setTab('draw')}>
            말 뽑기 시작
          </button>
          <button className="secondary-btn" onClick={() => setTab('collection')}>
            도감 보기
          </button>
        </section>
      )}

      {tab === 'draw' && (
        <section className="screen">
          <article className="card result-card">
            {lastDrawnHorse ? (
              <>
                <img src={lastDrawnHorse.image} alt={lastDrawnHorse.name} />
                <h2>{lastDrawnHorse.name}</h2>
                <p className={`badge ${lastWasNew ? 'new' : 'dup'}`}>
                  {lastWasNew ? '신규 획득!' : '중복 획득'}
                </p>
              </>
            ) : (
              <>
                <img src={HORSES[0].image} alt="기본 말" />
                <h2>아직 뽑은 말이 없어요</h2>
                <p className="hint">아래 버튼으로 첫 뽑기를 진행해보세요.</p>
              </>
            )}
          </article>

          <button className="primary-btn" onClick={drawHorse}>
            한 번 뽑기 🎲
          </button>

          <article className="card history-card">
            <h3>최근 뽑기</h3>
            <ul>
              {history.slice(0, 5).map((h, i) => {
                const horse = HORSES.find((x) => x.id === h.id);
                if (!horse) return null;
                return (
                  <li key={`${h.drawnAt}-${i}`}>
                    <span>{horse.name}</span>
                    <time>{new Date(h.drawnAt).toLocaleTimeString('ko-KR')}</time>
                  </li>
                );
              })}
              {history.length === 0 && <li className="empty">아직 기록이 없습니다.</li>}
            </ul>
          </article>

          <button className="danger-btn" onClick={resetData}>
            데이터 초기화
          </button>
        </section>
      )}

      {tab === 'collection' && (
        <section className="screen">
          <article className="card progress-card">
            <div className="progress-head">
              <strong>도감 진행도</strong>
              <span>
                {ownedIds.length}/{HORSES.length}
              </span>
            </div>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
          </article>

          <div className="filter-tabs">
            <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>
              전체
            </button>
            <button className={filter === 'owned' ? 'active' : ''} onClick={() => setFilter('owned')}>
              획득
            </button>
            <button className={filter === 'locked' ? 'active' : ''} onClick={() => setFilter('locked')}>
              미획득
            </button>
          </div>

          <section className="collection-grid">
            {filteredHorses.map((horse) => {
              const owned = ownedIds.includes(horse.id);
              return (
                <article key={horse.id} className={`horse-card ${owned ? 'owned' : 'locked'}`}>
                  <img src={horse.image} alt={horse.name} />
                  <strong>{owned ? horse.name : '?????'}</strong>
                </article>
              );
            })}
          </section>
        </section>
      )}

      <nav className="bottom-nav">
        <button className={tab === 'home' ? 'active' : ''} onClick={() => setTab('home')}>
          홈
        </button>
        <button className={tab === 'draw' ? 'active' : ''} onClick={() => setTab('draw')}>
          뽑기
        </button>
        <button className={tab === 'collection' ? 'active' : ''} onClick={() => setTab('collection')}>
          도감
        </button>
      </nav>
    </main>
  );
}

export default App;
