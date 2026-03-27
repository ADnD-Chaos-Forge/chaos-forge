import type { ClassGroup } from "@/lib/rules/types";

/**
 * Returns CSS class names for class-group-based glow, border, and HP bar styling.
 */
export function getClassGroupColors(group: ClassGroup) {
  switch (group) {
    case "warrior":
      return {
        glow: "glow-warrior",
        hpBar: "hp-bar-warrior",
        badge: "bg-red-500/80 text-white",
        text: "text-red-400",
      };
    case "priest":
      return {
        glow: "glow-priest",
        hpBar: "hp-bar-priest",
        badge: "bg-amber-500/80 text-white",
        text: "text-amber-400",
      };
    case "rogue":
      return {
        glow: "glow-rogue",
        hpBar: "hp-bar-rogue",
        badge: "bg-blue-500/80 text-white",
        text: "text-blue-400",
      };
    case "wizard":
      return {
        glow: "glow-wizard",
        hpBar: "hp-bar-wizard",
        badge: "bg-teal-500/80 text-white",
        text: "text-teal-400",
      };
  }
}
