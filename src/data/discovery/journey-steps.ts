const articleStep = (articleId: string, routeIds?: readonly string[]) => ({
  id: articleId,
  type: "article" as const,
  articleId,
  ...(routeIds ? { routeIds: [...routeIds] } : {}),
});

const conditionalStep = (articleId: string, conditionLabel: string, routeIds?: readonly string[]) => ({
  id: articleId,
  type: "article" as const,
  articleId,
  requiredness: "conditional" as const,
  conditionLabel,
  ...(routeIds ? { routeIds: [...routeIds] } : {}),
});

const routeChoice = { id: "select-route", type: "route-choice" as const };

/** Shared arrival sequence; route filters keep resident-only procedures off short-stay branches. */
function settlementSteps(registeredRouteIds?: readonly string[]) {
  return [
    articleStep("finding-housing-and-moving-in"),
    articleStep("documents-received-when-entering-japan"),
    articleStep("registering-your-address-after-arrival", registeredRouteIds),
    articleStep("understanding-my-number", registeredRouteIds),
    conditionalStep("joining-national-health-insurance", "If you are not enrolled through another qualifying health-insurance route", registeredRouteIds),
    conditionalStep("national-pension-after-moving-to-japan", "If your age and coverage place you in the National Pension system", registeredRouteIds),
    articleStep("getting-a-phone-number-in-japan"),
    articleStep("opening-a-bank-account-after-moving-to-japan", registeredRouteIds),
  ];
}

export { articleStep, conditionalStep, routeChoice, settlementSteps };
