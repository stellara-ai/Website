// Centralized, typed content schema shared by both locales.
// Components receive translated content through these types so locale logic
// stays out of the presentation layer and copy can later move to a CMS.

export type Locale = "en" | "es"

export interface NavItem {
  /** Stable identifier used for equivalent-route resolution across locales. */
  id: string
  label: string
  /** In-page anchor target. */
  href: string
}

export interface CtaContent {
  label: string
}

export interface MetaContent {
  title: string
  description: string
  ogTitle: string
  ogDescription: string
}

export type HeroServiceId = "after-hours" | "reviews" | "website-intake" | "treatment-follow-up"

export interface HeroService {
  id: HeroServiceId
  label: string
}

export interface HeroContent {
  eyebrow: string
  headline: string
  supporting: string
  selectorQuestion: string
  services: HeroService[]
  demoCta: string
  origin: string
  headlinePrefix: string
  headlineWord: string
  headlineSuffix: string
  rotatingWords: string[]
  description: string
  primaryCta: string
  secondaryCta: string
  credibility: string
  observation: string
  industryLabel: string
  industryMore: string
  industryLess: string
}

export interface FrictionContent {
  eyebrow: string
  statements: string[]
  conclusion: string
}

/** A single "work moving" pair: something enters (`from`) and Stellara moves it to an action (`to`). */
export interface WorkPair {
  id: string
  index: string
  from: string
  to: string
  headline: string
  description: string
  capabilities: string[]
}

export interface WorkContent {
  eyebrow: string
  title: string
  description: string
  pairs: WorkPair[]
  boundariesTitle: string
  boundaries: string[]
}

export interface ExplorerOption {
  id: string
  label: string
}

export interface ExplorerRecommendation {
  id: string
  title: string
  why: string
  components: string[]
  /** Diagnostic breakdown shown on the result screen. */
  friction: string
  system: string
  outcome: string
  /** Ordered node labels for the animated "work moving" workflow output. */
  workflow: string[]
}

export interface ExplorerContent {
  eyebrow: string
  title: string
  intro: string
  start: string
  progressLabel: string
  q1: { prompt: string; options: ExplorerOption[] }
  q2: { prompt: string; options: ExplorerOption[] }
  q3: { prompt: string; options: ExplorerOption[] }
  q4: { prompt: string; options: ExplorerOption[] }
  back: string
  resultEyebrow: string
  whyLabel: string
  componentsLabel: string
  /** Labels for the friction / system / outcome diagnostic breakdown. */
  frictionLabel: string
  systemLabel: string
  outcomeLabel: string
  workflowLabel: string
  disclaimer: string
  resultCta: string
  reset: string
  recommendations: ExplorerRecommendation[]
  /** Maps the first-question answer id to a recommendation id. */
  routing: Record<string, string>
}

export interface ProcessPhase {
  index: string
  title: string
  description: string
}

export interface ProcessContent {
  eyebrow: string
  title: string
  phases: ProcessPhase[]
}

export interface SoftwareContent {
  eyebrow: string
  headline: string
  description: string
  capabilities: string[]
  secondary: string
  cta: string
}

export interface IndustryItem {
  id: string
  name: string
  examples: string[]
  /** Operational sequence shown in the hero board: work entering and moving through the business. */
  flow: string[]
}

export interface IndustryContent {
  eyebrow: string
  title: string
  description: string
  industries: IndustryItem[]
  note: string
  /** Understated label marking the demo dashboards as sample data, not real client results. */
  demoLabel: string
}

export interface PrincipleItem {
  title: string
  description: string
}

export interface PrinciplesContent {
  eyebrow: string
  title: string
  description: string
  principles: PrincipleItem[]
}

export interface AppointmentContent {
  title: string
  reassurance: string
  step: string
  of: string
  steps: { reason: string; contact: string; time: string; confirm: string }
  reasonOptions: ExplorerOption[]
  fields: {
    name: string
    email: string
    company: string
    phone: string
    website: string
    language: string
    description: string
    optional: string
  }
  placeholders: {
    name: string
    email: string
    company: string
    phone: string
    website: string
    description: string
  }
  timeIntro: string
  timeNote: string
  pickDay: string
  pickTime: string
  consent: string
  privacyLink: string
  next: string
  back: string
  submit: string
  submitting: string
  confirmTitle: string
  confirmReason: string
  confirmTime: string
  confirmEmail: string
  whatNext: string
  whatNextBody: string
  close: string
  errors: {
    name: string
    email: string
    emailInvalid: string
    company: string
    reason: string
    time: string
    consent: string
  }
}

export interface AssistantContent {
  launcherLabel: string
  title: string
  status: string
  intro: string
  quickReplies: ExplorerOption[]
  followUp: string
  recommendPrefix: string
  whyPrefix: string
  bookCta: string
  restart: string
  restartLabel: string
  minimizeLabel: string
  closeLabel: string
  disclaimer: string
  inputPlaceholder: string
  send: string
  guideNote: string
}

export interface FinalCtaContent {
  headline: string
  description: string
  primaryCta: string
  secondaryCta: string
}

export interface FooterContent {
  descriptor: string
  navTitle: string
  contactTitle: string
  contactPlaceholder: string
  legalTitle: string
  privacy: string
  terms: string
  crafted: string
  craftedSecondary?: string
  rights: string
}

export interface WhatsAppContent {
  label: string
  message: string
  cta: string
}

export interface LegalSection {
  heading: string
  body: string[]
}

export interface LegalPageContent {
  title: string
  updated: string
  reviewNote: string
  intro: string
  sections: LegalSection[]
  backHome: string
}

export interface CommonContent {
  skipToContent: string
  languageLabel: string
  languageEnglish: string
  languageSpanish: string
  themeLabel: string
  themeSystem: string
  themeLight: string
  themeDark: string
  openMenu: string
  closeMenu: string
  menuTitle: string
}

export interface SiteContent {
  locale: Locale
  meta: MetaContent
  nav: NavItem[]
  navCta: string
  common: CommonContent
  hero: HeroContent
  friction: FrictionContent
  work: WorkContent
  explorer: ExplorerContent
  process: ProcessContent
  software: SoftwareContent
  industries: IndustryContent
  principles: PrinciplesContent
  appointment: AppointmentContent
  assistant: AssistantContent
  finalCta: FinalCtaContent
  footer: FooterContent
  whatsapp: WhatsAppContent
  privacy: LegalPageContent
  terms: LegalPageContent
}
