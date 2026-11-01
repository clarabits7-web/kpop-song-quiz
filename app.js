// 상태 관리
let selectedCategory = 'ALL';
let selectedCountLimit = 'ALL'; // '10', '20', '30', 'ALL'
let customLoadedSongs = []; // 실시간 iTunes 검색으로 불러온 곡 목록
let currentBasePool = [];
let deck = [];
let currentIndex = 0;
let hintStep = 0; // 0: 힌트 없음, 1: 1차(연도/앨범/가사) 공개, 2: 최후(초성) 공개
let isAnswerRevealed = false;
let isArtistMatched = false;
let isTitleMatched = false;
const solvedSongIds = new Set();

// 오디오 플레이어 상태 (file:// 환경에서도 CORS 차단 없이 재생되도록 crossOrigin 미설정)
const audioPlayer = new Audio();
audioPlayer.preload = 'auto';
let rafId = null;
let currentLoadToken = 0;

// iTunes 캐시 로드 (localStorage)
const ITUNES_CACHE_KEY = 'kpop_quiz_itunes_cache_v1';
let itunesCache = {};
try {
  const saved = localStorage.getItem(ITUNES_CACHE_KEY);
  if (saved) itunesCache = JSON.parse(saved);
} catch (err) {
  itunesCache = {};
}

function saveItunesCache() {
  try {
    localStorage.setItem(ITUNES_CACHE_KEY, JSON.stringify(itunesCache));
  } catch (err) {
    // ignore quota errors
  }
}

// 기본 앨범 플레이스홀더 SVG 데이터 URI
const FALLBACK_ARTWORK =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0%' stop-color='%23ec4899'/><stop offset='100%' stop-color='%236366f1'/></linearGradient></defs><rect width='400' height='400' fill='url(%23g)'/><circle cx='200' cy='200' r='110' fill='%230f172a' opacity='0.75'/><text x='200' y='218' font-size='64' text-anchor='middle' fill='%23ffffff' font-family='sans-serif' font-weight='bold'>♪</text></svg>";

// DOM 요소
const categoryChips = document.getElementById('categoryChips');
const countChips = document.getElementById('countChips');
const totalPoolCountEl = document.getElementById('totalPoolCount');
const quizModeBadge = document.getElementById('quizModeBadge');

const categoryBadgeEl = document.getElementById('categoryBadge');
const stepPill1El = document.getElementById('stepPill1');
const stepPill2El = document.getElementById('stepPill2');

const vinylStageEl = document.getElementById('vinylStage');
const albumCoverImgEl = document.getElementById('albumCoverImg');
const mysteryOverlayEl = document.getElementById('mysteryOverlay');
const mysterySubTextEl = document.getElementById('mysterySubText');

const eqBarsEl = document.getElementById('eqBars');
const audioStatusTextEl = document.getElementById('audioStatusText');
const audioTimeDisplayEl = document.getElementById('audioTimeDisplay');
const timelineContainerEl = document.getElementById('timelineContainer');
const timelineProgressEl = document.getElementById('timelineProgress');

const playToggleBtn = document.getElementById('playToggleBtn');
const playToggleIconEl = document.getElementById('playToggleIcon');
const playToggleLabelEl = document.getElementById('playToggleLabel');
const stopAudioBtn = document.getElementById('stopAudioBtn');
const volumeSlider = document.getElementById('volumeSlider');
const appleMusicLink = document.getElementById('appleMusicLink');

const artistLetterSlotsEl = document.getElementById('artistLetterSlots');
const titleLetterSlotsEl = document.getElementById('titleLetterSlots');

const hintStage1ZoneEl = document.getElementById('hintStage1Zone');
const hintReleaseYearEl = document.getElementById('hintReleaseYear');
const hintAlbumNameEl = document.getElementById('hintAlbumName');
const hintLyricTextEl = document.getElementById('hintLyricText');

const hintStage2ZoneEl = document.getElementById('hintStage2Zone');
const hintTitleChoseongEl = document.getElementById('hintTitleChoseong');
const hintArtistChoseongEl = document.getElementById('hintArtistChoseong');

const hintBtn = document.getElementById('hintBtn');
const hintBtnText = document.getElementById('hintBtnText');
const answerBtn = document.getElementById('answerBtn');
const answerBtnText = document.getElementById('answerBtnText');

const answerZoneEl = document.getElementById('answerZone');
const answerStatusBadgeEl = document.getElementById('answerStatusBadge');
const answerCategoryTagEl = document.getElementById('answerCategoryTag');
const answerYearTagEl = document.getElementById('answerYearTag');
const answerArtistNameEl = document.getElementById('answerArtistName');
const answerArtistEnEl = document.getElementById('answerArtistEn');
const answerSongTitleEl = document.getElementById('answerSongTitle');
const answerSongSubEl = document.getElementById('answerSongSub');
const answerLyricLineEl = document.getElementById('answerLyricLine');
const answerTriviaEl = document.getElementById('answerTrivia');
const markCorrectBtn = document.getElementById('markCorrectBtn');

const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

