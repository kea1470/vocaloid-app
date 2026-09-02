// ★ご自身のGASのURLに書き換えてね！
const GAS_API_URL = "https://script.google.com/macros/s/AKfycbx_in3vx6PSBaWPxYBfo52d-Y9QulsKeYrZMTBeEP4cUDUO-JT7UOnDbk6YHqgOAJJb/exec";

let favorites = JSON.parse(localStorage.getItem("voca_favorites") || "[]");
updateFavCounts();

const currentYear = new Date().getFullYear();

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
}
initDetailYearDropdowns();

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

const quizTree = {
  "q_start": {
    question: "今の気分にぴったりなボカロ曲を見つけよう！",
    isStart: true,
    next: "q1"
  },
  "q1": {
    question: "どのボーカルの曲が聴きたい？",
    options: [
      { label: "初音ミク！", tag: "初音ミク", text: "初音ミク", next: "q2", colorClass: "btn-color-teal" },
      { label: "鏡音リン！", tag: "鏡音リン", text: "鏡音リン", next: "q2", colorClass: "btn-color-yellow" },
      { label: "重音テト！", tag: "重音テト", text: "重音テト", next: "q2", colorClass: "btn-color-red" },
      { label: "可不！", tag: "可不", text: "可不", next: "q2", colorClass: "btn-color-black" },
      { label: "だれでもOK！", tag: "", text: "", next: "q2", colorClass: "" },
      { label: "その他のボーカル", tag: "", text: "", next: "qb", colorClass: "" }
    ]
  },
  "qb": {
    question: "どのボーカルの曲が聴きたい？",
    options: [
      { label: "歌愛ユキ！", tag: "歌愛ユキ", text: "歌愛ユキ", next: "q2", colorClass: "btn-color-red" },
      { label: "足立レイ！", tag: "足立レイ", text: "足立レイ", next: "q2", colorClass: "btn-color-orange" },
      { label: "GUMI！", tag: "Megpoid", text: "GUMI", next: "q2", colorClass: "btn-color-green" },
      { label: "やっぱり誰でもOK！", tag: "", text: "", next: "q2", colorClass: "" }
    ]
  },
  "q2": {
    question: "どんな曲が聴きたい？",
    options: [
      { label: "気持ちが明るくなる曲が聴きたい！", tag: "明るい", text: "明るく", next: "q3a", colorClass: "btn-color-red" },
      { label: "暗めなかっこいい曲を聴きたい！", tag: "暗い", text: "暗く", next: "q3b", colorClass: "btn-color-black" }
    ]
  },
  "q3a": {
    question: "どんな雰囲気の曲が聴きたい？",
    options: [
      { label: "気分がノリノリになる曲！", tag: "ノリノリ", text: "ノリノリ", next: "q4a", colorClass: "btn-color-red" },
      { label: "ゆったり癒される曲！", tag: "癒し", text: "ゆったり癒される", next: "q5a", colorClass: "btn-color-cyan" }
    ]
  },
  "q3b": {
    question: "どんな雰囲気の曲が聴きたい？",
    options: [
      { label: "感情が乗せられている病み曲", tag: "病み", text: "病み系", next: "q5b", colorClass: "btn-color-pink" },
      { label: "世界観に浸れるダークな曲", tag: "ダーク", text: "ダーク", next: "q5b", colorClass: "btn-color-black" },
      { label: "夜に聴きたいおしゃれな曲", tag: "おしゃれ", text: "おしゃれ", next: "q5b", colorClass: "btn-color-purple" },
      { label: "曲を深く知りたい考察したくなる曲", tag: "考察", text: "考察系", next: "q5b", colorClass: "btn-color-navy" },
      { label: "気持ちがノれるかっこいい曲", tag: "かっこいい", text: "かっこいい", next: "q5b", colorClass: "" }
    ]
  },
  "q4a": {
    question: "どんな曲を聴きたい気分？",
    options: [
      { label: "とにかく気分が上がる曲！", tag: "キラキラ", text: "気分が上がる", next: "q5a", colorClass: "btn-color-yellow" },
      { label: "疾走感ある爽やかな曲！", tag: "疾走感", text: "爽やかな", next: "q5a", colorClass: "btn-color-blue" },
      { label: "心動かされる感動する曲！", tag: "感動", text: "感動的な", next: "q_year", colorClass: "btn-color-orange" },
      { label: "笑っちゃう面白い曲！", tag: "ネタ曲", text: "面白い", next: "q_year", colorClass: "btn-color-lightred" },
      { label: "ちょっと闇を感じる曲！", tag: "闇", text: "闇を感じる", next: "q_year", colorClass: "btn-color-black" }
    ]
  },
  "q5a": {
    question: "どんなシチュエーションで聴く曲が良い？",
    options: [
      { label: "通勤・通学中が楽しくなる曲！", tag: "通勤・通学中", text: "通勤・通学中", suffixText: "に聴きたい", next: "q_year", colorClass: "btn-color-blue" },
      { label: "今気分を上げたい！", tag: "気分を上げたい時", text: "今気分を上げたい時", suffixText: "に聴きたい", next: "q_year", colorClass: "btn-color-red" },
      { label: "お昼の散歩中に！", tag: "お昼の散歩", text: "お昼の散歩中", suffixText: "に聴きたい", next: "q_year", colorClass: "btn-color-green" },
      { label: "部屋で一人じっくりと聴きたい！", tag: "一人の部屋で", text: "部屋で一人じっくり", suffixText: "聴きたい", next: "q_year", colorClass: "btn-color-purple" },
      { label: "作業中のお供に！", tag: "作業中", text: "作業中のお供", suffixText: "に聴きたい", next: "q_year", colorClass: "btn-color-cyan" }
    ]
  },
  "q5b": {
    question: "どんな世界観の曲が良い？",
    options: [
      { label: "曲の世界観に浸りたい…！", tag: "独自の世界観", text: "曲の世界観に浸れる", next: "q_year", colorClass: "btn-color-black" },
      { label: "曲のストーリーに心動かされたい！", tag: "ストーリーに感動", text: "ストーリーに心動かされる", next: "q_year", colorClass: "btn-color-navy" },
      { label: "歌詞に共感する曲がいい！", tag: "歌詞に共感", text: "歌詞に共感する", next: "q_year", colorClass: "btn-color-cyan" },
      { label: "聴いてて楽しい曲！", tag: "聴いてて楽しい", text: "聴いてて楽しい", next: "q_year", colorClass: "btn-color-yellow" }
    ]
  },
  "q_year": {
    question: "いつ頃投稿された作品を調べたい？",
    type: "year",
    next: "q6"
  },
  "q6": {
    question: "どのくらい作品を調べたい？",
    options: [
      { label: "いろんなボカロPの作品が見たい！", subLabel: "（1ボカロPにつき1作品）", filterProducer: true, next: "end", colorClass: "" },
      { label: "とにかくたくさんの作品を見たい！", subLabel: "（すべての作品を表示）", filterProducer: false, next: "end", colorClass: "" }
    ]
  }
};

