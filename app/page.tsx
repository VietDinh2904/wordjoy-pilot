'use client';

import { useEffect, useMemo, useState } from 'react';
import { Check, ChevronRight, Headphones, Home, Library, Medal, Menu, Play, RotateCcw, Sparkles, SpellCheck, Star, Users, Volume2, X, Zap } from 'lucide-react';

type GameId = 'listen' | 'spell' | 'team';
type AgeId = 'all' | '3-5' | '6-8' | '9-12';

const words = [
  { word: 'CAT', emoji: '🐱', color: '#ffe5d2' },
  { word: 'DOG', emoji: '🐶', color: '#d9f0ff' },
  { word: 'BIRD', emoji: '🐦', color: '#dcf7e8' },
  { word: 'FISH', emoji: '🐠', color: '#ede3ff' },
];

const templates = [
  { id: 'listen' as GameId, title: 'Nghe & Chọn', kicker: '3–5 tuổi', desc: 'Nghe từ và chạm vào hình đúng.', icon: Headphones, color: '#2878ff', soft: '#eaf2ff' },
  { id: 'spell' as GameId, title: 'Ghép Chữ', kicker: '6–8 tuổi', desc: 'Xếp chữ cái thành từ hoàn chỉnh.', icon: SpellCheck, color: '#ef6d46', soft: '#fff0e9' },
  { id: 'team' as GameId, title: 'Đấu Trường', kicker: '9–12 tuổi', desc: 'Quiz nhanh cho hai đội cùng chơi.', icon: Users, color: '#6e4bd8', soft: '#f0ebff' },
];

const ages: { id: AgeId; label: string }[] = [
  { id: 'all', label: 'Tất cả' }, { id: '3-5', label: '3–5 tuổi' }, { id: '6-8', label: '6–8 tuổi' }, { id: '9-12', label: '9–12 tuổi' },
];

function speak(word: string) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(word.toLowerCase());
  utterance.lang = 'en-US';
  utterance.rate = 0.72;
  window.speechSynthesis.speak(utterance);
}

