'use client';

import { useEffect, useMemo, useState } from 'react';
import { Check, ChevronLeft, ChevronRight, Dices, Grid3X3, Headphones, Home, Layers3, Library, Link2, Medal, Menu, Play, RotateCcw, Sparkles, SpellCheck, Star, Users, Volume2, X, Zap } from 'lucide-react';

type GameId = 'listen' | 'spell' | 'team' | 'crossword' | 'flashcard' | 'snake' | 'board';
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
  { id: 'crossword' as GameId, title: 'Ô Chữ', kicker: '9–12 tuổi', desc: 'Điền tên con vật theo gợi ý.', icon: Grid3X3, color: '#0f9d7a', soft: '#e4f8f2' },
  { id: 'flashcard' as GameId, title: 'Thẻ Từ', kicker: '3–5 tuổi', desc: 'Lật thẻ, nghe và ghi nhớ từ.', icon: Layers3, color: '#df5b9a', soft: '#fdebf4' },
  { id: 'snake' as GameId, title: 'Rắn Nối Từ', kicker: '6–8 tuổi', desc: 'Nối từ mới bằng chữ cái cuối.', icon: Link2, color: '#44a83d', soft: '#eaf8e7' },
  { id: 'board' as GameId, title: 'Board Game', kicker: '6–12 tuổi', desc: 'Hai bàn cờ mẫu cho hai người.', icon: Dices, color: '#e79024', soft: '#fff3df' },
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
          game: { type: 'string', enum: ['listen', 'spell', 'team', 'crossword', 'flashcard', 'snake', 'board'] },
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

  const visibleTemplates = useMemo(() => age === 'all' ? templates : templates.filter((item) => item.kicker.startsWith(age.replace('-', '–')) || (item.id === 'board' && (age === '6-8' || age === '9-12'))), [age]);

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
            <div><span className="section-kicker">7 MẪU GAME</span><h2>Chọn cách chơi</h2></div>
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
    {game === 'listen' && <ListenGame reward={reward} />}
    {game === 'spell' && <SpellGame reward={reward} />}
    {game === 'team' && <TeamGame reward={reward} />}
    {game === 'crossword' && <CrosswordGame reward={reward} />}
    {game === 'flashcard' && <FlashcardGame reward={reward} />}
    {game === 'snake' && <WordSnakeGame reward={reward} />}
    {game === 'board' && <BoardGame reward={reward} />}
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

const crosswordCells: Record<string, string> = {
  '1-1': 'C', '1-2': 'A', '1-3': 'T',
  '2-3': 'I',
  '3-1': 'D', '3-2': 'O', '3-3': 'G',
  '4-3': 'E',
  '5-3': 'R',
};

function CrosswordGame({ reward }: { reward: (amount?: number) => void }) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'right' | 'wrong'>('idle');
  const check = () => {
    const correct = Object.entries(crosswordCells).every(([cell, letter]) => answers[cell] === letter);
    setStatus(correct ? 'right' : 'wrong');
    if (correct && status !== 'right') reward(5);
  };
  const reset = () => { setAnswers({}); setStatus('idle'); };
  return <div className="crossword-area">
    <div className="crossword-clues">
      <span className="round-badge">Ô CHỮ ANIMAL FRIENDS</span>
      <h3>Điền từ theo gợi ý</h3>
      <ol><li><strong>Ngang 1:</strong> Mèo</li><li><strong>Dọc 1:</strong> Hổ</li><li><strong>Ngang 2:</strong> Chó</li></ol>
      <p>Ba từ gặp nhau tại các ô chung.</p>
    </div>
    <div className="crossword-play">
      <div className="crossword-grid" aria-label="Bảng ô chữ">
        {Array.from({ length: 49 }, (_, index) => {
          const row = Math.floor(index / 7);
          const col = index % 7;
          const key = `${row}-${col}`;
          const letter = crosswordCells[key];
          return letter
            ? <label key={key} className="crossword-cell"><input aria-label={`Hàng ${row + 1}, cột ${col + 1}`} maxLength={1} value={answers[key] || ''} onChange={(event) => { setAnswers((current) => ({ ...current, [key]: event.target.value.toUpperCase().replace(/[^A-Z]/g, '') })); setStatus('idle'); }} /></label>
            : <span key={key} className="crossword-block" />;
        })}
      </div>
      <div className="game-actions"><button className="primary-game-button" onClick={check}><Check size={17} /> Kiểm tra</button><button className="secondary-game-button" onClick={reset}><RotateCcw size={16} /> Làm lại</button></div>
      <div className={`feedback ${status}`}>{status === 'idle' ? 'Điền đủ chữ rồi kiểm tra nhé!' : status === 'right' ? 'Hoàn thành ô chữ! +5 sao' : 'Có vài chữ chưa đúng, thử lại nào!'}</div>
    </div>
  </div>;
}