let currentQuestionKey = "q_start";
let quizHistory = [];
let quizSelectedTags = [];
let isFilterProducerOne = false;
let selectedYearRange = null;

let quizTextAnswers = {};
let quizSuffixAnswers = {};

let currentDetailSongs = [];
let currentDetailDisplayedCount = 0;

let currentQuizSongs = [];
let currentQuizDisplayedCount = 0;

let selectedDetailTags = {};

function switchMode(mode) {
  const btnDetail = document.getElementById("btn-mode-detail");
  const btnQuiz = document.getElementById("btn-mode-quiz");
  const layoutDetail = document.getElementById("layout-detail-mode");
  const layoutQuiz = document.getElementById("layout-quiz-mode");

  if (mode === 'detail') {
    btnDetail.classList.add("active");
    btnQuiz.classList.remove("active");
    layoutDetail.style.display = "flex";
    layoutQuiz.style.display = "none";
  } else {
    btnQuiz.classList.add("active");
    btnDetail.classList.remove("active");
    layoutDetail.style.display = "none";
    layoutQuiz.style.display = "block";
    resetQuiz();
  }
}

function resetQuiz() {
  currentQuestionKey = "q_start";
  quizHistory = [];
  quizSelectedTags = [];
  quizTextAnswers = {};
  quizSuffixAnswers = {};
  isFilterProducerOne = false;
  selectedYearRange = null;
  document.getElementById("quiz-card").style.display = "block";
  document.getElementById("quiz-loading").style.display = "none";
  document.getElementById("results-wrapper-quiz").style.display = "none";
  renderSelectedTags();
  showQuizStep();
}