const shuffleBtn = document.getElementById('shuffleBtn');
const listOpenBtn = document.getElementById('listOpenBtn');
const modalListCountEl = document.getElementById('modalListCount');
const correctCountEl = document.getElementById('correctCount');
const questionCounterEl = document.getElementById('questionCounter');
const progressBarFillEl = document.getElementById('progressBarFill');

const customArtistOpenBtn = document.getElementById('customArtistOpenBtn');
const customArtistModal = document.getElementById('customArtistModal');
const closeCustomArtistBtn = document.getElementById('closeCustomArtistBtn');
const itunesLiveSearchForm = document.getElementById('itunesLiveSearchForm');
const itunesArtistQueryInput = document.getElementById('itunesArtistQueryInput');
const presetArtistChips = document.getElementById('presetArtistChips');
const liveSearchStatus = document.getElementById('liveSearchStatus');

const songListModal = document.getElementById('songListModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const searchSongInput = document.getElementById('searchSongInput');
const songGridList = document.getElementById('songGridList');

const quizResultModal = document.getElementById('quizResultModal');
const resultSubtitle = document.getElementById('resultSubtitle');
const resultTotalQuestions = document.getElementById('resultTotalQuestions');
const resultCorrectQuestions = document.getElementById('resultCorrectQuestions');
const resultAccuracy = document.getElementById('resultAccuracy');
const restartSameDeckBtn = document.getElementById('restartSameDeckBtn');
const restartNewDeckBtn = document.getElementById('restartNewDeckBtn');
const closeResultBtn = document.getElementById('closeResultBtn');

// Fisher-Yates 셔플
function shuffleArray(arr) {
  const cloned = [...arr];
  for (let i = cloned.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cloned[i], cloned[j]] = [cloned[j], cloned[i]];
  }
  return cloned;
}

// 정답 비교용 정규화 (공백, 괄호 부제, 특수기호 제거 및 소문자화)
function normalizeAnswer(str) {
  return (str || '')
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/[().·,!?'":;\-_~&]/g, '');
}

// 괄호 안 부제 제거 버전도 함께 생성 (예: "해야 (HEYA)" -> "해야")
function stripParentheses(str) {
  return (str || '').replace(/\([^)]*\)/g, '').replace(/\[[^\]]*\]/g, '').trim();
}

// ======================================================
// iTunes Search API 실시간 조회 (Fetch + JSONP 폴백)
// ======================================================
function jsonpItunesSearch(url) {
  return new Promise((resolve, reject) => {
    const cbName = 'itunesCb_' + Math.random().toString(36).slice(2, 10);
    const script = document.createElement('script');
    const timer = setTimeout(() => {
      cleanup();
      reject(new Error('iTunes JSONP timeout'));
    }, 8000);

    function cleanup() {
      clearTimeout(timer);
      delete window[cbName];
      if (script.parentNode) script.parentNode.removeChild(script);
    }

    window[cbName] = (data) => {
      cleanup();
      resolve(data);
    };

    script.onerror = () => {
      cleanup();
      reject(new Error('iTunes JSONP error'));
    };

    script.src = `${url}&callback=${cbName}`;
    document.head.appendChild(script);
  });
}

async function queryItunesApiByCountry(term, limit = 8, country = 'kr') {
  const baseUrl = `https://itunes.apple.com/search?term=${encodeURIComponent(term)}&country=${country}&entity=song&limit=${limit}`;
  // file:// 환경에서는 CORS 에러 없이 즉시 동작하는 JSONP를 우선 사용
  if (window.location.protocol === 'file:') {
    return await jsonpItunesSearch(baseUrl);
  }
  try {
    const res = await fetch(baseUrl);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    return await jsonpItunesSearch(baseUrl);
  }
}

async function queryItunesApi(term, limit = 8) {
  // 한국 스토어(kr) 우선 조회 후 결과가 없으면 글로벌 스토어(us) 자동 폴백
  try {
    const krData = await queryItunesApiByCountry(term, limit, 'kr');
    if (krData && Array.isArray(krData.results) && krData.results.some((r) => r.previewUrl)) {
      return krData;
    }
  } catch (err) {
    // ignore and try US store
  }
  return await queryItunesApiByCountry(term, limit, 'us');
}

// 개별 곡의 iTunes previewUrl 및 artworkUrl 확보
async function ensureSongAudioReady(song) {
  if (!song) return null;
  if (song.previewUrl && song.artworkUrl) {
    return song;
  }

  // 캐시 확인
  const cached = itunesCache[song.id];
  if (cached && cached.previewUrl) {
    song.previewUrl = cached.previewUrl;
    song.artworkUrl = cached.artworkUrl || song.artworkUrl;
    song.trackViewUrl = cached.trackViewUrl || song.trackViewUrl;
    return song;
  }

  const searchTerm = song.itunesQuery || `${song.artist} ${song.title}`;
  try {
    const data = await queryItunesApi(searchTerm, 6);
    const results = (data && data.results) || [];
    const match = results.find((r) => r.previewUrl);
    if (match) {
      song.previewUrl = match.previewUrl;
      song.artworkUrl = (match.artworkUrl100 || '').replace('100x100bb', '600x600bb');
      song.trackViewUrl = match.trackViewUrl;
      if (!song.album && match.collectionName) {
        song.album = match.collectionName;
      }
      itunesCache[song.id] = {
        previewUrl: song.previewUrl,
        artworkUrl: song.artworkUrl,
        trackViewUrl: song.trackViewUrl
      };
      saveItunesCache();
    }
  } catch (err) {
    console.warn('iTunes API lookup failed for:', searchTerm, err);
  }
  return song;
}

