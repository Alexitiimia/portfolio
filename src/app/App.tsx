import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { SkipLink } from '@/components/layout/SkipLink'
import { StatusBar } from '@/components/layout/StatusBar'
import { Contact } from '@/sections/contact/Contact'
import { Hero } from '@/sections/hero/Hero'
import { Offers } from '@/sections/offers/Offers'
import { Projects } from '@/sections/projects/Projects'
import { Security } from '@/sections/security/Security'
import { Services } from '@/sections/services/Services'
import { Tools } from '@/sections/tools/Tools'

/** Composição da página. A ordem das seções segue `SECTION_IDS` em content/sections.ts. */
export function App() {
  return (
    <>
      <SkipLink />
      <StatusBar />
      <Header />
      <main id="conteudo" tabIndex={-1}>
        <Hero />
        <Projects />
        <Tools />
        <Services />
        <Security />
        <Offers />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
