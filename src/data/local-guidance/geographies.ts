import { supportedGeographySchema } from "@/domain/geography/local-guidance";

export const supportedGeographies = [

  { id: "tokyo", name: "Tokyo Metropolis", type: "metropolis", aliases: ["Tokyo"], selectable: false },
  { id: "aichi", name: "Aichi Prefecture", type: "prefecture", aliases: ["Aichi"], selectable: false },
  { id: "shinjuku", name: "Shinjuku City", type: "special-ward", parentId: "tokyo", aliases: ["Shinjuku", "Shinjuku Ward", "Shinjuku-ku"], selectable: true },
  { id: "nagoya", name: "Nagoya City", type: "designated-city", parentId: "aichi", aliases: ["Nagoya", "Nagoya-shi"], selectable: true },
].map((record) => supportedGeographySchema.parse(record));