export default function HomePage() {
  const [game, setGame] = useState<GameId>('listen');
  const [age, setAge] = useState<AgeId>('all');
  const [stars, setStars] = useState(12);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem('wordjoy-stars');
    if (saved) setStars(Number(saved));
  }, []);

  useEffect(() => {
    const context = (document as Document & {
      modelContext?: {
        registerTool: (tool: unknown, options?: { signal?: AbortSignal }) => void | Promise<void>;
      };
    }).modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();
    void Promise.resolve(context.registerTool({
      name: 'start_english_game',
      title: 'Bắt đầu game tiếng Anh',
      description: 'Chọn một mẫu game và nhóm tuổi rồi hiển thị game đó trong WordJoy.',
      inputSchema: {
        type: 'object',
        properties: {
          game: { type: 'string', enum: ['listen', 'spell', 'team'] },
          age: { type: 'string', enum: ['all', '3-5', '6-8', '9-12'] },
        },
        required: ['game', 'age'],
        additionalProperties: false,
      },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      execute(input: unknown) {
        const value = input as { game?: GameId; age?: AgeId };
        if (!templates.some((item) => item.id === value.game) || !ages.some((item) => item.id === value.age)) {
          throw new Error('Game hoặc nhóm tuổi không hợp lệ.');
        }
        setGame(value.game!);
        setAge(value.age!);
        return { game: value.game, age: value.age, status: 'ready' };
      },
    }, { signal: lifecycle.signal })).catch(() => undefined);
    return () => lifecycle.abort();
  }, []);

  const reward = (amount = 1) => setStars((current) => {
    const next = current + amount;
    window.localStorage.setItem('wordjoy-stars', String(next));
    return next;
  });

  const visibleTemplates = useMemo(() => age === 'all' ? templates : templates.filter((item) => item.kicker.startsWith(age.replace('-', '–'))), [age]);

  return (
    <main className="app-shell">
      <aside className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="brand">
          <div className="brand-mark">W</div>
          <div><strong>WordJoy</strong><span>English playground</span></div>
          <button className="icon-button sidebar-close" onClick={() => setSidebarOpen(false)} aria-label="Đóng menu"><X size={20} /></button>
        </div>
        <nav aria-label="Điều hướng chính">
          <button className="nav-item active"><Home size={19} />Trang chơi</button>
          <button className="nav-item"><Library size={19} />Bộ bài của tôi</button>
          <button className="nav-item"><Medal size={19} />Thành tích</button>
        </nav>
        <div className="sidebar-note">
          <div className="note-icon"><Sparkles size={20} /></div>
          <strong>Pilot nhẹ & nhanh</strong><p>Một bộ từ chạy được trên nhiều mẫu game.</p>
        </div>
        <div className="profile"><div className="avatar">AN</div><div><strong>An Nhiên</strong><span>Học viên nhỏ</span></div><ChevronRight size={18} /></div>
      </aside>
      {sidebarOpen && <button className="scrim" aria-label="Đóng menu" onClick={() => setSidebarOpen(false)} />}

      <section className="workspace">
        <header className="topbar">
          <button className="icon-button menu-button" onClick={() => setSidebarOpen(true)} aria-label="Mở menu"><Menu size={22} /></button>
          <div className="breadcrumb"><span>Khám phá</span><ChevronRight size={15} /><strong>Animal Friends</strong></div>
          <div className="star-pill"><Star size={17} fill="currentColor" /><strong>{stars}</strong><span>sao</span></div>
        </header>

        <div className="content">
          <section className="welcome-card">
            <img src="/wordjoy-hero.png" alt="Các bạn nhỏ học tiếng Anh qua trò chơi" />
            <div className="welcome-copy"><span className="eyebrow">HỌC 10 PHÚT MỖI NGÀY</span><h1>Chơi một chút.<br />Giỏi lên mỗi ngày.</h1><p>Chọn trò chơi phù hợp và bắt đầu ngay với bộ từ <strong>Animal Friends</strong>.</p></div>
          </section>

          <div className="section-heading">
            <div><span className="section-kicker">3 MẪU GAME</span><h2>Chọn cách chơi</h2></div>
            <div className="age-filters" aria-label="Lọc theo độ tuổi">
              {ages.map((item) => <button key={item.id} className={age === item.id ? 'selected' : ''} onClick={() => setAge(item.id)}>{item.label}</button>)}
            </div>
          </div>

          <div className="template-grid">
            {visibleTemplates.map((item) => {
              const Icon = item.icon;
              return <button key={item.id} className={`template-card ${game === item.id ? 'chosen' : ''}`} style={{ '--accent': item.color, '--soft': item.soft } as React.CSSProperties} onClick={() => setGame(item.id)}>
                <span className="template-icon"><Icon size={24} /></span><span className="template-copy"><small>{item.kicker}</small><strong>{item.title}</strong><span>{item.desc}</span></span><span className="play-circle"><Play size={17} fill="currentColor" /></span>
              </button>;
            })}
          </div>
          <GameStage game={game} reward={reward} stars={stars} />
        </div>
      </section>
    </main>
  );
}

function GameStage({ game, reward, stars }: { game: GameId; reward: (amount?: number) => void; stars: number }) {
  const selected = templates.find((item) => item.id === game)!;
  const Icon = selected.icon;
  return <section className="game-stage" style={{ '--game-accent': selected.color, '--game-soft': selected.soft } as React.CSSProperties}>
    <div className="game-toolbar"><div className="game-title"><span><Icon size={20} /></span><div><small>ĐANG CHƠI</small><h2>{selected.title}</h2></div></div><div className="deck-pill"><span>🐾</span><div><small>BỘ BÀI</small><strong>Animal Friends · 4 từ</strong></div></div></div>
    {game === 'listen' && <ListenGame reward={reward} />}{game === 'spell' && <SpellGame reward={reward} />}{game === 'team' && <TeamGame reward={reward} />}
    <div className="progress-line"><span style={{ width: `${Math.min(100, 28 + stars * 2)}%` }} /></div>
  </section>;
}

