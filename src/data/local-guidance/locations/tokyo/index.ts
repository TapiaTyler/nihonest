import { definePrefectureGuidance } from "@/data/local-guidance/define-location";
import { guidance as chiyoda } from "./chiyoda";
import { guidance as chuo } from "./chuo";
import { guidance as minato } from "./minato";
import { guidance as shinjuku } from "./shinjuku";
import { guidance as bunkyo } from "./bunkyo";
import { guidance as taito } from "./taito";
import { guidance as sumida } from "./sumida";
import { guidance as koto } from "./koto";
import { guidance as shinagawa } from "./shinagawa";
import { guidance as meguro } from "./meguro";
import { guidance as ota } from "./ota";
import { guidance as setagaya } from "./setagaya";
import { guidance as shibuya } from "./shibuya";
import { guidance as nakano } from "./nakano";
import { guidance as suginami } from "./suginami";
import { guidance as toshima } from "./toshima";
import { guidance as kita } from "./kita";
import { guidance as arakawa } from "./arakawa";
import { guidance as itabashi } from "./itabashi";
import { guidance as nerima } from "./nerima";
import { guidance as adachi } from "./adachi";
import { guidance as katsushika } from "./katsushika";
import { guidance as edogawa } from "./edogawa";
import { guidance as hachioji } from "./hachioji";
import { guidance as tachikawa } from "./tachikawa";
import { guidance as fuchu } from "./fuchu";
import { guidance as machida } from "./machida";

/** Tokyo: one import and one list entry per researched location. */
export const prefecture = definePrefectureGuidance({
  geography: { id: "tokyo", name: "Tokyo", aliases: ["Tokyo Metropolis","Tokyo-to"] },
  locations: [
    chiyoda,
    chuo,
    minato,
    shinjuku,
    bunkyo,
    taito,
    sumida,
    koto,
    shinagawa,
    meguro,
    ota,
    setagaya,
    shibuya,
    nakano,
    suginami,
    toshima,
    kita,
    arakawa,
    itabashi,
    nerima,
    adachi,
    katsushika,
    edogawa,
    hachioji,
    tachikawa,
    fuchu,
    machida,
  ],
});
