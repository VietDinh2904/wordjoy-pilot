'use client';

import { useState } from 'react';
import { lookupWord, type VocabWord } from '@/lib/vocabulary';
import { RotateCcw, Send } from 'lucide-react';

export default function WordChainGame() {
  const [chain, setChain] = useState<VocabWord[]>([]);
  const [draft, setDraft] = useState('');
  const [turn, setTurn] = useState(0);
  const [scores, setScores] = useState([0, 0]);
  const [notice, setNotice] = useState('Người chơi Đỏ viết từ tiếng Anh đầu tiên.');
  const required = chain.at(-1)?.word.at(-1);
  const found = lookupWord(draft);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const entry = draft.trim().toLowerCase();
    const word = lookupWord(entry);
    if (!word) { setNotice(`“${entry || 'Từ trống'}” chưa có trong từ điển mẫu. Hãy tra từ rồi thử lại.`); return; }
    if (chain.some((item) => item.word === entry)) { setNotice('Từ này đã được dùng. Viết một từ mới nhé!'); return; }
    if (required && entry[0] !== required) { setNotice(`Từ mới phải bắt đầu bằng chữ “${required.toUpperCase()}”.`); return; }
    setChain((current) => [...current, word]);
    setScores((current) => current.map((value, i) => i === turn ? value + 10 : value));
    setNotice(`Đúng! ${word.word} nghĩa là “${word.meaning}”. Đến lượt ${turn === 0 ? 'Xanh' : 'Đỏ'}.`);
    setDraft(''); setTurn(1 - turn);
  };
  const reset = () => { setChain([]); setDraft(''); setTurn(0); setScores([0, 0]); setNotice('Người chơi Đỏ viết từ tiếng Anh đầu tiên.'); };

  return <main className="new-game-page">
    <header className="new-game-header"><a href="/" className="round-back">← Tất cả game</a><div><span className="section-kicker">HAI NGƯỜI THAY PHIÊN</span><h1>Rắn nối từ</h1><p>Tự viết từ · chữ cuối nối chữ đầu · hiện nghĩa sau mỗi lượt</p></div><img src="/wordjoy-owl.png" alt="Cú nhỏ WordJoy" /></header>
    <section className="chain-board">
      <div className="chain-scores"><span className={turn === 0 ? 'active-red' : ''}>🔴 Đỏ <strong>{scores[0]}</strong></span><span className={turn === 1 ? 'active-blue' : ''}>🔵 Xanh <strong>{scores[1]}</strong></span><button onClick={reset}><RotateCcw size={16} /> Chơi lại</button></div>
      <div className="chain-path" aria-label="Những từ đã nối">{chain.length ? chain.map((word, i) => <div key={word.word} className={`chain-word ${i % 2 ? 'blue' : 'red'}`}><small>{i + 1} · {i % 2 ? 'Xanh' : 'Đỏ'}</small><strong>{word.word}</strong><span>{word.meaning}</span></div>) : <div className="chain-empty">🐍 Con rắn từ vựng đang chờ từ đầu tiên!</div>}</div>
      <form className="chain-form" onSubmit={submit}><label htmlFor="chain-input">Lượt của <strong>{turn === 0 ? '🔴 Đỏ' : '🔵 Xanh'}</strong>{required && <> · bắt đầu bằng <strong>{required.toUpperCase()}</strong></>}</label><div><input id="chain-input" value={draft} onChange={(event) => setDraft(event.target.value.toLowerCase().replace(/[^a-z]/g, ''))} placeholder={required ? `Từ bắt đầu bằng ${required.toUpperCase()}...` : 'Viết từ tiếng Anh...'} autoComplete="off" spellCheck={false} maxLength={24} /><button type="submit"><Send size={18} /> Nối từ</button></div><p aria-live="polite">{draft ? found ? `Nghĩa sẽ được kiểm tra: ${found.meaning}` : 'Chưa thấy từ này trong bộ từ mẫu.' : notice}</p></form>
    </section>
    <p className="game-footnote">Bản mẫu kiểm tra trong bộ từ đã biên soạn, chưa phải toàn bộ từ điển tiếng Anh. <a href="/words">Xem danh sách từ được chấp nhận</a>.</p>
  </main>;
}
