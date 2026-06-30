export const landingKeys = {
  heroes: (lang: string) => ['landing', 'heroes', lang] as const,
  pricing: (lang: string) => ['landing', 'pricing', lang] as const,
  aboutUs: (lang: string) => ['landing', 'about-us', lang] as const,
  statistics: (lang: string) => ['landing', 'statistics', lang] as const,
  toolUsage: (lang: string) => ['landing', 'tool-usage', lang] as const,
  faqs: (lang: string) => ['landing', 'faqs', lang] as const,
  testimonials: (lang: string) => ['landing', 'testimonials', lang] as const,
  settings: (lang: string) => ['landing', 'settings', lang] as const,
  footer: (lang: string) => ['landing', 'footer', lang] as const,
};
