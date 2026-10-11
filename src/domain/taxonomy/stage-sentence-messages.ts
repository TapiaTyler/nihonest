import type { InterfaceMessageId } from "@/domain/localization/interface-message-catalogs/english";
import type { JourneyStageId } from "./taxonomy";

/**
 * The form of each journey stage that reads naturally inside a sentence ("Useful while recently arrived").
 * It lives in the message catalogs, not in code, because lowercasing the label would break proper nouns such as
 * Japan and cannot be right for every language.
 */
export const stageSentenceMessageIds: Record<JourneyStageId, InterfaceMessageId> = {
  planning: "stage.inSentence.planning",
  preparing: "stage.inSentence.preparing",
  "recently-arrived": "stage.inSentence.recentlyArrived",
  "living-in-japan": "stage.inSentence.livingInJapan",
};
