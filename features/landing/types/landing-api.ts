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
  logo: string;
  alt: string;
}

export interface Hero {
  id: number;
  title: string;
  description: string;
  seo: HeroSeo;
  images: HeroImage[];
  partners: HeroPartner[];
  sort_order: number;
}

// ── About Us ──────────────────────────────────────────────────────
export interface AboutHighlightItem {
  title: string;
  description: string;
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
  value: string;
  label: string;
}

export interface StatCards {
  id: number;
  items: StatCard[];
  sort_order: number;
}

export interface Statistics {
  id: number;
  title: string;
  description: string;
  content: string | null;
  sort_order: number;
  cards: StatCards;
}

// ── Tool Usage ────────────────────────────────────────────────────
export interface ToolUsageFeature {
  id: number;
  slug: string;
  title: string;
  description: string;
  sections: unknown[];
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

export interface Testimonial {
  id: number;
  content: TestimonialContent;
  rate: number;
}

export interface TestimonialsData {
  id: number;
  title: string;
  description: string;
  testimonials: Testimonial[];
}

// ── Settings ──────────────────────────────────────────────────────
export interface SettingsBrand {
  logo: string;
  about: string;
}

export interface SettingsContact {
  email: string;
  phones: string[];
}

export interface SettingsOffice {
  name?: string;
  address?: string;
  country?: string;
  location?: string;
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
  button_url: string;
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
  footer_links: { platform: unknown[]; company: unknown[]; legal: unknown[] };
  footer_cta: SettingsFooterCta;
}
