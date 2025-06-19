import dynamic from 'next/dynamic';
import { Header } from '@/components/Header';

const MonacoIDE = dynamic(() => import('@/features/IDE').then(m => m.MonacoIDE), { ssr: false });

export default function MonacoPage() {
  return (
    <main className="min-h-screen">
      <Header />
      <div className="container mx-auto p-4">
        <MonacoIDE />
      </div>
    </main>
  );
}
