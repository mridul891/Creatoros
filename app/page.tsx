
import Particles from "@/components/motion-primitives/particle"
import { WaitlistForm } from "@/components/modules/Landing/waitlist-form"
import HeroSection from "@/components/modules/Landing/herosection"

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col items-center overflow-x-clip  justify-center">
    <section className="flex flex-col items-center px-4 sm:px-6 lg:px-8">

    <HeroSection />
      
    <Particles
        quantityDesktop={350}
        quantityMobile={100}
        ease={80}
        color={"#F7FF9B"}
        refresh
      />

    </section>


  </main>
  )
}
 