function generateSummaryText() {
  const vocal = (quizTextAnswers["q1"] || quizTextAnswers["qb"] || "").trim();
  const mood = quizTextAnswers["q2"] || "";
  const q3a = quizTextAnswers["q3a"] || "";
  const q3b = quizTextAnswers["q3b"] || "";
  const q4a = quizTextAnswers["q4a"] || "";
  const q5a = quizTextAnswers["q5a"] || "";
  const q5aSuffix = quizSuffixAnswers["q5a"] || "";
  const q5b = quizTextAnswers["q5b"] || "";

  let yearStr = "";
  if (selectedYearRange) {
    yearStr = `【${selectedYearRange.startYear}年～${selectedYearRange.endYear}年】`;
  }

  let textParts = [];
  if (vocal !== "") textParts.push(`【${vocal}】が歌う`);
  if (mood) textParts.push(`【${mood}】て`);
  if (q3a) textParts.push(`【${q3a}】な`);
  if (q4a) textParts.push(`【${q4a}】`);
  if (q3b) textParts.push(`【${q3b}】な`);

  textParts.push("雰囲気の");

  if (q5a) {
    textParts.push(`【${q5a}】${q5aSuffix}`);
  } else if (q5b) {
    textParts.push(`【${q5b}】世界観の`);
  }

  if (yearStr) textParts.push(yearStr);
  textParts.push("おすすめ曲！");

  return textParts.join(" ");
}

function renderSelectedTags() {
  const container = document.getElementById("selected-tags-display");
  if (document.getElementById("results-wrapper-quiz").style.display !== "none") {
    const summaryText = generateSummaryText();
    container.innerHTML = `
      <div class="summary-banner">${summaryText}</div>
      <button class="action-sub-btn" onclick="resetQuiz()">🔄 もう一度質問する</button>
    `;
  } else {
    container.innerHTML = "";
  }
}

