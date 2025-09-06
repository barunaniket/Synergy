import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useScroll, useTransform } from "framer-motion";
import { cn } from "../utils/cn";
import { AINavbar } from '../components/AINavbar';
import { AIFooter } from '../components/AIFooter';
import { GoogleGeminiEffect } from '../components/GeminiEffect';
import { articles } from '../data/articles';

const AINewsPage = () => {
  const ref = useRef(null);
  // The useScroll hook now targets the ref on the middle container
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"], // Triggers when the container enters/leaves the viewport
  });

  const pathLengths = [
    useTransform(scrollYProgress, [0, 0.8], [0.2, 1.2]),
    useTransform(scrollYProgress, [0, 0.8], [0.15, 1.2]),
    useTransform(scrollYProgress, [0, 0.8], [0.1, 1.2]),
    useTransform(scrollYProgress, [0, 0.8], [0.05, 1.2]),
    useTransform(scrollYProgress, [0, 0.8], [0, 1.2]),
  ];

  useEffect(() => {
    document.documentElement.classList.add('dark');
    return () => {
      document.documentElement.classList.remove('dark');
    };
  }, []);

  return (
    <div className="bg-black text-white">
      <AINavbar />
      <main>
        {/* Section 1: Hero Title */}
        <div className="h-screen w-full flex flex-col items-center justify-center text-center p-4">
          <h1 className="text-4xl md:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
            The Future, Unfolding
          </h1>
          <p className="mt-4 text-lg text-neutral-300 max-w-2xl mx-auto">
            Your daily briefing on the latest breakthroughs and discussions in the world of Artificial Intelligence.
          </p>
        </div>

        {/* Section 2: Gemini Animation */}
        <div ref={ref} className="h-[300vh] relative">
          <GoogleGeminiEffect
            pathLengths={pathLengths}
            title="Visualizing Innovation"
            description="Scroll to see the connections form"
            className="top-0" // Position it at the top of its container
          />
        </div>

        {/* Section 3: Bento Grid Content */}
        <div className="container mx-auto px-4 py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
              Latest Briefings
            </h2>
          </div>
          <BentoGrid />
        </div>
      </main>
      <AIFooter />
    </div>
  );
};

// --- BentoGrid Component ---
const BentoGrid = () => {
  return (
    <div className="grid md:auto-rows-[18rem] grid-cols-1 md:grid-cols-3 gap-4 max-w-7xl mx-auto">
      {articles.map((item) => (
        <Link
          to={`/article/${item.slug}`}
          key={item.id}
          className={cn(
            "row-span-1 rounded-xl group/bento hover:shadow-xl transition duration-200 shadow-input dark:shadow-none p-4 dark:bg-black dark:border-white/[0.2] bg-white border border-transparent justify-between flex flex-col space-y-4",
            item.className
          )}
        >
          <div
            className={cn(
              "h-full w-full bg-cover bg-center rounded-xl transition-transform duration-200 group-hover/bento:scale-105"
            )}
            style={{ backgroundImage: `url('${item.header}')` }}
          ></div>
          <div className="group-hover/bento:translate-x-2 transition duration-200">
            <div className="font-sans font-bold text-neutral-200 mb-2 mt-2">
              {item.title}
            </div>
            <div className="font-sans font-normal text-xs text-neutral-300">
              {item.description}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default AINewsPage;