function ListenGame({ reward }: { reward: (amount?: number) => void }) {
  const [target, setTarget] = useState(0);
  const [result, setResult] = useState<'idle' | 'right' | 'wrong'>('idle');
  const choose = (index: number) => {
    if (result === 'right') return;
    if (index === target) { setResult('right'); reward(2); } else setResult('wrong');
  };
  const next = () => { setTarget((current) => (current + 1) % words.length); setResult('idle'); };
  return <div className="play-area">
    <div className="prompt-panel"><span className="round-badge">CÂU {target + 1} / 4</span><h3>Con nghe thấy từ nào?</h3><button className="sound-button" onClick={() => speak(words[target].word)}><Volume2 size={28} /><span>Nghe lại</span></button><p>Nhấn nút loa, sau đó chọn hình đúng.</p></div>
    <div className="answer-area"><div className="picture-grid">{words.map((item, index) => <button key={item.word} className={`picture-option ${result === 'right' && index === target ? 'correct' : ''}`} style={{ background: item.color }} onClick={() => choose(index)} aria-label={item.word}><span>{item.emoji}</span><strong>{item.word}</strong>{result === 'right' && index === target && <i><Check size={16} /></i>}</button>)}</div>
      <div className={`feedback ${result}`}>{result === 'idle' && <><Zap size={18} /> Chọn một đáp án để ghi sao!</>}{result === 'wrong' && <><RotateCcw size={18} /> Gần đúng rồi, thử lại nhé!</>}{result === 'right' && <><Star size={18} fill="currentColor" /> Tuyệt vời! +2 sao <button onClick={next}>Câu tiếp <ChevronRight size={16} /></button></>}</div>
    </div>
  </div>;
}

function SpellGame({ reward }: { reward: (amount?: number) => void }) {
  const rounds = ['CAT', 'DOG', 'BIRD', 'FISH'];
  const [round, setRound] = useState(0);
  const [built, setBuilt] = useState('');
  const target = rounds[round];
  const letters = useMemo(() => target.split('').sort(() => 0.5 - Math.random()), [target]);
  const done = built === target;
  const add = (letter: string) => { if (built.length >= target.length) return; const next = built + letter; setBuilt(next); if (next === target) reward(3); };
  const next = () => { setRound((round + 1) % rounds.length); setBuilt(''); };
  return <div className="spell-area"><div className="spell-picture">{words[round].emoji}</div><p>Sắp xếp các chữ cái để viết tên con vật.</p><div className="word-slots">{target.split('').map((_, index) => <span key={index} className={built[index] ? 'filled' : ''}>{built[index] || ''}</span>)}</div><div className="letter-bank">{letters.map((letter, index) => <button key={`${letter}-${index}`} onClick={() => add(letter)}>{letter}</button>)}</div><button className="clear-word" onClick={() => setBuilt('')}><RotateCcw size={15} /> Làm lại</button><div className={`feedback ${done ? 'right' : 'idle'}`}>{done ? <><Star size={18} fill="currentColor" /> Chính xác! +3 sao <button onClick={next}>Từ tiếp <ChevronRight size={16} /></button></> : <><SpellCheck size={18} /> Chạm vào từng chữ cái theo đúng thứ tự.</>}</div></div>;
}

function TeamGame({ reward }: { reward: (amount?: number) => void }) {
  const [scores, setScores] = useState([2, 1]);
  const [team, setTeam] = useState(0);
  const [answered, setAnswered] = useState(false);
  const answer = (correct: boolean) => { if (answered) return; setAnswered(true); if (correct) { setScores((current) => current.map((score, index) => index === team ? score + 1 : score)); reward(1); } };
  return <div className="team-area"><div className="scoreboard">{['Team Sun', 'Team Sky'].map((name, index) => <button key={name} className={team === index ? 'current' : ''} onClick={() => !answered && setTeam(index)}><span>{index === 0 ? '☀️' : '☁️'}</span><div><small>{name}</small><strong>{scores[index]}</strong></div></button>)}</div><div className="quiz-card"><span className="round-badge">LƯỢT CỦA {team === 0 ? 'TEAM SUN' : 'TEAM SKY'}</span><h3>Which animal can fly?</h3><div className="quiz-options">{['Cat', 'Bird', 'Fish', 'Dog'].map((option) => <button key={option} onClick={() => answer(option === 'Bird')} className={answered && option === 'Bird' ? 'correct' : ''}>{option}</button>)}</div>{answered && <button className="next-question" onClick={() => setAnswered(false)}>Câu mới <ChevronRight size={17} /></button>}</div></div>;
}
