"use client";

import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import StatsSection from "@/components/landing/StatsSection";
import FeatureSection from "@/components/landing/FeatureSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import StudentTeacherSection from "@/components/landing/StudentTeacherSection";
import Footer from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <div style={{ background: "#fff", minHeight: "100vh", overflowX: "hidden" }}>
      <Navbar />
      <main>
        <HeroSection />
        <StatsSection />
        <FeatureSection />
        <HowItWorksSection />
        <StudentTeacherSection />
      </main>
      <Footer />
    </div>
  );
}
