import { prefecture as aichi } from "./aichi";
import { prefecture as chiba } from "./chiba";
import { prefecture as fukuoka } from "./fukuoka";
import { prefecture as fukushima } from "./fukushima";
import { prefecture as gunma } from "./gunma";
import { prefecture as hiroshima } from "./hiroshima";
import { prefecture as hokkaido } from "./hokkaido";
import { prefecture as hyogo } from "./hyogo";
import { prefecture as kanagawa } from "./kanagawa";
import { prefecture as kumamoto } from "./kumamoto";
import { prefecture as kyoto } from "./kyoto";
import { prefecture as mie } from "./mie";
import { prefecture as miyagi } from "./miyagi";
import { prefecture as niigata } from "./niigata";
import { prefecture as okayama } from "./okayama";
import { prefecture as osaka } from "./osaka";
import { prefecture as saitama } from "./saitama";
import { prefecture as shizuoka } from "./shizuoka";
import { prefecture as tokyo } from "./tokyo";
import { prefecture as yamaguchi } from "./yamaguchi";

/** One line per prefecture folder; each folder's index.ts lists its locations. */
export const prefectureGuidance = [
  aichi,
  chiba,
  fukuoka,
  fukushima,
  gunma,
  hiroshima,
  hokkaido,
  hyogo,
  kanagawa,
  kumamoto,
  kyoto,
  mie,
  miyagi,
  niigata,
  okayama,
  osaka,
  saitama,
  shizuoka,
  tokyo,
  yamaguchi,
] as const;
