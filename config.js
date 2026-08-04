// ==============================================
// サロン予約システム 設定ファイル
// ここに入っている店名・メニュー・料金・スタッフはすべて仮の架空データです。
// クライアントの実データが決まり次第、この内容を書き換えてください。
// ==============================================

const SALON_CONFIG = {
  // 店舗情報（racines.link の情報を反映）
  salonName: "Racines（ラシネス）",
  tagline: "内側から整う、本当の美しさへ。",
  tel: "090-1337-6945",
  address: "岡山県岡山市中区西川原246-1",

  // 駐車場案内（任意）。設定するとお客様への確認メールに記載されます。
  parkingInfo: "【駐車場住所】\n岡山市中区藤原西町2-8-20 ⑤番\n＊サロンロゴ入りの水色の看板が目印です。県道96号線沿　翠松庵さん（お蕎麦）の向かいになります。\n\n駐車場からサロンまでは目の前の信号（横断歩道）を渡って左折、ファミリーマート清水店を目指して歩いてください。\n\n駐車場からサロンまで徒歩2分ほどありますがご理解の程よろしくお願いいたします。",

  // GAS Web AppのデプロイURL。
  // 空文字のままだとフロント単体の「デモモード」で動作します（localStorageに予約を保存、実際のカレンダーには入りません）。
  // README.md の手順でGASをデプロイしたら、取得したURLをここに設定してください。
  API_URL: "https://script.google.com/macros/s/AKfycbz5RZNniTmr7XmMPHDder5xLnX__gAYyJoaQ8HFq1s-Nci0_QDtKXFMrUUSks-olCzxWQ/exec",

  // 定休日（0=日曜〜6=土曜）。Racinesは「不定休」のため固定の定休日は設定せず、
  // 休みたい日はその都度、管理画面の「時間をブロック」でその日をまとめてブロックしてください。
  closedWeekdays: [],

  // 曜日別営業時間（分単位ではなく "HH:MM" で指定）
  businessHours: {
    default: { open: "10:00", close: "20:00" },
  },

  // 予約枠の刻み幅（分）
  slotIntervalMin: 30,

  // メニュー一覧（現在クライアントが管理画面で入力している本番の内容に合わせたもの。
  // 写真を images/ フォルダに保存したら、各項目の image に相対パスを入れてください）
  menuCategories: [
    {
      id: "fascia_headspa",
      name: "FASCIA RELEASE×DRY HEAD SPA",
      label: "筋膜リリース×ドライヘッドスパ",
      items: [
        { id: "kompon_care", name: "【根本ケア】全身から整える慢性疲労リカバリー（120分）", durationMin: 150, price: 18500, desc: "全身をほぐしてを不調に左右されない身体を手に入れる！！筋膜ケア（フット＋背中＋デコルテ＋腕＋頭皮）×ヘッドのRacinesのスペシャルメニュー", image: "images/S__123568146.jpg" },
        { id: "katakori", name: "【首肩こりが辛い方に】とろける首肩こり集中ドライヘッド(90分)", durationMin: 120, price: 12000, desc: "肩甲骨から緩める上半身の筋膜ケア＋ドライヘッドスパで辛い首肩凝りを徹底ケア！ガチガチの緊張をほぐして可動域の広がりと羽の生えたような軽さに☆", image: "images/S__123568156.jpg" },
        { id: "zutsu", name: "【頭痛が辛い方に】脳休息・深層ドライヘッド(90分)", durationMin: 120, price: 12000, desc: "筋膜ケア＋ドライヘッドで重だるい頭を心地よい刺激でリフレッシュ！深層部分へのアプローチで脳を休息。ガチガチの頭皮を緩め、重荷が外れたような解放感で軽やかに☆", image: "images/S__123568150.jpg" },
        { id: "suimin", name: "【睡眠悩みに】究極の寝落ち・自律神経リセットケア(90分)", durationMin: 120, price: 12000, desc: "寝つきが悪い、夜中に目が覚める、朝スッキリ起きられない方の「眠らなきゃ」の焦りを忘れて、深い眠りへ。高ぶった神経を鎮めて翌朝のスッと目覚める感動と一日中動ける活力を☆", image: "images/S__123568152.jpg" },
        { id: "ganseihirou", name: "【眼精疲労が辛い方に】 視界クリア・眼筋解放ドライヘッド", durationMin: 120, price: 12000, desc: "目の奥のズーンとした重みや疲れをリセット！！視界がパッと明るく！夕方まで疲れ顔を気にせず過ごせる瞳に☆", image: "images/S__123568154.jpg" },
        { id: "mansei_hirou", name: "回復できない人のための慢性疲労リセット（60分）", durationMin: 90, price: 9800, desc: "寝ても疲れが抜けない・頭が重い・首肩が限界の方へ！筋膜ケア（首肩）×ヘッドで回復できる体に戻します", image: "images/S__123568164.jpg" },
      ],
    },
    {
      id: "herb",
      name: "HERB TREATMENT",
      label: "ハーブトリートメント",
      items: [
        { id: "herb_main", name: "剥けないハーブトリートメント 〈ドライヘッド・筋膜リリース付き〉", durationMin: 120, price: 21800, desc: "ドライヘッドスパで肌トラブルの原因ストレスや睡眠不足を根本改善！メディセル筋膜リリースで血流UP！ハーブの施術効果もUP！ヒト幹細胞培養液導入付", image: "" },
      ],
    },
    {
      id: "medicel",
      name: "MEDICEL FASCIA RELEASE",
      label: "メディセル筋膜リリース",
      items: [
        { id: "medicel_full", name: "全身", durationMin: 120, price: 15000, desc: "脚、背中、腕、首肩、お腹、デコルテ、頭", image: "images/S__123568160_0.jpg" },
        { id: "medicel_back", name: "背面", durationMin: 90, price: 11000, desc: "脚、背中、腕、首肩(頭は除く)", image: "images/S__123568158_0.jpg" },
        { id: "medicel_half", name: "半身（上／下）", durationMin: 60, price: 8000, desc: "表面、背面の両面になります", image: "images/S__123568159_0.jpg" },
      ],
    },
  ],

  // 店主プロフィール（現在は予約フロー・管理画面どちらにも非表示。将来また表示する場合のために保持）
  owner: {
    name: "青山 愛子",
    role: "オーナー / エステティシャン",
    bio: "自身のニキビや肌トラブル、頭痛の経験から、ドライヘッドスパとエステだけでなく、インナーケアや生活習慣の改善まで含めたトータルケアを提供しています。",
    photoUrl: "",
  },
};