// 다음 문제 음원 백그라운드 프리로드
function preloadNextSongInDeck() {
  if (deck.length <= 1) return;
  const nextSong = deck[(currentIndex + 1) % deck.length];
  if (!nextSong || nextSong.previewUrl) return;
  setTimeout(() => {
    ensureSongAudioReady(nextSong);
  }, 850);
}

// ======================================================
// 오디오 재생 & 정지 제어
// ======================================================
function stopAudioPlayback(resetToBeginning = true, updateStatusText = true) {
  if (rafId) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }
  audioPlayer.pause();
  if (resetToBeginning) {
    try {
      audioPlayer.currentTime = 0;
    } catch (e) {
      // ignore if metadata not loaded
    }
    timelineProgressEl.style.width = '0%';
    audioTimeDisplayEl.textContent = '0.0s / 30.0s';
  }

  vinylStageEl.classList.remove('playing');
  eqBarsEl.classList.remove('active');
  playToggleBtn.classList.remove('active-playing');
  playToggleIconEl.textContent = '▶️';
  playToggleLabelEl.textContent = '노래 재생';

  if (updateStatusText) {
    audioStatusTextEl.textContent = resetToBeginning
      ? '⏹️ 정지됨 · [노래 재생] 버튼을 눌러 들어보세요'
      : '⏸️ 일시정지됨 · [노래 재생]을 누르면 이어서 재생됩니다';
  }
}

function monitorAudioProgress() {
  if (audioPlayer.paused) return;

  const cur = audioPlayer.currentTime || 0;
  const dur = audioPlayer.duration && isFinite(audioPlayer.duration) ? audioPlayer.duration : 30;
  const pct = Math.min(100, Math.max(0, (cur / dur) * 100));
  timelineProgressEl.style.width = `${pct}%`;
  audioTimeDisplayEl.textContent = `${cur.toFixed(1)}s / ${dur.toFixed(1)}s`;

  rafId = requestAnimationFrame(monitorAudioProgress);
}

async function playAudio(restartFromZero = false) {
  if (deck.length === 0) return;
  const song = deck[currentIndex];

  const token = ++currentLoadToken;
  audioStatusTextEl.textContent = '⏳ iTunes 음원 스트리밍 연결 중...';

  await ensureSongAudioReady(song);
  if (token !== currentLoadToken) return;

  if (!song.previewUrl) {
    audioStatusTextEl.textContent =
      '⚠️ 이 곡의 미리듣기를 불러오지 못했습니다. 잠시 후 다시 시도하거나 힌트를 참고하세요.';
    return;
  }

  albumCoverImgEl.src = song.artworkUrl || FALLBACK_ARTWORK;
  if (song.trackViewUrl) {
    appleMusicLink.href = song.trackViewUrl;
  }

  if (audioPlayer.src !== song.previewUrl) {
    audioPlayer.src = song.previewUrl;
    audioPlayer.load();
  } else if (restartFromZero) {
    try {
      audioPlayer.currentTime = 0;
    } catch (e) {
      // ignore
    }
  }

  const startPlayback = () => {
    if (token !== currentLoadToken) return;
    audioPlayer.volume = parseFloat(volumeSlider.value) || 0.8;
    const playPromise = audioPlayer.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          if (token !== currentLoadToken) return;
          vinylStageEl.classList.add('playing');
          eqBarsEl.classList.add('active');
          playToggleBtn.classList.add('active-playing');
          playToggleIconEl.textContent = '⏸️';
          playToggleLabelEl.textContent = '일시정지';
          audioStatusTextEl.textContent = '🎵 하이라이트 재생 중 · 노래를 듣고 가수와 제목을 맞춰보세요!';
          if (rafId) cancelAnimationFrame(rafId);
          rafId = requestAnimationFrame(monitorAudioProgress);
        })
        .catch(() => {
          vinylStageEl.classList.remove('playing');
          eqBarsEl.classList.remove('active');
          playToggleBtn.classList.remove('active-playing');
          playToggleIconEl.textContent = '▶️';
          playToggleLabelEl.textContent = '노래 재생';
          audioStatusTextEl.textContent =
            '🔊 브라우저 자동재생이 제한되었습니다. [노래 재생] 버튼을 눌러주세요!';
        });
    }
  };

  if (audioPlayer.readyState >= 1) {
    startPlayback();
  } else {
    audioPlayer.addEventListener('loadedmetadata', startPlayback, { once: true });
  }
}

function togglePlayAudio() {
  if (!audioPlayer.paused) {
    stopAudioPlayback(false, true);
  } else {
    playAudio(false);
  }
}

audioPlayer.addEventListener('ended', () => {
  stopAudioPlayback(true, false);
  audioStatusTextEl.textContent = '🎵 30초 미리듣기 재생 완료! 다시 들으려면 [노래 재생]을 눌러주세요';
});

