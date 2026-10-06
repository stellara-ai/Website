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
  headline: string
  supporting: string
  selectorQuestion: string
  services: HeroService[]
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
}

export interface ExplorerContent {
  q3: { prompt: string; options: ExplorerOption[] }
  componentsLabel: string
  recommendations: ExplorerRecommendation[]
  /** Maps the first-question answer id to a recommendation id. */
  routing: Record<string, string>
}

export interface PersonalizedDemoStep {
  index: string
  title: string
  body: string
}

export interface PersonalizedDemoContent {
  eyebrow: string
  title: string
  description: string
  fields: {
    websiteLabel: string
    websitePlaceholder: string
    firstNameLabel: string
    firstNamePlaceholder: string
    lastNameLabel: string
    lastNamePlaceholder: string
    mobileLabel: string
    mobilePlaceholder: string
    emailLabel: string
    emailPlaceholder: string
  }
  cta: string
  secondaryCta: string
  helperText: string
  submittedText: string
  steps: PersonalizedDemoStep[]
}

export interface HowItFitsContent {
  eyebrow: string
  title: string
  description: string
  incoming: string[]
  core: string[]
  output: string[]
  brandLabel: string
  footnote: string
}

export interface MeasurableWorkMetric {
  label: string
  value: string
}

export interface MeasurableWorkContent {
  eyebrow: string
  title: string
  description: string
  reportLabel: string
  dashboardLabel: string
  metrics: MeasurableWorkMetric[]
}

export interface PlanFeatureRow {
  label: string
  essentials: boolean
  pro: boolean
}

export interface PlanCard {
  name: string
  highlighted?: boolean
  monthly: string
  implementation: string
  summary: string
  points: string[]
}

export interface PlansContent {
  eyebrow: string
  title: string
  description: string
  badge: string
  monthlyPriceLabel: string
  implementationLabel: string
  featureHeader: string
  essentialsLabel: string
  proLabel: string
  includedEssentialsAria: string
  notIncludedEssentialsAria: string
  includedProAria: string
  notIncludedProAria: string
  distinction: string
  addOnsLabel: string
  primaryCta: string
  secondaryCta: string
  plans: PlanCard[]
  addOns: string[]
  features: PlanFeatureRow[]
}

export interface TrustFounderContent {
  eyebrow: string
  title: string
  description: string
  imagePlaceholder: string
  paragraphOne: string
  paragraphTwo: string
  tagline: string
}

export interface FaqItem {
  q: string
  a: string
}

export interface FaqFinalCtaContent {
  eyebrow: string
  title: string
  description: string
  faqs: FaqItem[]
  finalTitle: string
  finalDescription: string
  primaryCta: string
  secondaryCta: string
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
  intro: string
  quickReplies: ExplorerOption[]
  followUp: string
  recommendPrefix: string
  whyPrefix: string
  bookCta: string
  restart: string
  restartLabel: string
  closeLabel: string
  disclaimer: string
  guideNote: string
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
}

export interface SiteContent {
  locale: Locale
  meta: MetaContent
  nav: NavItem[]
  navCta: string
  common: CommonContent
  hero: HeroContent
  personalizedDemo: PersonalizedDemoContent
  howItFits: HowItFitsContent
  measurableWork: MeasurableWorkContent
  plans: PlansContent
  trustFounder: TrustFounderContent
  faqFinalCta: FaqFinalCtaContent
  explorer: ExplorerContent
  appointment: AppointmentContent
  assistant: AssistantContent
  footer: FooterContent
  whatsapp: WhatsAppContent
  privacy: LegalPageContent
  terms: LegalPageContent
}
