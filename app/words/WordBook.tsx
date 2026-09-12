'use client';

import { useMemo, useState } from 'react';
import { Search, Volume2 } from 'lucide-react';
import { vocabulary, type Level } from '@/lib/vocabulary';

const levels: { id: Level | 'all'; name: string; icon: string }[] = [
  { id: 'all', name: 'Tất cả', icon: '✨' },
  { id: 'starters', name: 'Starters', icon: '🌱' },
  { id: 'movers', name: 'Movers', icon: '🚀' },
  { id: 'flyers', name: 'Flyers', icon: '🦋' },
];

export default function WordBook() {
  const [level, setLevel] = useState<Level | 'all'>('all');
  const [query, setQuery] = useState('');
  const [topic, setTopic] = useState('Tất cả');
  const topics = ['Tất cả', ...new Set(vocabulary.map((item) => item.topic))];
  const results = useMemo(() => vocabulary.filter((item) =>
    (level === 'all' || item.level === level) &&
    (topic === 'Tất cả' || item.topic === topic) &&
    (!query || `${item.word} ${item.meaning}`.toLowerCase().includes(query.trim().toLowerCase()))
  ), [level, topic, query]);
  const say = (word: string) => { const utterance = new SpeechSynthesisUtterance(word); utterance.lang = 'en-US'; utterance.rate = .8; window.speechSynthesis.cancel(); window.speechSynthesis.speak(utterance); };

  return <main className="wordbook-page">
    <header className="wordbook-hero"><a href="/" className="round-back">← Trang chủ</a><div><span className="section-kicker">TRA TỪ & LUYỆN TẬP</span><h1>Sổ tay từ vựng ✨</h1><p>Tìm nghĩa, nghe phát âm, rồi đem từ vừa học vào game.</p></div><img src="/wordjoy-owl.png" alt="Cú nhỏ WordJoy cầm sách" /></header>
    <div className="wordbook-filters"><div className="level-tabs">{levels.map((item) => <button key={item.id} className={level === item.id ? 'active' : ''} onClick={() => setLevel(item.id)}>{item.icon} {item.name}</button>)}</div><label className="word-search"><Search size={19} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tra từ tiếng Anh hoặc nghĩa tiếng Việt..." /></label><select value={topic} onChange={(event) => setTopic(event.target.value)} aria-label="Chủ đề từ vựng">{topics.map((item) => <option key={item}>{item}</option>)}</select></div>
    <div className="wordbook-info"><strong>{results.length} từ</strong><span>Bộ từ mẫu chọn lọc cho Starters–Flyers; chưa phải toàn bộ danh sách thi.</span></div>
    <div className="wordbook-grid">{results.map((item) => <article key={item.word} className={`word-tile level-${item.level}`}><div className="word-emoji">{item.sprite === undefined ? item.emoji : <span className="word-sprite" style={{ backgroundPosition: `${(item.sprite % 5) * 25}% ${Math.floor(item.sprite / 5) * (100 / 3)}%` }} />}</div><div><small>{item.topic} · {item.level}</small><h2>{item.word}</h2><p>{item.meaning}</p></div><button onClick={() => say(item.word)} aria-label={`Nghe phát âm ${item.word}`}><Volume2 size={19} /></button></article>)}</div>
    {!results.length && <p className="empty-words">Chưa tìm thấy từ này trong bộ từ mẫu. Thử từ hoặc chủ đề khác nhé.</p>}
    <div className="wordbook-play"><strong>Học xong rồi? Chơi để nhớ lâu!</strong><a href="/games/flashcard">🃏 Ghép thẻ</a><a href="/games/hangman">🔤 Hangman</a><a href="/games/snake">🐍 Nối từ</a></div>
  </main>;
}