// ======================================================
// 필터 및 덱(Deck) 구성
// ======================================================
function setupFilters() {
  categoryChips.addEventListener('click', (e) => {
    const btn = e.target.closest('.category-chip-btn');
    if (!btn) return;
    categoryChips.querySelectorAll('.category-chip-btn').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    selectedCategory = btn.dataset.category;
    buildDeck(true);
  });

  countChips.querySelectorAll('.count-chip-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      countChips.querySelectorAll('.count-chip-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      selectedCountLimit = btn.dataset.count;
      buildDeck(true);
    });
  });
}

function buildDeck(isNewShuffle = true) {
  if (selectedCategory === 'ALL') {
    currentBasePool = [...SONGS, ...customLoadedSongs];
  } else if (selectedCategory.startsWith('CUSTOM:')) {
    const customArtist = selectedCategory.replace('CUSTOM:', '');
    currentBasePool = customLoadedSongs.filter((s) => s.category === customArtist);
  } else {
    currentBasePool = SONGS.filter((s) => s.category === selectedCategory);
  }

  totalPoolCountEl.textContent = currentBasePool.length;

  const pool = isNewShuffle ? shuffleArray(currentBasePool) : [...currentBasePool];

  if (selectedCountLimit !== 'ALL') {
    const limit = parseInt(selectedCountLimit, 10);
    deck = pool.slice(0, Math.min(limit, pool.length));
  } else {
    deck = pool;
  }

  currentIndex = 0;
  modalListCountEl.textContent = deck.length;

  const catLabel =
    selectedCategory === 'ALL'
      ? '전체 인기곡'
      : selectedCategory.replace('CUSTOM:', '🎤 ');
  const countLabel = selectedCountLimit === 'ALL' ? `전체 ${deck.length}곡` : `${deck.length}곡 코스`;
  quizModeBadge.textContent = `${catLabel} · ${countLabel}`;

  renderCurrentSong();
}

// ======================================================
// 타일 및 문제 렌더링
// ======================================================
function renderTilesIntoContainer(containerEl, text, mode) {
  // mode: 'hidden' (? 표시), 'choseong' (초성 표시), 'revealed' (정답 표시)
  containerEl.innerHTML = '';
  const words = (text || '').split(' ');

  words.forEach((word) => {
    const wordGroup = document.createElement('div');
    wordGroup.className = 'letter-word';

    for (const char of word) {
      const tile = document.createElement('div');
      let stateClass = '';
      if (mode === 'revealed') {
        stateClass = ' revealed';
      } else if (mode === 'choseong') {
        stateClass = ' choseong-mode';
      }
      tile.className = `letter-tile${stateClass}`;
      tile.textContent = char;
      wordGroup.appendChild(tile);
    }

    containerEl.appendChild(wordGroup);
  });
}

function renderDualLetterSlots() {
  if (deck.length === 0) return;
  const song = deck[currentIndex];

  // 1) 가수 타일
  if (isAnswerRevealed || isArtistMatched) {
    renderTilesIntoContainer(artistLetterSlotsEl, song.artist, 'revealed');
  } else if (hintStep >= 2) {
    renderTilesIntoContainer(artistLetterSlotsEl, song.artistChoseong, 'choseong');
  } else {
    renderTilesIntoContainer(artistLetterSlotsEl, song.artist.replace(/[^\s]/g, '?'), 'hidden');
  }

  // 2) 노래 제목 타일
  const cleanTitle = stripParentheses(song.title) || song.title;
  const cleanTitleChoseong = makeTileChoseong(cleanTitle, song.koreanRead);
  if (isAnswerRevealed || isTitleMatched) {
    renderTilesIntoContainer(titleLetterSlotsEl, song.title, 'revealed');
  } else if (hintStep >= 2) {
    renderTilesIntoContainer(titleLetterSlotsEl, cleanTitleChoseong, 'choseong');
  } else {
    renderTilesIntoContainer(titleLetterSlotsEl, cleanTitle.replace(/[^\s]/g, '?'), 'hidden');
  }
}

function updateCategoryBadge() {
  if (deck.length === 0) return;
  const song = deck[currentIndex];
  categoryBadgeEl.textContent = `🎵 ${song.category}`;
  categoryBadgeEl.classList.remove('muted');
}

function updateHintStepUI() {
  stepPill1El.classList.toggle('active', hintStep >= 1);
  stepPill2El.classList.toggle('active', hintStep >= 2);

  if (hintStep === 0) {
    hintStage1ZoneEl.classList.add('hidden');
    hintStage2ZoneEl.classList.add('hidden');
    hintBtn.disabled = isAnswerRevealed;
    hintBtn.classList.remove('stage-final');
    hintBtnText.textContent = '1차 힌트 보기 (연도·앨범·결정적 가사)';
  } else if (hintStep === 1) {
    hintStage1ZoneEl.classList.remove('hidden');
    hintStage2ZoneEl.classList.add('hidden');
    hintBtn.disabled = isAnswerRevealed;
    hintBtn.classList.add('stage-final');
    hintBtnText.textContent = '최후의 힌트 보기 (가수·노래 초성 공개)';
  } else {
    hintStage1ZoneEl.classList.remove('hidden');
    hintStage2ZoneEl.classList.remove('hidden');
    hintBtn.disabled = true;
    hintBtn.classList.remove('stage-final');
    hintBtnText.textContent = '모든 힌트 공개 완료';
  }
}

