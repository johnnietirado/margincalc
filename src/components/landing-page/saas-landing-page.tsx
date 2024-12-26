import FAQSection from "./faq-section";
import FeatureSection from "./feature-section";
import Hero from "./hero";
import LogoCloud from "./logo-cloud";
import TestimonialSection from "./testimonial-section";

export default async function SaasLandingPage() {
  return (
    <main className="isolate">
      <Hero />
      <LogoCloud />
      <FeatureSection />
      <TestimonialSection />
      <FAQSection />
    </main>
  );
}
