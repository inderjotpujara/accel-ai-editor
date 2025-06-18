import { Header } from '@/components/Header';
import { EditorFeature } from '@/features/Editor';

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Accel AI Editor
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl">
            Accelerate your development with AI-powered code editing, intelligent
            suggestions, and seamless workflow integration.
          </p>
        </div>
        <EditorFeature />
      </div>
    </main>
  );
}
