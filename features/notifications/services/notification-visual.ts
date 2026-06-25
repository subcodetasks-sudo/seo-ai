import {
  Activity,
  AlertTriangle,
  Bell,
  CheckCircle2,
  FileBarChart,
  Link2Off,
  type LucideIcon,
} from "lucide-react";

export type NotificationVisual = {
  icon: LucideIcon;
  iconClass: string;
  badgeClass: string;
};

/**
 * Maps a notification `type` to an icon and color treatment. The backend type
 * vocabulary isn't fixed, so we match on keywords and fall back to a bell.
 */
export function getNotificationVisual(type: string | null): NotificationVisual {
  const key = (type ?? "").toLowerCase();

  if (/(error|broken|404|fail|down|expired)/.test(key)) {
    return { icon: Link2Off, iconClass: "text-error-300", badgeClass: "bg-error-50" };
  }
  if (/(warn|issue|problem|alert|critical)/.test(key)) {
    return { icon: AlertTriangle, iconClass: "text-warning-400", badgeClass: "bg-warning-50" };
  }
  if (/(success|complete|done|verified|ready|resolved)/.test(key)) {
    return { icon: CheckCircle2, iconClass: "text-success-300", badgeClass: "bg-success-50" };
  }
  if (/(report|summary|digest|weekly)/.test(key)) {
    return { icon: FileBarChart, iconClass: "text-primary-500", badgeClass: "bg-primary-75" };
  }
  if (/(crawl|scan|analy|index)/.test(key)) {
    return { icon: Activity, iconClass: "text-secondary-400", badgeClass: "bg-secondary-50" };
  }

  return { icon: Bell, iconClass: "text-secondary-300", badgeClass: "bg-neutral-100" };
}
