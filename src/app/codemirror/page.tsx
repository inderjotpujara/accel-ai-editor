import dynamic from 'next/dynamic';
import { Header } from '@/components/Header';

const CodeMirrorIDE = dynamic(() => import('@/features/IDE').then(m => m.CodeMirrorIDE), { ssr: false });

export default function CodeMirrorPage() {
  return (
    <main className="min-h-screen">
      <Header />
      <div className="container mx-auto p-4">
        <CodeMirrorIDE />
      </div>
    </main>
  );
}