function FlashcardGame({ reward }: { reward: (amount?: number) => void }) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const item = words[index];
  const move = (direction: number) => { setIndex((current) => (current + direction + words.length) % words.length); setFlipped(false); };
  return <div className="flashcard-area">
    <div className="flashcard-head"><span className="round-badge">THẺ {index + 1} / {words.length}</span><p>Chạm vào thẻ để lật mặt.</p></div>
    <div className={`flashcard ${flipped ? 'flipped' : ''}`} role="button" tabIndex={0} onClick={() => { if (!flipped) reward(1); setFlipped(!flipped); }} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); if (!flipped) reward(1); setFlipped(!flipped); } }} aria-label="Lật thẻ từ">
      <span className="flashcard-face flashcard-front"><i>{item.emoji}</i><small>CHẠM ĐỂ LẬT</small></span>
      <span className="flashcard-face flashcard-back"><strong>{item.word}</strong><button onClick={(event) => { event.stopPropagation(); speak(item.word); }}><Volume2 size={21} /> Nghe từ</button></span>
    </div>
    <div className="flashcard-controls"><button onClick={() => move(-1)}><ChevronLeft size={19} /> Trước</button><button onClick={() => move(1)}>Tiếp <ChevronRight size={19} /></button></div>
  </div>;
}

const snakeChain = ['CAT', 'TIGER', 'RABBIT', 'TURTLE', 'ELEPHANT'];
const snakeOptions = ['TURTLE', 'CAT', 'ELEPHANT', 'TIGER', 'RABBIT'];

function WordSnakeGame({ reward }: { reward: (amount?: number) => void }) {
  const [chain, setChain] = useState<string[]>([]);
  const [message, setMessage] = useState('Bắt đầu bằng CAT.');
  const choose = (word: string) => {
    if (chain.includes(word)) return;
    const expected = snakeChain[chain.length];
    if (word !== expected) {
      const last = chain.at(-1);
      setMessage(last ? `Từ mới phải bắt đầu bằng chữ ${last.at(-1)}.` : 'Hãy tìm CAT để bắt đầu.');
      return;
    }
    const next = [...chain, word];
    setChain(next);
    if (next.length === snakeChain.length) { setMessage('Con rắn đã hoàn thành! +5 sao'); reward(5); }
    else setMessage(`Tốt lắm! Tìm từ bắt đầu bằng ${word.at(-1)}.`);
  };
  const reset = () => { setChain([]); setMessage('Bắt đầu bằng CAT.'); };
  return <div className="snake-area">
    <div className="snake-path">
      {snakeChain.map((word, index) => <div key={word} className={`snake-segment ${chain[index] ? 'filled' : ''}`}><span>{index === 0 ? '🐍' : '→'}</span><strong>{chain[index] || '?'}</strong></div>)}
    </div>
    <p className="snake-rule">Chữ cuối của từ trước là chữ đầu của từ sau.</p>
    <div className="snake-bank">{snakeOptions.map((word) => <button key={word} disabled={chain.includes(word)} onClick={() => choose(word)}>{word}</button>)}</div>
    <div className="snake-footer"><div className={`feedback ${chain.length === snakeChain.length ? 'right' : 'idle'}`}>{message}</div><button className="secondary-game-button" onClick={reset}><RotateCcw size={16} /> Chơi lại</button></div>
  </div>;
}

const boardJumps = [{ from: 3, to: 11, icon: '🪜' }, { from: 8, to: 15, icon: '🪜' }, { from: 14, to: 5, icon: '🐍' }, { from: 18, to: 7, icon: '🐍' }];