async function renderCurrentSong(autoPlay = false) {
  if (deck.length === 0) return;
  const song = deck[currentIndex];
  stopAudioPlayback(true, false);

  hintStep = 0;
  isAnswerRevealed = false;
  isArtistMatched = false;
  isTitleMatched = false;

  // 상단 카운터 및 진행 바
  questionCounterEl.textContent = `TRACK ${currentIndex + 1} / ${deck.length}`;
  const progressPercent = ((currentIndex + 1) / deck.length) * 100;
  progressBarFillEl.style.width = `${progressPercent}%`;

  // 미스터리 앨범 커버 초기화
  albumCoverImgEl.src = song.artworkUrl || FALLBACK_ARTWORK;
  albumCoverImgEl.classList.add('mystery');
  mysteryOverlayEl.classList.remove('hidden-overlay');
  mysterySubTextEl.textContent = '듣고 맞춰보세요';
  timelineProgressEl.style.width = '0%';
  audioTimeDisplayEl.textContent = '0.0s / 30.0s';

  updateCategoryBadge();
  renderDualLetterSlots();

  // 1차 & 2차 힌트 데이터 세팅
  hintReleaseYearEl.textContent = `${song.releaseYear || '-'}년`;
  hintAlbumNameEl.textContent = song.album || '싱글 / 미니 앨범';
  hintLyricTextEl.textContent = song.lyricHint ? `"${song.lyricHint}"` : '핵심 멜로디를 잘 들어보세요!';
  hintTitleChoseongEl.textContent = song.hintTitleChoseong;
  hintArtistChoseongEl.textContent = song.hintArtistChoseong;
  updateHintStepUI();

  // 정답 영역 숨김
  answerZoneEl.classList.add('hidden');
  answerBtnText.textContent = '정답 확인 (가수 + 노래제목)';
  answerBtn.classList.remove('next-ready');

  syncSolvedButtonState(song.id);
  preloadNextSongInDeck();

  // 맨 처음 문제 및 리셋 시에는 대기, 문제 이동(prev/next) 시에만 자동 재생
  if (autoPlay) {
    playAudio(true);
  } else {
    ensureSongAudioReady(song).then(() => {
      if (deck[currentIndex] === song) {
        albumCoverImgEl.src = song.artworkUrl || FALLBACK_ARTWORK;
        audioStatusTextEl.textContent = '음원 준비 완료 · [노래 재생] 버튼을 눌러 들어보세요';
      }
    });
  }
}

// ======================================================
// 힌트 및 정답 공개 로직
// ======================================================
function handleHintStep() {
  if (deck.length === 0 || isAnswerRevealed) return;

  if (hintStep === 0) {
    hintStep = 1;
    updateHintStepUI();
  } else if (hintStep === 1) {
    hintStep = 2;
    updateHintStepUI();
    renderDualLetterSlots();
  }
}

function handleRevealAnswer(solvedByTyping = false) {
  if (deck.length === 0) return;
  const song = deck[currentIndex];

  if (isAnswerRevealed && !solvedByTyping) {
    goToNextSong();
    return;
  }

  isAnswerRevealed = true;
  updateCategoryBadge();
  renderDualLetterSlots();
  updateHintStepUI();

  // 앨범 커버 블러 해제
  albumCoverImgEl.classList.remove('mystery');
  mysteryOverlayEl.classList.add('hidden-overlay');

  // 정답 영역 채우기
  answerStatusBadgeEl.textContent = solvedByTyping ? '🎯 가수 & 노래 완벽 정답!' : '🎉 정답 공개';
  answerCategoryTagEl.textContent = song.category;
  answerYearTagEl.textContent = `${song.releaseYear || '-'}년 발매`;
  answerArtistNameEl.textContent = song.artist;
  answerArtistEnEl.textContent = song.artistEn || '';
  answerSongTitleEl.textContent = song.title;
  answerSongSubEl.textContent = `${song.titleEn || ''} · ${song.album || ''}`;
  answerLyricLineEl.textContent = song.lyricHint ? `🎤 "${song.lyricHint}"` : '';
  answerTriviaEl.textContent = song.trivia || `${song.artist}의 대표 인기곡입니다.`;

  answerZoneEl.classList.remove('hidden');
  answerBtnText.textContent = currentIndex === deck.length - 1 ? '결과 보기 →' : '다음 곡 →';
  answerBtn.classList.add('next-ready');

  syncSolvedButtonState(song.id);

  // 정답 공개 시 아직 오디오가 안 나오고 있으면 노래 재생
  if (audioPlayer.paused) {
    playAudio(false);
  }
}

