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

/** Who owns a workflow step: Stellara, a handoff that needs staff, or the firm's team. */
export type WorkflowOwner = "auto" | "handoff" | "staff"

export interface WorkflowStep {
  stage: string
  owner: WorkflowOwner
  title: string
  meta: string
  lines: string[]
  next?: string
}

export interface WorkflowScenario {
  id: string
  label: string
  steps: WorkflowStep[]
}

export interface HowItFitsContent {
  eyebrow: string
  title: string
  description: string
  takeaway: string
  illustrative: string
  scenarioLabel: string
  replay: string
  replayLabel: string
  ownerLabels: Record<WorkflowOwner, string>
  nextLabel: string
  scenarios: WorkflowScenario[]
  footnote: string
}

export interface MeasurableWorkMetric {
  label: string
  value: string
}

export type AttentionTone = "auto" | "handoff" | "done"

export interface MeasurableWorkAttention {
  label: string
  meta: string
  status: string
  tone: AttentionTone
}

export interface MeasurableWorkContent {
  eyebrow: string
  title: string
  description: string
  reportLabel: string
  dashboardLabel: string
  periodLabel: string
  metrics: MeasurableWorkMetric[]
  attentionLabel: string
  attention: MeasurableWorkAttention[]
}

export interface StorySceneCopy {
  time: string
  step: string
  title: string
  headline: string
  headlineAccent?: string
  body: string
  summary: string
}

export interface StoryControlsContent {
  previous: string
  next: string
  /** Template with {current} and {total}. */
  progress: string
  illustrative: string
  handledAutomatically: string
  staffActionNeeded: string
  intakeAriaLabel: string
}

export interface LabeledValue {
  label: string
  value: string
}

export interface TreatmentStoryContent {
  ariaLabel: string
  scenes: StorySceneCopy[]
  ui: {
    queueTitle: string
    checkinType: string
    statusScheduled: string
    queue: { name: string; when: string }[]
    smsFrom: string
    outgoing: string
    delivered: string
    reply: string
    replyTime: string
    flag: string
    alertTitle: string
    alertClient: string
    alertDetails: string[]
    alertNext: string
    assignee: string
    takeoverTitle: string
    takeoverLines: string[]
    takeoverNote: string
  }
}

export interface ReviewsStoryContent {
  ariaLabel: string
  scenes: StorySceneCopy[]
  ui: {
    ruleTitle: string
    ruleWhen: string
    ruleTrigger: string
    ruleThen: string
    ruleAction: string
    ruleNote: string
    milestoneEvent: string
    smsFrom: string
    request: string
    delivered: string
    linkTitle: string
    linkBody: string
    linkCta: string
    linkContact: string
    reminderTitle: string
    reminderWhen: string
    reminder: string
    reminderRules: string[]
    activityTitle: string
    activity: { name: string; status: string; tone: AttentionTone }[]
  }
}

export interface WebsiteStoryContent {
  ariaLabel: string
  scenes: StorySceneCopy[]
  ui: {
    url: string
    siteHeadline: string
    siteBody: string
    siteCta: string
    visitor: string
    chatPrompt: string
    chatTitle: string
    question: string
    answer: string
    infoNote: string
    detailsTitle: string
    details: LabeledValue[]
    consultTitle: string
    slots: string[]
    consultSent: string
    summaryTitle: string
    summaryLines: string[]
    summaryNext: string
  }
}

export interface StoriesContent {
  controls: StoryControlsContent
  treatment: TreatmentStoryContent
  reviews: ReviewsStoryContent
  website: WebsiteStoryContent
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
  stories: StoriesContent
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
