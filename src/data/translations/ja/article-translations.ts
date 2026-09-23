import { translationArtifactSchema } from "@/domain/translation/translation";
import {
  japaneseArticleGenerator as generation,
  japaneseArticlePromptRevision as promptRevision,
  japaneseArticleTerminologyRevision as terminologyRevision,
} from "./article-translation-builder";
import { japaneseEducationArticleTranslations } from "./article-translations-education";
import { japaneseEmploymentArticleTranslations } from "./article-translations-employment";
import { japaneseEmploymentTransitionArticleTranslations } from "./article-translations-employment-transition";
import { japaneseFreelanceArticleTranslations } from "./article-translations-freelance";
import { japaneseTaxArticleTranslations } from "./article-translations-tax";
import { japaneseTaxLifecycleArticleTranslations } from "./article-translations-tax-lifecycle";
import { japaneseResidentProtectionArticleTranslations } from "./article-translations-resident-protections";
import { japaneseSettlingInArticleTranslations } from "./article-translations-settling-in";
import { japaneseMobilityDailyLifeArticleTranslations } from "./article-translations-mobility-daily-life";
import { japaneseImmigrationLifecycleArticleTranslations } from "./article-translations-immigration-lifecycle";
import { japaneseFamilyStatusArticleTranslations } from "./article-translations-family-status";
import { japaneseTeachingEmploymentArticleTranslations } from "./article-translations-teaching-employment";
import { japaneseProfessionalStatusArticleTranslations } from "./article-translations-professional-statuses";
import { japaneseWorkforceDevelopmentArticleTranslations } from "./article-translations-workforce-development";
import { japaneseCreativeSkilledArticleTranslations } from "./article-translations-creative-skilled";
import { japaneseCulturalTrainingArticleTranslations } from "./article-translations-cultural-training";
import { japaneseBusinessRouteArticleTranslations } from "./article-translations-business-routes";
import { japaneseMedicalCareArticleTranslations } from "./article-translations-medical-care";
import { japaneseDesignatedRouteArticleTranslations } from "./article-translations-designated-routes";
import { japaneseDiplomaticOfficialArticleTranslations } from "./article-translations-diplomatic-official";
import { japaneseMedicalHolidayArticleTranslations } from "./article-translations-medical-holiday";
import { japaneseLegalAccountingArticleTranslations } from "./article-translations-legal-accounting";
import { japaneseTrainingRouteArticleTranslations } from "./article-translations-training-route";
import { japaneseJapanBasicsArticleTranslations, japanesePracticalArticleTranslations } from "./article-translations-practical";
import { japaneseSafetyArticleTranslations } from "./article-translations-safety";
import { japanesePilotArticleTranslations } from "./pilot-article-translations";

