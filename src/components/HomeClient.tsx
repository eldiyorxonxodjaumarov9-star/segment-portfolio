"use client";

import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { SiteContentProvider, useSiteContent } from "@/contexts/SiteContentContext";
import { useMounted } from "@/hooks/useMounted";
import { PremiumBackground } from "./PremiumBackground";
import { ScrollRevealSection } from "./ScrollRevealSection";
import { ThemeApplier } from "./ThemeApplier";
import { LoadingScreen } from "./LoadingScreen";
import { ScrollProgress } from "./ScrollProgress";
import { MouseGlow } from "./MouseGlow";
import { Header } from "./Header";
import { Hero } from "./Hero";
import { BrandsSection } from "./BrandsSection";
import { TopVideos } from "./TopVideos";
import { ClientWorks } from "./ClientWorks";
import { StatsDashboard } from "./StatsDashboard";
import { TeamSection } from "./TeamSection";
import { AboutSection } from "./AboutSection";
import { ContactSection } from "./ContactSection";

function HomeContent() {
  const { content } = useSiteContent();
  const mounted = useMounted();
  const [loading, setLoading] = useState(true);
  const theme = content.config.theme;

  useEffect(() => {
    if (!mounted) return;
    const t = window.setTimeout(() => setLoading(false), 2600);
    return () => window.clearTimeout(t);
  }, [mounted]);

  const showLoader = mounted && loading;

  return (
    <div className="relative min-h-screen overflow-x-hidden text-white">
      <PremiumBackground />
      <div className="relative z-10">
      <ThemeApplier />
      <ScrollProgress />
      {mounted && theme.mouseGlowEnabled && <MouseGlow />}
      <AnimatePresence>{showLoader && <LoadingScreen key="loader" />}</AnimatePresence>

      <Header />
      <main>
        <Hero />
        <ScrollRevealSection from="left">
          <BrandsSection />
        </ScrollRevealSection>
        <ScrollRevealSection from="right">
          <TopVideos />
        </ScrollRevealSection>
        <ScrollRevealSection from="bottom">
          <ClientWorks />
        </ScrollRevealSection>
        <ScrollRevealSection from="top">
          <StatsDashboard />
        </ScrollRevealSection>
        <ScrollRevealSection from="left" delay={0.05}>
          <TeamSection />
        </ScrollRevealSection>
        <ScrollRevealSection from="right">
          <AboutSection />
        </ScrollRevealSection>
        <ScrollRevealSection from="bottom">
          <ContactSection />
        </ScrollRevealSection>
      </main>
      </div>
    </div>
  );
}

export default function HomeClient() {
  return (
    <SiteContentProvider>
      <HomeContent />
    </SiteContentProvider>
  );
}
