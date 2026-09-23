import { translationArtifactSchema } from "@/domain/translation/translation";

const terminologyRevision = "74c46a91ccec5c9de19e65a60b89acd0bde3f837a042c3fe08a6ce6f1899f5cf";
const promptRevision = "4c275d0982deb5cef4ad5c05b49c900bd2f71e8065991ff32aec2ba5739c1486";
const generator = { id: "codex-assisted", model: "gpt-5" } as const;

function defineFaqTranslation(
  contentId: string,
  sourceRevision: string,
  question: string,
  summary: string,
) {
  return translationArtifactSchema.parse({
    schemaVersion: 1,
    contentKind: "faq",
    contentId,
    sourceLocale: "en",
    targetLocale: "ja",
    sourceRevision,
    terminologyRevision,
    promptRevision,
    generator,
    fields: { question, summary },
    availability: "active",
    reviewState: "machine-translated",
    generatedAt: "2026-09-19T00:00:00.000Z",
  });
}

/** Current bounded Japanese FAQ catalog; canonical IDs keep incremental batches composable. */
export const japaneseFaqTranslations = [
  defineFaqTranslation("what-is-a-prefecture", "45f044e5f79a2c9e090d68eec0cf3357595dccb3a429e55fcf5288fd9490ee9a", "日本の「都道府県」とは何ですか？", "「Prefecture」は、日本に47ある都道府県レベルの自治体をまとめて表す英語です。都道府県は、市町村や東京都の特別区とは異なるため、手続きの内容と正確な住所によって担当窓口が変わります。"),
  defineFaqTranslation("need-local-dialect", "3e134e1025bfd9fe740c642305d779d69a02b6459dccdc15b2dce7ebcfede390", "日本で暮らす地域の方言を話す必要がありますか？", "いいえ。広く通じる共通語から始めるのが実用的です。地域の話し方は、地域社会、世代、場面によって異なります。1つの方言を必須または一様なものと考えず、役立つ表現を少しずつ学べます。"),
  defineFaqTranslation("address-bank-housing-loop", "1c168634265a07e91a625f63f5253368b5572526af79b22bbe03573f7cd8b95c", "来日後、住所、住居、銀行口座が互いに必要になる問題にはどう対応しますか？", "住居、住居地の届出、電話サービス、銀行の審査は、互いに影響する場合があります。関連する来日後のガイドでは、すべての事業者が同じ要件を使うと断定せず、実行しやすい順序と一時的な代替手段を説明します。"),
  defineFaqTranslation("health-insurance-after-moving", "8cf9377070b76a5c62858b68d4e8ebc5aeced8d7c6283c833d855a738b602816", "日本へ引っ越した後、国民健康保険に加入する必要がありますか？", "加入の要否は、在留状況と、別の対象となる健康保険で保障されているかによって異なります。自治体または雇用主に何を確認する必要があるかを、ガイドで確認してください。"),
  defineFaqTranslation("pension-after-moving", "5795f3a02afc3f0274a15789e38639547ec3c2e38602bb0188947d0096900520", "外国人住民も日本の年金制度に加入する必要がありますか？", "年齢、居住状況、勤務先での加入状況が年金の加入に影響します。学生などは、加入に関する通知を無視するのではなく、免除または猶予の手続きについて確認する必要がある場合があります。"),
  defineFaqTranslation("receiving-my-number", "9f188f47b407e6d4944ead0034deca04cafcec2d69aeecbbadb3927bf97a6962", "来日後、マイナンバーはいつ、どのように受け取りますか？", "マイナンバーは住民登録の後に指定され、任意で申請する顔写真付きのマイナンバーカードとは異なります。ガイドでは、通知の方法と安全に管理すべき情報を説明します。"),
  defineFaqTranslation("register-address-after-arrival", "f148247dc337533bdf85b51c77ce089d0ab76de2a1cf54f854e5fcedf5f30448", "日本へ引っ越した後、いつ、どこで住居地を届け出ますか？", "対象となる中長期在留者は、通常、住居地を定めた後に自治体で転入届を提出します。「短期滞在」の人には別の取扱いが適用されます。"),
  defineFaqTranslation("phone-or-bank-first", "b2fc5ecca3d6615b64d699659eedf54d67ee9c64ce7cc7ae085e8f9f953b00cf", "日本の電話番号と銀行口座は、どちらを先に取得すべきですか？", "事業者によって要件が異なり、一方のサービスで他方の情報を求められる場合があります。2つのガイドでは、申込み前に確認する書類、代わりの支払い方法、手続きの順序を説明します。"),
  defineFaqTranslation("visa-versus-status-of-residence", "5e6d91c3276fe8c40fb94db966e68b70b3d669a851072f49bd8d698ba263a2a3", "査証（ビザ）と在留資格は、どのように違いますか？", "査証、上陸許可、在留期間、在留資格は互いに関係しますが、それぞれ異なります。「就労ビザ」のような日常的な表現だけで判断せず、まず全体の仕組みを確認してください。"),
  defineFaqTranslation("documents-received-at-entry", "c8ac08a46a97f761366956e183a7eb7b53f4080e7aa813f36ea280079cc87a64", "日本へ入国するとき、どのような書類を受け取りますか？", "受け取るものは、入国と在留の経路によって異なります。ガイドでは、上陸許可、在留カードの取扱い、住民登録の後に届く記録を分けて説明します。"),
  defineFaqTranslation("short-study-without-student-visa", "0eaa7e72999e49f3c2cfc0cb0633a29bb7989264a1d1f2166abd09b085d49490", "「留学」の在留資格がなくても、日本で短期間学べますか？", "場合によっては、短期コースを「短期滞在」で受講できます。一方、要件を満たす長期の就学では、通常「留学」の在留資格の経路を使います。国籍ごとの入国要件を確認し、「短期滞在」で報酬を受ける活動ができると考えないでください。"),
  defineFaqTranslation("student-part-time-work", "d3b6ef7f292af534cb8a2e038c733979b4cc025cf5263709073ca924fc8b74ba", "留学生は日本でアルバイトができますか？", "「留学」の在留資格だけでは、通常の報酬を受ける活動は認められません。留学生は原則として資格外活動許可を受け、活動内容と時間の制限を守る必要があります。"),
  defineFaqTranslation("police-or-ambulance-emergency-number", "22d2979e7bab5d31dbf9e7e38ccb62c274392be8e56071d1ad1baf2722916bf1", "日本で緊急事態が起きたとき、110番と119番のどちらに電話しますか？", "緊急に警察の対応が必要なときは110番へ電話します。火災、救助、救急車は119番です。最初に正確な場所を伝え、差し迫った危険やけがを説明してください。緊急事態の最中に、緊急ではない相談窓口を探すため通報を遅らせないでください。"),
  defineFaqTranslation("set-up-utilities-after-moving", "066961e3df40b61f8265731cd317ecf43a83001f8db59eb33db2238107cf6eea", "日本で引っ越した後、電気、ガス、水道はどのように開始しますか？", "まず、物件に含まれるサービスと、料金の請求者を確認します。サービスごとに開始日と事業者を確認してください。ガスの開栓には立会いが必要な場合があり、水道は担当する自治体または建物の手続きに従います。"),
  defineFaqTranslation("freelancing-alongside-sponsored-job", "5a02e71f7251f86ce136f1166df74bbad97cba2071c22d811b8738f443bf63c1", "雇用主に支援された就労資格で日本にいる間、フリーランスの仕事もできますか？", "主な仕事の在留資格があっても、すべての副業が自動的に認められるわけではありません。予定するフリーランスの業務と現在認められている活動を比較し、許可、契約、届出、税金、資格や免許を別々に確認してください。"),
  defineFaqTranslation("employer-support-for-worker-coe", "0efd222997894e4f7fbc56563acd798cd549e660f269d5e6e61328f0b4aab076", "日本の雇用主が、外国人労働者の在留資格認定証明書（COE）を発行またはスポンサーしますか？", "COEを交付するのは出入国在留管理庁です。雇用主は職務を定め、機関に関する資料を準備し、要件を満たす代理人または認められた取次者を利用できる場合がありますが、COE、査証、上陸、またはその後の在留期間更新を保証することはできません。"),
  defineFaqTranslation("join-spouse-or-family-in-japan", "ad052e8f5967d2a0460d2f33058b066d2c2049b974efe6390758274b3b59b85e", "日本にいる配偶者や家族と暮らす場合、どの経路が該当しますか？", "経路は、相手の在留資格、正確な法的関係、扶養関係、出生地、その他の事情によって異なります。「家族滞在」、2つの配偶者・子に関する在留資格、「定住者」は、互いに置き換えられるものではありません。"),
  defineFaqTranslation("can-dependent-work-in-japan", "3649d24f546c2054465925ea870da66ecab9b72deb3662623fb3afde7fba6934", "「家族滞在」の人は日本で働けますか？", "「家族滞在」の在留資格だけでは、通常の報酬を受ける活動は認められません。対象となる人は資格外活動許可を申請でき、一般的に週28時間以内の包括的な許可を受けられる場合がありますが、活動内容にも制限があります。"),
  defineFaqTranslation("taxes-after-moving-to-japan", "776a1f75f32cc1688f75bc2546793f3f2bf8629760f99a6d2eca98069ecf1735", "日本へ移った後、どのような税金がかかりますか？", "まず、税務上の居住者区分を別に確認します。国の所得税は暦年について源泉徴収または申告される場合があります。一方、地方の住民税は通常、前年の所得と1月1日時点の住所地の自治体に基づくため、後から請求が始まることがあります。"),
  defineFaqTranslation("procedures-before-leaving-japan", "be5c59cef879d3e3b95223d0a387458e0a403f88468c547bb969330af6f3f284", "日本を出国する前に、何を解約または届け出る必要がありますか？", "まず、一時的な旅行なのか、日本での在留を終える出国なのかを確認します。一時出国する人は再入国の期限を確認してください。日本での在留を終える場合は、自治体、税金、保険、年金、銀行、住居、出入国在留管理上の記録に影響することがあります。"),
] as const;
