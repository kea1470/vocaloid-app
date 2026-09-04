// ★ご自身のGASのURLに書き換えてね！
const GAS_API_URL = "https://script.google.com/macros/s/AKfycbx_in3vx6PSBaWPxYBfo52d-Y9QulsKeYrZMTBeEP4cUDUO-JT7UOnDbk6YHqgOAJJb/exec";

let favorites = JSON.parse(localStorage.getItem("voca_favorites") || "[]");
updateFavCounts();

const currentYear = new Date().getFullYear();

// スプレッドシートの全曲データをあらかじめ保持する配列
let allSongsData = [];
let isDataLoaded = false;

// 検索・フィルタリング用のベースデータを保持
let baseQuizFilteredSongs = [];

// カウントダウンアニメーション用のタイマー管理
let countAnimationTimer = null;
let currentDisplayedCount = 0;

// アプリ起動時にバックグラウンドで全データを一括取得
async function preloadAllSongs() {
  const countBadge = document.getElementById("quiz-song-count");
  try {
    const res = await fetch(`${GAS_API_URL}?q=`);
    const songs = await res.json();
    if (Array.isArray(songs)) {
      allSongsData = songs;
      isDataLoaded = true;
      currentDisplayedCount = allSongsData.length;
      updateRealtimeSongCount();
      updateDetailSongCount();
    } else {
      if (countBadge) countBadge.innerText = "データ読み込みに失敗しました";
    }
  } catch (err) {
    console.error("データプリロードエラー:", err);
    if (countBadge) countBadge.innerText = "データ読み込みエラー";
  }
}
preloadAllSongs();

// 「細かく検索」のリアルタイム曲数計算関数
function updateDetailSongCount() {
  const countBadge = document.getElementById("detail-song-count");
  if (!countBadge) return;

  if (!isDataLoaded || allSongsData.length === 0) {
    countBadge.innerText = "データを読み込み中...";
    return;
  }

  const startYVal = document.getElementById("detail-start-year") ? document.getElementById("detail-start-year").value : "all";
  const endYVal = document.getElementById("detail-end-year") ? document.getElementById("detail-end-year").value : "all";

  const searchKeywords = Object.values(selectedDetailTags).filter(t => t && t.trim() !== "");

  if (searchKeywords.length === 0 && startYVal === "all" && endYVal === "all") {
    countBadge.innerHTML = `該当する曲: <b>${allSongsData.length}</b> 曲`;
    return;
  }

  let filtered = allSongsData.filter(song => {
    const songTags = song.tags ? song.tags.map(t => String(t).toLowerCase()) : [];
    
    if (searchKeywords.length > 0) {
      const tagsMatched = searchKeywords.every(kw => {
        const kwLower = kw.toLowerCase();
        return songTags.some(tag => tag.toLowerCase() === kwLower);
      });
      if (!tagsMatched) return false;
    }

    if (startYVal !== "all" || endYVal !== "all") {
      const startYear = startYVal !== "all" ? parseInt(startYVal, 10) : 2007;
      const endYear = endYVal !== "all" ? parseInt(endYVal, 10) : currentYear;
      const minYear = Math.min(startYear, endYear);
      const maxYear = Math.max(startYear, endYear);

      const songYear = extractSongYear(song);
      if (songYear !== null) {
        if (songYear < minYear || songYear > maxYear) return false;
      }
    }

    return true;
  });

  countBadge.innerHTML = `該当する曲: <b>${filtered.length}</b> 曲`;
}

function initDetailYearDropdowns() {
  const startSelect = document.getElementById("detail-start-year");
  const endSelect = document.getElementById("detail-end-year");
  
  let startOptions = `<option value="all">指定なし</option>`;
  let endOptions = `<option value="all">指定なし</option>`;

  for (let y = 2007; y <= currentYear; y++) {
    startOptions += `<option value="${y}">${y}年</option>`;
    endOptions += `<option value="${y}">${y}年</option>`;
  }

  startSelect.innerHTML = startOptions;
  endSelect.innerHTML = endOptions;

  startSelect.onchange = updateDetailSongCount;
  endSelect.onchange = updateDetailSongCount;
}
initDetailYearDropdowns();

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// 質問ツリー（質問6から直接検索実行 end へ遷移）
const quizTree = {
  "q_start": {
    question: "今の気分にぴったりなボカロ曲を見つけよう！",
    isStart: true,
    next: "q2"
  },
  "q1": {
    question: "どのボーカルの曲が聴きたい？",
    options: [
      { label: "初音ミク！", col: "vocal", tag: "初音ミク", text: "初音ミク", next: "q2", colorClass: "btn-color-teal" },
      { label: "鏡音リン！", col: "vocal", tag: "鏡音リン", text: "鏡音リン", next: "q2", colorClass: "btn-color-yellow" },
      { label: "重音テト！", col: "vocal", tag: "重音テト", text: "重音テト", next: "q2", colorClass: "btn-color-red" },
      { label: "GUMI！", col: "vocal", tag: "GUMI", text: "GUMI", next: "q2", colorClass: "btn-color-green" },
      { label: "だれでもOK！", tag: "", text: "", next: "q2", colorClass: "" },
      { label: "その他のボーカル", tag: "", text: "", next: "qb", colorClass: "" }
    ]
  },
  "qb": {
    question: "どのボーカルの曲が聴きたい？",
    options: [
      { label: "flower！", col: "vocal", tag: "flower", text: "flower", next: "q2", colorClass: "btn-color-purple" },
      { label: "可不！", col: "vocal", tag: "可不", text: "可不", next: "q2", colorClass: "btn-color-black" },
      { label: "歌愛ユキ！", col: "vocal", tag: "歌愛ユキ", text: "歌愛ユキ", next: "q2", colorClass: "btn-color-red" },
      { label: "IA！", col: "vocal", tag: "IA", text: "IA", next: "q2", colorClass: "btn-color-lightorange" },
      { label: "やっぱり誰でもOK！", tag: "", text: "", next: "q2", colorClass: "" }
    ]
  },
  "q2": {
    question: "どんな曲が聴きたい？",
    options:
