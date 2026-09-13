import { translationArtifactSchema } from "@/domain/translation/translation";

const terminologyRevision = "fadc2d5bb16fe8b2afb229ceb06a8eaf00247f2309219b036324217931991ad9";
const promptRevision = "7a7aa495d0326df7e6ae47cf036619f957af2ff26cec18dc34fe97f012276952";
const generation = { id: "codex-assisted", model: "gpt-5" } as const;

/** Repository-cached Japanese pilot artifacts; these are machine translated and not editorially reviewed. */
export const japanesePilotArticleTranslations = [
  translationArtifactSchema.parse({
    schemaVersion: 1,
    contentKind: "article",
    contentId: "visa-and-status-of-residence-explained",
    sourceLocale: "en",
    targetLocale: "ja",
    sourceRevision: "f9523f504f6430f6bcc708e68249f4cd2ab0e0b207c8c11c11483672c1d5b8f8",
    terminologyRevision,
    promptRevision,
    generator: generation,
    fields: {
      title: "ビザと在留資格：それぞれの役割",
      description: "渡航のための許可、上陸許可、そして入国後の活動を定める在留資格の違いを理解します。",
      body: `> **ドラフトの範囲：** この記事は、手続きの流れと確認すべき事項を整理したものです。申請資格や必要書類を網羅した、編集レビュー済みの案内ではありません。

## この案内で扱うこと

日本の査証（ビザ）は、一般に日本への入国を求める際に使用されます。一方、在留資格は、上陸後に滞在できる活動または身分・地位を定めます。在留資格認定証明書（COE）は多くの長期滞在ビザ申請を支える書類ですが、それ自体はビザではなく、上陸許可を保証するものでもありません。日常会話ではさまざまな手続きをまとめて「ビザ」と呼ぶことがあるため、案内がどの書類とどの判断を指しているのかを必ず確認してください。

## 確認をおすすめする人

- 申請前に複数の長期滞在経路を比較している人
- COE、在外公館でのビザ申請、上陸、在留カード交付までの流れを理解したい人

## 準備を検討する根拠資料

- 在留の根拠となる具体的な活動、関係、または身分・地位
- 予定する滞在期間と、報酬を受ける活動を行う予定があるかどうか
- 担当する日本の在外公館および出入国在留管理庁の在留資格案内に掲載されたチェックリスト

## 重要な区別

渡航前にビザが必要か、COEが想定されているか、実際の活動にどの在留資格が合うかを確認してください。短期滞在でビザが免除される場合でも、就労や、その後の長期滞在が許可されると考えないでください。

## このドラフトを利用する前に

下記の公式情報を開き、実際に行う手続き（COE、在外公館でのビザ申請、在留資格変更、在留期間更新）について、最新の申請案内を確認してください。要件は、国籍、雇用主や受入機関の区分、家族状況、申請を扱う日本の在外公館などによって異なる場合があります。契約書、申請書、添付資料、説明書類の間で、予定する活動の内容が一貫していることを確認してください。`,
    },
    availability: "stale",
    reviewState: "machine-translated",
    generatedAt: "2026-09-09T00:00:00.000Z",
  }),
  translationArtifactSchema.parse({
    schemaVersion: 1,
    contentKind: "article",
    contentId: "preparing-to-enter-japan",
    sourceLocale: "en",
    targetLocale: "ja",
    sourceRevision: "2f41b62d0db832bcadf37adab2341e2508b8ad99ec1618ec14f2124c716d5a48",
    terminologyRevision,
    promptRevision,
    generator: generation,
    fields: {
      title: "「留学」の在留資格で日本へ入国するための準備",
      description: "渡航前に、「留学」の在留資格に関する書類、到着時の情報、資金、最初の1週間の予定を整理します。",
      body: `> **対象：** 「留学」の在留資格で入国する学生向けです。「短期滞在」で学ぶ人も、旅券、必要な場合の短期滞在ビザ、受講を証明する資料、滞在先、保険、資金、帰国または次の渡航予定を準備する必要があります。ただし、「留学」用のCOEや、在留カード交付後の住居地届出を前提とはしません。

## 手元に置くもの

旅券とビザ、COEに関する情報、学校の入学許可書と連絡先、日本での滞在先住所、到着後の案内、学校または日本の在外公館から持参するよう指示された資料を準備してください。受託手荷物ではなく、機内持込み手荷物に入れてください。紛失時に備えて別の安全な場所にも写しを保管し、本人確認情報や金融情報は適切に保護してください。

## 最初の1週間を計画する

到着空港、到着時刻、滞在先までの経路、チェックイン方法、緊急連絡先を確認してください。日本の銀行口座を開設する前でも使える資金手段を用意します。到着予定を学校に伝え、オリエンテーション、在留カードに関する報告、保険、学校独自の期限について確認してください。

可能であれば、日本語で書いた短い住所メモを用意してください。到着予定の空港で通常、上陸時に在留カードが交付されるのか、それとも住居地の届出後に郵送されるのかを確認します。すべての空港で同じ手続きが行われるとは考えないでください。

## 最終確認

- 旅券とビザの有効期限、および氏名表記が一致していることを再確認する。
- 手荷物、税関、医薬品、輸入に関する規則を担当する公的機関の情報で確認する。
- 渡航情報と学校からの案内を、オフラインでも確認できるよう保存する。
- 到着から学校で必須となる予定まで、十分な時間を確保する。
- 内容を正確に把握していない他人の書類や物品を運ばない。

> **実用的なヒント：** 学校の電話番号、滞在先住所、移動経路、自分の予定を把握している人の連絡先を1枚にまとめてください。携帯電話がつながらない場合にも役立ちます。`,
    },
    availability: "stale",
    reviewState: "machine-translated",
    generatedAt: "2026-09-09T00:00:00.000Z",
  }),
] as const;
