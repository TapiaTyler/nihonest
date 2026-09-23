import { translationArtifactSchema } from "@/domain/translation/translation";

const terminologyRevision = "74c46a91ccec5c9de19e65a60b89acd0bde3f837a042c3fe08a6ce6f1899f5cf";
const promptRevision = "4c275d0982deb5cef4ad5c05b49c900bd2f71e8065991ff32aec2ba5739c1486";
const generator = { id: "codex-assisted", model: "gpt-5" } as const;
/** Drafted by `npm run status:draft` (Claude Opus) and reviewed by Claude before integration. */
const pipelineGenerator = { id: "claude-code-claude-reviewed", model: "claude-opus-5-5" } as const;
const pipelineGeneratedAt = "2026-09-23T16:21:50.000Z";
const sharedConsiderations = [
  "対象となるかどうかは、通称ではなく、実際の活動、関係、または身分・地位によって決まります。",
  "必要な資料と手続きは、申請の種類と申請者の事情によって異なります。",
  "出入国在留管理庁と、査証申請を担当する日本の在外公館の最新の提出資料一覧を確認してください。",
];

function defineResidenceStatusTranslation(
  contentId: string,
  sourceRevision: string,
  summary: string,
  purpose: string,
  typicalActivities: readonly string[],
  examples: readonly string[],
  artifactGenerator: { id: string; model: string } = generator,
  generatedAt = "2026-09-19T00:00:00.000Z",
) {
  return translationArtifactSchema.parse({
    schemaVersion: 1,
    contentKind: "residence-status",
    contentId,
    sourceLocale: "en",
    targetLocale: "ja",
    sourceRevision,
    terminologyRevision,
    promptRevision,
    generator: artifactGenerator,
    fields: {
      summary,
      purpose,
      "typical-activities": JSON.stringify(typicalActivities),
      examples: JSON.stringify(examples),
      considerations: JSON.stringify(sharedConsiderations),
    },
    availability: "active",
    reviewState: "machine-translated",
    generatedAt,
  });
}

