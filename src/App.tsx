import { useMemo, useState } from 'react';
import './App.css';
import { HORSES, type HorseRarity } from './data/horses';
import { loadHistory, loadOwnedIds, saveHistory, saveOwnedIds, type DrawHistory } from './lib/storage';

type Tab = 'home' | 'draw' | 'collection';
type CollectionFilter = 'all' | 'owned' | 'locked';
type RarityFilter = 'all' | HorseRarity;

const RARITY_LABELS: Record<HorseRarity, string> = {
  common: '일반',
  uncommon: '고급',
  rare: '희귀',
  epic: '영웅',
  legendary: '전설',
  mythic: '신화',
  celestial: '천상',
};

const RARITY_WEIGHTS: Array<{ rarity: HorseRarity; weight: number }> = [
  { rarity: 'common', weight: 36 },
  { rarity: 'uncommon', weight: 24 },
  { rarity: 'rare', weight: 17 },
  { rarity: 'epic', weight: 11 },
  { rarity: 'legendary', weight: 7 },
  { rarity: 'mythic', weight: 4 },
  { rarity: 'celestial', weight: 1 },
];

function App() {
  const [tab, setTab] = useState<Tab>('home');
  const [filter, setFilter] = useState<CollectionFilter>('all');
  const [rarityFilter, setRarityFilter] = useState<RarityFilter>('all');
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
    let list = HORSES;

    if (filter === 'owned') list = list.filter((h) => ownedIds.includes(h.id));
    if (filter === 'locked') list = list.filter((h) => !ownedIds.includes(h.id));
    if (rarityFilter !== 'all') list = list.filter((h) => h.rarity === rarityFilter);

    return list;
  }, [filter, ownedIds, rarityFilter]);

  const pickRarity = (): HorseRarity => {
    let point = Math.random() * 100;
    for (const { rarity, weight } of RARITY_WEIGHTS) {
      if (point < weight) return rarity;
      point -= weight;
    }
    return 'common';
  };

  const drawHorse = () => {
    const pickedRarity = pickRarity();
    const pool = HORSES.filter((horse) => horse.rarity === pickedRarity);
    const picked = pool[Math.floor(Math.random() * pool.length)] ?? HORSES[0];
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
        <p>픽셀 포니 100종을 모아보세요</p>
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
                <p className="hint">등급: {RARITY_LABELS[lastDrawnHorse.rarity]}</p>
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

          <label className="card" style={{ display: 'grid', gap: 8 }}>
            <strong>등급 필터</strong>
            <select value={rarityFilter} onChange={(e) => setRarityFilter(e.target.value as RarityFilter)}>
              <option value="all">전체 등급</option>
              {Object.entries(RARITY_LABELS).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </label>

          <section className="collection-grid">
            {filteredHorses.map((horse) => {
              const owned = ownedIds.includes(horse.id);
              return (
                <article key={horse.id} className={`horse-card ${owned ? 'owned' : 'locked'}`}>
                  <img src={horse.image} alt={horse.name} />
                  <strong>{owned ? horse.name : '?????'}</strong>
                  <small>{RARITY_LABELS[horse.rarity]}</small>
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