function showQuizStep() {
  if (currentQuestionKey === "end" || !quizTree[currentQuestionKey]) {
    executeQuizSearch();
    return;
  }

  const quizCard = document.getElementById("quiz-card");
  quizCard.classList.remove("fade-in");
  void quizCard.offsetWidth;
  quizCard.classList.add("fade-in");

  const step = quizTree[currentQuestionKey];
  document.getElementById("quiz-question-text").innerText = step.question;

  const container = document.getElementById("quiz-options-container");
  container.innerHTML = "";

  if (step.isStart) {
    const startBtn = document.createElement("button");
    startBtn.className = "start-btn";
    startBtn.innerText = "ボカロ曲を探す！";
    startBtn.onclick = function() {
      currentQuestionKey = step.next;
      showQuizStep();
    };
    container.appendChild(startBtn);

  } else if (step.type === "year") {
    const yearBox = document.createElement("div");
    yearBox.className = "year-select-box";

    let startOptions = "";
    let endOptions = "";
    for (let y = 2007; y <= currentYear; y++) {
      startOptions += `<option value="${y}" ${y === 2007 ? "selected" : ""}>${y}年</option>`;
      endOptions += `<option value="${y}" ${y === currentYear ? "selected" : ""}>${y}年</option>`;
    }

    yearBox.innerHTML = `
      <div class="year-select-group">
        <select id="select-start-year" class="year-dropdown">${startOptions}</select>
        <span>～</span>
        <select id="select-end-year" class="year-dropdown">${endOptions}</select>
      </div>
      <button class="quiz-btn btn-color-teal" style="width: 100%;" onclick="submitYearRange('${step.next}')">この年代で検索する！</button>
    `;
    container.appendChild(yearBox);

    const ignoreBtn = document.createElement("button");
    ignoreBtn.className = "quiz-btn";
    ignoreBtn.innerText = "年代は気にしない！";
    ignoreBtn.onclick = function() {
      quizHistory.push({ key: currentQuestionKey, yearRange: null });
      selectedYearRange = null;
      currentQuestionKey = step.next;
      showQuizStep();
    };
    container.appendChild(ignoreBtn);

  } else {
    step.options.forEach(opt => {
      const btn = document.createElement("button");
      btn.className = "quiz-btn" + (opt.colorClass ? " " + opt.colorClass : "");
      
      if (opt.subLabel) {
        btn.innerHTML = `${opt.label}<span class="quiz-btn-sub">${opt.subLabel}</span>`;
      } else {
        btn.innerText = opt.label;
      }

      btn.onclick = function() {
        quizHistory.push({
          key: currentQuestionKey,
          tag: opt.tag || null,
          text: opt.text !== undefined ? opt.text : null,
          suffixText: opt.suffixText || null,
          filterProducer: opt.filterProducer !== undefined ? opt.filterProducer : null
        });

        if (opt.tag) quizSelectedTags.push(opt.tag);
        if (opt.text !== undefined && opt.text !== null) {
          quizTextAnswers[currentQuestionKey] = opt.text;
        }
        if (opt.suffixText) quizSuffixAnswers[currentQuestionKey] = opt.suffixText;
        if (opt.filterProducer !== undefined) {
          isFilterProducerOne = opt.filterProducer;
        }

        renderSelectedTags();
        currentQuestionKey = opt.next;
        showQuizStep();
      };
      container.appendChild(btn);
    });
  }

  const footer = document.getElementById("quiz-footer");
  footer.innerHTML = "";
  if (quizHistory.length > 0 && !step.isStart) {
    const backBtn = document.createElement("button");
    backBtn.className = "action-sub-btn";
    backBtn.innerText = "← ひとつ前に戻る";
    backBtn.onclick = goBackStep;
    footer.appendChild(backBtn);
  }
}

function submitYearRange(nextKey) {
  const startY = parseInt(document.getElementById("select-start-year").value, 10);
  const endY = parseInt(document.getElementById("select-end-year").value, 10);

  const minYear = Math.min(startY, endY);
  const maxYear = Math.max(startY, endY);

  selectedYearRange = { startYear: minYear, endYear: maxYear };

  quizHistory.push({
    key: currentQuestionKey,
    yearRange: selectedYearRange
  });

  currentQuestionKey = nextKey;
  showQuizStep();
}

function goBackStep() {
  if (quizHistory.length === 0) return;

  const lastStep = quizHistory.pop();
  currentQuestionKey = lastStep.key;

  if (lastStep.tag) {
    const index = quizSelectedTags.lastIndexOf(lastStep.tag);
    if (index >= 0) quizSelectedTags.splice(index, 1);
  }
  if (lastStep.text !== undefined) delete quizTextAnswers[currentQuestionKey];
  if (lastStep.suffixText) delete quizSuffixAnswers[currentQuestionKey];
  if (lastStep.yearRange !== undefined) selectedYearRange = null;

  renderSelectedTags();
  showQuizStep();
}

function extractSongYear(song) {
  if (!song.date) return null;
  const parsed = parseInt(String(song.date).trim(), 10);
  if (!isNaN(parsed) && parsed > 1900 && parsed < 2100) return parsed;
  const match = String(song.date).match(/(20\d{2}|19\d{2})/);
  if (match) return parseInt(match[1], 10);
  return null;
}

