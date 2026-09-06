import type { Metadata } from "next";
import { ArticleCard } from "@/components/content/article-card";
import { getAllArticles } from "@/lib/content/articles";

export const metadata: Metadata = {
  title: "Explore | Nihonest",
  description: "Follow practical, sourced guidance for an international student's move to Japan.",
};

export default function ExplorePage() {
  const articles = getAllArticles();

  return (
    <div className="page-shell py-16 sm:py-24">
      <header className="max-w-3xl">
        <p className="eyebrow">Explore</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
          Your student journey to Japan.
        </h1>
        <p className="mt-6 text-lg leading-8 text-slate-600">
          Follow the journey from choosing a school and preparing immigration documents through arrival, registration, housing, phone service, banking, and student life.
        </p>
      </header>
      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {articles.map((article) => (
          <ArticleCard key={article.metadata.id} article={article.metadata} />
        ))}
      </div>
    </div>
  );
}
