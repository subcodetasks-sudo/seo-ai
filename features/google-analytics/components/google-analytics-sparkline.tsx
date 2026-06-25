import type { MetricTone } from "../types";

type GoogleAnalyticsSparklineProps = {
  data: number[];
  tone: MetricTone;
};

const TONE_COLORS: Record<MetricTone, string> = {
  green: "#22C55E",
  gray: "#6B7280",
  yellow: "#EAB308",
  red: "#EF4444",
};

export function GoogleAnalyticsSparkline({ data, tone }: GoogleAnalyticsSparklineProps) {
  const width = 120;
  const height = 32;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data
    .map((value, index) => {
      const x = (index / (data.length - 1)) * width;
      const y = height - ((value - min) / range) * height;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="h-8 w-full max-w-28"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <polyline
        fill="none"
        stroke={TONE_COLORS[tone]}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
}