function syncSolvedButtonState(songId) {
  if (solvedSongIds.has(songId)) {
    markCorrectBtn.classList.add('checked');
    markCorrectBtn.textContent = '✅ 맞춘 곡 (클릭 시 취소)';
  } else {
    markCorrectBtn.classList.remove('checked');
    markCorrectBtn.textContent = '⭕ 가수·제목 둘 다 맞췄어요! (+1)';
  }
}

function toggleMarkCorrect() {
  if (deck.length === 0) return;
  const song = deck[currentIndex];
  if (solvedSongIds.has(song.id)) {
    solvedSongIds.delete(song.id);
  } else {
    solvedSongIds.add(song.id);
  }
  correctCountEl.textContent = solvedSongIds.size;
  syncSolvedButtonState(song.id);
}

function goToPrevSong() {
  if (deck.length === 0) return;
  currentIndex = (currentIndex - 1 + deck.length) % deck.length;
  renderCurrentSong(true);
}

function goToNextSong() {
  if (deck.length === 0) return;
  if (currentIndex === deck.length - 1) {
    stopAudioPlayback(false);
    openQuizResultModal();
    return;
  }
  currentIndex = (currentIndex + 1) % deck.length;
  renderCurrentSong(true);
}

function openQuizResultModal() {
  const total = deck.length;
  const solvedInDeck = deck.filter((s) => solvedSongIds.has(s.id)).length;
  const accuracy = total > 0 ? Math.round((solvedInDeck / total) * 100) : 0;

  const catLabel =
    selectedCategory === 'ALL' ? '전체 인기곡' : selectedCategory.replace('CUSTOM:', '');
  resultSubtitle.textContent = `${catLabel} ${total}곡 코스를 모두 완주하셨습니다!`;
  resultTotalQuestions.textContent = `${total}곡`;
  resultCorrectQuestions.textContent = `${solvedInDeck}곡`;
  resultAccuracy.textContent = `${accuracy}%`;

  quizResultModal.showModal();
}

// ======================================================
// 실시간 iTunes 가수 검색 & 덱 추가 기능
// ======================================================
const ARTIST_SEARCH_ALIASES = {
  아이유: 'IU',
  데이식스: 'DAY6',
  세븐틴: 'SEVENTEEN',
  태연: 'TAEYEON',
  빅뱅: 'BIGBANG',
  성시경: 'Sung Si Kyung',
  폴킴: 'Paul Kim',
  베이비몬스터: 'BABYMONSTER',
  엔믹스: 'NMIXX',
  플레이브: 'PLAVE',
  레드벨벳: 'Red Velvet',
  블랙핑크: 'BLACKPINK',
  방탄소년단: 'BTS',
  트와이스: 'TWICE',
  스트레이키즈: 'Stray Kids',
  투모로우바이투게더: 'TOMORROW X TOGETHER',
  엔하이픈: 'ENHYPEN',
  있지: 'ITZY',
  스테이씨: 'STAYC',
  프로미스나인: 'fromis_9',
  오마이걸: 'OH MY GIRL',
  마마무: 'MAMAMOO',
  샤이니: 'SHINee',
  엑소: 'EXO',
  엔시티: 'NCT',
  제로베이스원: 'ZEROBASEONE',
  비투비: 'BTOB',
  볼빨간사춘기: 'BOL4',
  십센치: '10CM',
  멜로망스: 'MeloMance',
  다비치: 'DAVICHI',
  임영웅: 'Lim Young Woong',
  이무진: 'Lee Mujin',
  박효신: 'Park Hyo Shin'
};

