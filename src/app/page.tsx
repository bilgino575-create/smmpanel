"use client";
import React from "react";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { Hero } from "@/components/landing/Hero";
import {
  Metrics, Platforms, WhyUs, ServicesPreview, HowItWorks, ApiSection, Pricing, Faq, FinalCta,
} from "@/components/landing/Sections";
import { LandingChatbot } from "@/components/landing/LandingChatbot";

export default function Home() {
  return (
    <div className="bg-white text-[color:var(--color-ink)] min-h-screen selection:bg-blue-600/30 selection:text-white">
      <SiteNav />
      <main>
        <Hero />
        <Metrics />
        <Platforms />
        <WhyUs />
        <ServicesPreview />
        <HowItWorks />
        <ApiSection />
        <Pricing />
        <Faq />
        <FinalCta />
      </main>
      <SiteFooter />
      <LandingChatbot />
    </div>
  );
}
