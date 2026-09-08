import type { Metadata } from 'next';
import { Nunito, Quicksand } from 'next/font/google';
import './globals.css';

const nunito = Nunito({ variable: '--font-body', subsets: ['latin', 'vietnamese'] });
const quicksand = Quicksand({ variable: '--font-heading', subsets: ['latin', 'vietnamese'], weight: ['600', '700'] });

export const metadata: Metadata = { title: 'WordJoy — English Playground', description: 'Các trò chơi tiếng Anh vui nhộn cho trẻ từ 3 đến 12 tuổi.' };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="vi"><body className={`${nunito.variable} ${quicksand.variable}`}>{children}</body></html>;
}
