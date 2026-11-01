/**
 * 🎵 가요 듣고 노래 맞추기 퀴즈 (아이패드 심플 버튼 전용 버전)
 * - 사진(앨범 커버) 선명하게 즉시 표시
 * - 상하좌우 스와이프/스크롤 동작 완전 차단 (오직 버튼 터치로만 동작)
 */

const CHOSEONG_LIST = [
  'ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ',
  'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'
];

const CATEGORY_ICONS = {
  '잔나비': '🎸 잔나비',
  '아이브': '👑 아이브',
  '아일릿': '🧲 아일릿',
  '에스파': '⚡ 에스파',
  '악뮤': '🍀 악뮤',
  '인기 아이돌': '🌟 인기 아이돌',
  '2026 차트': '🔥 2026 차트'
};

const FALLBACK_ARTWORK =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
      <defs>
        <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#6366f1"/>
          <stop offset="50%" stop-color="#ec4899"/>
          <stop offset="100%" stop-color="#f59e0b"/>
        </linearGradient>
      </defs>
      <rect width="400" height="400" rx="40" fill="url(#g)"/>
      <circle cx="200" cy="200" r="120" fill="rgba(15,23,42,0.75)"/>
      <circle cx="200" cy="200" r="36" fill="#f8fafc"/>
      <text x="200" y="365" font-size="32" text-anchor="middle" fill="#ffffff" font-family="sans-serif" font-weight="bold">K-POP QUIZ</text>
    </svg>
  `);

// 상태 관리
const state = {
  allSongs: [...INITIAL_SONGS],
  selectedCategory: 'ALL',
  deck: [],
  currentIndex: 0,
  hintStep: 0, // 0: 없음, 1: 1단계 가사/연도, 2: 2단계 초성
  isAnswerRevealed: false,
  scoredSongIds: new Set(),
  currentTrackData: null
};

// 오디오 객체
const audioPlayer = new Audio();
audioPlayer.preload = 'auto';

// DOM 참조
const scoreCountEl = document.getElementById('scoreCount');
const shuffleDeckBtn = document.getElementById('shuffleDeckBtn');
const categoryChipsEl = document.getElementById('categoryChips');

const questionNumberEl = document.getElementById('questionNumber');
const questionCategoryTagEl = document.getElementById('questionCategoryTag');

const albumArtFrameEl = document.getElementById('albumArtFrame');
const albumCoverImgEl = document.getElementById('albumCoverImg');

const playToggleBtn = document.getElementById('playToggleBtn');
const playBtnIcon = document.getElementById('playBtnIcon');
const playBtnLabel = document.getElementById('playBtnLabel');
const stopAudioBtn = document.getElementById('stopAudioBtn');
const audioStatusTextEl = document.getElementById('audioStatusText');

const stagePlaceholderEl = document.getElementById('stagePlaceholder');
const hintDisplayAreaEl = document.getElementById('hintDisplayArea');
const hintLyricRowEl = document.getElementById('hintLyricRow');
const hintLyricTextEl = document.getElementById('hintLyricText');
const hintChoseongRowEl = document.getElementById('hintChoseongRow');
const hintChoseongTextEl = document.getElementById('hintChoseongText');

const answerBannerEl = document.getElementById('answerBanner');
const answerArtistNameEl = document.getElementById('answerArtistName');
const answerSongTitleEl = document.getElementById('answerSongTitle');
const answerMetaInfoEl = document.getElementById('answerMetaInfo');
const markCorrectBtn = document.getElementById('markCorrectBtn');

const hintBtn = document.getElementById('hintBtn');
const answerBtn = document.getElementById('answerBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

const quizResultModal = document.getElementById('quizResultModal');
const finalTotalCountEl = document.getElementById('finalTotalCount');
const finalCorrectCountEl = document.getElementById('finalCorrectCount');
const restartSameDeckBtn = document.getElementById('restartSameDeckBtn');
const closeResultModalBtn = document.getElementById('closeResultModalBtn');

/**
 * 한글 문자열 -> 초성 변환
 */
function extractChoseong(str) {
  if (!str) return '';
  let result = '';
  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i) - 0xac00;
    if (code > -1 && code < 11172) {
      const choseongIdx = Math.floor(code / 588);
      result += CHOSEONG_LIST[choseongIdx];
    } else {
      result += str[i];
    }
  }
  return result;
}

/**
 * 배열 무작위 셔플
 */
function shuffleArray(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * 덱 구성
 */
function buildQuizDeck() {
  stopPlayback();

  const filtered =
    state.selectedCategory === 'ALL'
      ? [...state.allSongs]
      : state.allSongs.filter((song) => song.category === state.selectedCategory);

  state.deck = shuffleArray(filtered);
  state.currentIndex = 0;
  state.scoredSongIds.clear();
  updateScoreUI();
  loadCurrentQuestion();
}

function updateScoreUI() {
  scoreCountEl.textContent = String(state.scoredSongIds.size);
}

/**
 * 현재 문제 화면 렌더링
 */
function loadCurrentQuestion() {
  stopPlayback();

  if (state.deck.length === 0) {
    return;
  }

  const song = state.deck[state.currentIndex];
  state.hintStep = 0;
  state.isAnswerRevealed = false;

  // 상단 번호 & 카테고리 태그
  questionNumberEl.textContent = `${state.currentIndex + 1} / ${state.deck.length}`;
  questionCategoryTagEl.textContent = CATEGORY_ICONS[song.category] || `🎵 ${song.category}`;

  // 앨범 사진 즉시 선명하게 표시
  albumCoverImgEl.onerror = () => {
    albumCoverImgEl.onerror = null;
    albumCoverImgEl.src = FALLBACK_ARTWORK;
  };
  albumCoverImgEl.src = song.artworkUrl || FALLBACK_ARTWORK;

  // 기본 스테이지 초기화
  stagePlaceholderEl.classList.remove('hidden');
  hintDisplayAreaEl.classList.add('hidden');
  hintChoseongRowEl.classList.add('hidden');
  answerBannerEl.classList.add('hidden');

  // 버튼 텍스트 초기화
  hintBtn.textContent = '💡 힌트 보기';
  hintBtn.disabled = false;
  answerBtn.textContent = '🎉 정답 보기';

  // 맞췄어요 버튼 상태
  const alreadyScored = state.scoredSongIds.has(song.id);
  markCorrectBtn.classList.toggle('scored', alreadyScored);
  markCorrectBtn.textContent = alreadyScored ? '✅ 맞춘 문제!' : '⭕ 맞췄어요! (+1점)';

  // 이전/다음 버튼
  prevBtn.disabled = state.currentIndex <= 0;
  nextBtn.textContent =
    state.currentIndex === state.deck.length - 1 ? '🏁 결과 보기' : '다음 문제 ➡️';

  // 오디오 트랙 설정
  state.currentTrackData = {
    previewUrl: song.previewUrl || '',
    artworkUrl: song.artworkUrl || FALLBACK_ARTWORK
  };

  if (state.currentTrackData.previewUrl) {
    audioPlayer.src = state.currentTrackData.previewUrl;
    audioPlayer.load();
    audioStatusTextEl.textContent = '▶️ 버튼을 눌러 노래를 들어보세요!';
  } else {
    audioStatusTextEl.textContent = '⚠️ 미리듣기 주소가 없는 곡입니다.';
  }
}

/**
 * 오디오 재생 / 일시정지 토글
 */
async function togglePlayPause() {
  if (!state.currentTrackData || !state.currentTrackData.previewUrl) {
    audioStatusTextEl.textContent = '⚠️ 재생할 수 있는 미리듣기가 없습니다.';
    return;
  }

  if (!audioPlayer.paused) {
    audioPlayer.pause();
    updateAudioControlState(false);
    audioStatusTextEl.textContent = '⏸️ 일시정지됨 (다시 누르면 이어서 재생)';
    return;
  }

  try {
    await audioPlayer.play();
    updateAudioControlState(true);
    audioStatusTextEl.textContent = '🎶 노래가 나오는 중이에요! 귀 기울여 들어보세요!';
  } catch (err) {
    console.error('오디오 재생 오류:', err);
    updateAudioControlState(false);
    audioStatusTextEl.textContent = '⚠️ 다시 한 번 ▶️ 노래 듣기 버튼을 눌러주세요.';
  }
}

/**
 * 처음부터 다시 듣기 (정지 후 0초로 이동)
 */
function restartFromBeginning() {
  if (!state.currentTrackData || !state.currentTrackData.previewUrl) return;
  audioPlayer.pause();
  audioPlayer.currentTime = 0;
  audioPlayer.play().then(() => {
    updateAudioControlState(true);
    audioStatusTextEl.textContent = '🎶 처음부터 다시 재생 중!';
  }).catch(() => {
    updateAudioControlState(false);
    audioStatusTextEl.textContent = '⏹️ 처음으로 돌아갔어요. ▶️ 노래 듣기를 눌러주세요!';
  });
}

function stopPlayback() {
  audioPlayer.pause();
  try {
    audioPlayer.currentTime = 0;
  } catch (_) {
    // ignore
  }
  updateAudioControlState(false);
}

function updateAudioControlState(isPlaying) {
  playToggleBtn.classList.toggle('playing', isPlaying);
  albumArtFrameEl.classList.toggle('playing', isPlaying);
  if (isPlaying) {
    playBtnIcon.textContent = '⏸️';
    playBtnLabel.textContent = '일시정지';
  } else {
    playBtnIcon.textContent = '▶️';
    playBtnLabel.textContent = '노래 듣기';
  }
}

audioPlayer.addEventListener('ended', () => {
  updateAudioControlState(false);
  audioStatusTextEl.textContent = '🎵 미리듣기가 끝났어요. 다시 들으려면 버튼을 눌러주세요!';
});

/**
 * 힌트 단계별 표시
 */
function handleHintStep() {
  if (state.deck.length === 0 || state.isAnswerRevealed) return;
  const song = state.deck[state.currentIndex];

  stagePlaceholderEl.classList.add('hidden');
  hintDisplayAreaEl.classList.remove('hidden');

  if (state.hintStep === 0) {
    state.hintStep = 1;
    hintLyricTextEl.textContent = `"${song.lyricHint}" (${song.year}년)`;
    hintChoseongRowEl.classList.add('hidden');
    hintBtn.textContent = '💡 초성 힌트 보기';
  } else if (state.hintStep === 1) {
    state.hintStep = 2;
    const artistChoseong = extractChoseong(song.artist);
    const titleChoseong = extractChoseong(song.title);
    hintChoseongTextEl.textContent = `가수: ${artistChoseong}  /  제목: ${titleChoseong}`;
    hintChoseongRowEl.classList.remove('hidden');
    hintBtn.textContent = '💡 힌트 모두 공개됨';
    hintBtn.disabled = true;
  }
}

/**
 * 정답 보기 토글
 */
function toggleAnswerReveal() {
  if (state.deck.length === 0) return;
  const song = state.deck[state.currentIndex];

  state.isAnswerRevealed = !state.isAnswerRevealed;

  if (state.isAnswerRevealed) {
    stagePlaceholderEl.classList.add('hidden');
    hintDisplayAreaEl.classList.add('hidden');
    answerBannerEl.classList.remove('hidden');

    answerArtistNameEl.textContent = `🎤 ${song.artist}`;
    answerSongTitleEl.textContent = `🎵 ${song.title}`;
    answerMetaInfoEl.textContent = `${song.year}년 발매 · "${song.lyricHint}"`;
    answerBtn.textContent = '🙈 정답 가리기';
  } else {
    answerBannerEl.classList.add('hidden');
    if (state.hintStep > 0) {
      hintDisplayAreaEl.classList.remove('hidden');
    } else {
      stagePlaceholderEl.classList.remove('hidden');
    }
    answerBtn.textContent = '🎉 정답 보기';
  }
}

/**
 * 맞췄어요 (+1점) 토글
 */
function toggleScoreCurrentSong() {
  if (state.deck.length === 0) return;
  const song = state.deck[state.currentIndex];

  if (state.scoredSongIds.has(song.id)) {
    state.scoredSongIds.delete(song.id);
    markCorrectBtn.classList.remove('scored');
    markCorrectBtn.textContent = '⭕ 맞췄어요! (+1점)';
  } else {
    state.scoredSongIds.add(song.id);
    markCorrectBtn.classList.add('scored');
    markCorrectBtn.textContent = '✅ 맞춘 문제!';
  }
  updateScoreUI();
}

/**
 * 이전 / 다음 문제 이동
 */
function goPrevQuestion() {
  if (state.currentIndex > 0) {
    state.currentIndex--;
    loadCurrentQuestion();
  }
}

function goNextQuestion() {
  if (state.currentIndex < state.deck.length - 1) {
    state.currentIndex++;
    loadCurrentQuestion();
  } else {
    showResultModal();
  }
}

function showResultModal() {
  stopPlayback();
  finalTotalCountEl.textContent = String(state.deck.length);
  finalCorrectCountEl.textContent = String(state.scoredSongIds.size);
  if (typeof quizResultModal.showModal === 'function') {
    quizResultModal.showModal();
  }
}

/**
 * 이벤트 바인딩 (오직 버튼 클릭으로만 동작, 스와이프/스크롤 완전 차단)
 */
function bindEvents() {
  // 아이패드에서 상하/좌우 드래그 스크롤 및 바운스 완전 차단
  document.addEventListener(
    'touchmove',
    (e) => {
      e.preventDefault();
    },
    { passive: false }
  );

  // 카테고리 버튼 클릭
  categoryChipsEl.addEventListener('click', (e) => {
    const btn = e.target.closest('.cat-btn');
    if (!btn) return;
    categoryChipsEl.querySelectorAll('.cat-btn').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    state.selectedCategory = btn.dataset.category;
    buildQuizDeck();
  });

  // 순서 섞기
  shuffleDeckBtn.addEventListener('click', () => {
    buildQuizDeck();
  });

  // 오디오 컨트롤 버튼
  playToggleBtn.addEventListener('click', togglePlayPause);
  stopAudioBtn.addEventListener('click', restartFromBeginning);

  // 힌트 / 정답 / 점수 / 이전 / 다음 버튼
  hintBtn.addEventListener('click', handleHintStep);
  answerBtn.addEventListener('click', toggleAnswerReveal);
  markCorrectBtn.addEventListener('click', toggleScoreCurrentSong);
  prevBtn.addEventListener('click', goPrevQuestion);
  nextBtn.addEventListener('click', goNextQuestion);

  // 결과 모달 버튼
  restartSameDeckBtn.addEventListener('click', () => {
    quizResultModal.close();
    buildQuizDeck();
  });
  closeResultModalBtn.addEventListener('click', () => {
    quizResultModal.close();
  });
}

// 초기 실행
bindEvents();
buildQuizDeck();
