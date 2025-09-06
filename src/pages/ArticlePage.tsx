// src/pages/ArticlePage.tsx
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { AINavbar } from '../components/AINavbar';
import { AIFooter } from '../components/AIFooter';
import { articles } from '../data/articles'; // Import article data

const ArticlePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const article = articles.find(a => a.slug === slug);

  useEffect(() => {
    document.documentElement.classList.add('dark');
    window.scrollTo(0, 0); // Scroll to top on page load
    return () => {
      document.documentElement.classList.remove('dark');
    };
  }, []);

  if (!article) {
    return (
      <div className="bg-black text-white min-h-screen flex items-center justify-center">
        <h1 className="text-4xl">Article Not Found</h1>
      </div>
    );
  }

  return (
    <div className="bg-black text-white">
      <AINavbar />
      <main className="pt-28 pb-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 mb-12">
            {article.title}
          </h1>
          {/* Prose classes from Tailwind make Markdown look beautiful */}
          <article className="prose prose-invert prose-lg max-w-none">
            <ReactMarkdown>{article.content}</ReactMarkdown>
          </article>
        </div>
      </main>
      <AIFooter />
    </div>
  );
};

export default ArticlePage;