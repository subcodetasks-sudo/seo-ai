// ── Hero ──────────────────────────────────────────────────────────
export interface HeroSeo {
  title: string;
  description: string;
}

export interface HeroImage {
  url: string;
  alt: string;
  path: string;
}

export interface HeroPartner {
  name: string;
  url: string;
  logo: string | null;
  alt: string;
}

export interface HeroStatistic {
  number: string;
  label: string;
}

export interface HeroSeoHealthItem {
  label: string;
  value: string;
}

export interface HeroSeoHealthSuggestion {
  title: string;
  content: string;
  approved: boolean;
}

export interface HeroSeoHealth {
  overview: HeroSeoHealthItem[];
  suggestion: HeroSeoHealthSuggestion;
  auto_applied: { count: number; last_applied_at: string };
  updated_at: string;
}

export interface Hero {
  id: number;
  title: string;
  description: string;
  content: string;
  seo: HeroSeo;
  images: HeroImage[];
  partners: HeroPartner[];
  youtube_url: string;
  statistics: HeroStatistic[];
  ytkamal: string[];
  seo_health: HeroSeoHealth;
  sort_order: number;
}

// ── About Us ──────────────────────────────────────────────────────
export interface AboutHighlightItem {
  number: string;
  text: string;
}

export interface AboutHighlights {
  id: number;
  title: string;
  items: AboutHighlightItem[];
  sort_order: number;
}

export interface AboutUs {
  id: number;
  title: string;
  description: string;
  content: string;
  sort_order: number;
  highlights: AboutHighlights;
}

// ── Pricing ───────────────────────────────────────────────────────
export interface PricingPackageItem {
  title: string;
  description: string;
  price: string;
  button_text: string;
  features: string[];
  /** Optional billing slug when CMS provides it (e.g. "starter", "pro"). */
  plan_name?: string;
  slug?: string;
}

export interface PricingPackages {
  id: number;
  items: PricingPackageItem[];
  sort_order: number;
}

export interface Pricing {
  id: number;
  title: string;
  description: string;
  content: string;
  sort_order: number;
  packages: PricingPackages;
}

// ── Statistics ────────────────────────────────────────────────────
export interface StatCard {
  title: string;
  value: string;
  description: string | null;
  style: 'featured' | 'progress' | 'default';
}

export interface StatCards {
  id: number;
  items: StatCard[];
  sort_order: number;
}

export interface Statistics {
  id: number;
  title: string;
  description: string | null;
  content: string;
  sort_order: number;
  cards: StatCards;
}

// ── Tool Usage ────────────────────────────────────────────────────
export interface ToolUsageField {
  label: string;
  type: "text" | "number" | "url";
  value: string | number;
}

export interface ToolUsageSection {
  name: string;
  fields: ToolUsageField[];
}

export interface ToolUsageFeature {
  id: number;
  slug: string;
  content: string;
  title: string;
  description: string;
  sections: ToolUsageSection[];
}

export interface ToolUsage {
  id: number;
  title: string;
  description: string;
  content: string;
  features: ToolUsageFeature[];
  sort_order: number;
}

// ── FAQ ───────────────────────────────────────────────────────────
export interface FaqItem {
  question: string;
  answer: string;
}

export interface FaqStatItem {
  number: string;
  label: string;
}

export interface FaqStatistics {
  title: string;
  description: string;
  content: string | null;
  items: FaqStatItem[];
}

export interface Faq {
  id: number;
  title: string;
  description: string;
  content: string | null;
  items: FaqItem[];
  statistics: FaqStatistics;
  sort_order: number;
}

// ── Testimonials ──────────────────────────────────────────────────
export interface TestimonialContent {
  name: string;
  job_title: string;
  content: string;
}

export interface TestimonialSeo {
  meta_title: string;
  meta_description: string;
}

export interface Testimonial {
  id: number;
  content: TestimonialContent;
  image: string | null;
  image_alt: string | null;
  rate: number;
  sort_order: number;
  seo: TestimonialSeo;
}

export interface TestimonialsData {
  id: number;
  title: string;
  description: string;
  testimonials: Testimonial[];
}

// ── Legal (Terms of Use / Privacy Policy) ────────────────────────
export interface LegalPage {
  id: number;
  title: string;
  description: string;
  content: string;
  sort_order: number;
}

// ── Settings ──────────────────────────────────────────────────────
export interface SettingsBrand {
  logo: string | null;
  about: string;
}

export interface SettingsContact {
  email: string;
  phones: string[];
}

export interface SettingsOffice {
  title: string;
  address: string;
}

export interface SettingsSocial {
  linkedin: string | null;
  facebook: string | null;
  instagram: string | null;
  x: string | null;
}

export interface SettingsFooterCta {
  title: string;
  description: string;
  button_text: string;
  platform_url: string;
}

export interface SettingsFooterLink {
  label: string;
  url: string;
}

export interface SettingsFooterLinks {
  platform: SettingsFooterLink[];
  company: SettingsFooterLink[];
  legal: SettingsFooterLink[];
}

export interface Settings {
  app_name: string;
  default_locale: string;
  default_currency: string;
  maintenance_mode: boolean;
  supported_currencies: string[];
  brand: SettingsBrand;
  contact: SettingsContact;
  offices: SettingsOffice[];
  social: SettingsSocial;
  copyright: string;
  footer_links: SettingsFooterLinks;
  footer_cta: SettingsFooterCta;
}
