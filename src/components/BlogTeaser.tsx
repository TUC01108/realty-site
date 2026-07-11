import Link from "next/link";
import Image from "next/image";
import { fetchBlogPosts, formatDate } from "@/lib/blog";

export default async function BlogTeaser() {
  const posts = await fetchBlogPosts(3);

  if (posts.length === 0) return null;

  return (
    <section className="bg-sand py-16 lg:py-20">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="eyebrow text-coral">Market Insights</p>
            <h2 className="font-display text-3xl lg:text-4xl mt-2">
              Latest from the Blog
            </h2>
          </div>
          <Link
            href="/blog"
            className="hidden sm:inline-block text-sm font-medium text-coral border-b border-coral pb-0.5 hover:text-coral-dark hover:border-coral-dark transition-colors"
          >
            View all posts
          </Link>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, i) => (
            <article key={i} className="group flex flex-col">
              <a
                href={post.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <div className="relative aspect-[16/9] rounded-sm overflow-hidden bg-line/60">
                  {post.thumbnail ? (
                    <Image
                      src={post.thumbnail}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      unoptimized
                    />
                  ) : (
                    <div className="absolute inset-0 bg-coral/10 flex items-center justify-center">
                      <span className="font-display text-coral/30 text-4xl">Y</span>
                    </div>
                  )}
                </div>
              </a>
              <div className="mt-4 flex flex-col flex-1">
                {post.published && (
                  <p className="eyebrow text-ink/50">{formatDate(post.published)}</p>
                )}
                <h3 className="font-display text-lg mt-1 leading-snug group-hover:text-coral transition-colors">
                  <a href={post.url} target="_blank" rel="noopener noreferrer">
                    {post.title}
                  </a>
                </h3>
                {post.summary && (
                  <p className="mt-2 text-sm text-ink/60 leading-relaxed line-clamp-3 flex-1">
                    {post.summary}
                  </p>
                )}
                <a
                  href={post.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-block text-sm font-medium text-coral border-b border-coral pb-0.5 hover:text-coral-dark transition-colors self-start"
                >
                  Read more
                </a>
              </div>
            </article>
          ))}
        </div>

        <Link
          href="/blog"
          className="mt-10 sm:hidden inline-block text-sm font-medium text-coral border-b border-coral pb-0.5"
        >
          View all posts
        </Link>
      </div>
    </section>
  );
}