/** Representative statuses spanning activity-based and status-based residence routes. */
export const japaneseResidenceStatusTranslations = [
  defineResidenceStatusTranslation("student", "4a65b969e1b0dbea5fd0afff1ed39f2a152b1bb48368d4145fff7401cd1e8a79", "大学、学校、その他の対象となる教育機関で学ぶための在留資格です。", "「留学」の在留資格の対象となる教育機関で学ぶことです。", ["大学または専門学校で学ぶこと", "対象となる日本語学校その他の学校で学ぶこと"], []),
  defineResidenceStatusTranslation("engineer-specialist-humanities-international-services", "45ec09d98226dab1eca2eb86e0cb517f3f2b44f3bbd648f88f3ed4b138656111", "技術、人文科学、または国際業務に関する専門知識を必要とする、要件を満たす仕事のための在留資格です。", "日本の機関との契約に基づいて、専門的な業務を行うことです。", ["エンジニアリングまたはITの仕事", "通訳、デザイン、その他の要件を満たす専門業務"], ["ソフトウェアエンジニア", "通訳者", "デザイナー"]),
  defineResidenceStatusTranslation("dependent", "c957e70b242f3e3c1e5048eabc046a643d79f01592058ad897d776a300e8598c", "対象となる在留資格を持つ外国人に扶養される、要件を満たす配偶者または未婚の未成年の子のための在留資格です。「特定技能2号」は対象に含まれますが、「特定技能1号」は含まれません。", "扶養を受ける家族として日常生活を送ることです。通常の報酬を受ける仕事には、別途、資格外活動許可が必要です。", ["扶養される配偶者として生活すること", "扶養される未婚の未成年の子として生活すること", "該当する資格外活動許可を受けた後に、制限の範囲内でアルバイトをすること"], ["対象となる就労資格を持つ人の配偶者", "「留学」の在留資格を持つ人の未婚の未成年の子"]),
  defineResidenceStatusTranslation("permanent-resident", "086f29ba9f3e9524c098e25d8729fd1d662460d9da19dbdcf4061d1399acaac5", "該当する在留歴の経路、素行、生計、公的義務、現在の在留期間、国益に関する事情などについて、別の審査を受けて永住を許可された人のための在留資格です。", "永住許可を受けた後、在留期間の定めや活動に基づく就労制限を受けずに在留することです。", ["活動に基づく在留資格の制限を受けずに生活し、働くこと", "在留カード、再入国、税、保険、その他の住民としての義務を継続して守ること"], []),
  defineResidenceStatusTranslation("temporary-visitor", "7e524b5a637014c5dde9343f7776553446186a06ec61b2ba782a1546ca189510", "観光、親族・知人訪問、会議、短期留学など、報酬を受けない要件を満たす短期の訪問のための在留資格です。査証、査証免除、上陸時の在留資格、認められた期間はそれぞれ別のものです。", "通常の報酬を受ける仕事や居住を目的としない一時的な活動を行うことです。", ["観光または親族・知人の訪問", "短期の商談、会議、または見学", "認められた期間内の報酬を受けない短期留学"], ["観光客", "親族・知人を訪問する人", "会議の参加者", "短期講座の参加者"]),
  defineResidenceStatusTranslation("designated-activities", "f9d4ed4710814af1a8a9dd9cf2083cbbd2a05652b17506a248b413d678a4e61d", "認められる活動、就労、家族の帯同、在留期間、更新、必要資料が、本人に指定された活動によって異なる包括的な在留資格です。", "名称のある制度または個別の決定によって、特に指定された活動を行うことです。", ["継続就職活動またはJ-Findの未来創造人材としての活動", "ワーキング・ホリデーまたはデジタルノマドとしての活動", "長期観光、起業準備、医療滞在、またはその他の指定された活動"], ["要件を満たす就職活動を続ける卒業者", "J-Find参加者", "デジタルノマド", "ワーキング・ホリデー参加者", "長期観光の滞在者"]),
  defineResidenceStatusTranslation("business-manager", "58612f5cb26a9e83b825f966faadbda0d22190a0823cea9b756f7d0e80179f53", "日本で要件を満たす事業を経営し、または管理するための在留資格です。", "適切な日本国内の事業拠点から、実体のある事業の経営または管理を行うことです。", ["会社を経営すること", "要件を満たす事業部門を管理すること"], []),
  defineResidenceStatusTranslation("highly-skilled-professional", "0d30cfd969b6587d14183e7cc92d959b222f334265288d4692429c39bad1632c", "要件を満たす高度な学術研究、専門・技術、または事業経営の活動のための、ポイント制その他の高度人材向け在留資格です。", "認められた活動区分に応じた出入国在留管理上の優遇措置を伴う、高度な専門活動を行うことです。", ["高度な学術研究", "高度な専門・技術活動", "高度な事業経営・管理"], []),
  defineResidenceStatusTranslation("specified-skilled-worker", "9721a35ce22e01aecea2bd773af96fd9ec0eeb5d09b850bf43c46a449758073e", "特定技能1号または2号の制度要件に基づき、現在指定されている産業分野で要件を満たす仕事に従事するための在留資格です。", "人手不足に対応する特定技能制度の下で、分野と業務を限定した仕事に従事することです。", ["技能、日本語、雇用主、支援体制に関する要件を満たす特定技能1号の仕事", "2号が認められる分野で、より熟練した技能を要する特定技能2号の仕事"], ["外食業の従事者", "建設作業員", "工業製品製造業の従事者", "農業従事者", "宿泊業の従事者", "自動車運送業の従事者"]),
  defineResidenceStatusTranslation("spouse-or-child-japanese-national", "9caa09cd3a48333d3f5f5ffe102eb1160431a3c974a69854bc438cbed6874a2d", "要件を満たす日本人の配偶者、日本人の子として出生した人、または要件を満たす特別養子のための在留資格です。", "活動に基づく就労制限を受けず、日本人との対象となる関係を継続していることに基づいて在留することです。", ["日本人の配偶者として日本で生活すること", "日本人の子として出生した人として日本で生活すること", "要件を満たす特別養子として日本で生活すること"], []),
  defineResidenceStatusTranslation("instructor", "1966e56ed6627fb2a7456686e3de54637fae016d4cb22579223a2be46244e6d2", "大学より下の段階にある対象の学校で、語学教育その他の教育を行うための在留資格です。", "小学校、中学校、高等学校、専修学校、またはこれらに相当する対象の学校で教育を行うことです。", ["小学校または中学校・高等学校で教えること", "対象となる教育機関で語学を教えること"], []),
  defineResidenceStatusTranslation("cultural-activities", "446b1f0195fa789cf334b105a1ae205c8d7ac9a8bb2095999c03f892605465ae", "報酬を受けない、要件を満たす学術・芸術活動または日本文化の研究・修得のための在留資格です。", "収入を伴わず、日本固有の文化または技能について研究し、専門的な指導を受けることです。", ["日本文化を研究すること", "専門家の指導を受けて伝統芸術を学ぶこと"], []),
  // Pipeline batch 2026-09-23: remaining 18 statuses, drafted by Claude Opus and reviewed by Claude.
  defineResidenceStatusTranslation("diplomat", "fc5e2b3016275cb3cf50286d3455c8beac6afe97fa9f7cb4af07b343ce7d311a", "日本が受け入れている外交上の任務、またはこれに相当する特権・免除を受ける任務に就く人と、その同一世帯に属する要件を満たす家族のための在留資格です。外交旅券を持っているだけでは、この在留資格に該当しません。", "日本との正式な調整を経て行う、外交、領事、またはこれに相当する特権・免除を伴う活動です。", ["日本が受け入れている外交または領事の職務に従事すること","同一世帯に属する要件を満たす家族として、在留資格を持つ本人に同行すること"], ["大使または外交官","対象となる職務に就く領事官","同一世帯に属する要件を満たす家族"], pipelineGenerator, pipelineGeneratedAt),
  defineResidenceStatusTranslation("official", "2410d07face825481853c8b1f8a99d843ab895e0dcb7c32ecaa6126b316493dd", "日本が認める外国政府または国際機関の公務（「外交」の在留資格に該当するものを除く）を行う人と、その同一世帯に属する要件を満たす家族のための在留資格です。", "日本との正式な調整を経て行う、外国政府または国際機関の職務（「外交」の在留資格に該当するものを除く）です。", ["日本が認める外国政府の公務を行うこと","日本が認める国際機関の公務を行うこと","同一世帯に属する要件を満たす家族として、在留資格を持つ本人に同行すること"], ["事務・技術職員","国際機関の職員","同一世帯に属する要件を満たす家族"], pipelineGenerator, pipelineGeneratedAt),
  defineResidenceStatusTranslation("professor", "ec83007e000336ac99ea4edc9276a3e08111d03f5cbd8cba722c8666b3743fd5", "要件を満たす高等教育機関で、研究、研究指導、または教育を行うための在留資格です。", "大学やこれに準ずる機関で、学術的な教育と研究を行うことです。", ["大学で教えること","学術研究を行うこと、または研究を指導すること"], [], pipelineGenerator, pipelineGeneratedAt),
  defineResidenceStatusTranslation("artist", "df97e32d545b20e64cb7755d251fee172377c4b48c6e09cc1308980f0cbaa56c", "収入を伴う音楽、美術、文学その他の芸術上の活動（「興行」に当たるものを除く）のための在留資格です。", "日本で、契約に基づく、または独立した、裏付けのある職業としての芸術活動を行うことです。", ["作曲、執筆、または美術作品を制作すること","記録で裏付けられた、独立した芸術活動を行うこと"], ["作曲家","画家","作家または著述家","イラストレーター","芸術写真家"], pipelineGenerator, pipelineGeneratedAt),
  defineResidenceStatusTranslation("religious-activities", "da50c1bb0bd0e4a0c6c66cdea5c2a2b8bdef9c5a30bb94970a0dd34ca8ca0403", "外国の宗教団体から派遣された宗教家が行う、布教その他の宗教上の活動のための在留資格です。", "記録で確認できる外国の宗教団体からの派遣に基づいて、日本で要件を満たす宗教上の活動を行うことです。", ["布教活動","要件を満たす派遣の範囲内での礼拝の主宰、宗教上の奉仕、または宗教指導"], ["宣教師","牧師","司祭","ラビ","イマーム","修道士・僧侶、または修道女・尼僧"], pipelineGenerator, pipelineGeneratedAt),
  defineResidenceStatusTranslation("journalist", "5525f43921224d05103cc7406fe536c926b7ccd92189e0a581e03d6748133edd", "外国の報道機関との、要件を満たす契約に基づいて行う取材その他の報道上の活動のための在留資格です。", "派遣、雇用、または要件を満たす雇用以外の契約により、外国の報道機関のために報道を行うことです。", ["外国の特派員として取材を行うこと","報道写真の撮影その他の報道上の撮影業務"], ["記者","特派員","フォトジャーナリスト","報道カメラマン","放送記者"], pipelineGenerator, pipelineGeneratedAt),
  defineResidenceStatusTranslation("legal-accounting-services", "c9e93cf52ab6b9c5e550744c03b8296b45e9e91211b100a54602981df066c916", "日本の法律で認められた11の専門資格のいずれかに基づいて行う、有資格者に限られた法律または会計に関する業務のための在留資格です。", "保有する日本の資格の範囲内で、法令で規制された法律または会計に関する専門業務を行うことです。", ["日本の資格を持つ弁護士として業務を行うこと","要件を満たす公認会計士、税理士、司法書士、行政書士、その他の定められた専門職として働くこと"], ["弁護士","外国法事務弁護士","公認会計士","税理士","司法書士","行政書士","弁理士"], pipelineGenerator, pipelineGeneratedAt),
  defineResidenceStatusTranslation("medical-services", "774fa17c52d68e721d4bc234ff5804e24f28e0fccbc3e25bbda5e7cac384a426", "有効な日本の専門資格の範囲内で行う、対象となる医療に関する業務のための在留資格です。", "現行の出入国管理上の基準に定められた職種のいずれかで、免許に基づく医療業務を行うことです。", ["日本の免許を持つ医師、歯科医師、薬剤師、または看護師として業務を行うこと","基準で明示的に対象とされているその他の医療関係職種として働くこと"], ["医師","歯科医師","薬剤師","看護師","助産師","理学療法士","作業療法士","臨床工学技士"], pipelineGenerator, pipelineGeneratedAt),
  defineResidenceStatusTranslation("researcher", "fb5b6875f2e6a63d43521d78fea4c176b06d618092dbda02c2a78c86f63daf71", "日本の機関との契約に基づいて行う、要件を満たす研究（「教授」に当たるものを除く）のための在留資格です。", "要件を満たす公私の機関で研究活動を行うことです。", ["企業の研究所での研究","研究機関での調査"], [], pipelineGenerator, pipelineGeneratedAt),
  defineResidenceStatusTranslation("intra-company-transferee", "2ca79c56910b11e1591a3d81eeaf112d9738a1f3d7c363e79624eca237848ddd", "国際的な企業グループ内で日本の事業所へ転勤する、要件を満たす従業員のための在留資格です。", "期間を限ったグループ内の転勤により、「技術・人文知識・国際業務」の活動分野に当たる対象の仕事を行うことです。", ["海外の事業所から日本の支店への転勤","要件を満たす関連会社間の転勤"], [], pipelineGenerator, pipelineGeneratedAt),
  defineResidenceStatusTranslation("nursing-care", "e3ae7ce55895264c0cf0032bedbc1a1580b9bc93472f1281ea3ea0e83ea6e8a3", "日本の公私の機関との契約に基づいて、登録を受けた介護福祉士が行う介護または介護の指導のための在留資格です。", "介護福祉士の資格と登録に基づいて、専門的な介護の業務を行うことです。", ["登録を受けた介護福祉士として介護を行うこと","専門資格を生かして介護の実践を指導すること"], ["介護福祉士","介護福祉士の登録を受けている介護の指導者"], pipelineGenerator, pipelineGeneratedAt),
  defineResidenceStatusTranslation("entertainer", "96b0a142027b5a8d878338a09a3f7a2b8ca5c8c1b60fe0162d57853db949c774", "該当する活動区分に基づいて行う、要件を満たす公演、スポーツ、芸能、広告、または商業制作のための在留資格です。", "活動区分ごとに定められた公演、芸能、プロスポーツ、または商業制作の仕事を行うことです。", ["音楽、演劇、ダンス、モデル、またはプロスポーツの活動","広告、放送、映画、商業写真、またはレコーディングの制作"], ["俳優","歌手またはミュージシャン","ダンサーまたはモデル","プロスポーツ選手","映画または放送の制作スタッフ","商業写真家"], pipelineGenerator, pipelineGeneratedAt),
  defineResidenceStatusTranslation("skilled-labor", "a1f01865b65ce1af6479c5e2adc1d2dd833b950ca8a8c694764eaa8275cd6a90", "9つの産業上の特殊な分野のいずれかで、熟練した技能を要する仕事を行うための在留資格です。分野ごとに、実務経験または実績に関する基準があります。", "日本の公私の機関との契約に基づいて、限定された職種区分で熟練した専門的な仕事を行うことです。", ["外国料理の調理、またはその他の外国に特有の技能を要する仕事","航空機の操縦、スポーツの指導、動物の調教、またはワインの鑑定"], ["外国料理の調理師","航空機のパイロット","スポーツ指導者","ソムリエ","宝石・貴金属の加工職人","動物の調教師"], pipelineGenerator, pipelineGeneratedAt),
  defineResidenceStatusTranslation("technical-intern-training", "c08a46ae69675f7c4030b79f72c807e758c2c8d6f5cbbe33ac320d5e5907dbd8", "認定を受けた計画、段階、作業区分、機関の体制のもとで、規制された従来の技能実習制度に参加するための在留資格です。", "認定を受けた技能実習計画に基づき、監督のもとでの雇用と指導を通じて技能等を移転することです。", ["認定を受けた計画に基づく「技能実習1号」、「技能実習2号」、または「技能実習3号」","実習実施者のもとでの対象となる雇用と指導"], ["認定を受けた職種・作業に従事する技能実習生"], pipelineGenerator, pipelineGeneratedAt),
  defineResidenceStatusTranslation("employment-for-skill-development", "a0d231914b8d68588ecaf0ea5013e620483d1490188275241a7b61001894072e", "2027年4月1日から始まる、対象となる人手不足分野で、働く人を「特定技能1号」の水準の技能に向けて育成する計画的な雇用のための在留資格です。", "対象分野で、認定を受けた育成就労計画を通じて、通常3年間かけて人材を育成し、確保することです。", ["対象分野の認定を受けた計画に基づく雇用と技能の育成","「特定技能1号」に向けた日本語と技能の育成"], ["介護、製造、建設、宿泊、農業、外食業、その他の認められた対象分野で働く育成就労外国人"], pipelineGenerator, pipelineGeneratedAt),
  defineResidenceStatusTranslation("trainee", "236c11af63adb2c9603deb6336aa5c25ba15d6eb8c4f9c0762263cf2994c52ce", "「技能実習」に該当しない、要件を満たす雇用関係のない研修のための在留資格です。", "対象となる研修の枠組みを通じて技能を修得することです。", ["公的機関を通じて研修を受けること","要件を満たす非実務研修または公的研修を受けること"], [], pipelineGenerator, pipelineGeneratedAt),
  defineResidenceStatusTranslation("spouse-or-child-permanent-resident", "1d0e0014cdd9d429459edc6140d3bdb699d9725110268a9d20424f3d486d92d2", "「永住者」または「特別永住者」の要件を満たす配偶者、またはその実子で日本で出生し、その後も引き続き日本に在留している人のための在留資格です。", "対象となる関係と事情が継続していることに基づいて在留することです。活動に基づく就労制限はありません。", ["「永住者」または「特別永住者」の要件を満たす配偶者として生活すること","日本で出生し、引き続き日本に在留している、要件を満たす実子として生活すること"], [], pipelineGenerator, pipelineGeneratedAt),
  defineResidenceStatusTranslation("long-term-resident", "e6f458f66290b1e42e83c3b452c2f1a04b71a5612e576e45871c5d70eac74c8c", "該当する告示の類型に当たる人、または認められた特別な事情により個別に在留を認められた人のための在留資格です。ほかに該当しない場合の一般的な受け皿となる在留資格ではありません。", "要件を満たす個人の身分や地位に基づいて在留することです。活動に基づく就労制限はありません。", ["対象となる日系人または家族の類型に基づいて在留すること","第三国定住難民として在留すること","個別に認められたその他の特別な事情に基づいて在留すること"], [], pipelineGenerator, pipelineGeneratedAt),
] as const;
