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

/** One line of the morning brief: what moved forward, paired with what staff should do. */
export interface BriefItem {
  count: string
  label: string
  detail: string
  action: string
  /** "handoff" when staff need to act, "done" when nothing is required. */
  tone: Extract<AttentionTone, "handoff" | "done">
}

export interface MeasurableWorkContent {
  eyebrow: string
  title: string
  description: string
  illustrative: string
  briefLabel: string
  briefFirm: string
  briefTime: string
  movedLabel: string
  actionLabel: string
  handoffStatus: string
  doneStatus: string
  items: BriefItem[]
  monthLabel: string
  monthPeriod: string
  monthMetrics: MeasurableWorkMetric[]
  footnote: string
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
    clientName: string
    clientTag: string
    staffTag: string
    weekLabel: string
    /** Three consecutive weekdays; the first holds the missed appointment. */
    days: string[]
    dates: string[]
    appointment: string
    appointmentTime: string
    missed: string
    checkinLabel: string
    checkinTime: string
    autoSent: string
    firm: string
    question: string
    reply: string
    replyTime: string
    alertTitle: string
    alertContext: string[]
    nextActionLabel: string
    nextAction: string
    statusLabel: string
    statusDone: string
  }
}

export interface ReviewsStoryContent {
  ariaLabel: string
  /** Shown under the controls in place of the shared fictional-data note. */
  illustrative: string
  scenes: StorySceneCopy[]
  ui: {
    clientTag: string
    prospectTag: string
    staffTag: string
    firmTag: string
    differentPerson: string
    matterName: string
    matterType: string
    /** Firm-defined milestones; the last one is completed in the scene. */
    milestones: string[]
    ruleMatched: string
    firm: string
    lockTime: string
    now: string
    request: string
    linkTitle: string
    linkLabel: string
    reviewerInitials: string
    reviewerName: string
    reviewText: string
    reviewLabel: string
    post: string
    posted: string
    searchQuery: string
    listingMeta: string
    reviewsLink: string
    tabs: string[]
    consultCta: string
    notificationTitle: string
    notificationSource: string
    requested: string
  }
}

export interface WebsiteStoryContent {
  ariaLabel: string
  scenes: StorySceneCopy[]
  ui: {
    url: string
    siteName: string
    siteHeadline: string
    siteCta: string
    visitorTag: string
    staffTag: string
    launcher: string
    assistantTitle: string
    question: string
    assistantReply: string
    detailsPrompt: string
    formTitle: string
    fields: LabeledValue[]
    callbackTitle: string
    callbackDay: string
    slots: string[]
    selectedSlot: number
    requested: string
    requestedNote: string
    inboxTitle: string
    inbox: string[]
    summaryTitle: string
    newLabel: string
    summary: LabeledValue[]
    nextActionLabel: string
    nextAction: string
  }
}

export interface StoriesContent {
  controls: StoryControlsContent
  treatment: TreatmentStoryContent
  reviews: ReviewsStoryContent
  website: WebsiteStoryContent
}

export interface PlanCoverage {
  name: string
  /** What the plan covers, phrased as the firm's need. */
  focus: string
  monthly: string
  implementation: string
  /** Label introducing `points`. */
  pointsLabel: string
  points: string[]
}

export interface PlansContent {
  eyebrow: string
  title: string
  description: string
  badge: string
  implementationLabel: string
  perMonthLabel: string
  /** Shown in the Pro column in place of repeating the Essentials list. */
  includesEssentials: string
  addOnsLabel: string
  addOnsNote: string
  primaryCta: string
  secondaryCta: string
  essentials: PlanCoverage
  pro: PlanCoverage
  addOns: string[]
}

export interface TrustFounderContent {
  eyebrow: string
  title: string
  name: string
  role: string
  /** Public path to the founder photograph. Leave null until the photo is added. */
  photo: string | null
  photoAlt: string
  photoPending: string
  paragraphs: string[]
}

export interface FaqItem {
  q: string
  a: string
}

export interface FaqGroup {
  label: string
  items: FaqItem[]
}

export interface FaqFinalCtaContent {
  eyebrow: string
  title: string
  description: string
  groups: FaqGroup[]
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
