import HeroSection from '@/components/landing/HeroSection'
import BenefitsSection from '@/components/landing/BenefitsSection'
import HowItWorksSection from '@/components/landing/HowItWorksSection'
import FAQSection from '@/components/landing/FAQSection'

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <BenefitsSection />
      <HowItWorksSection />
      <FAQSection />
    </main>
  )
}