/** Current Japanese article artifacts. They remain machine translated until separately reviewed. */
export const currentJapaneseArticleTranslations = [
  translationArtifactSchema.parse({
    schemaVersion: 1,
    contentKind: "article",
    contentId: "visa-and-status-of-residence-explained",
    sourceLocale: "en",
    targetLocale: "ja",
    sourceRevision: "9c19585c5821401a3ea84bef40e737a14a76ee280400c04c2edf86cd41fdbb52",
    terminologyRevision,
    promptRevision,
    generator: generation,
    fields: {
      title: "ビザと在留資格：それぞれの役割",
      description: "長期入国の計画から日本で適法に在留するまでに必要となる、別々の判断と記録の流れを確認します。",
      body: `> **編集レビューが必要です：** このガイドは現在の国の公式情報に基づいていますが、法律に関する内容の最終的な人のレビューはまだ完了していません。実際に行う手続きについては、公式リンクを確認してください。

## つながっているものの、別々に扱われる6つの事項

「就労ビザ」のような日常的な表現だけでは、どの判断や書類が重要なのか分かりにくいことがあります。一般的な長期入国では、次の複数の概念がそれぞれ別に扱われます。

1. **経路と予定する活動。** 就労、留学、家族関係、事業、その他の根拠によって、確認すべき出入国在留管理上の区分が変わります。
2. **[在留資格認定証明書](/glossary/certificate-of-eligibility)（COE）。** 多くの長期在留の経路では、海外でビザを申請する前に、日本にいる代理人がCOEを申請します。COEはその後の審査を支える書類ですが、入国の許可ではありません。
3. **[査証](/glossary/sasho)（ビザ）。** 日本の大使館または領事館が、日本への入国を求める際に使うビザを発給します。日本の上陸港でビザが発給されるわけではなく、ビザがあっても上陸が保証されるわけではありません。
4. **[上陸許可](/glossary/joriku-kyoka)。** 国境で上陸を許可するかどうかは、入国審査で判断されます。計画と書類の内容は、それまでに示した活動と一致している必要があります。
5. **[在留資格](/glossary/zairyu-shikaku)。** 日本に在留できる活動、または身分・地位を定めます。
6. **[在留期間](/glossary/zairyu-kikan)。** 許可された期間です。申請した期間や、その経路で示されている最長期間と異なる場合があります。

対象となる中長期在留者には、上陸時、または利用する上陸港によっては住居地の届出後に、[在留カード](/glossary/zairyu-card)も交付されます。在留カードには重要な許可内容が記載されますが、基礎となる規則に代わるものではありません。

## COEは役立つ書類ですが、最終的な決定ではありません

COEは、予定する活動が上陸条件に関する区分に適合するか審査されたことを示します。領事手続きで確認される資料を減らせる場合がありますが、外務省は、COEがビザの発給を保証するものではないと明記しています。同様に、ビザも上陸を保証するものではありません。

通常のCOEの有効期間は現在3か月です。渡航を手配する前に、発行日と最新の公式情報を確認してください。新型コロナウイルス感染症流行時の有効期間延長は一時的な措置であり、通常の規則として扱わないでください。2023年3月以降は、メールで受け取ったCOEまたはその印刷物を、ビザおよび上陸の手続きで提示できます。

COEの発行後に、雇用主、学校、活動、関係、入国予定時期などの重要な事情が変わった場合は、受入機関、担当の在外公館、または出入国在留管理庁に、何を更新する必要があるか確認してください。以前の承認が新しい計画にも適用されるとは考えないでください。

## 各段階の手数料は共通ではありません

出入国在留管理庁へのCOE交付申請には、**政府の申請手数料はかかりません**。学校、雇用主、配送業者、翻訳者、代理人、または資格を持つ専門家が独自の料金を請求する場合があります。その民間の料金は、出入国在留管理庁に支払うCOEの手数料ではありません。

2026年7月1日以降に日本の在外公館が受理するビザ申請について、外務省は、1回限りの入国はおおむね**15,000円**、数次入国はおおむね**30,000円**という基準額を公表しており、通常は発給する在外公館の現地通貨で徴収されます。国籍や目的によって手数料が変わる、または免除される場合があるため、担当する大使館または領事館の最新の料金表と支払方法を確認してください。外務省によると、**ビザが発給されなかった場合、ビザ手数料は徴収されません**。ただし、外部の申請センター、指定代理機関、配送業者、その他の民間サービスには、別の利用条件がある場合があります。

例として、ワシントンD.C.の在外公館は、2026年7月の料金表で、1回限りの入国を101米ドル、2回または数次入国を201米ドル、インドの旅券所持者を6米ドルとしています。米国籍者は免除されます。同公館ではビザ受取時に現金で徴収し、以前の通過査証の区分を1回・2回入国の区分に統合しました。これは同公館に固有の取扱いであり、世界共通の米ドル料金表ではありません。

上陸審査、その後の在留資格変更や在留期間更新の申請、再入国許可、日本で一定の事由が生じた後の在留資格取得、在留カードに関する手続きは、それぞれ別の手続きであり、個別に手数料がかかる場合とかからない場合があります。在留資格取得許可の申請には手数料がかかりませんが、その後の変更や更新まで無料になるわけではありません。ある段階で支払ったことを、別の段階の支払いや承認として扱わないでください。

## 短期入国は長期就労への近道ではありません

一部の国籍の人は、滞在と活動が該当する規則に合っていれば、事前にビザを取得せずに短期入国できる場合があります。この免除だけで、報酬を得る仕事が許可されたり、短期訪問が長期在留の経路に変わったりするわけではありません。有給の仕事、または許可された短期滞在期間を超える滞在を予定している場合は、渡航前に正しい経路を確認してください。

## 上陸後は、実際に与えられた許可に従います

予定していた期間だけに頼らず、上陸時に許可された在留資格と在留期間を確認してください。仕事、学業、その他の活動を始める前に、その活動が許可された在留資格と別途必要な許可の範囲に入ることを確認します。

その後に事情が変わった場合は、次のように別々の手続きを確認します。

- 現在の根拠のまま在留期間を延ばすときは、[在留期間更新許可](/glossary/zairyu-kikan-koshin-kyoka)を申請します。
- 今後の活動または身分・地位が別の在留資格に当たるときは、[在留資格変更許可](/glossary/zairyu-shikaku-henko-kyoka)を申請します。
- 対象となる雇用主、学校、契約、配偶者、または住所の変更後は、必要な届出を行います。
- 一時的に海外へ渡航する前に、再入国の手続きを正しく行います。

これらはそれぞれ別の手続きです。1つを申請しても、他の手続きが自動的に完了したり許可されたりするわけではありません。

## 自分の状況について確認すること

- 在留の根拠となる正確な活動または関係
- 在留資格と申請状況に対応する、現在の出入国在留管理庁のページと提出資料一覧
- 海外でのビザ申請を担当する大使館または領事館
- COE、旅券、ビザ、予定する入国日の有効期間
- 上陸時に実際に許可された在留資格と在留期間
- 別途必要となる就労、資格・免許、自治体、税、または届出に関する義務

要件は、経路、国籍、機関の区分、家族の状況、申請場所によって異なる場合があります。公表されている例に事情が当てはまらないときは、日常的な「ビザ」という呼び方に無理に当てはめず、個別の状況に応じた案内を確認してください。`,
    },
    availability: "active",
    reviewState: "machine-translated",
    generatedAt: "2026-09-19T00:00:00.000Z",
  }),
  translationArtifactSchema.parse({
    schemaVersion: 1,
    contentKind: "article",
    contentId: "preparing-to-enter-japan",
    sourceLocale: "en",
    targetLocale: "ja",
    sourceRevision: "2dc9e4f5fc1af8879412142473b0e8e3489cc0387e4b3f195a2ace595adcba36",
    terminologyRevision,
    promptRevision,
    generator: generation,
    fields: {
      title: "「留学」の在留資格で日本へ入国する準備",
      description: "出発前に、「留学」の経路に必要な出入国在留管理上の記録、到着情報、資金、最初の1週間の予定を整理します。",
      body: `> **対象：** [留学](/glossary/ryugaku)の在留資格で入国する学生が対象です。「短期滞在」で学ぶ人は、旅券、必要な場合の短期滞在ビザ、受講を証明する資料、滞在先、保険、資金、次の渡航予定を準備する必要があります。ただし、「留学」用のCOEを持参したり、在留カードの住居地届出を予定したりする必要はありません。

## 手元に置いておくもの

旅券と[査証](/glossary/sasho)（ビザ）、[在留資格認定証明書](/glossary/certificate-of-eligibility)（COE）の情報、学校の入学許可書と連絡先、日本での滞在先住所、到着後の案内、学校または在外公館から提示するよう案内された記録を携帯してください。受託手荷物ではなく、機内持込み手荷物に入れます。紛失した場合に備えて、別の安全な場所に復旧用の写しを保管し、本人確認情報や金融情報を適切に保護してください。

氏名、日付、学校、課程、経費支弁に関する情報、入国予定が、承認された内容と一致しているか再確認してください。課程、学校、支援者、旅券、または入学時期が変わった場合は、渡航前に学校と担当当局へ確認してください。

## 最初の1週間を計画する

利用する空港、到着時刻、滞在先までの経路、チェックインの方法、緊急連絡先を確認してください。日本の銀行口座を開設する前でも利用できる資金手段を準備します。到着予定を学校に伝え、オリエンテーション、在留カードに関する報告、保険、学校独自の期限について確認してください。

可能であれば、日本語で短い住所メモを用意してください。利用する上陸港で、[上陸許可](/glossary/joriku-kyoka)と同時に[在留カード](/glossary/zairyu-card)が現在交付されるか確認します。その他の上陸港では、後日交付することが旅券に記載され、通常は住居地を届け出た後に在留カードが郵送されます。

## 最終確認

- 旅券とビザの有効期間、および氏名表記が一致していることを再確認します。
- 手荷物、税関、医薬品、輸入に関する規則を、担当する公的機関の情報で確認します。
- 渡航情報と学校からの案内を、オフラインでも確認できるよう保存します。
- 到着から学校で必須となる予定まで、十分な時間を確保します。
- 医薬品の持込みと税関の要件は、学校の持ち物一覧だけに頼らず、担当当局の情報で確認します。
- 内容を正確に把握していない他人の書類や物品は運ばないでください。

> **実用的な助言：** 学校の電話番号、滞在先住所、移動経路、自分の予定を把握している人の連絡先を1枚にまとめてください。携帯電話がつながらない場合にも役立ちます。`,
    },
    availability: "active",
    reviewState: "machine-translated",
    generatedAt: "2026-09-19T00:00:00.000Z",
  }),
  translationArtifactSchema.parse({
    schemaVersion: 1,
    contentKind: "article",
    contentId: "getting-a-phone-number-in-japan",
    sourceLocale: "en",
    targetLocale: "ja",
    sourceRevision: "c11d7dea5a7268bdc06623689c4a22c7dac99365835115d64259537acee68b84",
    terminologyRevision,
    promptRevision,
    generator: generation,
    fields: {
      title: "日本で電話番号を取得する",
      description: "自分に合う携帯電話サービスを選び、本人確認書類と支払い手段を準備し、契約で起こりやすい問題を避けます。",
      body: `> **どちらの経路にも該当します：** 「短期滞在」の人は、旅行者向けのSIMまたはeSIMを利用できますが、居住者向けの契約を利用できない場合があります。住民登録をした人は、以下の本人確認と住所に関する手順を確認してください。

## 必要なサービスを決める

旅行用eSIMまたはデータ通信専用SIMを使えば、到着後すぐにインターネットへ接続できます。ただし、日本の音声通話用電話番号が付かない場合があります。「短期滞在」の人には、多くの場合、これが実用的な選択肢です。音声通話用電話番号は、学校、住居、銀行、配達、緊急連絡などで役立ち、特に長期滞在では重要です。通信エリア、データ容量、音声通話とSMS、eSIMへの対応、最低利用期間、開通手数料、端末の対応状況、解約費用、多言語サポートを比較してください。

## 本人確認の準備をする

携帯電話の契約には、[本人確認](/glossary/honnin-kakunin)が必要です。公的な案内では、[在留カード](/glossary/zairyu-card)、運転免許証、マイナンバーカード、または現在の住所が記載された旅券などの書類が挙げられています。実際にどの書類を受け付けるかは、通信事業者とプランによって決まります。支払い方法や追加の要件も異なります。可能であれば先に住居地の届出を済ませ、店舗へ行く前に、利用する通信事業者の最新の必要書類一覧を確認してください。

通信事業者から、まだ持っていない日本の銀行口座またはクレジットカードを求められた場合は、別のカードや支払い方法を受け付ける事業者を比較する、一時的なデータ通信サービスを使う、学校、雇用主、または受入機関に新しく来日した人向けの支援について尋ねる、といった方法を検討してください。他人名義の口座を開設したり、借りたりしないでください。一時的なデータeSIMは通信手段として役立ちますが、銀行の確認手続きに利用する前に、音声通話とSMSが含まれているか確認してください。

未成年の場合、通信事業者から保護者の同意や追加書類を求められることがあります。他人の本人情報、携帯電話契約、または支払い口座を借りないでください。

> **実用的な助言：** 学校に、近隣で新しく来日した留学生への対応実績がある通信事業者を尋ねることができます。ただし、実際の契約条件は自分でも書面で比較してください。

契約を確定する前に、広告の価格に通話料、開通手数料、端末の分割代金、オプションサービス、または後の値上げが含まれていない可能性がないか確認してください。契約書と解約方法を保管します。住所や在留情報が変わったときは通信事業者へ届け出て、日本を離れる前には正しい手順で解約してください。

開通、プラン、端末、乗り換え、紙の請求書、早期解約、機器などの料金は、民間事業者ごとに異なります。国が定める一律の「電話開通料金」を探すのではなく、契約全体を比較してください。キャンペーンやプランは変わるため、自分の予算に料金を記録するときは、確認した日付も残してください。`,
    },
    availability: "active",
    reviewState: "machine-translated",
    generatedAt: "2026-09-19T00:00:00.000Z",
  }),
  translationArtifactSchema.parse({
    schemaVersion: 1,
    contentKind: "article",
    contentId: "understanding-my-number",
    sourceLocale: "en",
    targetLocale: "ja",
    sourceRevision: "211aad65368a628a0f48712e8c8ff035fa67dbef920c38b5d96b5aaab9cb4389",
    terminologyRevision,
    promptRevision,
    generator: generation,
    fields: {
      title: "日本に到着した後のマイナンバーを理解する",
      description: "マイナンバー、その通知、申請して取得する顔写真付きのマイナンバーカードの違いを確認します。",
      body: `## 混同しやすい3つのもの

**[マイナンバー](/glossary/my-number)（[個人番号](/glossary/kojin-bango)）**は、[住民登録](/glossary/jumin-toroku)の後に指定される12桁の番号です。在留カード番号とは異なります。

マイナンバーは、住民基本台帳への登録に基づいて指定されます。ビザが発給されたという理由だけで、すべての訪問者に指定されるものではありません。通常の住民登録の対象外である人は、マイナンバーを受け取れると考えないでください。

**個人番号通知書**には、自分の番号が記載されています。通常、住民登録後に書留郵便で送られますが、通知書自体は本人確認書類ではありません。

**[マイナンバーカード](/glossary/my-number-card)**は、申請によって取得できる顔写真付きの本人確認書類です。番号が指定されても、顔写真付きカードが自動的に申し込まれたことにはなりません。

マイナンバーカードの初回交付は無料です。再交付は、すべて同じ手続きではありません。紛失、破損、電子証明書の時期、特急発行、在留カードとマイナンバーカードの一体化などによって、国と自治体の異なる手数料が関係する場合があります。支払う前に、J-LIS、出入国在留管理庁、自治体の最新の料金表を確認し、その料金がどの手続きに対するものか尋ねてください。

## 行うこと

郵便受けに自分の名前を表示し、書留郵便の到着に注意してください。公的な案内では、通知は通常およそ2～3週間で届くとされていますが、配達時期は変わることがあります。届かない場合は、申請を繰り返すのではなく、自治体へ問い合わせてください。

通知書は安全に保管してください。税、社会保障、雇用、海外送金に関する一部の手続きなど、法令に基づく手続きで必要な場合に限って番号を提供してください。認められた手続きで、番号が記載された[住民票](/glossary/juminhyo)を求められたときは、その記載があるものを明確に指定し、機密情報として取り扱ってください。通常の住民票の写しでは、すべての目的に番号を記載する必要はありません。番号が写った写真を公開したり、安易に送ったりしないでください。

> **実用的な助言：** 本人確認やオンライン・自治体サービスに、任意で取得する顔写真付きカードが役立つかを考え、申請するときは公式の方法だけを利用してください。通知書を紛失しても番号は変わりません。安全な確認方法を自治体に尋ねてください。`,
    },
    availability: "active",
    reviewState: "machine-translated",
    generatedAt: "2026-09-19T00:00:00.000Z",
  }),
  ...japanesePracticalArticleTranslations,
  ...japaneseSafetyArticleTranslations,
  ...japaneseEducationArticleTranslations,
  ...japaneseEmploymentArticleTranslations,
  ...japaneseEmploymentTransitionArticleTranslations,
  ...japaneseFreelanceArticleTranslations,
  ...japaneseTaxArticleTranslations,
  ...japaneseTaxLifecycleArticleTranslations,
  ...japaneseResidentProtectionArticleTranslations,
  ...japaneseSettlingInArticleTranslations,
  ...japaneseMobilityDailyLifeArticleTranslations,
  ...japaneseImmigrationLifecycleArticleTranslations,
  ...japaneseFamilyStatusArticleTranslations,
  ...japaneseTeachingEmploymentArticleTranslations,
  ...japaneseProfessionalStatusArticleTranslations,
  ...japaneseWorkforceDevelopmentArticleTranslations,
  ...japaneseCreativeSkilledArticleTranslations,
  ...japaneseCulturalTrainingArticleTranslations,
  ...japaneseBusinessRouteArticleTranslations,
  ...japaneseMedicalCareArticleTranslations,
  ...japaneseDesignatedRouteArticleTranslations,
  ...japaneseDiplomaticOfficialArticleTranslations,
  ...japaneseMedicalHolidayArticleTranslations,
  ...japaneseLegalAccountingArticleTranslations,
  ...japaneseTrainingRouteArticleTranslations,
  ...japaneseJapanBasicsArticleTranslations,
] as const;

/** Includes stale pilot history for audit while consumers select active artifacts only. */
export const japaneseArticleTranslations = [
  ...currentJapaneseArticleTranslations,
  ...japanesePilotArticleTranslations,
] as const;