async function executeQuizSearch() {
  document.getElementById("quiz-card").style.display = "none";
  document.getElementById("quiz-loading").style.display = "block";
  document.getElementById("results-wrapper-quiz").style.display = "none";

  const searchKeywords = quizSelectedTags.length > 0 ? quizSelectedTags.filter(t => t !== "") : [];
  const fetchQuery = searchKeywords.length > 0 ? searchKeywords[0] : "";

  const resultsDiv = document.getElementById("results-quiz");
  const resultsWrapper = document.getElementById("results-wrapper-quiz");
  const loadingElem = document.getElementById("quiz-loading");

  switchTab('recommend', 'quiz');

  try {
    const response = await fetch(`${GAS_API_URL}?q=${encodeURIComponent(fetchQuery)}`);
    let songs = await response.json();

    loadingElem.style.display = "none";
    resultsWrapper.style.display = "block";
    renderSelectedTags();

    if (!Array.isArray(songs) || songs.length === 0) {
      resultsDiv.innerHTML = "<p style='text-align:center;'>一致する楽曲が見つかりませんでした。</p>";
      return;
    }

    if (searchKeywords.length > 1) {
      songs = songs.filter(song => {
        const songTags = song.tags ? song.tags.map(t => String(t).toLowerCase()) : [];
        return searchKeywords.every(kw => {
          const kwLower = kw.toLowerCase();
          return songTags.some(tag => tag.includes(kwLower));
        });
      });
    }

    if (selectedYearRange && songs.length > 0) {
      songs = songs.filter(song => {
        const songYear = extractSongYear(song);
        if (songYear !== null) {
          return songYear >= selectedYearRange.startYear && songYear <= selectedYearRange.endYear;
        }
        return true;
      });
    }

    if (isFilterProducerOne && songs.length > 0) {
      const seenProducers = new Set();
      songs = songs.filter(song => {
        const artistName = song.artist ? song.artist.trim().toLowerCase() : "unknown";
        if (seenProducers.has(artistName)) return false;
        seenProducers.add(artistName);
        return true;
      });
    }

    if (songs.length === 0) {
      resultsDiv.innerHTML = "<p style='text-align:center;'>指定したすべての条件に一致する楽曲が見つかりませんでした。</p>";
      return;
    }

    currentQuizSongs = shuffleArray(songs);
    currentQuizDisplayedCount = 0;
    resultsDiv.innerHTML = "";
    renderPagedSongs('quiz');

  } catch (error) {
    console.error("エラーが発生しました:", error);
    loadingElem.style.display = "none";
    resultsWrapper.style.display = "block";
    renderSelectedTags();
    resultsDiv.innerHTML = "<p style='text-align:center;'>検索中にエラーが発生しました。</p>";
  }
}

function toggleWord(displayLabel, element, searchTag) {
  element.classList.remove("pyon");
  void element.offsetWidth;
  element.classList.add("pyon");

  const input = document.getElementById("keyword");

  if (element.classList.contains("active")) {
    element.classList.remove("active");
    delete selectedDetailTags[displayLabel];
  } else {
    element.classList.add("active");
    selectedDetailTags[displayLabel] = searchTag !== undefined ? searchTag : displayLabel;
  }

  const activeLabels = Object.keys(selectedDetailTags);
  input.value = activeLabels.join(" ");
}

