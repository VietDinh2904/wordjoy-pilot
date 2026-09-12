'use client';

import { useEffect, useRef, useState } from 'react';
import { RotateCcw, Sparkles, Volume2 } from 'lucide-react';
import { vocabulary, type VocabWord } from '@/lib/vocabulary';
import './flashcard.css';

type Card = { id: string; pair: number; kind: 'picture' | 'meaning' };
const pictures = vocabulary.filter((item) => item.flyerSprite !== undefined).sort((a, b) => a.flyerSprite! - b.flyerSprite!);
const cards: Card[] = pictures.flatMap((_, pair) => [
  { id: `${pair}-picture`, pair, kind: 'picture' as const },
  { id: `${pair}-meaning`, pair, kind: 'meaning' as const },
]);
const topics = ['Tất cả', 'Con vật', 'Cơ thể & sức khỏe', 'Trang phục', 'Đồ ăn', 'Địa điểm'];

function shuffle<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function pictureStyle(item: VocabWord) {
  const sprite = item.flyerSprite!;
  return { backgroundPosition: `${(sprite % 5) * 25}% ${Math.floor(sprite / 5) * (100 / 3)}%` };
}

function say(word: string) {
  const speech = new SpeechSynthesisUtterance(word);
  speech.lang = 'en-US'; speech.rate = .8;
  window.speechSynthesis.cancel(); window.speechSynthesis.speak(speech);
}

function StudyCards() {
  const [topic, setTopic] = useState('Tất cả');
  const [flipped, setFlipped] = useState<string[]>([]);
  const visible = topic === 'Tất cả' ? pictures : pictures.filter((item) => item.topic === topic);
  const toggle = (word: string) => setFlipped((current) => current.includes(word) ? current.filter((item) => item !== word) : [...current, word]);

  return <section className="flyer-study" aria-label="Bộ thẻ học Flyers">
    <div className="flyer-study-heading"><div><h2>Nhìn hình, đoán từ, rồi lật thẻ</h2><p>Mặt trước là hình; mặt sau là từ tiếng Anh và nghĩa tiếng Việt.</p></div><span>{visible.length} thẻ</span></div>
    <div className="flyer-topic-tabs" role="group" aria-label="Chọn chủ đề">
      {topics.map((item) => <button key={item} className={topic === item ? 'active' : ''} onClick={() => { setTopic(item); setFlipped([]); }}>{item}</button>)}
    </div>
    <div className="flyer-study-grid">
      {visible.map((item) => <article key={item.word} className="flyer-card-wrap">
        <button className={`flyer-study-card ${flipped.includes(item.word) ? 'flipped' : ''}`} onClick={() => toggle(item.word)} aria-label={`${item.word}: ${flipped.includes(item.word) ? 'lật về hình' : 'lật để xem từ và nghĩa'}`} aria-pressed={flipped.includes(item.word)}>
          <span className="flyer-card-face flyer-front"><span className="flyer-picture" style={pictureStyle(item)} /><span className="flyer-flip-hint">Lật thẻ ↻</span></span>
          <span className="flyer-card-face flyer-back"><strong>{item.word}</strong><span>{item.meaning}</span><small>Chạm để xem hình ↻</small></span>
        </button>
        <div className="flyer-card-caption"><span>{item.topic}</span><button onClick={() => say(item.word)} aria-label={`Nghe phát âm ${item.word}`}><Volume2 size={18} /> Nghe</button></div>
      </article>)}
    </div>
  </section>;
}

function MatchingBoard() {
  const [deck, setDeck] = useState(cards);
  const [open, setOpen] = useState<string[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [turns, setTurns] = useState(0);
  const [message, setMessage] = useState('Mỗi lượt chỉ lật 2 thẻ: một hình và một nghĩa.');
  const locked = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => { setDeck(shuffle(cards)); }, []);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  const flip = (card: Card) => {
    if (locked.current || open.includes(card.id) || matched.includes(card.pair)) return;
    const next = [...open, card.id]; setOpen(next);
    if (next.length !== 2) return;
    locked.current = true; setTurns((current) => current + 1);
    const first = deck.find((item) => item.id === next[0])!;
    if (first.pair === card.pair && first.kind !== card.kind) {
      setMatched((current) => [...current, card.pair]);
      setMessage(`Đúng rồi! ${pictures[card.pair].word} = ${pictures[card.pair].meaning}. +10 điểm`);
      timer.current = setTimeout(() => { setOpen([]); locked.current = false; }, 700);
    } else {
      setMessage('Chưa khớp. Nhìn kỹ rồi thử lại nhé!');
      timer.current = setTimeout(() => { setOpen([]); locked.current = false; }, 1150);
    }
  };

  const restart = () => {
    if (timer.current) clearTimeout(timer.current);
    locked.current = false;
    setDeck(shuffle(cards)); setOpen([]); setMatched([]); setTurns(0);
    setMessage('Bắt đầu lại! Mỗi lượt chỉ lật 2 thẻ.');
  };

  return <section className="flyer-matching" aria-label="Trò ghép hình và nghĩa Flyers">
    <div className="game-status-bar"><span>✅ {matched.length}/20 cặp</span><span>⭐ {matched.length * 10} điểm</span><span>🎴 {turns} lượt</span><button onClick={restart}><RotateCcw size={17} /> Chơi lại</button></div>
    <p className="memory-message" aria-live="polite"><Sparkles size={18} /> {matched.length === 20 ? 'Tuyệt vời! Con đã ghép đủ 20 cặp!' : message}</p>
    <div className="memory-grid">
      {deck.map((card) => {
        const shown = open.includes(card.id) || matched.includes(card.pair);
        const item = pictures[card.pair];
        return <button key={card.id} className={`memory-card ${shown ? 'is-open' : ''} ${matched.includes(card.pair) ? 'is-matched' : ''}`} onClick={() => flip(card)} aria-label={shown ? `${card.kind === 'picture' ? 'Hình' : 'Nghĩa'} ${item.meaning}` : 'Thẻ úp'} aria-pressed={shown}>
          {shown ? card.kind === 'picture' ? <span className="flyer-picture" style={pictureStyle(item)} /> : <span className="memory-meaning">{item.meaning}</span> : <span className="memory-cover">✦<small>WORDJOY</small></span>}
        </button>;
      })}
    </div>
  </section>;
}

export default function FlashcardExperience() {
  const [mode, setMode] = useState<'study' | 'matching'>('study');
  return <main className="new-game-page flyer-page">
    <header className="new-game-header"><a href="/" className="round-back">← Tất cả game</a><div><span className="section-kicker">A2 FLYERS · FLASHCARDS</span><h1>Thẻ hình Flyers</h1><p>Học qua hình, lật xem từ và nghĩa, rồi thử ghép cặp.</p></div><img src="/wordjoy-owl.png" alt="Cú nhỏ WordJoy" /></header>
    <div className="flyer-mode-tabs" role="group" aria-label="Chọn cách học">
      <button className={mode === 'study' ? 'active' : ''} onClick={() => setMode('study')}>🖼️ Học thẻ hai mặt</button>
      <button className={mode === 'matching' ? 'active' : ''} onClick={() => setMode('matching')}>🃏 Ghép 20 cặp</button>
    </div>
    {mode === 'study' ? <StudyCards /> : <MatchingBoard />}
    <p className="game-footnote">Từ được chọn từ bộ flashcard Flyers bạn cung cấp; hình chibi do WordJoy tạo mới. Xem thêm trong <a href="/words">Sổ tay từ vựng</a>.</p>
  </main>;
}
