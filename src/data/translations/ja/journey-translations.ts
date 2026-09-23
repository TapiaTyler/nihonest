import { translationArtifactSchema } from "@/domain/translation/translation";

const terminologyRevision = "74c46a91ccec5c9de19e65a60b89acd0bde3f837a042c3fe08a6ce6f1899f5cf";
const promptRevision = "4c275d0982deb5cef4ad5c05b49c900bd2f71e8065991ff32aec2ba5739c1486";
const generator = { id: "codex-assisted", model: "gpt-5" } as const;
const professionalRouteTranslations = [
  { id: "professor", title: "教授", description: "大学またはこれに準ずる機関で教育や研究を行う経路です。" },
  { id: "artist", title: "芸術", description: "収入を伴う、要件を満たす芸術上の活動を行う経路です。" },
  { id: "religious-activities", title: "宗教", description: "外国の宗教団体から派遣され、宗教上の活動を行う経路です。" },
  { id: "journalist", title: "報道", description: "外国の報道機関との契約に基づき、対象となる報道上の活動を行う経路です。" },
  { id: "legal-accounting-services", title: "法律・会計業務", description: "日本の対象資格を必要とする、規制された法律または会計の業務を行う経路です。" },
  { id: "medical-services", title: "医療", description: "認められた日本の専門資格に基づき、規制された医療業務を行う経路です。" },
  { id: "researcher", title: "研究", description: "日本の機関との要件を満たす契約に基づき、研究を行う経路です。" },
  { id: "instructor", title: "教育", description: "対象となる学校や教育機関で、語学その他の教育を行う経路です。" },
  { id: "engineer-humanities-international-services", title: "技術・人文知識・国際業務", description: "要件を満たす技術、人文科学、または国際業務に関する仕事を行う経路です。" },
  { id: "intra-company-transferee", title: "企業内転勤", description: "海外の事業所から、日本にある関連事業所へ要件を満たす転勤をする経路です。" },
  { id: "nursing-care", title: "介護", description: "必要な日本の資格を用いて、対象となる介護業務を行う経路です。" },
] as const;

function defineJourneyTranslation(
  contentId: string,
  sourceRevision: string,
  fields: Readonly<Record<string, string>>,
) {
  return translationArtifactSchema.parse({
    schemaVersion: 1,
    contentKind: "journey",
    contentId,
    sourceLocale: "en",
    targetLocale: "ja",
    sourceRevision,
    terminologyRevision,
    promptRevision,
    generator,
    fields,
    availability: "active",
    reviewState: "machine-translated",
    generatedAt: "2026-09-20T00:00:00.000Z",
  });
}