async function fetchAndAddCustomArtist(artistKeyword) {
  const cleanKeyword = (artistKeyword || '').trim();
  if (!cleanKeyword) return;

  liveSearchStatus.textContent = `⏳ iTunes에서 '${cleanKeyword}'의 대표곡과 미리듣기 음원을 검색하고 있습니다...`;

  try {
    let data = await queryItunesApi(cleanKeyword, 45);
    let results = (data && data.results) || [];

    // 한글 검색어로 결과가 부족할 경우 영문 공식 아티스트명으로 자동 재검색
    if (!results.some((r) => r.previewUrl) && ARTIST_SEARCH_ALIASES[cleanKeyword.replace(/\s+/g, '')]) {
      const enAlias = ARTIST_SEARCH_ALIASES[cleanKeyword.replace(/\s+/g, '')];
      data = await queryItunesApi(enAlias, 45);
      results = (data && data.results) || [];
    }

    const seenTitles = new Set();
    const newTracks = [];

    for (const item of results) {
      if (!item.previewUrl || !item.trackName) continue;
      // Inst., Instrumental, Remix, Live 버전 제외
      if (/inst\.|instrumental|karaoke|mr|반주|remix|live/i.test(item.trackName)) continue;

      const baseTitle = stripParentheses(item.trackName).trim();
      const normKey = normalizeAnswer(baseTitle);
      if (!normKey || seenTitles.has(normKey)) continue;
      seenTitles.add(normKey);

      const year = item.releaseDate ? item.releaseDate.slice(0, 4) : '-';
      const songObj = {
        id: `custom-${item.trackId}`,
        category: cleanKeyword,
        artist: cleanKeyword,
        artistEn: item.artistName || cleanKeyword,
        artistAliases: [cleanKeyword, item.artistName].filter(Boolean),
        title: baseTitle,
        titleEn: item.trackName,
        titleAliases: [baseTitle, item.trackName],
        koreanRead: baseTitle,
        releaseYear: year,
        album: item.collectionName || 'Single',
        lyricHint: `${cleanKeyword}의 ${year}년 발매 수록 앨범 <${item.collectionName || 'Single'}> 트랙`,
        trivia: `Apple iTunes에서 실시간으로 불러온 ${item.artistName}의 공식 미리듣기 트랙입니다.`,
        itunesQuery: `${cleanKeyword} ${baseTitle}`,
        itunesTrackId: item.trackId,
        previewUrl: item.previewUrl,
        artworkUrl: (item.artworkUrl100 || '').replace('100x100bb', '600x600bb'),
        trackViewUrl: item.trackViewUrl,
        artistChoseong: makeTileChoseong(cleanKeyword, cleanKeyword),
        titleChoseong: makeTileChoseong(baseTitle, baseTitle),
        hintArtistChoseong: makeHintInitials(cleanKeyword, cleanKeyword),
        hintTitleChoseong: makeHintInitials(baseTitle, baseTitle)
      };

      newTracks.push(songObj);
      if (newTracks.length >= 20) break;
    }

    if (newTracks.length === 0) {
      liveSearchStatus.textContent = `❌ '${cleanKeyword}'의 미리듣기 음원을 찾지 못했습니다. 다른 검색어로 시도해 보세요.`;
      return;
    }

    // 기존 동일 커스텀 카테고리 교체 후 추가
    customLoadedSongs = customLoadedSongs.filter((s) => s.category !== cleanKeyword);
    customLoadedSongs.push(...newTracks);

    // 상단 카테고리 칩에 버튼 추가/활성화
    const customCatValue = `CUSTOM:${cleanKeyword}`;
    let chipBtn = categoryChips.querySelector(`[data-category="${customCatValue}"]`);
    if (!chipBtn) {
      chipBtn = document.createElement('button');
      chipBtn.type = 'button';
      chipBtn.className = 'category-chip-btn';
      chipBtn.dataset.category = customCatValue;
      categoryChips.appendChild(chipBtn);
    }
    chipBtn.textContent = `🎤 ${cleanKeyword} (${newTracks.length})`;

    categoryChips.querySelectorAll('.category-chip-btn').forEach((b) => b.classList.remove('active'));
    chipBtn.classList.add('active');
    selectedCategory = customCatValue;

    liveSearchStatus.textContent = `✅ '${cleanKeyword}'의 대표곡 ${newTracks.length}곡을 성공적으로 불러왔습니다!`;
    buildDeck(true);

    setTimeout(() => {
      if (customArtistModal.open) customArtistModal.close();
    }, 450);
  } catch (err) {
    liveSearchStatus.textContent = `⚠️ iTunes API 연결 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.`;
  }
}

// ======================================================
// 전체 수록곡 도감 모달 렌더링
// ======================================================
function renderModalSongList(filterKeyword = '') {
  songGridList.innerHTML = '';
  const keyword = filterKeyword.trim().toLowerCase();

  deck.forEach((song, idx) => {
    if (keyword) {
      const matchArtist = song.artist.toLowerCase().includes(keyword) || (song.artistEn || '').toLowerCase().includes(keyword);
      const matchTitle = song.title.toLowerCase().includes(keyword) || (song.titleEn || '').toLowerCase().includes(keyword);
      const matchCat = song.category.toLowerCase().includes(keyword);
      const matchChoseong =
        song.artistChoseong.includes(keyword) || song.titleChoseong.includes(keyword);
      if (!matchArtist && !matchTitle && !matchCat && !matchChoseong) return;
    }

    const item = document.createElement('div');
    item.className = 'song-grid-item';
    const isSolved = solvedSongIds.has(song.id);

    item.innerHTML = `
      <div class="grid-disc-icon">${isSolved ? '✅' : '💿'}</div>
      <div class="grid-item-info">
        <span class="grid-item-cat">${song.category} · #${idx + 1} (${song.releaseYear}년)</span>
        <span class="grid-item-name">${
          isSolved
            ? `${song.artist} - ${song.title}`
            : `${song.artist} · 초성: ${song.hintTitleChoseong}`
        }</span>
      </div>
    `;

    item.addEventListener('click', () => {
      currentIndex = idx;
      renderCurrentSong();
      songListModal.close();
    });

    songGridList.appendChild(item);
  });
}

// ======================================================
// 이벤트 바인딩 & IME 안전 처리 & Dialog Light-Dismiss 폴백
// ======================================================
playToggleBtn.addEventListener('click', togglePlayAudio);
stopAudioBtn.addEventListener('click', () => stopAudioPlayback(true, true));

volumeSlider.addEventListener('input', (e) => {
  audioPlayer.volume = parseFloat(e.target.value) || 0.8;
});

