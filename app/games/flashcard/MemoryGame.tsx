'use client';

import { useEffect, useRef, useState } from 'react';
import { RotateCcw, Sparkles } from 'lucide-react';
import { vocabulary } from '@/lib/vocabulary';

type Card = { id: string; pair: number; kind: 'picture' | 'meaning' };
const pairs = vocabulary.filter((word) => word.sprite !== undefined).slice(0, 20);
const initialCards: Card[] = pairs.flatMap((_, pair) => [
  { id: `${pair}-picture`, pair, kind: 'picture' as const },
  { id: `${pair}-meaning`, pair, kind: 'meaning' as const },
]);

function shuffle(cards: Card[]) {
  const copy = [...cards];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function MemoryGame() {
  const [cards, setCards] = useState(initialCards);
  const [open, setOpen] = useState<string[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [turns, setTurns] = useState(0);
  const [message, setMessage] = useState('Lật 2 thẻ: 1 hình chibi và 1 nghĩa tiếng Việt.');
  const locked = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => { setCards(shuffle(initialCards)); }, []);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  const flip = (card: Card) => {
    if (locked.current || open.includes(card.id) || matched.includes(card.pair)) return;
    const next = [...open, card.id];
    setOpen(next);
    if (next.length !== 2) return;
    locked.current = true;
    setTurns((current) => current + 1);
    const first = cards.find((item) => item.id === next[0])!;
    const correct = first.pair === card.pair && first.kind !== card.kind;
    if (correct) {
      setMatched((current) => [...current, card.pair]);
      setMessage(`Đúng rồi! ${pairs[card.pair].word} = ${pairs[card.pair].meaning}. +10 điểm`);
      timer.current = setTimeout(() => { setOpen([]); locked.current = false; }, 700);
    } else {
      setMessage('Chưa khớp. Nhìn kỹ rồi thử lại nhé!');
      timer.current = setTimeout(() => { setOpen([]); locked.current = false; }, 1150);
    }
  };

  const restart = () => {
    if (timer.current) clearTimeout(timer.current);
    locked.current = false;
    setCards(shuffle(initialCards)); setOpen([]); setMatched([]); setTurns(0);
    setMessage('Bắt đầu ván mới! Mỗi lượt chỉ lật 2 thẻ.');
  };

  return <main className="new-game-page memory-page">
    <header className="new-game-header">
      <a href="/" className="round-back">← Tất cả game</a>
      <div><span className="section-kicker">MEMORY & MATCHING</span><h1>Ghép hình với nghĩa</h1><p>20 cặp thẻ chibi · lật đúng mới được điểm</p></div>
      <img src="/wordjoy-owl.png" alt="Cú nhỏ WordJoy" />
    </header>
    <section className="game-status-bar" aria-live="polite">
      <span>✅ {matched.length}/20 cặp</span><span>⭐ {matched.length * 10} điểm</span><span>🎴 {turns} lượt</span>
      <button onClick={restart}><RotateCcw size={17} /> Chơi lại</button>
    </section>
    <p className="memory-message"><Sparkles size={18} /> {matched.length === 20 ? 'Tuyệt vời! Con đã ghép đủ 20 cặp!' : message}</p>
    <div className="memory-grid">
      {cards.map((card) => {
        const shown = open.includes(card.id) || matched.includes(card.pair);
        const word = pairs[card.pair];
        const sprite = word.sprite!;
        return <button key={card.id} className={`memory-card ${shown ? 'is-open' : ''} ${matched.includes(card.pair) ? 'is-matched' : ''}`} onClick={() => flip(card)} aria-label={shown ? `${card.kind === 'picture' ? 'Hình' : 'Nghĩa'} ${word.meaning}` : 'Thẻ úp'} aria-pressed={shown}>
          {shown ? card.kind === 'picture'
            ? <span className="memory-sprite" style={{ backgroundPosition: `${(sprite % 5) * 25}% ${Math.floor(sprite / 5) * (100 / 3)}%` }} />
            : <span className="memory-meaning">{word.meaning}</span>
          : <span className="memory-cover">✦<small>WORDJOY</small></span>}
        </button>;
      })}
    </div>
    <p className="game-footnote">Hình chibi là minh họa gợi nhớ. Xem từ và phát âm trong <a href="/words">Sổ tay từ vựng</a>.</p>
  </main>;
}
