import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { residenceStatuses } from "@/data/residence-statuses";
import { auditGuidanceCoverage, guidanceDiscoveryRecordSchema } from "@/domain/editorial/guidance-coverage-plan";
import { loadArticleSourceMetadata } from "@/lib/source-monitoring/article-source-metadata";

describe("guidance coverage plan", () => {
  it("assigns every current article and residence status exactly once", async () => {
    const projectRoot = process.cwd();
    const [plan, articles] = await Promise.all([
      readFile(resolve(projectRoot, "content/editorial/guidance-coverage-plan.json"), "utf8").then(JSON.parse),
      loadArticleSourceMetadata(resolve(projectRoot, "content/articles")),
    ]);

    expect(auditGuidanceCoverage(plan, articles.map(({ id }) => id), residenceStatuses.map(({ id }) => id))).toEqual([]);
  });

  it("reports new catalog records that have not been assigned", () => {
    const plan = { version: 1, catalogSnapshotDate: "2026-09-11", workflow: { discoveryRequiredBeforeImplementation: true, requiredDiscoveryOutputs: ["topic-candidates"] }, articleBatches: [{ id: "batch", targetIteration: 3, articleIds: [], residenceStatusIds: [] }], residenceStatusBatches: [{ id: "status-batch", targetIteration: 5, articleIds: [], residenceStatusIds: [] }], coverageTracks: [{ id: "incomplete", targetIterations: [2], dimensionIds: ["entry-and-residence"], plannedArticleIds: [], summary: "Incomplete fixture." }] };
    const findings = auditGuidanceCoverage(plan, ["new-article"], ["new-status"]);

    expect(findings.filter(({ code }) => code === "missing-id")).toHaveLength(2);
    expect(findings.some(({ code }) => code === "missing-coverage-dimension")).toBe(true);
    expect(findings.some(({ code }) => code === "missing-discovery-output")).toBe(true);
  });
});

describe("guidance discovery record", () => {
  const proposedRecord = {
    version: 1,
    id: "structured-status-discovery",
    workstreamId: "structured-status-model",
    preparedAt: "2026-09-11",
    reviewState: "proposed",
    topicCandidates: ["Qualification paths"],
    userSituations: ["A developer has experience but no relevant degree."],
    edgeCasesAndExceptions: ["Equivalent education and experience rules differ by route."],
    jurisdictionVariables: [],
    primarySourceCandidates: [{ organization: "Example authority", url: "https://example.go.jp/status", supports: ["Activity and qualification definitions"] }],
    contentImpacts: [{ kind: "residence-status", id: "example-status", action: "review", reason: "The model needs qualification alternatives." }],
    scopeBoundaries: ["The tool will not decide an individual's eligibility."],
    unresolvedQuestions: ["Which exceptions require their own structured field?"],
  } as const;

  it("accepts a proposed research scope without pretending it is approved", () => {
    expect(guidanceDiscoveryRecordSchema.safeParse(proposedRecord).success).toBe(true);
  });

  it("requires approval metadata before implementation scope is treated as accepted", () => {
    expect(guidanceDiscoveryRecordSchema.safeParse({ ...proposedRecord, reviewState: "scope-approved" }).success).toBe(false);
  });

  it.each(["structured-status-model", "immigration-foundations", "student-school-and-arrival"])(
    "validates the proposed %s discovery checkpoint",
    async (fileName) => {
      const record = await readFile(
        resolve(process.cwd(), `content/editorial/discovery/${fileName}.json`),
        "utf8",
      ).then(JSON.parse);

      expect(guidanceDiscoveryRecordSchema.safeParse(record).success).toBe(true);
    },
  );
});