function BoardGame({ reward }: { reward: (amount?: number) => void }) {
  const [board, setBoard] = useState<0 | 1>(0);
  const [positions, setPositions] = useState([1, 1]);
  const [turn, setTurn] = useState(0);
  const [dice, setDice] = useState<number | null>(null);
  const [winner, setWinner] = useState<number | null>(null);
  const reset = (nextBoard = board) => { setBoard(nextBoard); setPositions([1, 1]); setTurn(0); setDice(null); setWinner(null); };
  const roll = () => {
    if (winner !== null) return;
    const value = Math.floor(Math.random() * 6) + 1;
    setDice(value);
    const raw = Math.min(20, positions[turn] + value);
    const jump = board === 0 ? boardJumps.find((item) => item.from === raw) : [{ from: 4, to: 8 }, { from: 12, to: 16 }].find((item) => item.from === raw);
    const destination = jump?.to || raw;
    setPositions((current) => current.map((position, index) => index === turn ? destination : position));
    if (destination === 20) { setWinner(turn); reward(8); } else setTurn((current) => 1 - current);
  };
  return <div className="board-area">
    <div className="board-sidebar">
      <span className="round-badge">2 BÀN CỜ MẪU</span>
      <div className="board-picker"><button className={board === 0 ? 'active' : ''} onClick={() => reset(0)}>🐍 Rắn & Thang</button><button className={board === 1 ? 'active' : ''} onClick={() => reset(1)}>🚀 Đường đua từ</button></div>
      <div className="turn-card"><small>LƯỢT HIỆN TẠI</small><strong>{turn === 0 ? '🔴 Bạn Đỏ' : '🔵 Bạn Xanh'}</strong><span>{dice ? `Vừa tung: ${dice}` : 'Tung xúc xắc để đi'}</span></div>
      <button className="dice-button" onClick={roll} disabled={winner !== null}><Dices size={25} /> {winner === null ? 'Tung xúc xắc' : `${winner === 0 ? 'Bạn Đỏ' : 'Bạn Xanh'} thắng!`}</button>
      <button className="secondary-game-button" onClick={() => reset()}><RotateCcw size={16} /> Ván mới</button>
    </div>
    <div className={`game-board board-${board + 1}`}>
      {Array.from({ length: 20 }, (_, index) => 20 - index).map((cell) => {
        const special = board === 0 ? boardJumps.find((item) => item.from === cell) : [{ from: 4, to: 8, icon: '⚡' }, { from: 12, to: 16, icon: '⭐' }].find((item) => item.from === cell);
        return <div key={cell} className={`board-cell ${special ? 'special' : ''}`}><small>{cell}</small>{special && <span>{special.icon}<i>{special.to}</i></span>}<div className="tokens">{positions[0] === cell && <b className="red-token" />}{positions[1] === cell && <b className="blue-token" />}</div></div>;
      })}
    </div>
  </div>;
}

function TeamGame({ reward }: { reward: (amount?: number) => void }) {
  const [scores, setScores] = useState([2, 1]);
  const [team, setTeam] = useState(0);
  const [answered, setAnswered] = useState(false);
  const answer = (correct: boolean) => { if (answered) return; setAnswered(true); if (correct) { setScores((current) => current.map((score, index) => index === team ? score + 1 : score)); reward(1); } };
  return <div className="team-area"><div className="scoreboard">{['Team Sun', 'Team Sky'].map((name, index) => <button key={name} className={team === index ? 'current' : ''} onClick={() => !answered && setTeam(index)}><span>{index === 0 ? '☀️' : '☁️'}</span><div><small>{name}</small><strong>{scores[index]}</strong></div></button>)}</div><div className="quiz-card"><span className="round-badge">LƯỢT CỦA {team === 0 ? 'TEAM SUN' : 'TEAM SKY'}</span><h3>Which animal can fly?</h3><div className="quiz-options">{['Cat', 'Bird', 'Fish', 'Dog'].map((option) => <button key={option} onClick={() => answer(option === 'Bird')} className={answered && option === 'Bird' ? 'correct' : ''}>{option}</button>)}</div>{answered && <button className="next-question" onClick={() => setAnswered(false)}>Câu mới <ChevronRight size={17} /></button>}</div></div>;
}