function searchSongs() {
  const startYVal = document.getElementById("detail-start-year").value;
  const endYVal = document.getElementById("detail-end-year").value;

  const searchKeywords = Object.values(selectedDetailTags).filter(t => t && t.trim() !== "");

  if (searchKeywords.length === 0 && startYVal === "all" && endYVal === "all") return;

  document.getElementById("detail-left-panel").classList.remove("centered");
  document.getElementById("detail-right-panel").style.display = "block";

  const resultsDiv = document.getElementById("results-detail");
  const resultsWrapper = document.getElementById("results-wrapper-detail");
  
  switchTab('recommend', 'detail');
  resultsDiv.innerHTML = "検索中...";
  resultsWrapper.style.display = "block";

  const fetchQuery = searchKeywords.length > 0 ? searchKeywords[0] : "";

  fetch(`${GAS_API_URL}?q=${encodeURIComponent(fetchQuery)}`)
    .then(res => res.json())
    .then(songs => {
      if (!Array.isArray(songs) || songs.length === 0) {
        resultsDiv.innerHTML = "<p>一致する楽曲が見つかりませんでした。</p>";
        return;
      }

      if (searchKeywords.length > 0) {
        songs = songs.filter(song => {
          const songTags = song.tags ? song.tags.map(t => String(t).toLowerCase()) : [];
          return searchKeywords.every(kw => {
            const kwLower = kw.toLowerCase();
            return songTags.some(tag => tag.includes(kwLower));
          });
        });
      }

      if (startYVal !== "all" || endYVal !== "all") {
        const startYear = startYVal !== "all" ? parseInt(startYVal, 10) : 2007;
        const endYear = endYVal !== "all" ? parseInt(endYVal, 10) : currentYear;

        const minYear = Math.min(startYear, endYear);
        const maxYear = Math.max(startYear, endYear);

        songs = songs.filter(song => {
          const songYear = extractSongYear(song);
          if (songYear !== null) {
            return songYear >= minYear && songYear <= maxYear;
          }
          return true;
        });
      }

      if (songs.length === 0) {
        resultsDiv.innerHTML = "<p>指定した条件（タグ・年代）に一致する楽曲が見つかりませんでした。</p>";
        return;
      }

      currentDetailSongs = shuffleArray(songs);
      currentDetailDisplayedCount = 0;
      resultsDiv.innerHTML = "";
      renderPagedSongs('detail');
    })
    .catch(err => {
      console.error(err);
      resultsDiv.innerHTML = "<p>検索中にエラーが発生しました。</p>";
    });
}

function getEmbedHtml(url) {
  if (!url) return "";

  const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([a-zA-Z0-9_-]{11})/);
  if (ytMatch && ytMatch[1]) {
    return `
      <div class="embed-container">
        <iframe src="https://www.youtube.com/embed/${ytMatch[1]}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
      </div>
    `;
  }

  const nicoMatch = url.match(/nicovideo\.jp\/watch\/((?:sm|so|nm)?\d+)/);
  if (nicoMatch && nicoMatch[1]) {
    const videoId = nicoMatch[1];
    return `
      <div class="embed-container">
        <iframe src="https://embed.nicovideo.jp/watch/${videoId}" allowfullscreen></iframe>
      </div>
    `;
  }

  return "";
}

function renderPagedSongs(mode) {
  const container = mode === 'detail' ? document.getElementById("results-detail") : document.getElementById("results-quiz");
  const songs = mode === 'detail' ? currentDetailSongs : currentQuizSongs;
  let displayedCount = mode === 'detail' ? currentDetailDisplayedCount : currentQuizDisplayedCount;

  const PAGE_SIZE = 5;
  const nextBatch = songs.slice(displayedCount, displayedCount + PAGE_SIZE);

  const oldBtn = container.querySelector(".load-more-btn");
  if (oldBtn) oldBtn.remove();

  nextBatch.forEach(song => {
    const card = createSongCard(song);
    container.appendChild(card);
  });

  displayedCount += nextBatch.length;
  if (mode === 'detail') currentDetailDisplayedCount = displayedCount;
  else currentQuizDisplayedCount = displayedCount;

  if (displayedCount < songs.length) {
    const remaining = songs.length - displayedCount;
    const loadMoreBtn = document.createElement("button");
    loadMoreBtn.className = "load-more-btn";
    loadMoreBtn.innerText = `🔽 もっと見る（あと ${remaining} 曲）`;
    loadMoreBtn.onclick = function() { renderPagedSongs(mode); };
    container.appendChild(loadMoreBtn);
  }
}

