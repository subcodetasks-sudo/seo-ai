// TODO: MOCK DATA — remove this file and set USE_MOCK_SUMMARY = false in api.ts when the backend is ready
import type { IssueSummary } from "../types";

export const MOCK_ISSUE_SUMMARY: IssueSummary = {
  executive_summary:
    "ارتفعت الزيارات هذا الأسبوع بنسبة 18%، مما يعكس التحسن الملحوظ من زيارة الأمرة المتصورة. يعكس هذا النمو الدفعة التصاعدية ويتوقع هذا النمو الدفعة التصاعدية للمبيعات قريبًا.",
  period_days: 30,
  performance_score: 87,
  confidence_rate: 87,
  generated_at: new Date().toISOString(),
  trends: [
    { metric: "الزيارات", value: 18, direction: "up" },
    { metric: "معدل التحويل", value: 11, direction: "up" },
    { metric: "معدل الارتداد", value: 32, direction: "down" },
  ],
  key_metrics: [
    { label: "معدل التحويل", value: "29.4", unit: "%" },
    { label: "الإيرادات", value: "312K", unit: " ريال" },
    { label: "معدل الارتداد", value: "2.4", unit: "%" },
    { label: "الجلسات", value: "31,420" },
    { label: "المستخدمين", value: "24,831" },
  ],
  recommendations: [
    {
      id: "rec-1",
      title: "كلمات مفتاحية قريبة من المساحة الأولى",
      description:
        "حوّل 8 كلمات مفتاحية تحتل مراكز 4–10 إلى الصفحة الأولى عبر تحديث المحتوى وبناء الروابط المستهدفة.",
      priority: "urgent",
      expected_impact: "زيادة متوقعة في الزيارات بنسبة 25–35% خلال شهرين",
      effort: "medium",
      confidence: 91,
    },
    {
      id: "rec-2",
      title: "احتياط عناوين واجهة واضحة استراتيجي",
      description:
        "تحسين صفحات المنتجات بعناوين H1 وH2 تتضمن الكلمات المفتاحية الأساسية للسوق المستهدف.",
      priority: "high",
      expected_impact: "تحسين النقر بنسبة 15% وتعزيز ظهور البحث المنظم",
      effort: "low",
      confidence: 84,
    },
    {
      id: "rec-3",
      title: "نمو يروج لها الموقع لها استراتيجية",
      description:
        "نشر محتوى بلوج أسبوعي يستهدف الكلمات ذات الذيل الطويل لتنويع مصادر الزيارات العضوية.",
      priority: "medium",
      expected_impact: "بناء سلطة المجال ورفع الزيارات العضوية 10–20% خلال 3 أشهر",
      effort: "high",
      confidence: 76,
    },
    {
      id: "rec-4",
      title: "زيادة المحتوى المتعدد الوسائط",
      description:
        "إضافة مقاطع فيديو وصور محسّنة لصفحات الفئات الرئيسية لتحسين وقت الجلسة ومعدل الارتداد.",
      priority: "low",
      expected_impact: "خفض معدل الارتداد 5–8% وتحسين الإشارات السلوكية لمحركات البحث",
      effort: "medium",
      confidence: 68,
    },
  ],
  root_cause_analysis: [
    {
      issue: "انخفاض معدل التحويل",
      cause: "بطء تحميل صفحات الدفع على الأجهزة المحمولة",
      priority: "urgent",
      frequency: 19,
    },
    {
      issue: "نمو الزيارات المشبوهة",
      cause: "ارتفاع حركة البوتات من مصادر خارجية",
      priority: "high",
      frequency: 7,
    },
    {
      issue: "ضعف معدل التفاعل",
      cause: "المحتوى لا يتطابق مع نية البحث للكلمات المفتاحية المستهدفة",
      priority: "medium",
      frequency: 4,
    },
  ],
};
