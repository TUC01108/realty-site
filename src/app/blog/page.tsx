import Link from "next/link";
import Image from "next/image";
import { fetchBlogPosts, formatDate } from "@/lib/blog";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Blog | Hawaii Real Estate Market Insights",
  description: "Hawaii real estate market trends, buying guides, lava zone information, and Big Island living insights from Yordana Bolanos Salas, Coldwell Banker Island Properties.",
  alternates: { canonical: "https://www.yourbigislandrealestate.com/blog" },
  openGraph: { title: "The Big Island Real Estate Blog | Your Big Island Real Estate", description: "Real talk on buying, selling, and living on Hawai\'i Island — straight from Yordana.", url: "https://www.yourbigislandrealestate.com/blog" },
};
export const dynamic = "force-dynamic";
export default async function BlogPage() {
  const posts = await fetchBlogPosts(20);
  return (
    <>
      <section className="bg-sand py-16 lg:py-20">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <p className="eyebrow text-coral">Market Insights</p>
          <h1 className="font-display text-coral text-4xl sm:text-5xl lg:text-6xl mt-3 max-w-2xl">The Big Island Blog</h1>
          <p className="mt-6 text-ink/70 max-w-xl leading-relaxed">Real talk on buying, selling, and living on Hawai&apos;i Island — straight from Yordana.</p>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-6 lg:px-8 py-16 lg:py-20">
        {posts.length === 0 ? <p className="text-ink/50 text-sm">No posts found — check back soon.</p> : (
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, i) => (
              <article key={i} className="group flex flex-col">
                <a href={post.url} target="_blank" rel="noopener noreferrer">
                  <div className="relative aspect-[16/9] rounded-sm overflow-hidden bg-line/60">
                    {post.thumbnail ? <Image src={post.thumbnail} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" unoptimized /> : <div className="absolute inset-0 bg-coral/10 flex items-center justify-center"><span className="font-display text-coral/30 text-4xl">Y</span></div>}
                  </div>
                </a>
                <div className="mt-5 flex flex-col flex-1">
                  {post.published && <p className="eyebrow text-ink/50">{formatDate(post.published)}</p>}
                  <h2 className="font-display text-xl mt-2 leading-snug group-hover:text-coral transition-colors"><a href={post.url} target="_blank" rel="noopener noreferrer">{post.title}</a></h2>
                  {post.summary && <p className="mt-2 text-sm text-ink/60 leading-relaxed flex-1">{post.summary}</p>}
                  <a href={post.url} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block text-sm font-medium text-coral border-b border-coral pb-0.5 hover:text-coral-dark transition-colors self-start">Read more</a>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
      <section className="bg-coral text-paper">
        <div className="mx-auto max-w-6xl px-6 lg:px-8 py-14 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div><h2 className="font-display text-2xl lg:text-3xl">Ready to take the next step?</h2><p className="mt-2 text-paper/80 text-sm">Yordana is here to guide you through every part of your Hawaii real estate journey.</p></div>
          <Link href="/contact" className="rounded-sm bg-paper px-6 py-3 text-sm font-medium text-coral hover:bg-transparent hover:text-paper border border-paper transition-colors shrink-0">Let&apos;s Connect</Link>
        </div>
      </section>
    </>
  );
}