function createSongCard(song) {
  const card = document.createElement("div");
  card.className = "card";

  let targetUrl = song.url && song.url.trim().startsWith("http") ? song.url.trim() : "";
  if (!targetUrl) {
    const searchQuery = encodeURIComponent(`${song.title} ${song.artist}`);
    targetUrl = `https://www.youtube.com/results?search_query=${searchQuery}`;
  }

  const embedHtml = getEmbedHtml(targetUrl);
  const isFav = favorites.some(f => f.title === song.title && f.artist === song.artist);
  const favClass = isFav ? "active" : "";

  const cardHeader = document.createElement("div");
  cardHeader.className = "card-header";

  const titleGroup = document.createElement("div");
  titleGroup.className = "title-group";

  const favBtn = document.createElement("button");
  favBtn.className = `fav-btn ${favClass}`;
  favBtn.innerText = "★";
  favBtn.onclick = function() { toggleFavorite(song, targetUrl, favBtn); };

  const titleElem = document.createElement("h2");
  titleElem.className = "song-title";
  titleElem.innerText = song.title || "（タイトル不明）";

  titleGroup.appendChild(favBtn);
  titleGroup.appendChild(titleElem);

  const listenBtn = document.createElement("a");
  listenBtn.className = "listen-btn";
  listenBtn.href = targetUrl;
  listenBtn.target = "_blank";
  listenBtn.rel = "noopener noreferrer";
  listenBtn.innerText = "▶ 外部サイトで開く";

  cardHeader.appendChild(titleGroup);
  cardHeader.appendChild(listenBtn);

  const artistElem = document.createElement("p");
  artistElem.className = "artist";
  artistElem.innerText = song.artist || "";

  card.appendChild(cardHeader);
  card.appendChild(artistElem);
  
  if (embedHtml) card.insertAdjacentHTML("beforeend", embedHtml);

  return card;
}

function renderSongList(songList, container) {
  container.innerHTML = "";
  songList.forEach(song => {
    container.appendChild(createSongCard(song));
  });
}

function toggleFavorite(song, targetUrl, btn) {
  const index = favorites.findIndex(f => f.title === song.title && f.artist === song.artist);
  if (index >= 0) {
    favorites.splice(index, 1);
    btn.classList.remove("active");
  } else {
    favorites.push({ title: song.title, artist: song.artist, url: targetUrl });
    btn.classList.add("active");
  }
  localStorage.setItem("voca_favorites", JSON.stringify(favorites));
  updateFavCounts();

  const favDetail = document.getElementById("favorite-section-detail");
  const favQuiz = document.getElementById("favorite-section-quiz");

  if (favDetail.style.display !== "none") renderSongList(favorites, document.getElementById("fav-results-detail"));
  if (favQuiz.style.display !== "none") renderSongList(favorites, document.getElementById("fav-results-quiz"));
}

function updateFavCounts() {
  const countElems = document.querySelectorAll(".fav-count");
  countElems.forEach(elem => elem.innerText = favorites.length);
}

function switchTab(tabName, mode) {
  const suffix = mode === 'detail' ? '-detail' : '-quiz';
  const recTab = document.getElementById(`tab-recommend${suffix}`);
  const favTab = document.getElementById(`tab-favorite${suffix}`);
  const recSection = document.getElementById(`recommend-section${suffix}`);
  const favSection = document.getElementById(`favorite-section${suffix}`);

  if (tabName === 'recommend') {
    recTab.classList.add("active");
    favTab.classList.remove("active");
    recSection.style.display = "block";
    favSection.style.display = "none";
  } else {
    favTab.classList.add("active");
    recTab.classList.remove("active");
    favSection.style.display = "block";
    recSection.style.display = "none";

    const favResults = document.getElementById(`fav-results${suffix}`);
    if (favorites.length === 0) {
      favResults.innerHTML = "<p style='text-align:center;'>お気に入りに登録された楽曲はありません。</p>";
    } else {
      renderSongList(favorites, favResults);
    }
  }
}

showQuizStep();
