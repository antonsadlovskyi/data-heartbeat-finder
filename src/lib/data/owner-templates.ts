// Template page_objects payloads for the "owner" role.
// Used as a fallback when the backend hasn't written a row yet, so the owner
// view is always meaningful (instead of showing an empty / "waiting" state).
//
// Data is in Ukrainian and matches the platform niche: онлайн-підготовка до НМТ
// (Національний мультипредметний тест). Competitors and analyses describe real-
// world style accounts in the Ukrainian edtech / репетитор / онлайн-курси
// простір.

export type OwnerTemplateKey =
  | "dashboard"
  | "competitors"
  | "analyses"
  | "database";

const trend14 = Array.from({ length: 14 }, (_, i) => ({
  d: i,
  you: 1800 + Math.sin(i / 2) * 280 + i * 90,
  niche: 1500 + Math.cos(i / 3) * 220 + i * 70,
}));

export const OWNER_TEMPLATES: Record<OwnerTemplateKey, any> = {
  dashboard: {
    greeting: {
      name: "Кириле",
      project_name: "FlyHigh — підготовка до НМТ",
      subtitle:
        "Щоденний зріз: охоплення, залученість і що варто опублікувати сьогодні.",
    },
    top_insight: {
      badge: "⚡ Інсайт дня",
      title: "Reels із розбором задач з математики б'ють карусель у 2.4×",
      body: "За останні 7 днів короткі відео з покроковим розв'язанням завдань НМТ принесли в середньому 12.4k охоплення проти 5.1k у каруселей. Запиши ще 2 цього тижня — формат на хвилі.",
      cta: "Згенерувати ідеї Reels",
    },
    kpis: [
      { label: "Охоплення за 7 днів", value: "48.2k", delta: "+18%", up: true },
      { label: "Залученість", value: "4.8%", delta: "+0.6 п.п.", up: true },
      { label: "Нові підписники", value: "1 312", delta: "+24%", up: true },
    ],
    trend_title: "Ви vs ніша edtech / НМТ",
    trend_subtitle: "Прогнозоване охоплення, останні 14 днів",
    trend: trend14,
    spotlight_title: "Конкурент тижня",
    spotlight: [
      {
        emoji: "🎯",
        handle: "@zno.ua",
        badge: "Випустили серію 'НМТ за 60 секунд'",
        body: "5 коротких Reels за тиждень із підпискою +3.2k. Хук: 'Це завдання провалюють 8 із 10 учнів'.",
      },
      {
        icon: "image",
        handle: "@be_smart_school",
        body: "Запустили карусель-чеклист 'Що взяти на НМТ'.",
      },
      {
        icon: "star",
        handle: "@osvita.ua",
        body: "Колаборація з вчителем-блогером — +18% залученості.",
      },
    ],
    wins_title: "Ваші найкращі публікації 🎉",
    wins_subtitle: "Пости, що перевершили середнє за 30 днів",
    recent_wins: [
      {
        kind: "Reel",
        caption: "Як за 90 секунд розв'язати задачу з логарифмів на НМТ",
        reach: "14.8k",
        likes: "1 240",
        comments: "186",
        lift: "+182%",
      },
      {
        kind: "Carousel",
        caption: "5 типових помилок у тестах з української — і як їх уникнути",
        reach: "9.1k",
        likes: "742",
        comments: "98",
        lift: "+94%",
      },
      {
        kind: "Story",
        caption: "Опитування: який предмет дається найважче?",
        reach: "6.3k",
        likes: "412",
        comments: "54",
        lift: "+61%",
      },
    ],
    insights: [
      {
        tone: "works",
        title: "Хук-питання у перші 2 секунди",
        body: "Reels, що починаються із запитання ('А ти знав, що…?'), мають у середньому +47% утримання та +32% збережень.",
      },
      {
        tone: "fails",
        title: "Довгі вступи в каруселях",
        body: "Слайди з більше ніж 35 словами на першому екрані втрачають 60% свайпів. Скорочуй заголовок до 6–8 слів.",
      },
    ],
  },

  competitors: {
    headline: "10 акаунтів-конкурентів у ніші підготовки до НМТ · оцінено за 12 вимірами",
    own_score: 6.4,
    ranked: [
      {
        account_id: "own",
        name: "FlyHigh",
        handle: "flyhigh.nmt",
        followers: "18.4k",
        is_own: true,
        overall: 6.4,
        hook: 6.8,
        visual: 6.2,
        trust: 6.1,
        key_strength: "Сильні розбори задач з математики",
        key_weakness: "Слабкі соц-докази (мало відгуків випускників)",
      },
      {
        account_id: "c1",
        name: "ZNO.UA",
        handle: "zno.ua",
        followers: "112k",
        overall: 8.4,
        hook: 8.8,
        visual: 8.1,
        trust: 8.6,
        external_url: "https://instagram.com/zno.ua",
        key_strength: "Системна серіальність контенту, чіткий бренд-голос",
        key_weakness: "Майже не використовують довгі відео / лайви",
      },
      {
        account_id: "c2",
        name: "Be Smart School",
        handle: "be_smart_school",
        followers: "76k",
        overall: 7.6,
        hook: 7.2,
        visual: 8.4,
        trust: 7.1,
        external_url: "https://instagram.com/be_smart_school",
        key_strength: "Дизайн-ідентичність каруселей на рівні топ-edtech",
        key_weakness: "Хуки в Reels слабкі — багато 'м'яких' вступів",
      },
      {
        account_id: "c3",
        name: "Osvita.ua",
        handle: "osvita.ua",
        followers: "210k",
        overall: 7.1,
        hook: 6.8,
        visual: 6.4,
        trust: 8.9,
        external_url: "https://instagram.com/osvita.ua",
        key_strength: "Найвищий рівень довіри в ніші, офіційні джерела",
        key_weakness: "Контент сухий, формат майже не оновлюють",
      },
      {
        account_id: "c4",
        name: "EdEra",
        handle: "ed_era",
        followers: "94k",
        overall: 7.4,
        hook: 7.0,
        visual: 7.8,
        trust: 8.2,
        external_url: "https://instagram.com/ed_era",
        key_strength: "Сильна освітня методологія, колаборації з МОН",
        key_weakness: "Низька частота публікацій у Reels (1–2 / тиждень)",
      },
      {
        account_id: "c5",
        name: "Repetitor UA",
        handle: "repetitor.ua",
        followers: "42k",
        overall: 6.9,
        hook: 7.4,
        visual: 6.2,
        trust: 6.8,
        key_strength: "Багато живих кейсів учнів, реальні бали",
        key_weakness: "Хаотична візуальна сітка, різні шаблони",
      },
    ],
    head_to_head: {
      own_name: "FlyHigh",
      top_name: "ZNO.UA",
      delta: 2.0,
      axes: [
        { axis: "Хук", you: 6.8, top: 8.8 },
        { axis: "Візуал", you: 6.2, top: 8.1 },
        { axis: "Довіра", you: 6.1, top: 8.6 },
        { axis: "Регулярність", you: 5.8, top: 9.0 },
        { axis: "Освітня цінність", you: 7.4, top: 8.2 },
        { axis: "Емоційний зв'язок", you: 5.9, top: 7.8 },
        { axis: "Серіальність", you: 5.2, top: 9.2 },
        { axis: "CTA / продаж", you: 5.4, top: 7.0 },
        { axis: "Трендсетинг", you: 6.0, top: 7.6 },
        { axis: "Спільнота", you: 5.7, top: 8.4 },
        { axis: "Різноманіття форматів", you: 6.6, top: 7.2 },
        { axis: "Позиціонування", you: 6.4, top: 8.8 },
      ],
      comparisons: [
        {
          area: "хук",
          who_is_stronger: "competitor",
          gap: 20,
          recommended_action:
            "Перші 2 секунди Reels — запитання або провокативна теза 'Це завдання провалюють 8 із 10'.",
        },
        {
          area: "серіальність",
          who_is_stronger: "competitor",
          gap: 40,
          recommended_action:
            "Запусти серію 'НМТ за 60 секунд' — мінімум 3 епізоди / тиждень із єдиним шаблоном.",
        },
        {
          area: "довіра",
          who_is_stronger: "competitor",
          gap: 25,
          recommended_action:
            "Збери 5 відеовідгуків випускників з реальними балами НМТ та винеси в Highlights.",
        },
        {
          area: "освітня цінність",
          who_is_stronger: "you",
          gap: 8,
          recommended_action:
            "Підкреслюй методологію (вчителі, програма МОН) у bio та на обкладинках Reels.",
        },
        {
          area: "позиціонування",
          who_is_stronger: "competitor",
          gap: 24,
          recommended_action:
            "Сформулюй 1 чітку обіцянку у bio: 'Готуємо до НМТ на 180+ балів за 6 місяців'.",
        },
        {
          area: "CTA",
          who_is_stronger: "competitor",
          gap: 16,
          recommended_action:
            "У кожному 3-му Reels — прямий CTA на безкоштовний пробний урок із лінком у bio.",
        },
      ],
    },
  },

  analyses: {
    analyses: [
      {
        id: "a1",
        account_analysis_id: "a1",
        account_id: "c1",
        account_name: "ZNO.UA",
        score_overall: 8.4,
        period_start: "2026-04-01T00:00:00Z",
        period_end: "2026-05-15T00:00:00Z",
        positioning_summary:
          "Найсильніший бренд у ніші підготовки до НМТ у Instagram. Позиціонують себе як 'школа коротких розборів': кожен пост — одна задача, одне рішення, одне інсайт-питання.",
        main_content_pillars: [
          "Розбори задач НМТ",
          "Типові помилки",
          "Лайфхаки на іспит",
          "Історії випускників",
        ],
        strongest_formats: ["Reels 30–60 сек", "Карусель-чеклист", "Quiz Stories"],
        weakest_formats: ["Лайви", "Довгі IGTV"],
        main_hooks: [
          "Це завдання провалюють 8 із 10 учнів",
          "А ти знав, що…?",
          "За 60 секунд розповім, як…",
        ],
        tone_of_voice:
          "Дружній, на 'ти', трохи провокативний. Не повчальний — як старший друг, що пояснює.",
        visual_identity:
          "Жовто-синя палітра, єдиний шрифт (Inter Bold), обкладинки з великим білим текстом на фото вчителя.",
        audience_pain_points:
          "Страх не скласти НМТ, перевантаженість матеріалом, відсутність структури підготовки, дорогі репетитори.",
        main_ctas: "Безкоштовний пробний урок · Telegram-канал з добірками · Demo-тест на сайті",
        product_angle:
          "Онлайн-курси з підготовки до НМТ з прив'язкою до офіційної програми МОН. Гарантія повернення коштів, якщо учень не складе.",
        trust_signals:
          "1 200+ відгуків випускників, реальні бали НМТ у Highlights, ліцензія МОН, партнерство з 4 школами.",
        community_signals:
          "Telegram-спільнота на 28k учнів, щотижневі AMA з вчителями, конкурси розборів.",
        strengths:
          "Найкраща серіальність контенту в ніші. Чіткий бренд-голос. Сильні соц-докази через відеовідгуки.",
        weaknesses:
          "Майже не використовують довгі формати. Слабко працюють із Stories — мало інтерактиву.",
        opportunities:
          "Запустити подкаст із випускниками 200+ балів. Колаборації з вчителями-блогерами.",
        threats:
          "EdEra та Be Smart School наздоганяють у візуалі. Зростання вартості реклами в Instagram.",
        best_patterns_to_copy:
          "Шаблон обкладинки 'білий текст на фото вчителя'. Серія 'НМТ за 60 секунд' із єдиним інтро.",
        things_to_avoid:
          "Сухі академічні формулювання. Карусель без чіткого CTA на останньому слайді.",
        strategic_summary:
          "ZNO.UA задає планку в ніші. Щоб конкурувати — спочатку зрівняйся за серіальністю Reels і силою хука, потім перевершуй на форматах, які вони ігнорують (лайви, подкасти, довгі розбори).",
      },
      {
        id: "a2",
        account_analysis_id: "a2",
        account_id: "c2",
        account_name: "Be Smart School",
        score_overall: 7.6,
        period_start: "2026-04-01T00:00:00Z",
        period_end: "2026-05-15T00:00:00Z",
        positioning_summary:
          "Преміум-онлайн-школа з акцентом на дизайн. Позиціонують себе як 'НМТ без зубріння' — через структуру і візуальне мислення.",
        main_content_pillars: [
          "Структуровані конспекти",
          "Мнемоніка для запам'ятовування",
          "Розбори демо-тестів",
        ],
        strongest_formats: ["Карусель-конспект", "Reels з анімацією"],
        weakest_formats: ["Stories", "Reels без сценарію"],
        main_hooks: [
          "Запам'ятай за 1 картинку",
          "Цей конспект замінить 10 сторінок підручника",
        ],
        tone_of_voice: "Спокійний, експертний, без сленгу. Як вчитель, якому ти довіряєш.",
        visual_identity:
          "Пастельна палітра (м'ятний, рожевий, кремовий), мінімалістичні ілюстрації, єдина сітка.",
        audience_pain_points:
          "Учні-візуали, яким важко вчитися з тексту. Батьки, що шукають 'якісну' школу.",
        main_ctas: "Записатися на курс · Скачати безкоштовний конспект",
        product_angle:
          "Преміум-курси з ціною вище середнього по ніші, але з акцентом на якість матеріалів.",
        trust_signals:
          "Команда з 14 вчителів-методистів. Партнерство з видавництвом 'Ранок'. 600+ відгуків.",
        community_signals: "Закритий Telegram для учнів курсу. Менторські сесії 1-на-1.",
        strengths: "Найкращий візуал у ніші. Сильна методологія. Лояльна спільнота.",
        weaknesses: "Високий поріг входу. Слабкі хуки в Reels. Мало вірусного контенту.",
        opportunities:
          "Запустити безкоштовну mini-серію конспектів для лід-магніту. Reels з 'до/після' учнів.",
        threats: "ZNO.UA копіює дизайн-підходи. Цінова війна з ринком репетиторства.",
        best_patterns_to_copy:
          "Карусель-конспект з єдиною кольоровою системою. Мнемонічні картки як окремий формат.",
        things_to_avoid:
          "Занадто 'тихий' хук у перші 2 сек. Reels без титрів — багато аудиторії дивиться без звуку.",
        strategic_summary:
          "Be Smart School виграє на якості, а не на охопленнях. Для FlyHigh — це орієнтир у візуалі та методології, але не в темпі публікацій.",
      },
    ],
  },

  database: {
    executive_summary:
      "За останні 6 тижнів ніша 'підготовка до НМТ' стабільно росте: середнє охоплення Reels +22%, середня залученість +0.4 п.п. ZNO.UA утримує лідерство, але Be Smart School і EdEra стрімко наздоганяють за якістю контенту. FlyHigh має сильну освітню базу, але програє у швидкості та серіальності.",
    kpi_tiles: [
      { label: "Акаунтів у базі", value: "11", hint: "1 ваш + 10 конкурентів" },
      { label: "Постів проаналізовано", value: "1 482", hint: "за останні 90 днів" },
      { label: "Коментарів оброблено", value: "9 614", hint: "Sentiment + pain points" },
      { label: "Інсайтів згенеровано", value: "47", hint: "із них 12 — high priority" },
    ],
    sections: [
      {
        title: "Основні висновки для власника",
        items: [
          "Ніша на хвилі росту — кожен новий Reels у середньому показує на 22% краще, ніж 6 тижнів тому.",
          "Топ-3 формати: короткі розбори задач, чеклісти 'що взяти на НМТ', історії випускників із реальними балами.",
          "Найбільший gap FlyHigh vs ZNO.UA — серіальність (-40%) і сила хука (-20%). Це найшвидший важіль росту.",
        ],
      },
      {
        title: "Що змінилось за тиждень",
        items: [
          "EdEra почали публікувати по 3 Reels / тиждень (було 1) — будь готовий до тиску у візуалі.",
          "ZNO.UA запустили нову серію 'НМТ за 60 секунд' — формат, який варто адаптувати.",
          "Be Smart School провели лайв із психологом про вигорання перед НМТ — 4.8k переглядів.",
        ],
      },
    ],
  },
};

export function getOwnerTemplate(pageKey: string) {
  return (OWNER_TEMPLATES as any)[pageKey] ?? null;
}