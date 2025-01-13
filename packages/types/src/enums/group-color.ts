export enum GroupColor {
  "red" = "red-600",
  "sky" = "sky-400",
  "blue" = "blue-700",
  "green" = "green-600",
  "yellow" = "yellow-400",
  "purple" = "purple-700",
  "pink" = "pink-600",
  "orange" = "orange-600",
  "brown" = "yellow-900",
  "gray" = "gray-400",
  "black" = "gray-950",
}

export function getHexColor(groupColor: GroupColor): string {
  const colorMap: Record<GroupColor, string> = {
    [GroupColor.red]: "dc2626",
    [GroupColor.sky]: "38bdf8",
    [GroupColor.blue]: "1D4ED8",
    [GroupColor.green]: "16a34a",
    [GroupColor.yellow]: "facc15",
    [GroupColor.purple]: "7E22CE",
    [GroupColor.pink]: "db2777",
    [GroupColor.orange]: "ea580c",
    [GroupColor.brown]: "713f12",
    [GroupColor.gray]: "9ca3af",
    [GroupColor.black]: "030712",
  };

  return colorMap[groupColor];
}