/** Representative route-aware and route-free journeys for the structured localization contract. */
export const japaneseJourneyTranslations = [
  defineJourneyTranslation("student-moving-to-japan", "44159bb37e9ec271bd171e52eb0f8e92aed7ad71ba3b839d8596ad82f74c6c94", {
    title: "留学生のためのジャーニー",
    description: "短期留学または「留学」の在留資格を選び、その経路に必要な準備と来日後の手続きだけを順に確認します。",
    introduction: "まず、「短期滞在」で入国するのか、「留学」の在留資格で入国するのかを確認します。経路を選ぶと、それに合った手順が表示されます。",
    routes: JSON.stringify([
      { id: "temporary-visitor-study", title: "「短期滞在」で学ぶ", description: "許可された滞在期間内に、報酬を受ける活動をせず短期コースを受講します。" },
      { id: "student-status", title: "「留学」の在留資格で長期留学する", description: "対象となる学校で学ぶため、学校と出入国在留管理上の準備を行う経路です。" },
    ]),
    phases: JSON.stringify([
      { id: "plan", title: "留学を計画する" },
      { id: "choose-route", title: "留学の経路を選ぶ" },
      { id: "prepare", title: "入国の準備をする" },
      { id: "settle", title: "来日後の生活を整える" },
      { id: "work-and-transition", title: "仕事、一時出国、その後の進路を確認する" },
    ]),
    conditions: JSON.stringify([
      { id: "joining-national-health-insurance", label: "ほかの対象となる健康保険に加入していない場合" },
      { id: "national-pension-after-moving-to-japan", label: "年齢と加入状況により国民年金の対象となる場合" },
      { id: "working-part-time-on-student-status", label: "報酬を受ける活動を行う予定がある場合" },
      { id: "reentry-permission-and-temporary-travel", label: "在留期間中に一時出国し、日本へ戻る予定がある場合" },
      { id: "continued-job-hunting-after-study", label: "卒業後、引き続き就職活動を行う要件を満たす場合" },
    ]),
  }),
  defineJourneyTranslation("short-visit-to-japan", "9422f7be9910132587e8b5b5c37d2a9e9f3f3579a1080123dfbff3efb4e8d032", {
    title: "日本への短期訪問ジャーニー",
    description: "ビザまたは査証免除による渡航手続きと、上陸時に許可される「短期滞在」の在留資格・在留期間を分けて確認します。",
    introduction: "旅券、国籍、居住地、目的、滞在期間によって入国前の手続きが変わります。「短期滞在」では通常の報酬を受ける活動や、住民としての定住は認められません。",
    routes: "[]",
    phases: JSON.stringify([
      { id: "plan", title: "訪問を計画する" },
      { id: "enter", title: "入国時の記録を理解する" },
    ]),
    conditions: JSON.stringify([
      { id: "short-term-study-in-japan", label: "訪問中に短期コースを受講する場合" },
    ]),
  }),
  defineJourneyTranslation("accepting-international-students", "2aa5b35515afe7c07213c28c442f45f873648e1fff64a9e39f7895c72f65994a", {
    title: "留学生受入れジャーニー",
    description: "教育機関が、適切な入学審査、COE申請支援、来日、入学手続き、継続的な支援を計画するための流れです。",
    introduction: "学校は入学審査と資料の準備を支援しますが、COEを交付するのは出入国在留管理庁です。このジャーニーでは、教育機関の対応と留学生本人の手続きを分けて説明します。",
    routes: "[]",
    phases: JSON.stringify([
      { id: "understand", title: "留学生の経路を理解する" },
      { id: "accept-and-support", title: "留学生を受け入れ、申請を支援する" },
      { id: "receive-and-support", title: "来日後の受入れと支援を行う" },
    ]),
    conditions: JSON.stringify([
      { id: "working-part-time-on-student-status", label: "任意のアルバイトと資格外活動許可について説明する場合" },
    ]),
  }),
  defineJourneyTranslation("professional-worker-moving-to-japan", "2293c48757bcfa559d2761c5bae8cfb4d52680ef33a4ea2d51a81757ca014dda", {
    title: "専門職として働くためのジャーニー",
    description: "実際に行う専門的な活動に合う在留資格を選び、雇用・受入れ、入国、来日後の生活に必要な一つの経路を確認します。",
    introduction: "就労の在留資格は、それぞれ別の選択肢です。一つを選ぶと、ほかの専門職向け在留資格のガイドは、その後の手順から除かれます。",
    routes: JSON.stringify(professionalRouteTranslations),
    phases: JSON.stringify([
      { id: "understand", title: "就労の在留資格を理解する" },
      { id: "choose-route", title: "実際の仕事に合う在留資格を選ぶ" },
      { id: "prepare", title: "入国の準備をする" },
      { id: "settle", title: "来日後の生活を整える" },
    ]),
    conditions: JSON.stringify([
      { id: "joining-national-health-insurance", label: "ほかの対象となる健康保険に加入していない場合" },
      { id: "national-pension-after-moving-to-japan", label: "年齢と加入状況により国民年金の対象となる場合" },
    ]),
  }),
  defineJourneyTranslation("joining-family-in-japan", "c503d36ddf17eebe1b1f1c0c6e18981f84d0c6c4d308056ac2cdc717f9610a8f", {
    title: "家族と日本で暮らすためのジャーニー",
    description: "実際に該当する家族関係または身分・地位に基づく経路を選び、家族の入国に必要な一つの流れを確認します。",
    introduction: "「家族滞在」、「日本人の配偶者等」、「永住者の配偶者等」、「定住者」は、互いに置き換えられる制度ではありません。在留の根拠となる、資料で確認できる関係または事情を選びます。",
    routes: JSON.stringify([
      { id: "dependent", title: "家族滞在", description: "対象となる在留資格を持つ外国人に扶養される、要件を満たす配偶者または子の経路です。" },
      { id: "spouse-child-japanese", title: "日本人の配偶者等", description: "日本人との対象となる関係に基づく経路です。" },
      { id: "spouse-child-permanent-resident", title: "永住者の配偶者等", description: "永住者との対象となる関係に基づく経路です。" },
      { id: "long-term-resident", title: "定住者", description: "要件を満たす事情について個別に指定される、身分・地位に基づく経路です。" },
    ]),
    phases: JSON.stringify([
      { id: "understand", title: "家族に関する経路を理解し、比較する" },
      { id: "choose-route", title: "該当する家族関係または身分・地位の経路を選ぶ" },
      { id: "prepare", title: "入国の準備をする" },
      { id: "settle", title: "来日後の生活を整える" },
      { id: "maintain", title: "在留状況を維持する" },
    ]),
    conditions: JSON.stringify([
      { id: "joining-national-health-insurance", label: "ほかの対象となる健康保険に加入していない場合" },
      { id: "national-pension-after-moving-to-japan", label: "年齢と加入状況により国民年金の対象となる場合" },
      { id: "renewing-or-changing-your-status-of-residence", label: "家族の在留期間が満了する前、または関係、扶養状況、主たる在留者の在留資格が変わる場合" },
      { id: "reentry-permission-and-temporary-travel", label: "在留期間中に一時出国し、日本へ戻る予定がある場合" },
    ]),
  }),
  defineJourneyTranslation("founder-or-highly-skilled-moving-to-japan", "14bd39fdfb31a62a504bf0908bb7c0d56b7900a88da7862c29bc3d7d54ed1ebe", {
    title: "起業家・高度人材のためのジャーニー",
    description: "共通の入国・来日後の手続きへ進む前に、高度人材、支援を受けるスタートアップ、または設立済み事業の経路を選びます。",
    introduction: "これらの経路では、要件の確認方法が異なります。現在資料で示せる経路を選び、その後の在留資格変更は別の手続きとして確認してください。",
    routes: JSON.stringify([
      { id: "highly-skilled-professional", title: "高度専門職", description: "要件を満たす高度人材の活動について、ポイント制で確認する経路です。" },
      { id: "startup-pathway", title: "スタートアップの経路", description: "対象となる自治体などの制度を通じて支援を受ける、起業準備の経路です。" },
      { id: "business-manager", title: "経営・管理", description: "要件を満たす設立済みの事業を経営または管理するための経路です。" },
    ]),
    phases: JSON.stringify([
      { id: "understand", title: "選択肢を理解する" },
      { id: "choose-route", title: "事業または高度人材の経路を選ぶ" },
      { id: "prepare", title: "入国の準備をする" },
      { id: "settle", title: "来日後の生活を整える" },
    ]),
    conditions: JSON.stringify([
      { id: "joining-national-health-insurance", label: "ほかの対象となる健康保険に加入していない場合" },
      { id: "national-pension-after-moving-to-japan", label: "年齢と加入状況により国民年金の対象となる場合" },
    ]),
  }),
  defineJourneyTranslation("workforce-development-in-japan", "f73c7698513193bc579127579c4a13c0821cd3b149233ade042e00556d447b9c", {
    title: "人材育成制度のジャーニー",
    description: "現在の経過措置が関係する従来制度、2027年4月に始まる後継制度、直接雇用の「特定技能」を区別します。",
    introduction: "制度名、開始日、認定された計画、分野、業務区分、技能と日本語能力、過去の参加状況によって確認すべき経路が変わります。これらの選択肢は、自動的に相互移行するものではありません。",
    routes: JSON.stringify([
      { id: "technical-intern-training", title: "技能実習", description: "技能実習制度の規制を受ける、現在の計画または経過措置の対象となる従来制度の経路です。" },
      { id: "employment-for-skill-development", title: "育成就労", description: "2027年4月1日に始まる、雇用を基礎とする後継制度です。" },
      { id: "specified-skilled-worker", title: "特定技能", description: "該当する特定技能の要件を満たす人が、対象分野で直接雇用される経路です。" },
    ]),
    phases: JSON.stringify([
      { id: "compare", title: "研修・人材育成の経路を比較する" },
      { id: "choose-route", title: "時期と事情に合う制度を選ぶ" },
      { id: "prepare", title: "入国の準備をする" },
      { id: "settle", title: "来日後の生活を整える" },
      { id: "travel", title: "一時出国を計画する" },
    ]),
    conditions: JSON.stringify([
      { id: "joining-national-health-insurance", label: "ほかの対象となる健康保険に加入していない場合" },
      { id: "national-pension-after-moving-to-japan", label: "年齢と加入状況により国民年金の対象となる場合" },
      { id: "reentry-permission-and-temporary-travel", label: "在留期間中に一時出国し、日本へ戻る予定がある場合" },
    ]),
  }),
  defineJourneyTranslation("working-holiday-in-japan", "2b8b42dcbd3c3a0e972c56b9503e32bfa48f25631cccf6059abd28445ac22029", {
    title: "日本でのワーキング・ホリデーのジャーニー",
    description: "二国間の要件を確認し、休暇を主目的とする申請を準備して、該当する来日後と帰国前の手続きを行います。",
    introduction: "ワーキング・ホリデーは「特定活動」の制度の一つです。対象となるかどうかと付随的な就労の条件は、国・地域ごとの取決めによって異なります。",
    routes: "[]",
    phases: JSON.stringify([
      { id: "understand", title: "制度を理解する" },
      { id: "prepare", title: "入国の準備をする" },
      { id: "settle", title: "来日後の生活を整える" },
      { id: "maintain-and-leave", title: "税金と帰国前の手続きを確認する" },
    ]),
    conditions: JSON.stringify([
      { id: "joining-national-health-insurance", label: "ほかの対象となる健康保険に加入していない場合" },
      { id: "national-pension-after-moving-to-japan", label: "年齢と加入状況により国民年金の対象となる場合" },
      { id: "income-and-resident-tax-after-moving-to-japan", label: "課税対象となる所得がある場合、または税務上の扱いを確認する必要がある場合" },
    ]),
  }),
  defineJourneyTranslation("digital-nomad-in-japan", "8d87b06852a2c56c9f13e953c7461a7568ad4ea6dec5888413ed091777d6a805", {
    title: "日本でのデジタルノマドのジャーニー",
    description: "日本の限定的なデジタルノマドの経路、リモートワークの範囲、税務上の問題、出国準備を確認します。",
    introduction: "この期間限定の「特定活動」は、日本国内で一般的に雇用されるため、または日本へ移住するための経路ではありません。",
    routes: "[]",
    phases: JSON.stringify([
      { id: "understand", title: "経路を理解する" },
      { id: "tax", title: "税務上の扱いを確認する" },
      { id: "departure", title: "定められた期限までの出国を準備する" },
    ]),
    conditions: JSON.stringify([
      { id: "tax-residence-and-taxable-income-in-japan", label: "滞在または仕事により、日本の税務上の居住者に該当するか確認が必要な場合" },
      { id: "foreign-income-tax-treaties-and-foreign-tax-credits", label: "所得が国外で支払われる、他国と関係する、または日本国外で課税される場合" },
    ]),
  }),
  defineJourneyTranslation("skilled-or-sector-worker-moving-to-japan", "2e12c8abbc39c061d922713ddb6508cce2c5c5527f3d38099f66fa3ee34b9fe2", {
    title: "技能・分野別の仕事のジャーニー",
    description: "該当する技能職または分野別の直接雇用の経路を選び、雇用、入国、来日後の生活に必要な手順を確認します。",
    introduction: "「興行」、「技能」、「特定技能」は、順番に進む手順ではなく、別々の選択肢です。人材育成制度は別のジャーニーで確認します。",
    routes: JSON.stringify([
      { id: "entertainer", title: "興行", description: "要件を満たす公演、芸能、またはプロスポーツの活動を行う経路です。" },
      { id: "skilled-labor", title: "技能", description: "産業上の熟練した技能を必要とする、定められた職種の経路です。" },
      { id: "specified-skilled-worker", title: "特定技能", description: "指定された産業分野で、対象となる仕事を行う経路です。" },
    ]),
    phases: JSON.stringify([
      { id: "understand", title: "就労の在留資格を理解する" },
      { id: "choose-route", title: "技能または分野別の経路を選ぶ" },
      { id: "prepare", title: "入国の準備をする" },
      { id: "settle", title: "来日後の生活を整える" },
    ]),
    conditions: JSON.stringify([
      { id: "joining-national-health-insurance", label: "ほかの対象となる健康保険に加入していない場合" },
      { id: "national-pension-after-moving-to-japan", label: "年齢と加入状況により国民年金の対象となる場合" },
    ]),
  }),
  defineJourneyTranslation("accepting-foreign-workers", "9b33f16e3780fb5cf8d703c2bf4c7ee64e45fbc02877af7bbb9f4446342a3829", {
    title: "外国人材受入れジャーニー",
    description: "適法な職務を定め、検討する活動別の在留資格を選び、申請支援、受入れ、雇用後の届出や変更を管理します。",
    introduction: "雇用主は、実際の職務と正確な資料を準備しますが、COE、査証、上陸、在留資格変更、在留期間更新を決定するのは行政機関です。候補者の専門的な活動に合う経路を選びますが、これを要件を満たすという判断として扱わないでください。",
    routes: JSON.stringify(professionalRouteTranslations),
    phases: JSON.stringify([
      { id: "design-role", title: "職務を定め、在留資格を検討する" },
      { id: "recruit-and-apply", title: "適法に採用し、申請を支援する" },
      { id: "manage-changes", title: "契約とその後の変更を管理する" },
    ]),
    conditions: "[]",
  }),
  defineJourneyTranslation("side-work-or-freelancing-while-employed", "ed24a78e4b94f4ae2c02c3bf72c7925262df2482aa4c359f967340f5f9fdd815", {
    title: "雇用中の副業・フリーランスのジャーニー",
    description: "現在の専門職向け在留資格を確認し、追加の仕事について、許可、契約、届出、税務上の責任を確認します。",
    introduction: "現在の就労資格を選ぶと、その活動範囲を確認しながら、関係のない専門職向け資格を後の手順から除外できます。",
    routes: JSON.stringify(professionalRouteTranslations),
    phases: JSON.stringify([
      { id: "current-status", title: "現在の就労資格を確認する" },
      { id: "assess-side-work", title: "予定している副業を確認する" },
      { id: "handle-coverage", title: "保険の加入と労働時間を確認する" },
      { id: "handle-tax", title: "税務記録と申告を管理する" },
      { id: "maintain-status", title: "基礎となる在留資格を維持する" },
    ]),
    conditions: JSON.stringify([
      { id: "side-jobs-and-multiple-employers-in-japan", label: "追加の活動が、別の雇用主との雇用契約に基づく仕事である場合" },
      { id: "freelance-contracts-and-client-obligations-in-japan", label: "事業者から独立したフリーランスとして業務を受託する場合" },
      { id: "notifying-immigration-about-work-contract-changes", label: "対象となる契約または所属機関が変わる場合" },
      { id: "employment-insurance-social-insurance-and-work-injury", label: "雇用保険・社会保険の加入状況が変わる、複数の勤務先がある、または仕事中・通勤中にけがをした場合" },
      { id: "workplace-harassment-safety-and-getting-help", label: "職場が安全でない場合、または職場の問題について支援が必要な場合" },
      { id: "payroll-withholding-and-year-end-adjustment", label: "日本の給与計算を通じて給与を受け取る場合" },
      { id: "consumption-tax-and-the-invoice-system", label: "課税売上高、任意の課税事業者選択、またはインボイス登録が関係する可能性がある場合" },
      { id: "filing-a-japanese-income-tax-return", label: "所得、控除、その他の事情により確定申告が必要または有利となる場合" },
    ]),
  }),
  defineJourneyTranslation("j-find-future-creation", "ef70ff3bdbfb2626752492130d2a809a53ea06b33f7a367c985799c1bbde8767", {
    title: "未来創造人材制度（J-Find）のジャーニー",
    description: "卒業後の期間などの要件を確認し、認められる未来創造活動を準備して、長期滞在に伴う責任を管理します。",
    introduction: "現在の対象大学、卒業時期、資金、活動内容、家族に関する条件を確認してください。",
    routes: "[]",
    phases: JSON.stringify([
      { id: "understand", title: "経路を理解する" },
      { id: "prepare", title: "入国の準備をする" },
      { id: "settle", title: "来日後の生活を整える" },
      { id: "maintain", title: "継続的な責任を管理する" },
    ]),
    conditions: JSON.stringify([
      { id: "joining-national-health-insurance", label: "ほかの対象となる健康保険に加入していない場合" },
      { id: "national-pension-after-moving-to-japan", label: "年齢と加入状況により国民年金の対象となる場合" },
      { id: "income-and-resident-tax-after-moving-to-japan", label: "所得または活動により、日本で納税義務が生じる場合" },
      { id: "reentry-permission-and-temporary-travel", label: "許可された期間中に日本を一時出国する場合" },
      { id: "renewing-or-changing-your-status-of-residence", label: "通算の上限内で在留期間を更新する、または別の認められた活動へ移る前" },
    ]),
  }),
  defineJourneyTranslation("long-stay-sightseeing-in-japan", "f688863f4d6936398da20cc59204201073578d63b482d18574aa3ec22a1c2bd7", {
    title: "日本での長期観光ジャーニー",
    description: "長期観光の経路を、資金、保険、就労不可、出国に関する条件とともに確認します。",
    introduction: "この経路は、要件を満たす観光や保養のためのものであり、雇用またはフリーランスの仕事を行うためのものではありません。",
    routes: "[]",
    phases: JSON.stringify([
      { id: "understand", title: "経路を理解する" },
      { id: "prepare", title: "入国の準備をする" },
      { id: "settle", title: "該当する住民向け手続きを行う" },
      { id: "maintain", title: "最長1年の期間を管理する" },
      { id: "departure", title: "出国の準備をする" },
    ]),
    conditions: JSON.stringify([
      { id: "joining-national-health-insurance", label: "ほかの対象となる健康保険に加入していない場合" },
      { id: "national-pension-after-moving-to-japan", label: "年齢と加入状況により国民年金の対象となる場合" },
      { id: "renewing-or-changing-your-status-of-residence", label: "当初の6か月の在留期間が満了する前に、認められる延長を申請する場合" },
    ]),
  }),
  defineJourneyTranslation("cultural-activities-or-training-in-japan", "efcc326ecf65d2c5eafef46a29646c28060e464fca16fc89fb502ad222115209", {
    title: "文化活動・研修のジャーニー",
    description: "報酬を受けない文化・学術上の活動、または対象となる研修の経路を選び、該当する長期入国の手順を確認します。",
    introduction: "「文化活動」と「研修」は、認められる活動が異なる別々の選択肢です。",
    routes: JSON.stringify([
      { id: "cultural-activities", title: "文化活動", description: "要件を満たす、報酬を受けない文化上または学術上の活動を行う経路です。" },
      { id: "trainee", title: "研修", description: "通常の雇用とは異なる、対象となる研修を受ける経路です。" },
    ]),
    phases: JSON.stringify([
      { id: "understand", title: "在留資格の仕組みを理解する" },
      { id: "choose-route", title: "文化活動または研修を選ぶ" },
      { id: "prepare", title: "入国の準備をする" },
      { id: "settle", title: "来日後の生活を整える" },
    ]),
    conditions: JSON.stringify([
      { id: "joining-national-health-insurance", label: "ほかの対象となる健康保険に加入していない場合" },
      { id: "national-pension-after-moving-to-japan", label: "年齢と加入状況により国民年金の対象となる場合" },
    ]),
  }),
  defineJourneyTranslation("medical-visit-to-japan", "1210644ac6bc3d4c875b9b436381a636527f05dcc55b953ef5bc907fbbef5c83", {
    title: "日本での医療滞在ジャーニー",
    description: "計画的な医療滞在または通常の短期訪問を選び、90日以内の治療と、要件を満たす長期入院を区別します。",
    introduction: "治療期間、入院、複数回の訪問、コーディネーター、同伴者、費用負担によって、経路と必要資料が変わります。医療上の手配だけで、出入国在留管理上の許可が得られるわけではありません。",
    routes: JSON.stringify([
      { id: "medical-stay", title: "医療滞在", description: "日本の医療機関と登録された身元保証機関が調整する計画的な治療の経路で、該当する場合は長期入院の経路も含みます。" },
      { id: "temporary-visitor", title: "通常の短期訪問", description: "医療滞在制度ではなく、通常の「短期滞在」が適切となる、要件を満たす短期間で報酬を伴わない訪問です。" },
    ]),
    phases: JSON.stringify([
      { id: "understand", title: "訪問に必要な許可を理解する" },
      { id: "choose-route", title: "訪問の経路を選ぶ" },
      { id: "enter", title: "入国時の記録を理解する" },
    ]),
    conditions: "[]",
  }),
  defineJourneyTranslation("diplomatic-or-official-assignment", "04a21ac093ba8f10be7d8e2e00c0095d9744adf0c42a0a1e329e1060fb8c7db5", {
    title: "外交・公用の任務ジャーニー",
    description: "認められた「外交」または「公用」の任務と、外交・公用旅券を使う私的な渡航を区別します。",
    introduction: "役割、目的、派遣機関、日本による承認によって経路が決まります。旅券の種類だけでは決まらず、これらの在留資格は通常の在留カード制度の対象外です。",
    routes: JSON.stringify([
      { id: "diplomatic", title: "外交", description: "認められた外交、領事、またはこれに準ずる保護対象の活動と、要件を満たす同一世帯の家族の経路です。" },
      { id: "official", title: "公用", description: "「外交」以外の、認められた外国政府または国際機関の公務と、要件を満たす同一世帯の家族の経路です。" },
    ]),
    phases: JSON.stringify([
      { id: "understand", title: "在留資格の仕組みを理解する" },
      { id: "choose-route", title: "任務の経路を選ぶ" },
      { id: "enter", title: "入国時の記録を理解する" },
    ]),
    conditions: JSON.stringify([
      { id: "documents-received-when-entering-japan", label: "一般的な入国書類の説明がその任務にも当てはまる場合" },
    ]),
  }),
  defineJourneyTranslation("preparing-for-permanent-residence", "517a336d48175ecf72f4d587a5d49b9afff9c21fdea0757eede1520ad57b1d04", {
    title: "永住許可申請の準備ジャーニー",
    description: "将来の永住許可申請を支える、継続的な出入国在留管理と税務の記録を整理します。",
    introduction: "対象となる経路と現在の基準によって要件は異なります。このジャーニーは準備を支援するものであり、許可の可能性を予測するものではありません。",
    routes: "[]",
    phases: JSON.stringify([
      { id: "understand", title: "在留資格の仕組みを理解する" },
      { id: "maintain", title: "記録を適切に維持する" },
      { id: "apply", title: "申請を準備する" },
    ]),
    conditions: "[]",
  }),
  defineJourneyTranslation("ongoing-resident-responsibilities", "8965dacd8b1cd634ab88678ebc7b964fbc3977e9893e669aeb71b6f1c610e1bb", {
    title: "在留中の継続的な責任のジャーニー",
    description: "来日直後の手続きが終わった後も、税金、出入国在留管理、将来の出国に関する責任を確認できるようにします。",
    introduction: "雇用、所得、在留資格、自治体、今後の予定によって、これらの責任がどのように当てはまるかは異なります。",
    routes: "[]",
    phases: JSON.stringify([
      { id: "tax", title: "税務記録を維持する" },
      { id: "work-changes", title: "仕事の変更に対応する" },
      { id: "immigration", title: "出入国在留管理上の許可を維持する" },
      { id: "temporary-travel", title: "一時出国を準備する" },
      { id: "departure", title: "在留終了の手続きを行う" },
    ]),
    conditions: JSON.stringify([
      { id: "payroll-withholding-and-year-end-adjustment", label: "日本の給与計算を通じて給与を受け取る場合" },
      { id: "foreign-income-tax-treaties-and-foreign-tax-credits", label: "国外と関係する所得、外国で納付した税金、または租税条約による軽減が関係する場合" },
      { id: "tax-for-side-work-and-sole-proprietors", label: "通常の給与以外の所得がある、または独立して事業を行う場合" },
      { id: "consumption-tax-and-the-invoice-system", label: "独立した活動、課税売上高、任意の課税事業者選択、またはインボイス登録が関係する場合" },
      { id: "filing-a-japanese-income-tax-return", label: "所得、控除、その他の事情により確定申告が必要または有利となる場合" },
      { id: "side-work-and-freelancing-on-a-work-status", label: "追加の報酬を受ける活動を予定している場合" },
      { id: "notifying-immigration-about-work-contract-changes", label: "対象となる契約または所属機関が変わる場合" },
      { id: "reentry-permission-and-temporary-travel", label: "現在の在留許可で日本を一時出国し、戻る予定がある場合" },
      { id: "tax-procedures-before-leaving-japan", label: "日本の税務上の居住を終える、または未解決の国税・地方税の事項を残して出国する場合" },
      { id: "leaving-japan-and-closing-out-procedures", label: "日本での在留を終えて出国する準備をする場合" },
    ]),
  }),
  defineJourneyTranslation("employment-lifecycle-in-japan", "5bd50a06524b08c76222d1eec9b4e42d66bb821b8c9b3a66715c20a797dc7bab", {
    title: "日本での雇用ライフサイクルのジャーニー",
    description: "雇用関係と労働条件、賃金と労働時間を確認し、必要に応じて変更や雇用終了に対応します。",
    introduction: "労働者の権利、出入国在留管理上の許可、保険、税金には、それぞれ別の規則があります。このジャーニーでは、一つをほかの証明として扱わずに、それらの関係を確認します。",
    routes: "[]",
    phases: JSON.stringify([
      { id: "start", title: "雇用関係を理解する" },
      { id: "work", title: "賃金、労働時間、休暇を確認する" },
      { id: "coverage", title: "保険の加入と安全を確認する" },
      { id: "changes", title: "追加の仕事に対応する" },
      { id: "ending", title: "雇用終了に対応する" },
    ]),
    conditions: JSON.stringify([
      { id: "workplace-harassment-safety-and-getting-help", label: "職場が安全でない、ハラスメントがある、またはほかの問題について支援が必要な場合" },
      { id: "side-work-and-freelancing-on-a-work-status", label: "2つ目の仕事、フリーランスの案件、またはほかの報酬を受ける活動を予定している場合" },
      { id: "side-jobs-and-multiple-employers-in-japan", label: "追加の活動が、別の雇用契約に基づく仕事である場合" },
      { id: "freelance-contracts-and-client-obligations-in-japan", label: "事業者から独立したフリーランスとして業務を受託する場合" },
      { id: "resigning-dismissal-and-fixed-term-contract-endings", label: "雇用が終了する可能性がある、または有期契約が更新されるか不確かな場合" },
      { id: "notifying-immigration-about-work-contract-changes", label: "雇用終了または新しい契約により、出入国在留管理庁への届出が必要となる場合" },
      { id: "payroll-withholding-and-year-end-adjustment", label: "税務書類を受け取る、または年の途中で別の雇用主へ移る場合" },
    ]),
  }),
] as const;
