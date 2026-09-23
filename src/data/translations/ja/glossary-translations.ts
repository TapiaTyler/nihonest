import { translationArtifactSchema } from "@/domain/translation/translation";

const terminologyRevision = "74c46a91ccec5c9de19e65a60b89acd0bde3f837a042c3fe08a6ce6f1899f5cf";
const promptRevision = "4c275d0982deb5cef4ad5c05b49c900bd2f71e8065991ff32aec2ba5739c1486";
const generator = { id: "codex-assisted", model: "gpt-5" } as const;

function defineGlossaryTranslation(contentId: string, sourceRevision: string, shortDefinition: string, detailedExplanation: string, commonContext: string) {
  return translationArtifactSchema.parse({
    schemaVersion: 1,
    contentKind: "glossary-term",
    contentId,
    sourceLocale: "en",
    targetLocale: "ja",
    sourceRevision,
    terminologyRevision,
    promptRevision,
    generator,
    fields: {
      "short-definition": shortDefinition,
      "detailed-explanation": detailedExplanation,
      "common-context": commonContext,
    },
    availability: "active",
    reviewState: "machine-translated",
    generatedAt: "2026-09-19T00:00:00.000Z",
  });
}

/** Representative administrative terms used throughout the current Japanese article pilot. */
export const japaneseGlossaryTranslations = [
  defineGlossaryTranslation("zairyu-card", "b66a4f5c4cbe04f9a0fe397dbb0b90a2642dcef9f3021df0b90ed67153b907bb", "対象となる中長期在留者に交付される、身分と在留に関する書類です。", "氏名、在留資格、在留期間、満了日、住所、該当する場合の就労制限など、在留に関する基本情報が記載されます。査証、上陸許可、マイナンバーカードとは別のものです。", "指定された空港で、または住居地の届出後に交付され、自治体や民間事業者の手続きで提示します。"),
  defineGlossaryTranslation("zairyu-shikaku", "be3e14092fbf679fcde243dfbbe310d16219c107e7af5e9200701438ecc8b908", "外国人が日本に在留する間に認められる活動または身分・地位を定める法的な区分です。", "在留資格は出入国在留管理上の手続きによって決まり、日本へ渡航するために使う査証とは異なります。「留学」「家族滞在」「文化活動」「経営・管理」などは、認められる活動が異なる別々の在留資格です。", "上陸許可に記載され、対象となる在留者には在留カードにも表示されます。"),
  defineGlossaryTranslation("certificate-of-eligibility", "76d67951c7dad01b8c2f34641b3f55c05a64988bc225570ff57630cc33c2b29f", "予定する長期在留の活動が、関係する上陸条件に適合するかを出入国在留管理庁が事前に審査したことを示す証明書です。", "出入国在留管理庁が、予定する活動が関係する上陸条件に適合するかを審査した後に交付します。申請の対象者は外国人本人ですが、経路によっては、要件を満たす学校、雇用主、親族などが代理人として手続きできます。その後の査証申請と上陸申請を支える書類ですが、査証そのものではなく、どちらの決定も保証しません。", "学校、雇用主、在外公館、出入国在留管理庁の案内では、COEと略されることがあります。受入機関が申請を支援することはありますが、証明書を交付する機関ではありません。"),
  defineGlossaryTranslation("my-number", "2665d0ccb883669ea083af7c42f9c4023bd10d5f059c60352444dca4c3f5417c", "日本の住民票に記録された一人ひとりに指定される12桁の個人番号です。", "マイナンバーは、法令で定められた社会保障、税、災害対策の行政手続きに使われます。番号そのもの、番号を知らせる通知、任意で申請する顔写真付きのマイナンバーカードは、それぞれ別のものです。", "法令に基づいて番号を使用する手続きでのみ求められます。必要のない相手に開示しないよう、安全に管理する必要があります。"),
  defineGlossaryTranslation("sasho", "cd4e3dd49cd580b8bcabaccaa3cafb1dd01e7fae5c10daf4da7057f481e0d98c", "日本の大使館または領事館が、日本への渡航と上陸申請のために発給する書類です。", "査証は渡航前と入国時に使います。上陸後の活動を定める在留資格とは異なり、査証だけで国境での上陸が保証されるわけではありません。", "大使館や領事館の案内に記載されます。日常会話では在留資格を指して「ビザ」と呼ぶこともありますが、正確には別の概念です。"),
  defineGlossaryTranslation("joriku-kyoka", "81225474c9c8ecc167294e9a8273f5dcdc26aade517ac0f112737791dbe7c096", "日本への入国を認めるときに、出入国在留管理の審査によって与えられる許可です。", "上陸許可には、認められた在留資格と在留期間が記録されます。上陸を求めるために使う査証や、対象となる在留者に交付される在留カードとは別のものです。", "通常、入国審査の後に、旅券へ上陸許可の証印または記録として示されます。"),
  defineGlossaryTranslation("zairyu-kikan", "5884327debd239d158fe954f94206f6b9800aa4f22e7fa334160e5499406ec2d", "認められた在留資格に基づいて、日本に在留できる期間です。", "在留期間は個々の事情を審査して決定され、上陸許可と、交付対象者の在留カードに記載されます。旅券の有効期間や学校の課程の長さとは異なります。", "日本への入国時や、在留期間の更新または在留資格の変更を計画するときに確認します。"),
  defineGlossaryTranslation("tanki-taizai", "beb8e7f5552985e4282cf50be525055cfe0e1029231a198937a6d0ec97f477f1", "観光、訪問、報酬を受けない要件を満たす短期留学など、認められた短期の活動のための在留資格です。", "「短期滞在」は「留学」の在留資格とは異なり、通常、中長期在留者が行う住民手続きの対象にはなりません。認められる期間と査証の要否は、渡航者の入国経路や国籍によって異なります。", "多くの短期訪問では、認められた期間内に終わる一部の留学プログラムを含め、上陸許可の記録に表示されます。"),
  defineGlossaryTranslation("ryugaku", "50737d8889b07f3bef58ad6e97046a1873eeaaf3bb088026a082a02d04f8cd56", "日本の対象となる教育機関で、要件を満たす教育を受けるための在留資格です。", "「留学」は、認められた課程で学ぶ活動を許可します。「短期滞在」で行う短期留学とは異なり、それ自体では報酬を受ける仕事を許可しません。", "対象となる留学生の上陸許可や在留カードには、「留学」と表示されます。"),
  defineGlossaryTranslation("shikakugai-katsudo-kyoka", "186171d767bae415b8747acf1b8a227cd1f2b0565243fa805cbb9c46f2001d61", "現在の在留資格で認められた活動の範囲外で、指定された収入を伴う活動を行うための出入国在留管理上の許可です。", "現在の在留資格の範囲外で、収入を伴う事業を運営したり報酬を受ける活動を行ったりするときに必要となる許可です。許可の種類と条件は在留者と活動によって異なるため、留学生に一般的な許可を就労資格の専門職にも当てはめることはできません。", "留学生がアルバイトを始める前や、就労資格を持つ人が現在の資格の範囲外の有償活動を引き受ける前によく確認されます。"),
  defineGlossaryTranslation("sainyukoku-kyoka", "f8a83932dd9a744a1a2139220f7d34cf564bf38eac653e9e11d4b5564c5776a1", "日本を一時的に出国し、現在の在留資格と在留期間のまま再び入国するために、事前に受ける出入国在留管理上の許可です。", "通常の再入国許可には一回限りと数次のものがあります。有効期間は現在の在留期間を超えられないため、基礎となる在留許可を更新するものではありません。", "みなし再入国許可の期限を超える予定の出国や、みなし再入国許可を利用できない場合に検討します。"),
  defineGlossaryTranslation("minashi-sainyukoku-kyoka", "1ca17b5c6deee94fb3fc39793c72101024334a4252cb7915109dd1953c2245fc", "要件を満たす在留者が所定の短い期限内に戻る場合、通常は事前の再入国許可を不要とする制度です。", "帰国期限は、出国から1年が経過する日と現在の在留期間の満了日のうち、早い方です。渡航前に、対象要件、旅券と在留カードの取扱い、出国時の意思表示、適用除外をすべて確認する必要があります。", "対象となる中長期在留者が一時的に海外へ出る際によく利用されます。"),
  defineGlossaryTranslation("tokutei-katsudo", "4072bf3c42220c4faacbb59cc426599e397cb85a211d261af4a96839121f8b15", "本人または定められた制度について、認められる活動が個別に指定される在留資格です。", "「特定活動」という名称だけでは、認められる仕事や活動は分かりません。デジタルノマド、継続就職活動、ワーキング・ホリデーなどは条件が異なるため、指定書と関連する記録を確認する必要があります。", "実際の活動範囲を定める指定書とともに、在留に関する記録に表示されます。"),
  defineGlossaryTranslation("kazoku-taizai", "f506cf901296a73697a71b0aa76d3fad82752d91967b2f7b3094b8cdc543564f", "対象となる在留資格を持つ外国人に扶養される、要件を満たす配偶者または子のための在留資格です。", "「家族滞在」は扶養を受ける家族関係に基づく在留資格で、それ自体では制限のない就労を許可しません。日本人または永住者との婚姻に基づく配偶者の在留資格とも異なります。", "対象となる主たる在留者が、配偶者または子を日本へ呼び寄せ、扶養するときに使われます。"),
  defineGlossaryTranslation("gijutsu-jinbun-kokusai", "f5559e238cb0c9da94aa4195be58dea91f210b9257094f83ad996b09f80a76fd", "要件を満たす技術、人文知識、国際業務の活動を対象とする就労資格です。", "予定する職務、申請者の経歴、雇用主、労働条件がこの区分に適合する必要があります。職種名だけでは対象になることを示せず、関連のない単純作業は活動範囲外となる場合があります。", "一般的な専門職の就労区分で、「技人国」と略して呼ばれることもあります。"),
  defineGlossaryTranslation("eiju-kyoka", "cff48efcf4033fb7950f183d52d7e1b795b2d7d820825b517757f11d85ff026b", "在留期間の定めがない「永住者」として日本に在留するための許可です。", "永住は独自の審査を伴う別の出入国在留管理上の許可です。日本国籍ではなく、在留カードや再入国の手続きを適切に維持する義務などがなくなるわけでもありません。", "一定期間の在留を続けた後、経路ごとの要件や素行に関する基準を検討するときに扱われます。"),
  defineGlossaryTranslation("shotoku-zei", "2bc5e1ce5eb499c2e938bd37f43cbdf98076f2c3901644c2a5c0d7b849db5702", "法律で定められた課税範囲にある個人の所得に対する日本の国税です。", "税法上の居住者区分、所得の源泉、所得区分、控除、源泉徴収によって計算が変わります。出入国在留資格と税法上の居住者区分は別の法的区分です。", "給与明細、源泉徴収票、確定申告書、国税庁の案内などに記載されます。"),
  defineGlossaryTranslation("jumin-zei", "2887863d00f471827c1a1b46551e3475d89396ea07c5a37fe43826f6f83635cf", "通常、前年の所得と住民情報を基に都道府県と市区町村が課す地方税です。", "請求と徴収は、所得を得た年より後になることがあります。担当する自治体、1月1日時点の状況、徴収方法によって、実際の手続きが変わります。", "自治体の通知書に記載され、給与から差し引かれる場合と、別に届く納付書で支払う場合があります。"),
] as const;