timelineContainerEl.addEventListener('click', (e) => {
  if (!audioPlayer.src) return;
  const rect = timelineContainerEl.getBoundingClientRect();
  const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
  const dur = audioPlayer.duration && isFinite(audioPlayer.duration) ? audioPlayer.duration : 30;
  audioPlayer.currentTime = ratio * dur;
  audioPlayer.play().then(() => {
    vinylStageEl.classList.add('playing');
    eqBarsEl.classList.add('active');
    playToggleBtn.classList.add('active-playing');
    playToggleIconEl.textContent = '⏸️';
    playToggleLabelEl.textContent = '일시정지';
    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(monitorAudioProgress);
  }).catch(() => {});
});

hintBtn.addEventListener('click', handleHintStep);
answerBtn.addEventListener('click', () => handleRevealAnswer(false));
prevBtn.addEventListener('click', goToPrevSong);
nextBtn.addEventListener('click', goToNextSong);
markCorrectBtn.addEventListener('click', toggleMarkCorrect);

shuffleBtn.addEventListener('click', () => {
  deck = shuffleArray(deck);
  currentIndex = 0;
  renderCurrentSong();
});

itunesArtistQueryInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    if (event.isComposing || event.keyCode === 229) {
      return;
    }
    itunesLiveSearchForm.requestSubmit();
  }
});

// 모달 열기/닫기
customArtistOpenBtn.addEventListener('click', () => {
  customArtistModal.showModal();
});

closeCustomArtistBtn.addEventListener('click', () => {
  customArtistModal.close();
});

itunesLiveSearchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  fetchAndAddCustomArtist(itunesArtistQueryInput.value);
});

presetArtistChips.addEventListener('click', (e) => {
  const chip = e.target.closest('.preset-chip');
  if (!chip) return;
  const artistName = chip.dataset.artist;
  itunesArtistQueryInput.value = artistName;
  fetchAndAddCustomArtist(artistName);
});

listOpenBtn.addEventListener('click', () => {
  searchSongInput.value = '';
  renderModalSongList('');
  songListModal.showModal();
});

closeModalBtn.addEventListener('click', () => {
  songListModal.close();
});

searchSongInput.addEventListener('input', (e) => {
  renderModalSongList(e.target.value);
});

restartSameDeckBtn.addEventListener('click', () => {
  quizResultModal.close();
  currentIndex = 0;
  renderCurrentSong();
});

restartNewDeckBtn.addEventListener('click', () => {
  quizResultModal.close();
  buildDeck(true);
});

closeResultBtn.addEventListener('click', () => {
  quizResultModal.close();
});

// <dialog closedby="any"> 미지원 브라우저(Safari 등)용 Light-Dismiss 폴백 (dialog / light-dismiss-a-dialog 가이드 준수)
if (!('closedBy' in HTMLDialogElement.prototype)) {
  const outside = (e, dialog) => {
    const r = dialog.getBoundingClientRect();
    return e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
  };
  for (const dialog of document.querySelectorAll('dialog[closedby="any"]')) {
    let pressedOutside = false;
    dialog.addEventListener('pointerdown', (e) => {
      pressedOutside = outside(e, dialog);
    });
    dialog.addEventListener('pointerup', (e) => {
      if (pressedOutside && outside(e, dialog)) dialog.close();
    });
  }
}

// 키보드 단축키 지원
window.addEventListener('keydown', (e) => {
  if (songListModal.open || quizResultModal.open || customArtistModal.open) return;
  const activeTag = document.activeElement ? document.activeElement.tagName : '';
  if (activeTag === 'INPUT' || activeTag === 'TEXTAREA' || activeTag === 'SELECT') return;

  if (e.key === 'r' || e.key === 'R' || e.key === 'ㄱ') {
    e.preventDefault();
    togglePlayAudio();
  } else if (e.key === 'h' || e.key === 'H' || e.key === 'ㅗ') {
    e.preventDefault();
    if (!hintBtn.disabled) handleHintStep();
  } else if (e.code === 'Space') {
    e.preventDefault();
    handleRevealAnswer(false);
  } else if (e.key === 'ArrowRight') {
    e.preventDefault();
    goToNextSong();
  } else if (e.key === 'ArrowLeft') {
    e.preventDefault();
    goToPrevSong();
  }
});

// 아이패드 및 모바일 터치 스와이프 제스처 (좌우 넘기기)
let touchStartX = 0;
let touchStartY = 0;
let isSliderTouch = false;

window.addEventListener(
  'touchstart',
  (e) => {
    if (songListModal.open || quizResultModal.open || customArtistModal.open) return;
    const targetTag = e.target ? e.target.tagName : '';
    isSliderTouch = targetTag === 'INPUT' || Boolean(e.target.closest('#timelineContainer'));
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
  },
  { passive: true }
);

window.addEventListener(
  'touchend',
  (e) => {
    if (isSliderTouch || songListModal.open || quizResultModal.open || customArtistModal.open) return;
    const touchEndX = e.changedTouches[0].screenX;
    const touchEndY = e.changedTouches[0].screenY;

    const diffX = touchEndX - touchStartX;
    const diffY = touchEndY - touchStartY;

    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 60) {
      if (diffX < 0) {
        goToNextSong();
      } else {
        goToPrevSong();
      }
    }
  },
  { passive: true }
);

// 초기 실행
setupFilters();
buildDeck(true);
