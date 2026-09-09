'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, Star } from 'lucide-react';
import { GameStage, type GameId } from '../page';

export default function GamePage({ game }: { game: GameId }) {
  const [stars, setStars] = useState(12);

  useEffect(() => {
    const saved = window.localStorage.getItem('wordjoy-stars');
    if (saved) setStars(Number(saved));
  }, []);

  const reward = (amount = 1) => setStars((current) => {
    const next = current + amount;
    window.localStorage.setItem('wordjoy-stars', String(next));
    return next;
  });

  return <main className="standalone-game">
    <header className="standalone-topbar">
      <Link href="/" className="back-home"><ChevronLeft size={19} /> Tất cả game</Link>
      <Link href="/" className="mini-brand"><span>W</span><strong>WordJoy</strong></Link>
      <div className="star-pill"><Star size={17} fill="currentColor" /><strong>{stars}</strong><span>sao</span></div>
    </header>
    <div className="standalone-content"><GameStage game={game} reward={reward} stars={stars} /></div>
  </main>;
}
