'use client';

import { useState } from 'react';
import { RotateCcw, Volume2 } from 'lucide-react';
import { vocabulary } from '@/lib/vocabulary';

const pool = vocabulary.filter((item) => /^[a-z]+$/.test(item.word) && item.word.length >= 4);
const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export default function HangmanGame() {
  const [index, setIndex] = useState(0);
  const [guesses, setGuesses] = useState<string[]>([]);
  const item = pool[index];
  const answer = item.word.toUpperCase();
  const wrong = guesses.filter((letter) => !answer.includes(letter)).length;
  const won = answer.split('').every((letter) => guesses.includes(letter));
  const lost = wrong >= 6;
  const next = () => { setIndex((current) => (current + 1) % pool.length); setGuesses([]); };
  const say = () => { const speech = new SpeechSynthesisUtterance(item.word); speech.lang = 'en-US'; speech.rate = .8; window.speechSynthesis.speak(speech); };

  return <main className="new-game-page">
    <header className="new-game-header"><a href="/" className="round-back">← Tất cả game</a><div><span className="section-kicker">ĐOÁN CHỮ</span><h1>Hangman vui nhộn</h1><p>Đoán từ tiếng Anh qua nghĩa · tối đa 6 lần sai</p></div><img src="/wordjoy-owl.png" alt="Cú nhỏ WordJoy" /></header>
    <section className="hangman-layout">
      <div className="hangman-figure" aria-label={`${wrong} trên 6 lần đoán sai`}><span>☁️</span><strong>{['🌱','🌼','🌿','🌳','🍂','🌧️','💦'][wrong]}</strong><small>{6 - wrong} cơ hội còn lại</small></div>
      <div className="hangman-main"><span className="round-badge">{item.level.toUpperCase()} · {item.topic}</span><h2>Nghĩa: {item.meaning}</h2><div className="hangman-slots">{answer.split('').map((letter, pos) => <span key={pos}>{guesses.includes(letter) || lost ? letter : '＿'}</span>)}</div>
        <div className="hangman-keys">{alphabet.map((letter) => <button key={letter} disabled={guesses.includes(letter) || won || lost} className={guesses.includes(letter) ? answer.includes(letter) ? 'good' : 'bad' : ''} onClick={() => setGuesses((current) => [...current, letter])}>{letter}</button>)}</div>
        <p className={`feedback ${won ? 'right' : lost ? 'wrong' : 'idle'}`} aria-live="polite">{won ? `Giỏi quá! ${item.word} = ${item.meaning}` : lost ? `Đáp án là ${item.word}. Mình thử từ khác nhé!` : 'Chạm một chữ cái để đoán.'}</p>
        <div className="game-actions"><button className="primary-game-button" onClick={next}><RotateCcw size={17} /> Từ khác</button>{(won || lost) && <button className="secondary-game-button" onClick={say}><Volume2 size={17} /> Nghe phát âm</button>}</div>
      </div>
    </section>
  </main>;
}
