"use client";
import React, { useState } from "react";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import Image from "next/image";
import Link from "next/link";
import { Search, Calendar, User, Clock, ArrowRight, BookOpen } from "lucide-react";

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  image: string;
}

const BLOGS: BlogPost[] = [
  {
    slug: "smm-reseller-guide-scale-10k",
    title: "The SMM Reseller Playbook: 5 Strategies to Scale to $10k/Month",
    excerpt: "Learn how top digital marketing agencies package, white-label, and resell social media engagement services to corporate clients for maximum profit margins.",
    category: "Reselling Strategies",
    author: "Kriyava Growth Lab",
    date: "May 28, 2026",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600&auto=format&fit=crop"
  },
  {
    slug: "instagram-algorithm-hacks-2026",
    title: "Cracking the 2026 Instagram Feed & Reels Distribution Loop",
    excerpt: "Instagram's new ranking signals place heavy weight on share rates and watch loops. Discover how buying initial vetted signals triggers rapid algorithmic amplification.",
    category: "Algorithm Insights",
    author: "Devin K. (SMM Engineer)",
    date: "May 24, 2026",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=600&auto=format&fit=crop"
  },
  {
    slug: "smm-failover-redundancy-reliability",
    title: "Behind the Scenes: Why Multi-Provider Failover Protects Your Orders",
    excerpt: "Social platforms update their APIs constantly. Read how Kriyava's automatic endpoints switcher reroutes delays instantly for guaranteed 100% completion rates.",
    category: "Platform Tech",
    author: "Alok R. (Infrastructure Lead)",
    date: "May 18, 2026",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=600&auto=format&fit=crop"
  },
  {
    slug: "profile-target-locations-matter",
    title: "Target Locations Decoded: Profile Country vs. Global Audiences",
    excerpt: "Why are some likes cheaper while others claim premium status? Learn how geotargeted Indian or US profiles boost your local search ranking (SEO) more effectively.",
    category: "Marketing Strategy",
    author: "Kriyava Growth Lab",
    date: "May 12, 2026",
    readTime: "4 min read",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=600&auto=format&fit=crop"
  }
];

export default function BlogsPage() {
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState("All");

  const categories = ["All", ...Array.from(new Set(BLOGS.map((b) => b.category)))];

  const filtered = BLOGS.filter((b) => {
    if (selectedCat !== "All" && b.category !== selectedCat) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        b.title.toLowerCase().includes(q) ||
        b.excerpt.toLowerCase().includes(q) ||
        b.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <>
      <SiteNav />
      <main className="bg-slate-50 min-h-screen py-16">
        <div className="container-x">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wider mb-4 border border-blue-100">
              <BookOpen size={12} />
              Knowledge Hub
            </div>
            <h1 className="font-display text-4xl font-extrabold text-slate-900 tracking-tight">
              Growth Lab Blogs & Articles
            </h1>
            <p className="text-slate-500 mt-2 text-sm max-w-md mx-auto">
              Get direct industry secrets, algorithm hacks, and technical walkthroughs from professional organic growth developers.
            </p>
          </div>

          {/* Search + Category Pills */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-10 pb-6 border-b border-slate-200/60 text-left">
            {/* Categories */}
            <div className="flex flex-wrap gap-1.5 order-2 md:order-1">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setSelectedCat(c)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all border ${
                    selectedCat === c
                      ? "bg-slate-900 border-slate-900 text-white"
                      : "bg-white border-slate-200/60 text-slate-500 hover:text-slate-900 hover:border-slate-300"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative w-full md:w-80 order-1 md:order-2">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <input
                type="text"
                placeholder="Search articles..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 pl-9 text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-slate-400 transition-all font-medium"
              />
            </div>
          </div>

          {/* Blogs Grid */}
          {filtered.length === 0 ? (
            <div className="py-20 text-center bg-white border border-slate-200/60 rounded-2xl text-slate-400 text-xs font-bold shadow-sm">
              No matching blog articles found. Try another search.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
              {filtered.map((b) => (
                <article
                  key={b.slug}
                  className="bg-white rounded-2xl border border-slate-200/60 overflow-hidden shadow-sm flex flex-col hover:shadow-md hover:border-slate-300/80 transition-all group"
                >
                  {/* Image container */}
                  <div className="h-56 relative overflow-hidden bg-slate-100">
                    <img
                      src={b.image}
                      alt={b.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-4 left-4 bg-white/90 backdrop-blur border border-slate-100 px-3 py-1 rounded-full text-[10px] font-extrabold text-blue-600 uppercase tracking-wider shadow-sm">
                      {b.category}
                    </span>
                  </div>

                  {/* Content body */}
                  <div className="p-6 md:p-8 flex flex-col flex-1">
                    {/* Meta rows */}
                    <div className="flex items-center gap-4 text-[11px] font-semibold text-slate-400 mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar size={11} />
                        {b.date}
                      </span>
                      <span className="h-1.5 w-1.5 rounded-full bg-slate-200" />
                      <span className="flex items-center gap-1">
                        <Clock size={11} />
                        {b.readTime}
                      </span>
                    </div>

                    <h3 className="font-display text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug mb-3">
                      {b.title}
                    </h3>

                    <p className="text-slate-500 text-[13.5px] leading-relaxed mb-6 line-clamp-3">
                      {b.excerpt}
                    </p>

                    <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold">
                      <span className="flex items-center gap-1.5 text-slate-700">
                        <User size={12} className="text-slate-400" />
                        {b.author}
                      </span>

                      <Link
                        href="/login"
                        className="text-blue-600 flex items-center gap-1 hover:text-blue-700 transition-colors"
                      >
                        Read Article
                        <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
