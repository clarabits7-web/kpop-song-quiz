// 한글 초성 추출 유틸리티 (실시간 검색 곡 및 기본 곡 공통 사용)
const CHOSEONG_LIST = [
  'ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ',
  'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'
];

function extractChoseong(str) {
  if (!str) return '';
  let result = '';
  for (const ch of str) {
    const code = ch.charCodeAt(0);
    // 한글 가~힣 범위
    if (code >= 0xac00 && code <= 0xd7a3) {
      const choseongIndex = Math.floor((code - 0xac00) / 588);
      result += CHOSEONG_LIST[choseongIndex];
    } else if (/[a-zA-Z]/.test(ch)) {
      // 영문은 첫 글자 외에는 초성 힌트용으로 대문자 이니셜 혹은 기호 처리 가능하지만
      // 타일 표시에선 알파벳 첫 글자만 보여주거나 '?'로 변환할 수 있도록 그대로 유지
      result += ch.toUpperCase();
    } else {
      result += ch;
    }
  }
  return result;
}

// 영문 제목일 경우 첫 글자만 남기고 나머지는 ● 처리한 초성형 힌트 생성
function makeHintInitials(title, koreanPronunciation) {
  // 한글 발음 별칭이 있으면 한글 초성 + 영문 첫 글자 병기 가능
  const hasKorean = /[가-힣]/.test(title);
  if (hasKorean) {
    return extractChoseong(title);
  }
  // 순수 영문 제목이고 한글 발음이 제공된 경우 한글 초성 반환 (더 재미있는 초성 퀴즈를 위해)
  if (koreanPronunciation && /[가-힣]/.test(koreanPronunciation)) {
    return `${extractChoseong(koreanPronunciation)} (${title
      .split(/\s+/)
      .map((w) => w[0].toUpperCase() + '·'.repeat(Math.max(0, w.length - 1)))
      .join(' ')})`;
  }
  return title
    .split(/\s+/)
    .map((w) => w[0].toUpperCase() + '·'.repeat(Math.max(0, w.length - 1)))
    .join(' ');
}

// 타일 슬롯용 초성 문자열 (글자 수와 띄어쓰기 1:1 매칭)
function makeTileChoseong(text, koreanRead) {
  const hasKorean = /[가-힣]/.test(text);
  if (hasKorean) {
    return extractChoseong(text);
  }
  // 순수 영문인 경우 각 단어의 첫 글자만 알파벳 대문자로 보여주고 나머지는 ㆍ 표시
  return text
    .split(' ')
    .map((word) => {
      if (!word) return '';
      return (
        word[0].toUpperCase() +
        word
          .slice(1)
          .replace(/[a-zA-Z0-9]/g, '·')
      );
    })
    .join(' ');
}

const RAW_SONGS = [
  {
    "id": "jannabi-1",
    "category": "잔나비",
    "artist": "잔나비",
    "artistEn": "JANNABI",
    "artistAliases": [
      "잔나비",
      "JANNABI",
      "그룹사운드 잔나비"
    ],
    "title": "주저하는 연인들을 위해",
    "titleEn": "For Lovers Who Hesitate",
    "titleAliases": [
      "주저하는 연인들을 위해",
      "주저하는연인들을위해",
      "For Lovers Who Hesitate"
    ],
    "koreanRead": "주저하는 연인들을 위해",
    "releaseYear": "2019",
    "album": "전설 (Legend)",
    "lyricHint": "나는 읽기 쉬운 마음이야 / 당신도 스윽 훑고 가셔요",
    "trivia": "잔나비를 국민 밴드 반열에 올린 정규 2집 <전설>의 타이틀곡으로, 아날로그 감성의 정점을 보여준 명곡입니다.",
    "itunesQuery": "잔나비 주저하는 연인들을 위해",
    "itunesTrackId": 1456103133,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/b1/a4/0a/b1a40a3e-65ca-f51b-3bb9-12145d970895/mzaf_509885747699732949.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/fc/a9/b2/fca9b2d4-b1ed-92e8-2e5f-1838d77cbce7/cover-_NEW.jpg/600x600bb.jpg"
  },
  {
    "id": "jannabi-2",
    "category": "잔나비",
    "artist": "잔나비",
    "artistEn": "JANNABI",
    "artistAliases": [
      "잔나비",
      "JANNABI"
    ],
    "title": "뜨거운 여름밤은 가고 남은 건 볼품없지만",
    "titleEn": "Summer",
    "titleAliases": [
      "뜨거운 여름밤은 가고 남은 건 볼품없지만",
      "뜨거운 여름밤은 가고",
      "뜨거운여름밤은가고",
      "뜨여남품"
    ],
    "koreanRead": "뜨거운 여름밤은 가고 남은 건 볼품없지만",
    "releaseYear": "2016",
    "album": "MONKEY HOTEL",
    "lyricHint": "그립고 그리운 밤에 / 두 손 모아 기도하네",
    "trivia": "정규 1집 <MONKEY HOTEL> 타이틀곡으로, 여름밤 페스티벌마다 떼창이 울려 퍼지는 잔나비의 대표곡입니다.",
    "itunesQuery": "잔나비 뜨거운 여름밤은 가고 남은 건 볼품없지만",
    "itunesTrackId": 1552662544,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/0f/a4/8f/0fa48fd9-31b8-4edb-d48d-c9bee767757b/mzaf_15959397423306782503.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music114/v4/68/59/cd/6859cdcb-d7b3-566b-033f-547b44733bae/cover_-_SBS_K_Part.2.jpg/600x600bb.jpg"
  },
  {
    "id": "jannabi-3",
    "category": "잔나비",
    "artist": "잔나비",
    "artistEn": "JANNABI",
    "artistAliases": [
      "잔나비",
      "JANNABI"
    ],
    "title": "사랑하긴 했었나요 스쳐가는 인연이었나요",
    "titleEn": "Baby I Need You",
    "titleAliases": [
      "사랑하긴 했었나요 스쳐가는 인연이었나요 짧지않은 우리 함께했던 시간들이 자꾸 내 마음을 가둬두네",
      "사랑하긴 했었나요 스쳐가는 인연이었나요",
      "사랑하긴 했었나요",
      "사랑하긴했었나요",
      "사스짧자"
    ],
    "koreanRead": "사랑하긴 했었나요 스쳐가는 인연이었나요",
    "releaseYear": "2014",
    "album": "봉춤을 추네 (Pole Dance)",
    "lyricHint": "조금만 더 기다려 줄래요 / 내가 달려갈 테니",
    "trivia": "원래 풀 제목은 무려 47자에 달하는 긴 제목으로, 대학 축제와 라이브 무대를 통해 역주행 신화를 쓴 곡입니다.",
    "itunesQuery": "잔나비 사랑하긴 했었나요 스쳐가는 인연이었나요",
    "itunesTrackId": 1466693931,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/62/ae/92/62ae9281-0f5a-2adc-7d0c-9c9a171bae0f/mzaf_17918409927310568289.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music123/v4/1e/c8/09/1ec8097c-8a98-6123-ea5a-f630ecfad679/cover-_DS_NEW.jpg/600x600bb.jpg"
  },
  {
    "id": "jannabi-4",
    "category": "잔나비",
    "artist": "잔나비",
    "artistEn": "JANNABI",
    "artistAliases": [
      "잔나비",
      "JANNABI"
    ],
    "title": "가을밤에 든 생각",
    "titleEn": "A Thought on an Autumn Night",
    "titleAliases": [
      "가을밤에 든 생각",
      "가을밤에든생각"
    ],
    "koreanRead": "가을밤에 든 생각",
    "releaseYear": "2020",
    "album": "잔나비 소곡집 l",
    "lyricHint": "머나먼 별빛 저 별에서도 / 노랠 부르는 사랑 살겠지",
    "trivia": "선선한 가을바람이 불어올 때마다 차트에 다시 등장하는 서정적인 어쿠스틱 발라드입니다.",
    "itunesQuery": "잔나비 가을밤에 든 생각",
    "itunesTrackId": 1539127951,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/17/33/7e/17337e63-ff3f-8ec9-d0a9-00c7bd7b3fb9/mzaf_16465432148411887446.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/a9/d6/d4/a9d6d4e2-0f52-be99-abd0-9e5c5338f507/cover_-.jpg/600x600bb.jpg"
  },
  {
    "id": "jannabi-5",
    "category": "잔나비",
    "artist": "잔나비",
    "artistEn": "JANNABI",
    "artistAliases": [
      "잔나비",
      "JANNABI"
    ],
    "title": "초록을거머쥔우리는",
    "titleEn": "GRIPPIN'THEGREEN",
    "titleAliases": [
      "초록을거머쥔우리는",
      "초록을 거머쥔 우리는"
    ],
    "koreanRead": "초록을거머쥔우리는",
    "releaseYear": "2022",
    "album": "잔나비 소곡집 ll : 초록을거머쥔우리는",
    "lyricHint": "창문 너머 초록을 거머쥔 우리는 / 기꺼이 함께할 거야",
    "trivia": "싱그러운 봄·초여름 피크닉 감성을 담은 곡으로, 듣고만 있어도 잔디밭에 누운 듯한 기분을 주는 곡입니다.",
    "itunesQuery": "잔나비 초록을거머쥔우리는",
    "itunesTrackId": 1622756312,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/34/0e/18/340e182c-f1e8-960e-360b-225f2b03d662/mzaf_13696474645961084991.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/d9/a4/fb/d9a4fb13-9601-62d8-d342-21957312ab06/cover_KM0015239_1.jpg/600x600bb.jpg"
  },
  {
    "id": "jannabi-6",
    "category": "잔나비",
    "artist": "잔나비",
    "artistEn": "JANNABI",
    "artistAliases": [
      "잔나비",
      "JANNABI"
    ],
    "title": "투게더!",
    "titleEn": "Together!",
    "titleAliases": [
      "투게더!",
      "투게더",
      "Together",
      "Together!"
    ],
    "koreanRead": "투게더",
    "releaseYear": "2019",
    "album": "전설 (Legend)",
    "lyricHint": "우리들의 팔짱 낀 추억이 / 늙어가는 걸 보네",
    "trivia": "정규 2집 <전설>의 경쾌한 록 트랙으로, 콘서트 오프닝이나 앙코르에서 관객들과 힘차게 호흡하는 곡입니다.",
    "itunesQuery": "잔나비 투게더",
    "itunesTrackId": 1456103127,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/60/56/42/60564255-e2a0-b5ed-eb66-69ae88f38875/mzaf_15497999820320399980.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/fc/a9/b2/fca9b2d4-b1ed-92e8-2e5f-1838d77cbce7/cover-_NEW.jpg/600x600bb.jpg"
  },
  {
    "id": "jannabi-7",
    "category": "잔나비",
    "artist": "잔나비",
    "artistEn": "JANNABI",
    "artistAliases": [
      "잔나비",
      "JANNABI"
    ],
    "title": "외딴섬 로맨틱",
    "titleEn": "I Know Where the Rainbow Has Fallen",
    "titleAliases": [
      "외딴섬 로맨틱",
      "외딴섬로맨틱"
    ],
    "koreanRead": "외딴섬 로맨틱",
    "releaseYear": "2021",
    "album": "환상의 나라 (The Land of Fantasy)",
    "lyricHint": "덧없는 바닷가 모래성 / 파도가 부서지듯 무너지네",
    "trivia": "정규 3집 <환상의 나라>의 타이틀곡으로, 동화적이고 웅장한 오케스트라 사운드가 인상적인 곡입니다.",
    "itunesQuery": "잔나비 외딴섬 로맨틱",
    "itunesTrackId": 1578636393,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/fa/56/7d/fa567d41-6c55-58ee-22a2-9569444e23fa/mzaf_18190808652932962107.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/2f/92/25/2f922513-0da1-5c2d-2ee2-c9cbca86457e/2.jpg/600x600bb.jpg"
  },
  {
    "id": "jannabi-8",
    "category": "잔나비",
    "artist": "잔나비",
    "artistEn": "JANNABI",
    "artistAliases": [
      "잔나비",
      "JANNABI"
    ],
    "title": "꿈과 책과 힘과 벽",
    "titleEn": "Dreams, Books, Power and Walls",
    "titleAliases": [
      "꿈과 책과 힘과 벽",
      "꿈과책과힘과벽"
    ],
    "koreanRead": "꿈과 책과 힘과 벽",
    "releaseYear": "2019",
    "album": "전설 (Legend)",
    "lyricHint": "해가 뜨고 해가 지는 것을 보았네 / 나의 작은 방엔",
    "trivia": "어른이 되어가며 느끼는 청춘의 무게와 성찰을 담담한 보컬로 풀어내 많은 이들에게 위로를 건넨 곡입니다.",
    "itunesQuery": "잔나비 꿈과 책과 힘과 벽",
    "itunesTrackId": 1456103137,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/d7/6f/bb/d76fbb4b-2461-a9c9-1bd4-e7da4c5958f7/mzaf_516901413690275414.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/fc/a9/b2/fca9b2d4-b1ed-92e8-2e5f-1838d77cbce7/cover-_NEW.jpg/600x600bb.jpg"
  },
  {
    "id": "jannabi-9",
    "category": "잔나비",
    "artist": "잔나비",
    "artistEn": "JANNABI",
    "artistAliases": [
      "잔나비",
      "JANNABI"
    ],
    "title": "포니",
    "titleEn": "Pony",
    "titleAliases": [
      "포니",
      "Pony",
      "포니 (Pony)"
    ],
    "koreanRead": "포니",
    "releaseYear": "2023",
    "album": "포니 (Pony) - Single",
    "lyricHint": "뒷좌석에 앉아 창밖을 보던 / 어린 날의 드라이브",
    "trivia": "현대자동차 헤리티지 프로젝트와 협업해 발표한 곡으로, 부모님의 옛 자동차를 타고 달리던 유년 시절의 향수를 담았습니다.",
    "itunesQuery": "JANNABI Pony",
    "itunesTrackId": 1693199646,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/19/7f/03/197f0398-3618-9a38-d4ed-fe60a78fe1a1/mzaf_257988253864521324.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/9e/7f/5b/9e7f5b8b-c3d9-262c-04f9-bf80ed5b4ae9/cover_KM0017720_1.jpg/600x600bb.jpg"
  },
  {
    "id": "jannabi-10",
    "category": "잔나비",
    "artist": "잔나비",
    "artistEn": "JANNABI",
    "artistAliases": [
      "잔나비",
      "JANNABI"
    ],
    "title": "쉬 (She)",
    "titleEn": "She",
    "titleAliases": [
      "쉬",
      "She",
      "쉬 (She)"
    ],
    "koreanRead": "쉬",
    "releaseYear": "2017",
    "album": "She - Single",
    "lyricHint": "우린 어쩌면 같은 꿈을 꾸고 있었는지도 몰라",
    "trivia": "달콤하고 몽환적인 멜로디로 팬들 사이에서 손꼽히는 잔나비의 러브송입니다.",
    "itunesQuery": "JANNABI She",
    "itunesTrackId": 1281470015,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/1d/da/39/1dda39c0-908b-7eb7-6f75-ac107aa75a0c/mzaf_16231129250318181984.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music118/v4/4b/8c/0f/4b8c0f1e-472e-732b-8dd8-f4a690ef95db/cover-_DS.jpg/600x600bb.jpg"
  },
  {
    "id": "ive-1",
    "category": "아이브",
    "artist": "아이브",
    "artistEn": "IVE",
    "artistAliases": [
      "아이브",
      "IVE"
    ],
    "title": "LOVE DIVE",
    "titleEn": "LOVE DIVE",
    "titleAliases": [
      "LOVE DIVE",
      "러브 다이브",
      "러브다이브"
    ],
    "koreanRead": "러브 다이브",
    "releaseYear": "2022",
    "album": "LOVE DIVE - Single",
    "lyricHint": "숨 참고 LOVE DIVE / 우우우우 라라라라",
    "trivia": "2022년 연간 차트 1위를 휩쓸고 각종 시상식 대상을 석권한 아이브의 메가 히트곡입니다.",
    "itunesQuery": "IVE LOVE DIVE",
    "itunesTrackId": 1616804152,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/b1/71/d4/b171d4a4-0446-b7d6-d778-7de6ee31f779/mzaf_13755854455583478875.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/67/f8/16/67f8164a-bfc2-f29b-e241-800426a968ef/cover_KM0015013_1.jpg/600x600bb.jpg"
  },
  {
    "id": "ive-2",
    "category": "아이브",
    "artist": "아이브",
    "artistEn": "IVE",
    "artistAliases": [
      "아이브",
      "IVE"
    ],
    "title": "I AM",
    "titleEn": "I AM",
    "titleAliases": [
      "I AM",
      "아이엠",
      "아이 엠"
    ],
    "koreanRead": "아이 엠",
    "releaseYear": "2023",
    "album": "I've IVE",
    "lyricHint": "어제랑 또 다른 짜릿한 나 / 두려워하지 마",
    "trivia": "시원하게 뻗어 나가는 고음 후렴구와 당당한 자기확신의 메시지로 큰 사랑을 받은 정규 1집 타이틀곡입니다.",
    "itunesQuery": "IVE I AM",
    "itunesTrackId": 1680047366,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/7d/58/dc/7d58dcfe-20ae-643e-d160-2bbb49628383/mzaf_15653119750983230833.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/3a/23/b7/3a23b7f4-0b43-df9d-b7e4-14f992443324/197188335663.jpg/600x600bb.jpg"
  },
  {
    "id": "ive-3",
    "category": "아이브",
    "artist": "아이브",
    "artistEn": "IVE",
    "artistAliases": [
      "아이브",
      "IVE"
    ],
    "title": "After LIKE",
    "titleEn": "After LIKE",
    "titleAliases": [
      "After LIKE",
      "애프터 라이크",
      "애프터라이크"
    ],
    "koreanRead": "애프터 라이크",
    "releaseYear": "2022",
    "album": "After LIKE - Single",
    "lyricHint": "내 장점이 뭔지 알아? 바로 솔직한 거야",
    "trivia": "글로리아 게이너의 명곡 <I Will Survive>를 샘플링해 화려한 디스코 사운드와 불꽃놀이 같은 쾌감을 선사한 곡입니다.",
    "itunesQuery": "IVE After LIKE",
    "itunesTrackId": 1639416903,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/af/78/11/af78116e-4e31-2cf6-faf6-e62ca99d7196/mzaf_4773771462355548204.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/01/f5/0a/01f50af1-89da-cb51-a809-c613600451e9/196925429900.jpg/600x600bb.jpg"
  },
  {
    "id": "ive-4",
    "category": "아이브",
    "artist": "아이브",
    "artistEn": "IVE",
    "artistAliases": [
      "아이브",
      "IVE"
    ],
    "title": "ELEVEN",
    "titleEn": "ELEVEN",
    "titleAliases": [
      "ELEVEN",
      "일레븐"
    ],
    "koreanRead": "일레븐",
    "releaseYear": "2021",
    "album": "ELEVEN - Single",
    "lyricHint": "내 앞에 있는 너를 그 눈에 비친 나를 / 1, 2, 3, 4, 5, 6, 7",
    "trivia": "후렴 직전 템포가 느려지는 독특한 변속 연출로 데뷔와 동시에 음원 차트와 음악방송을 휩쓴 데뷔곡입니다.",
    "itunesQuery": "IVE ELEVEN",
    "itunesTrackId": 1597404252,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/73/fb/20/73fb20dc-06ba-e335-0f41-12c236cf4a6a/mzaf_8112463022445538098.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/d3/63/4a/d3634a37-8dd2-8fc6-d138-895b3d237611/IVE_OnlineCover_fix.jpg/600x600bb.jpg"
  },
  {
    "id": "ive-5",
    "category": "아이브",
    "artist": "아이브",
    "artistEn": "IVE",
    "artistAliases": [
      "아이브",
      "IVE"
    ],
    "title": "해야 (HEYA)",
    "titleEn": "HEYA",
    "titleAliases": [
      "해야 (HEYA)",
      "해야",
      "HEYA"
    ],
    "koreanRead": "해야",
    "releaseYear": "2024",
    "album": "IVE SWITCH - EP",
    "lyricHint": "해야 해야 해야 / 한입에 삼켜버릴 거야",
    "trivia": "설화 속 해를 사랑한 호랑이 모티브와 한국적인 미학을 세련된 힙합 비트와 결합한 곡입니다.",
    "itunesQuery": "IVE HEYA",
    "itunesTrackId": 1741071167,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/43/a7/4d/43a74d0f-ef5f-b714-d812-5839d78a7bd7/mzaf_13646341762554566811.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/33/6d/b4/336db418-00ea-9570-1aa5-2541c07e582e/198391557965.jpg/600x600bb.jpg"
  },
  {
    "id": "ive-6",
    "category": "아이브",
    "artist": "아이브",
    "artistEn": "IVE",
    "artistAliases": [
      "아이브",
      "IVE"
    ],
    "title": "Baddie",
    "titleEn": "Baddie",
    "titleAliases": [
      "Baddie",
      "배디"
    ],
    "koreanRead": "배디",
    "releaseYear": "2023",
    "album": "I'VE MINE - EP",
    "lyricHint": "I'm a baddie b-b-baddie baddie / Pretty little risky baddie",
    "trivia": "강렬한 트랩 비트와 고양이 수염 안무로 아이브의 다크하고 힙한 반전 매력을 보여준 타이틀곡입니다.",
    "itunesQuery": "IVE Baddie",
    "itunesTrackId": 1709569470,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/76/1b/b7/761bb77b-e8f1-8e02-2c63-e77f39281c21/mzaf_6248546002557999331.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/2e/a2/87/2ea2870f-9700-bb4e-df68-abd2acfb5fb9/197189809583.jpg/600x600bb.jpg"
  },
  {
    "id": "ive-7",
    "category": "아이브",
    "artist": "아이브",
    "artistEn": "IVE",
    "artistAliases": [
      "아이브",
      "IVE"
    ],
    "title": "REBEL HEART",
    "titleEn": "REBEL HEART",
    "titleAliases": [
      "REBEL HEART",
      "레블 하트",
      "레블하트",
      "Rebel Heart"
    ],
    "koreanRead": "레블 하트",
    "releaseYear": "2025",
    "album": "IVE EMPATHY",
    "lyricHint": "We are rebels in our heart / 시작은 항상 다를 뿐인걸",
    "trivia": "2025년 발매된 <IVE EMPATHY> 선공개 타이틀곡으로, 벅차오르는 밴드 사운드와 연대의 메시지로 차트 1위를 기록했습니다.",
    "itunesQuery": "IVE REBEL HEART",
    "itunesTrackId": 1786710186,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/32/74/05/3274059e-cd56-6149-6879-1eadba98704d/mzaf_3829637146046662884.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/26/c5/38/26c5381f-2dcb-cc8f-c161-60009a3c4d97/199066086087.jpg/600x600bb.jpg"
  },
  {
    "id": "ive-8",
    "category": "아이브",
    "artist": "아이브",
    "artistEn": "IVE",
    "artistAliases": [
      "아이브",
      "IVE"
    ],
    "title": "Accendio",
    "titleEn": "Accendio",
    "titleAliases": [
      "Accendio",
      "아센디오"
    ],
    "koreanRead": "아센디오",
    "releaseYear": "2024",
    "album": "IVE SWITCH - EP",
    "lyricHint": "주문을 외워 Accendio / 마법처럼 변해",
    "trivia": "요술봉을 든 마법소녀 콘셉트와 중독성 있는 훅으로 팬들에게 폭발적인 지지를 받은 더블 타이틀곡입니다.",
    "itunesQuery": "IVE Accendio",
    "itunesTrackId": 1741071186,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/fe/fd/2b/fefd2be3-b963-37e2-1db6-5b648274fe75/mzaf_8434992173599027208.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/33/6d/b4/336db418-00ea-9570-1aa5-2541c07e582e/198391557965.jpg/600x600bb.jpg"
  },
  {
    "id": "ive-9",
    "category": "아이브",
    "artist": "아이브",
    "artistEn": "IVE",
    "artistAliases": [
      "아이브",
      "IVE"
    ],
    "title": "Kitsch",
    "titleEn": "Kitsch",
    "titleAliases": [
      "Kitsch",
      "키치"
    ],
    "koreanRead": "키치",
    "releaseYear": "2023",
    "album": "I've IVE",
    "lyricHint": "우리만의 자유로운 nineteen’s kitsch",
    "trivia": "우아한 보컬 도입부에서 강렬하고 힙한 후렴구로 반전되는 구성이 돋보이는 정규 1집 선공개 히트곡입니다.",
    "itunesQuery": "IVE Kitsch",
    "itunesTrackId": 1677260541,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/3c/e6/58/3ce6580c-e272-473e-7520-b7c2719dc7b6/mzaf_11480319542966989999.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/64/76/fd/6476fd99-c90f-93a3-3c80-bc8dd3652920/197188357023.jpg/600x600bb.jpg"
  },
  {
    "id": "ive-10",
    "category": "아이브",
    "artist": "아이브",
    "artistEn": "IVE",
    "artistAliases": [
      "아이브",
      "IVE"
    ],
    "title": "ATTITUDE",
    "titleEn": "ATTITUDE",
    "titleAliases": [
      "ATTITUDE",
      "애티튜드",
      "Attitude"
    ],
    "koreanRead": "애티튜드",
    "releaseYear": "2025",
    "album": "IVE EMPATHY",
    "lyricHint": "바꿀 수 없는 건 받아들여 즐겁게 / 내 태도는 내가 정해",
    "trivia": "수잔 베가의 <Tom’s Diner>를 샘플링해 중독적인 멜로디와 원영턴·폭주기니 안무로 화제를 모은 타이틀곡입니다.",
    "itunesQuery": "IVE ATTITUDE",
    "itunesTrackId": 1789741053,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/17/1d/64/171d649e-0790-4e09-2a73-4f8b2e44d3ed/mzaf_5296834646897207806.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/b5/b1/ca/b5b1cab8-4a78-cd58-eb6d-87945e20d84c/199066115046.jpg/600x600bb.jpg"
  },
  {
    "id": "ive-11",
    "category": "아이브",
    "artist": "아이브",
    "artistEn": "IVE",
    "artistAliases": [
      "아이브",
      "IVE"
    ],
    "title": "Off The Record",
    "titleEn": "Off The Record",
    "titleAliases": [
      "Off The Record",
      "오프 더 레코드",
      "오프더레코드"
    ],
    "koreanRead": "오프 더 레코드",
    "releaseYear": "2023",
    "album": "I'VE MINE - EP",
    "lyricHint": "늦은 밤 잠 못 드는 이 순간 / 아무도 모르게",
    "trivia": "그루비하고 몽환적인 이지리스닝 사운드로 심야 감성을 자극하는 아이브의 매력적인 타이틀곡입니다.",
    "itunesQuery": "IVE Off The Record",
    "itunesTrackId": 1709569468,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/b0/f7/f2/b0f7f249-ab08-ef1c-93dd-03fb74ae7462/mzaf_11263065537529760855.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/2e/a2/87/2ea2870f-9700-bb4e-df68-abd2acfb5fb9/197189809583.jpg/600x600bb.jpg"
  },
  {
    "id": "illit-1",
    "category": "아일릿",
    "artist": "아일릿",
    "artistEn": "ILLIT",
    "artistAliases": [
      "아일릿",
      "아이릿",
      "ILLIT"
    ],
    "title": "Magnetic",
    "titleEn": "Magnetic",
    "titleAliases": [
      "Magnetic",
      "마그네틱"
    ],
    "koreanRead": "마그네틱",
    "releaseYear": "2024",
    "album": "SUPER REAL ME - EP",
    "lyricHint": "Wait a minute, 이게 뭐지? / 내 심장이 lub-dub, 자꾸만 뛰어",
    "trivia": "데뷔곡 최초로 미국 빌보드 핫 100과 영국 오피셜 차트에 동시 진입하며 전 세계 숏폼을 강타한 메가 히트곡입니다.",
    "itunesQuery": "ILLIT Magnetic",
    "itunesTrackId": 1734500896,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/e8/7e/67/e87e6795-4ada-2f65-d562-1fd2a3eddfdf/mzaf_11263458879279601822.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/3e/49/1e/3e491e43-4961-21ab-2abe-37fb1c0feb40/196922879227_Cover.jpg/600x600bb.jpg"
  },
  {
    "id": "illit-2",
    "category": "아일릿",
    "artist": "아일릿",
    "artistEn": "ILLIT",
    "artistAliases": [
      "아일릿",
      "아이릿",
      "ILLIT"
    ],
    "title": "Cherish (My Love)",
    "titleEn": "Cherish (My Love)",
    "titleAliases": [
      "Cherish (My Love)",
      "Cherish",
      "My Love",
      "체리시",
      "체리쉬"
    ],
    "koreanRead": "체리시",
    "releaseYear": "2024",
    "album": "I'LL LIKE YOU - EP",
    "lyricHint": "Ch-ch-ch-ch-cherish my love / 너의 마음보다 내 마음이 더 중요해",
    "trivia": "사랑니 모티브와 당차고 엉뚱한 소녀들의 직진 고백을 담은 미니 2집 타이틀곡입니다.",
    "itunesQuery": "ILLIT Cherish My Love",
    "itunesTrackId": 1775992463,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/c1/77/e9/c177e96f-cb99-e02d-da46-3d66c2c937ab/mzaf_15117868021297341620.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/11/f4/ed/11f4ed06-8a08-2aae-740e-448409e7e089/198704217340_Cover.jpg/600x600bb.jpg"
  },
  {
    "id": "illit-3",
    "category": "아일릿",
    "artist": "아일릿",
    "artistEn": "ILLIT",
    "artistAliases": [
      "아일릿",
      "아이릿",
      "ILLIT"
    ],
    "title": "Lucky Girl Syndrome",
    "titleEn": "Lucky Girl Syndrome",
    "titleAliases": [
      "Lucky Girl Syndrome",
      "럭키걸신드롬",
      "럭키 걸 신드롬"
    ],
    "koreanRead": "럭키 걸 신드롬",
    "releaseYear": "2024",
    "album": "SUPER REAL ME - EP",
    "lyricHint": "Yeah, I'm a lucky girl / 내 모든 날이 행운인 걸",
    "trivia": "일상 속 소소한 순간들을 최고의 행운으로 여기는 긍정 에너지를 가득 담은 청량한 곡입니다.",
    "itunesQuery": "ILLIT Lucky Girl Syndrome",
    "itunesTrackId": 1734501146,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/22/b7/4e/22b74e6f-8297-bcef-7a97-042fd80fb10e/mzaf_10835128423678862503.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/3e/49/1e/3e491e43-4961-21ab-2abe-37fb1c0feb40/196922879227_Cover.jpg/600x600bb.jpg"
  },
  {
    "id": "illit-4",
    "category": "아일릿",
    "artist": "아일릿",
    "artistEn": "ILLIT",
    "artistAliases": [
      "아일릿",
      "아이릿",
      "ILLIT"
    ],
    "title": "Tick-Tack",
    "titleEn": "Tick-Tack",
    "titleAliases": [
      "Tick-Tack",
      "Tick Tack",
      "틱택"
    ],
    "koreanRead": "틱택",
    "releaseYear": "2024",
    "album": "I'LL LIKE YOU - EP",
    "lyricHint": "시계바늘처럼 째깍째깍 / 쉴 새 없이 바뀌는 내 마음",
    "trivia": "통통 튀는 8비트 게임 사운드와 중독적인 스캣 후렴구로 숏폼 챌린지 열풍을 일으킨 후속곡입니다.",
    "itunesQuery": "ILLIT Tick-Tack",
    "itunesTrackId": 1772790106,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/68/e9/78/68e978c1-6d32-713d-c91b-836669da6ee3/mzaf_14472264782207748518.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/e9/20/73/e9207332-1b22-18d0-5d1b-daaf370a4317/198704136962_Cover.jpg/600x600bb.jpg"
  },
  {
    "id": "illit-5",
    "category": "아일릿",
    "artist": "아일릿",
    "artistEn": "ILLIT",
    "artistAliases": [
      "아일릿",
      "아이릿",
      "ILLIT"
    ],
    "title": "Almond Chocolate",
    "titleEn": "Almond Chocolate",
    "titleAliases": [
      "Almond Chocolate",
      "아몬드 초콜릿",
      "아몬드초콜릿"
    ],
    "koreanRead": "아몬드 초콜릿",
    "releaseYear": "2025",
    "album": "Almond Chocolate - Single",
    "lyricHint": "달콤쌉싸름한 아몬드 초콜릿처럼 / 빠져드는 좋아하는 마음",
    "trivia": "2025년 발렌타인데이에 맞춰 공개되어 한·일 양국 차트에서 역주행 인기를 끈 달콤한 시즌송입니다.",
    "itunesQuery": "ILLIT Almond Chocolate",
    "itunesTrackId": 1793026654,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/d0/e0/91/d0e0914f-3aa1-8b38-dfef-023a23670356/mzaf_15196190014403368802.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/2b/be/38/2bbe3800-08d2-c340-af71-b828da918ba6/25UMGIM01018.rgb.jpg/600x600bb.jpg"
  },
  {
    "id": "illit-6",
    "category": "아일릿",
    "artist": "아일릿",
    "artistEn": "ILLIT",
    "artistAliases": [
      "아일릿",
      "아이릿",
      "ILLIT"
    ],
    "title": "I'll Like You",
    "titleEn": "I'll Like You",
    "titleAliases": [
      "I'll Like You",
      "Ill Like You",
      "아일 라이크 유",
      "아일라이크유"
    ],
    "koreanRead": "아일 라이크 유",
    "releaseYear": "2024",
    "album": "I'LL LIKE YOU - EP",
    "lyricHint": "너를 좋아하게 될 것 같아 / 설레는 첫인상",
    "trivia": "미니 2집 앨범의 포문을 여는 동명의 인트로 트랙으로 산뜻하고 경쾌한 사운드가 매력적입니다.",
    "itunesQuery": "ILLIT I'll Like You",
    "itunesTrackId": 1772790088,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/72/8f/35/728f3554-97c0-30e2-598a-535b12abad24/mzaf_16440370409239936151.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/e9/20/73/e9207332-1b22-18d0-5d1b-daaf370a4317/198704136962_Cover.jpg/600x600bb.jpg"
  },
  {
    "id": "illit-7",
    "category": "아일릿",
    "artist": "아일릿",
    "artistEn": "ILLIT",
    "artistAliases": [
      "아일릿",
      "아이릿",
      "ILLIT"
    ],
    "title": "Midnight Fiction",
    "titleEn": "Midnight Fiction",
    "titleAliases": [
      "Midnight Fiction",
      "미드나잇 픽션",
      "미드나잇픽션"
    ],
    "koreanRead": "미드나잇 픽션",
    "releaseYear": "2024",
    "album": "SUPER REAL ME - EP",
    "lyricHint": "새벽 세 시 잠들지 못하는 밤 / 나만의 상상의 나래",
    "trivia": "잠들기 전 끝없이 펼쳐지는 엉뚱한 상상을 로파이(Lo-Fi)하고 포근한 멜로디로 풀어낸 수록곡입니다.",
    "itunesQuery": "ILLIT Midnight Fiction",
    "itunesTrackId": 1734501142,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/98/ea/3d/98ea3d2a-d5f6-e50c-5e12-0a5f30cb3ef3/mzaf_6385319279090451769.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/3e/49/1e/3e491e43-4961-21ab-2abe-37fb1c0feb40/196922879227_Cover.jpg/600x600bb.jpg"
  },
  {
    "id": "aespa-1",
    "category": "에스파",
    "artist": "에스파",
    "artistEn": "aespa",
    "artistAliases": [
      "에스파",
      "aespa"
    ],
    "title": "Supernova",
    "titleEn": "Supernova",
    "titleAliases": [
      "Supernova",
      "슈퍼노바",
      "수퍼노바"
    ],
    "koreanRead": "슈퍼노바",
    "releaseYear": "2024",
    "album": "Armageddon - The 1st Album",
    "lyricHint": "Su-su-su-Supernova / 사건은 다가와 Ah Oh Ay",
    "trivia": "멜론 역대 최장기간 1위 기록을 경신하고 2024 올해의 노래를 석권한 에스파 최고의 히트곡입니다.",
    "itunesQuery": "aespa Supernova",
    "itunesTrackId": 1781140575,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/67/d4/61/67d46140-9db6-d19c-df63-05240aa7e18f/mzaf_15509769437025975878.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/07/7a/aa/077aaab2-d536-adc3-3e9b-297435c22ff8/00888735947483_Cover.jpg/600x600bb.jpg"
  },
  {
    "id": "aespa-2",
    "category": "에스파",
    "artist": "에스파",
    "artistEn": "aespa",
    "artistAliases": [
      "에스파",
      "aespa"
    ],
    "title": "Whiplash",
    "titleEn": "Whiplash",
    "titleAliases": [
      "Whiplash",
      "위플래시",
      "위플래쉬"
    ],
    "koreanRead": "위플래시",
    "releaseYear": "2024",
    "album": "Whiplash - The 5th Mini Album",
    "lyricHint": "One look give ’em Whiplash / Beat drop with a big flash",
    "trivia": "세련된 테크노 베이스라인과 뒷목을 잡는 포인트 안무로 일명 \"쇠맛\"의 정점을 찍은 곡입니다.",
    "itunesQuery": "aespa Whiplash",
    "itunesTrackId": 1772214981,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/7d/1b/a1/7d1ba15e-19fb-0411-e503-61e4379abd10/mzaf_16342830676435185944.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/d5/c1/f5/d5c1f505-f588-775f-df05-c672a8ec22e9/888735949562_Cover.jpg/600x600bb.jpg"
  },
  {
    "id": "aespa-3",
    "category": "에스파",
    "artist": "에스파",
    "artistEn": "aespa",
    "artistAliases": [
      "에스파",
      "aespa"
    ],
    "title": "Armageddon",
    "titleEn": "Armageddon",
    "titleAliases": [
      "Armageddon",
      "아마겟돈"
    ],
    "koreanRead": "아마겟돈",
    "releaseYear": "2024",
    "album": "Armageddon - The 1st Album",
    "lyricHint": "I’ma get ’em / Shoot! Oh my gosh, don’t you know I’m a...",
    "trivia": "묵직한 올드스쿨 힙합 사운드와 거친 음색이 어우러진 정규 1집 더블 타이틀곡입니다.",
    "itunesQuery": "aespa Armageddon",
    "itunesTrackId": 1773694547,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/84/34/f0/8434f0e6-0d39-0340-030a-0168bba3825b/mzaf_7352837177102038356.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/50/7e/e0/507ee09f-ccfd-1e3c-af90-ca5e92b1221b/00888735949869_Cover.jpg/600x600bb.jpg"
  },
  {
    "id": "aespa-4",
    "category": "에스파",
    "artist": "에스파",
    "artistEn": "aespa",
    "artistAliases": [
      "에스파",
      "aespa"
    ],
    "title": "Next Level",
    "titleEn": "Next Level",
    "titleAliases": [
      "Next Level",
      "넥스트 레벨",
      "넥스트레벨"
    ],
    "koreanRead": "넥스트 레벨",
    "releaseYear": "2021",
    "album": "Next Level - Single",
    "lyricHint": "I’m on the Next Level Yeah / 절대로 뒤를 돌아보지 말아",
    "trivia": "전 국민에게 디귿(ㄷ)자 팔 안무 열풍을 일으키며 에스파의 독보적인 세계관을 각인시킨 메가 히트곡입니다.",
    "itunesQuery": "aespa Next Level",
    "itunesTrackId": 1567326688,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/43/1e/0a/431e0a24-2c04-e738-2632-87462a20984d/mzaf_3158159453623406671.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/60/8d/ac/608dacc2-d6d6-462d-26f0-d693e4364751/artwork.jpg/600x600bb.jpg"
  },
  {
    "id": "aespa-5",
    "category": "에스파",
    "artist": "에스파",
    "artistEn": "aespa",
    "artistAliases": [
      "에스파",
      "aespa"
    ],
    "title": "Drama",
    "titleEn": "Drama",
    "titleAliases": [
      "Drama",
      "드라마"
    ],
    "koreanRead": "드라마",
    "releaseYear": "2023",
    "album": "Drama - The 4th Mini Album",
    "lyricHint": "I bring, I bring all the Drama-ma-ma-ma / With my girls in the back",
    "trivia": "어택감 있는 드럼 소스와 중독성 강한 \"Drama-ma-ma-ma\" 훅이 인상적인 미니 4집 타이틀곡입니다.",
    "itunesQuery": "aespa Drama",
    "itunesTrackId": 1715939931,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/1f/dc/9b/1fdc9b25-04dd-515c-b5da-8dc132ed39b6/mzaf_5682330302212897053.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/f7/f0/5c/f7f05ce4-e5a4-900d-e087-1dd9668b2b34/888735945939.jpg/600x600bb.jpg"
  },
  {
    "id": "aespa-6",
    "category": "에스파",
    "artist": "에스파",
    "artistEn": "aespa",
    "artistAliases": [
      "에스파",
      "aespa"
    ],
    "title": "Spicy",
    "titleEn": "Spicy",
    "titleAliases": [
      "Spicy",
      "스파이시"
    ],
    "koreanRead": "스파이시",
    "releaseYear": "2023",
    "album": "MY WORLD - The 3rd Mini Album",
    "lyricHint": "Cuz I’m too Spicy for your heart / Ring the fire alarm",
    "trivia": "광야에서 현실 세계(리얼 월드)로 돌아온 에스파의 하이틴 에너지와 서머 퀸 매력을 터뜨린 곡입니다.",
    "itunesQuery": "aespa Spicy",
    "itunesTrackId": 1685400184,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/d1/c1/14/d1c11426-0640-3175-6150-d5a3624215bb/mzaf_10974603736747457612.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/af/2c/6d/af2c6d62-0ebc-2dff-17b3-8eeb2b3986a0/888735943621.jpg/600x600bb.jpg"
  },
  {
    "id": "aespa-7",
    "category": "에스파",
    "artist": "에스파",
    "artistEn": "aespa",
    "artistAliases": [
      "에스파",
      "aespa"
    ],
    "title": "Savage",
    "titleEn": "Savage",
    "titleAliases": [
      "Savage",
      "새비지"
    ],
    "koreanRead": "새비지",
    "releaseYear": "2021",
    "album": "Savage - The 1st Mini Album",
    "lyricHint": "Oh my gosh! Don’t you know I’m a Savage? / 김밥처럼 말아",
    "trivia": "강렬한 트랩 비트와 \"Gimme gimme now, 트집 잡지 마\" 파트로 큰 화제를 모은 첫 미니앨범 타이틀곡입니다.",
    "itunesQuery": "aespa Savage",
    "itunesTrackId": 1587844525,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/a4/a7/dd/a4a7dd1e-f863-9859-c7bc-b187878851e3/mzaf_12453525985007448400.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/51/f7/85/51f7852b-7602-136b-ac15-8b3878260c64/4000aespa_M01_Savage_DC.jpg/600x600bb.jpg"
  },
  {
    "id": "aespa-8",
    "category": "에스파",
    "artist": "에스파",
    "artistEn": "aespa",
    "artistAliases": [
      "에스파",
      "aespa"
    ],
    "title": "Black Mamba",
    "titleEn": "Black Mamba",
    "titleAliases": [
      "Black Mamba",
      "블랙 맘바",
      "블랙맘바"
    ],
    "koreanRead": "블랙 맘바",
    "releaseYear": "2020",
    "album": "Black Mamba - Single",
    "lyricHint": "넌 광야를 떠돌고 있어 / 나의 아바타를 삼킨 Black Mamba",
    "trivia": "강렬한 신스 사운드와 바닥에 내려앉는 파격적인 후렴구 안무로 데뷔부터 강렬한 인상을 남긴 데뷔곡입니다.",
    "itunesQuery": "aespa Black Mamba",
    "itunesTrackId": 1540251305,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/33/3c/36/333c3649-365d-8eee-ed97-bd1727d6f9f6/mzaf_1246960292291494891.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/1f/53/e2/1f53e291-df44-bb66-1c29-6e74c2b0eab0/aespa_BlackMamba_final.png/600x600bb.jpg"
  },
  {
    "id": "aespa-9",
    "category": "에스파",
    "artist": "에스파",
    "artistEn": "aespa",
    "artistAliases": [
      "에스파",
      "aespa"
    ],
    "title": "Dreams Come True",
    "titleEn": "Dreams Come True",
    "titleAliases": [
      "Dreams Come True",
      "드림스 컴 트루",
      "드림스컴트루"
    ],
    "koreanRead": "드림스 컴 트루",
    "releaseYear": "2021",
    "album": "Dreams Come True - SM STATION",
    "lyricHint": "내가 원하는 대로 자신 있는 모습 그대로 / 이제껏 숨겨왔던 비밀을",
    "trivia": "원조 요정 S.E.S.의 1998년 명곡을 보아(BoA)의 프로듀싱 아래 에스파만의 영(Young)한 에너지로 리메이크한 곡입니다.",
    "itunesQuery": "aespa Dreams Come True",
    "itunesTrackId": 1600008461,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/0a/bd/4c/0abd4cc4-1fc6-fada-36a7-be29cebe990f/mzaf_14505502218539213698.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/70/d7/4a/70d74a73-cb0e-eb09-4662-c2bdc7eb723a/dj.oabkpkud.jpg/600x600bb.jpg"
  },
  {
    "id": "aespa-10",
    "category": "에스파",
    "artist": "에스파",
    "artistEn": "aespa (KARINA)",
    "artistAliases": [
      "에스파",
      "aespa",
      "카리나",
      "KARINA"
    ],
    "title": "UP (KARINA Solo)",
    "titleEn": "UP (KARINA Solo)",
    "titleAliases": [
      "UP (KARINA Solo)",
      "UP",
      "업",
      "카리나 UP"
    ],
    "koreanRead": "업",
    "releaseYear": "2024",
    "album": "SYNK : PARALLEL LINE - Special Digital Single",
    "lyricHint": "Pump it up, pump it up / 절대 멈추지 않아 위로",
    "trivia": "콘서트 솔로 무대 공개 직후 폭발적인 반응에 힘입어 정식 음원 발매와 동시에 음원 차트 1위를 달성한 카리나의 솔로곡입니다.",
    "itunesQuery": "aespa UP KARINA",
    "itunesTrackId": 1772223475,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/2f/04/f4/2f04f477-519c-10cb-5ae6-4c8663b8a661/mzaf_12558426005192511902.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/fd/85/0e/fd850e67-f6e2-c4e9-6ea5-501ca5afccbd/aespa_DS_Synk-PARALLEL_LINE_DC.jpg/600x600bb.jpg"
  },
  {
    "id": "akmu-1",
    "category": "악뮤",
    "artist": "악뮤",
    "artistEn": "AKMU",
    "artistAliases": [
      "악뮤",
      "악동뮤지션",
      "AKMU"
    ],
    "title": "어떻게 이별까지 사랑하겠어, 널 사랑하는 거지",
    "titleEn": "How can I love the heartbreak, you're the one I love",
    "titleAliases": [
      "어떻게 이별까지 사랑하겠어, 널 사랑하는 거지",
      "어떻게 이별까지 사랑하겠어 널 사랑하는 거지",
      "어떻게 이별까지 사랑하겠어",
      "어사널사"
    ],
    "koreanRead": "어떻게 이별까지 사랑하겠어 널 사랑하는 거지",
    "releaseYear": "2019",
    "album": "항해 (SAILING)",
    "lyricHint": "어떻게 내가 어떻게 너를 / 이후에 우리 바다처럼 깊은 사랑이 다 마를 때까지",
    "trivia": "이찬혁의 시적인 가사와 이수현의 애절한 보컬이 만나 지금까지도 차트 상위권을 지키는 대한민국 대표 이별 발라드입니다.",
    "itunesQuery": "AKMU 어떻게 이별까지 사랑하겠어",
    "itunesTrackId": 1480802550,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/14/16/55/1416558a-2bc2-a6a3-6943-cbb7bb61709d/mzaf_5601978480163855394.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/e4/a2/80/e4a28015-490b-255a-ff26-aadd6257cfa1/AKMU_DS.jpg/600x600bb.jpg"
  },
  {
    "id": "akmu-2",
    "category": "악뮤",
    "artist": "악뮤",
    "artistEn": "AKMU",
    "artistAliases": [
      "악뮤",
      "악동뮤지션",
      "AKMU"
    ],
    "title": "후라이의 꿈",
    "titleEn": "Fry's Dream",
    "titleAliases": [
      "후라이의 꿈",
      "후라이의꿈",
      "Fry's Dream"
    ],
    "koreanRead": "후라이의 꿈",
    "releaseYear": "2023",
    "album": "Love Lee - Single",
    "lyricHint": "틀에 갇힌 듯한 똑같은 모양 대신 / 넓게 퍼지는 계란 후라이처럼",
    "trivia": "2014년 콘서트에서 선보인 미발매곡이 9년 만에 정식 음원으로 발매되어 큰 사랑을 받은 재치 만점 힐링곡입니다.",
    "itunesQuery": "AKMU Fry Dream",
    "itunesTrackId": 1702810043,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/05/5f/72/055f725b-623b-073e-cadb-04c88eea2f3e/mzaf_4121315245673499980.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/7f/ca/13/7fca1315-9134-7937-b159-367bbed08dfa/AKMU_LoveLee_Cover_4000x4000.jpg/600x600bb.jpg"
  },
  {
    "id": "akmu-3",
    "category": "악뮤",
    "artist": "악뮤",
    "artistEn": "AKMU",
    "artistAliases": [
      "악뮤",
      "악동뮤지션",
      "AKMU"
    ],
    "title": "Love Lee",
    "titleEn": "Love Lee",
    "titleAliases": [
      "Love Lee",
      "러브리",
      "러브 리"
    ],
    "koreanRead": "러브 리",
    "releaseYear": "2023",
    "album": "Love Lee - Single",
    "lyricHint": "You know 내 스타일이 아닌 음악을 들어도 / 너만 좋다면야 Lovely",
    "trivia": "초기 악동뮤지션 특유의 통통 튀고 사랑스러운 어쿠스틱 팝 감성으로 돌아와 차트 1위를 차지한 곡입니다.",
    "itunesQuery": "AKMU Love Lee",
    "itunesTrackId": 1702810042,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/75/42/8e/75428efd-bf7c-922a-253a-dcc9f812eddc/mzaf_9614853286254962096.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/7f/ca/13/7fca1315-9134-7937-b159-367bbed08dfa/AKMU_LoveLee_Cover_4000x4000.jpg/600x600bb.jpg"
  },
  {
    "id": "akmu-4",
    "category": "악뮤",
    "artist": "악뮤",
    "artistEn": "AKMU",
    "artistAliases": [
      "악뮤",
      "악동뮤지션",
      "AKMU"
    ],
    "title": "오랜 날 오랜 밤",
    "titleEn": "Last Goodbye",
    "titleAliases": [
      "오랜 날 오랜 밤",
      "오랜날오랜밤",
      "Last Goodbye"
    ],
    "koreanRead": "오랜 날 오랜 밤",
    "releaseYear": "2017",
    "album": "사춘기 하 (WINTER)",
    "lyricHint": "별 하나 있고 너 하나 있는 그곳이 내 오랜 밤이었어 / 사랑해란 말이 머뭇거려도",
    "trivia": "어쿠스틱 기타 선율 위로 남매의 따뜻한 화음이 포개어지는 겨울 감성 명곡입니다.",
    "itunesQuery": "AKMU Last Goodbye",
    "itunesTrackId": 1191276302,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/7f/51/db/7f51db96-6e84-a63c-4865-48605a160d46/mzaf_13147174409622642656.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/9a/fa/45/9afa45ec-7823-7e58-5580-27c01cdd709d/akmu_cover.jpg/600x600bb.jpg"
  },
  {
    "id": "akmu-5",
    "category": "악뮤",
    "artist": "악뮤",
    "artistEn": "AKMU",
    "artistAliases": [
      "악뮤",
      "악동뮤지션",
      "AKMU"
    ],
    "title": "200%",
    "titleEn": "200%",
    "titleAliases": [
      "200%",
      "이백퍼센트",
      "200퍼센트"
    ],
    "koreanRead": "이백퍼센트",
    "releaseYear": "2014",
    "album": "PLAY",
    "lyricHint": "나를 봐 나를 봐 나를 봐 / 이제 그만 다른 곳은 보지 말고",
    "trivia": "데뷔 정규 앨범 <PLAY>의 타이틀곡으로, 짝사랑의 설렘을 경쾌한 리듬과 유쾌한 가사로 담아낸 메가 히트곡입니다.",
    "itunesQuery": "AKMU 200%",
    "itunesTrackId": 1316852697,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/1d/12/c4/1d12c466-7b73-798d-1736-cbbacb6dd4c5/mzaf_10270323767760593308.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/0d/fc/aa/0dfcaa7f-c686-e945-85e1-73aece780869/AKMU-PLAY_DS_cover.jpg/600x600bb.jpg"
  },
  {
    "id": "akmu-6",
    "category": "악뮤",
    "artist": "악뮤",
    "artistEn": "AKMU",
    "artistAliases": [
      "악뮤",
      "악동뮤지션",
      "AKMU"
    ],
    "title": "DINOSAUR",
    "titleEn": "DINOSAUR",
    "titleAliases": [
      "DINOSAUR",
      "다이노소어",
      "공룡"
    ],
    "koreanRead": "다이노소어",
    "releaseYear": "2017",
    "album": "SUMMER EPISODE",
    "lyricHint": "내 어릴 적 꿈에 나타난 / 거대한 공룡과 맞서 소리를 질러",
    "trivia": "어린 시절 악몽 속 두려움을 공룡에 비유한 일렉트로닉 팝 트랙으로, 이수현의 청량한 돌고래 고음이 빛나는 여름 대표곡입니다.",
    "itunesQuery": "AKMU DINOSAUR",
    "itunesTrackId": 1261291986,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/d4/4e/ca/d44eca9f-0a29-dbb9-5e90-ee7c248379db/mzaf_14361741256570688489.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/30/90/16/3090163e-ab9e-d944-8dca-c8038b36fd1b/akmu_cover_4000.jpg/600x600bb.jpg"
  },
  {
    "id": "akmu-7",
    "category": "악뮤",
    "artist": "악뮤",
    "artistEn": "AKMU",
    "artistAliases": [
      "악뮤",
      "악동뮤지션",
      "AKMU"
    ],
    "title": "낙하",
    "titleEn": "NAKKA (with IU)",
    "titleAliases": [
      "낙하",
      "낙하 (with 아이유)",
      "NAKKA"
    ],
    "koreanRead": "낙하",
    "releaseYear": "2021",
    "album": "NEXT EPISODE",
    "lyricHint": "말했잖아 언젠가 이런 날이 온다면 / 난 너를 혼자 두지 않겠다고",
    "trivia": "아이유가 피처링으로 참여해 추락이 아닌 구원과 동행의 메시지를 레트로 신스팝으로 풀어낸 히트곡입니다.",
    "itunesQuery": "AKMU NAKKA IU",
    "itunesTrackId": 1577524107,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/86/4d/a5/864da591-eeb0-27db-bbfa-a190ee20a05c/mzaf_17780542814473670833.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/12/31/63/12316366-55bb-065c-8ad9-47e107fa79b2/AKMU_NEXT_EPISODE.jpg/600x600bb.jpg"
  },
  {
    "id": "akmu-8",
    "category": "악뮤",
    "artist": "악뮤",
    "artistEn": "AKMU",
    "artistAliases": [
      "악뮤",
      "악동뮤지션",
      "AKMU"
    ],
    "title": "Give Love",
    "titleEn": "Give Love",
    "titleAliases": [
      "Give Love",
      "기브 러브",
      "기브러브"
    ],
    "koreanRead": "기브 러브",
    "releaseYear": "2014",
    "album": "PLAY",
    "lyricHint": "Give Love 사랑을 좀 주세요 /Give Love 사랑이 모자라요",
    "trivia": "스마트폰 게임의 하트(생명)에서 영감을 받아 만든 곡으로, 봄마다 생각나는 발랄한 리듬이 매력적입니다.",
    "itunesQuery": "AKMU Give Love",
    "itunesTrackId": 1316852696,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/ce/34/29/ce34295d-3074-fa83-d2a4-4c212578e5b9/mzaf_14918361723007185781.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/0d/fc/aa/0dfcaa7f-c686-e945-85e1-73aece780869/AKMU-PLAY_DS_cover.jpg/600x600bb.jpg"
  },
  {
    "id": "akmu-9",
    "category": "악뮤",
    "artist": "악뮤",
    "artistEn": "AKMU",
    "artistAliases": [
      "악뮤",
      "악동뮤지션",
      "AKMU"
    ],
    "title": "Hero",
    "titleEn": "Hero",
    "titleAliases": [
      "Hero",
      "히어로"
    ],
    "koreanRead": "히어로",
    "releaseYear": "2024",
    "album": "LOVE EPISODE",
    "lyricHint": "세상을 구하는 영웅이 아니어도 / 오직 너만을 위한 히어로",
    "trivia": "2024년 미니 3집 <LOVE EPISODE>의 타이틀곡으로, 동화 같은 분위기와 담백한 사랑 고백이 담긴 곡입니다.",
    "itunesQuery": "AKMU Hero",
    "itunesTrackId": 1748970668,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/61/0c/d1/610cd14d-4433-85a8-6261-af433f35cba6/mzaf_10632502631826123654.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/ad/88/53/ad88535c-6f99-cd29-2492-56be613ecadd/AKMU_-COVER_4000x4000.jpg/600x600bb.jpg"
  },
  {
    "id": "idol-1",
    "category": "인기 아이돌",
    "artist": "뉴진스",
    "artistEn": "NewJeans",
    "artistAliases": [
      "뉴진스",
      "NewJeans"
    ],
    "title": "Hype Boy",
    "titleEn": "Hype Boy",
    "titleAliases": [
      "Hype Boy",
      "하입 보이",
      "하입보이"
    ],
    "koreanRead": "하입 보이",
    "releaseYear": "2022",
    "album": "NewJeans 1st EP 'New Jeans'",
    "lyricHint": "'Cause I know what you like boy / You're my chemical hype boy",
    "trivia": "\"뉴진스의 하입보이요\" 밈과 함께 대한민국을 강타한 뭄바톤·일렉트로 팝 명곡입니다.",
    "itunesQuery": "NewJeans Hype Boy",
    "itunesTrackId": 1635469851,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/85/f3/08/85f30899-e93c-35e2-4742-df57fc2d3552/mzaf_14134842621180071043.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/4e/64/34/4e64344b-3ac6-c503-2c41-257a15401416/192641873096_Cover.jpg/600x600bb.jpg"
  },
  {
    "id": "idol-2",
    "category": "인기 아이돌",
    "artist": "뉴진스",
    "artistEn": "NewJeans",
    "artistAliases": [
      "뉴진스",
      "NewJeans"
    ],
    "title": "Ditto",
    "titleEn": "Ditto",
    "titleAliases": [
      "Ditto",
      "디토"
    ],
    "koreanRead": "디토",
    "releaseYear": "2022",
    "album": "OMG - Single",
    "lyricHint": "Stay in the middle / Like you a little, don’t want no riddle",
    "trivia": "포근하고 아련한 볼티모어 클럽 리듬과 캠코더 감성으로 겨울 대표 캐럴처럼 자리 잡은 곡입니다.",
    "itunesQuery": "NewJeans Ditto",
    "itunesTrackId": 1657231962,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/85/72/66/8572665a-d35f-ce5d-43c5-9ae4b69b4b46/mzaf_2317272666428796662.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/f6/29/42/f629426e-92fe-535c-cbe4-76e70850819b/196922287107_Cover.jpg/600x600bb.jpg"
  },
  {
    "id": "idol-3",
    "category": "인기 아이돌",
    "artist": "뉴진스",
    "artistEn": "NewJeans",
    "artistAliases": [
      "뉴진스",
      "NewJeans"
    ],
    "title": "Super Shy",
    "titleEn": "Super Shy",
    "titleAliases": [
      "Super Shy",
      "슈퍼 샤이",
      "슈퍼샤이"
    ],
    "koreanRead": "슈퍼 샤이",
    "releaseYear": "2023",
    "album": "NewJeans 2nd EP 'Get Up'",
    "lyricHint": "I'm super shy, super shy / But wait a minute while I make you mine",
    "trivia": "경쾌한 저지 클럽 리듬과 왁킹 플래시몹 안무로 글로벌 차트를 휩쓴 서머 히트곡입니다.",
    "itunesQuery": "NewJeans Super Shy",
    "itunesTrackId": 1695951897,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/bb/79/f3/bb79f38e-575d-5d68-a765-7160f27dc198/mzaf_7070253468473867952.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/d3/4b/7e/d34b7e1e-af3b-43b6-2949-7a8c652a1bc9/196922462726_Cover.jpg/600x600bb.jpg"
  },
  {
    "id": "idol-4",
    "category": "인기 아이돌",
    "artist": "뉴진스",
    "artistEn": "NewJeans",
    "artistAliases": [
      "뉴진스",
      "NewJeans"
    ],
    "title": "How Sweet",
    "titleEn": "How Sweet",
    "titleAliases": [
      "How Sweet",
      "하우 스윗",
      "하우스윗"
    ],
    "koreanRead": "하우 스윗",
    "releaseYear": "2024",
    "album": "How Sweet - EP",
    "lyricHint": "Don't you know how sweet it tastes? / 사과처럼 달콤한 해방감",
    "trivia": "마이애미 베이스 기반의 통통 튀는 일렉트로 사운드와 힙한 올드스쿨 바이브가 매력적인 곡입니다.",
    "itunesQuery": "NewJeans How Sweet",
    "itunesTrackId": 1744448416,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/4d/f8/ec/4df8ec06-579b-0b92-1c4d-d8714cc5d1bc/mzaf_8361635933595309894.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/bf/68/ca/bf68ca64-4acd-543f-bc78-455f11f06105/196922889738_Cover.jpg/600x600bb.jpg"
  },
  {
    "id": "idol-5",
    "category": "르세라핌",
    "artist": "르세라핌",
    "artistEn": "LE SSERAFIM",
    "artistAliases": [
      "르세라핌",
      "LE SSERAFIM",
      "LESSERAFIM"
    ],
    "title": "Perfect Night",
    "titleEn": "Perfect Night",
    "titleAliases": [
      "Perfect Night",
      "퍼펙트 나이트",
      "퍼펙트나이트"
    ],
    "koreanRead": "퍼펙트 나이트",
    "releaseYear": "2023",
    "album": "Perfect Night - Single",
    "lyricHint": "Tonight, I don’t care what’s wrong or right / 친구들과 함께라면 완벽한 밤",
    "trivia": "오버워치 2 컬래버레이션 영어 싱글로 발매되어 국내 음원 차트 1위 장기 집권에 성공한 곡입니다.",
    "itunesQuery": "LE SSERAFIM Perfect Night",
    "itunesTrackId": 1712731159,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/bc/f7/7f/bcf77f57-ea7e-e483-aa46-6cb919eee7e5/mzaf_16548890274351085831.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/a0/cd/40/a0cd4013-89cf-0554-0aa5-1ac5a0bb3db1/196922680779_Cover.jpg/600x600bb.jpg"
  },
  {
    "id": "idol-6",
    "category": "르세라핌",
    "artist": "르세라핌",
    "artistEn": "LE SSERAFIM",
    "artistAliases": [
      "르세라핌",
      "LE SSERAFIM",
      "LESSERAFIM"
    ],
    "title": "CRAZY",
    "titleEn": "CRAZY",
    "titleAliases": [
      "CRAZY",
      "크레이지"
    ],
    "koreanRead": "크레이지",
    "releaseYear": "2024",
    "album": "CRAZY - EP",
    "lyricHint": "Act like an angel and dress like crazy / All the girls are girling, girling",
    "trivia": "EDM 기반의 하우스 비트와 보깅(Voguing) 퍼포먼스로 빌보드 핫 100에 2주 연속 차트인한 곡입니다.",
    "itunesQuery": "LE SSERAFIM CRAZY",
    "itunesTrackId": 1763658321,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/46/0b/ae/460bae7f-536e-9df1-8aa4-ef1ed6d3b314/mzaf_17541894071969246196.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/38/95/ed/3895ed80-ba5b-7846-ce5b-b49805a818ef/198704101359_Cover.jpg/600x600bb.jpg"
  },
  {
    "id": "idol-7",
    "category": "르세라핌",
    "artist": "르세라핌",
    "artistEn": "LE SSERAFIM",
    "artistAliases": [
      "르세라핌",
      "LE SSERAFIM",
      "LESSERAFIM"
    ],
    "title": "Smart",
    "titleEn": "Smart",
    "titleAliases": [
      "Smart",
      "스마트"
    ],
    "koreanRead": "스마트",
    "releaseYear": "2024",
    "album": "EASY - EP",
    "lyricHint": "I’m a smarter baby, smarter / 계획대로 되어가지",
    "trivia": "아마피아노(Amapiano) 리듬의 골반 그루브 안무로 타이틀곡 못지않은 폭발적인 인기를 얻은 수록곡입니다.",
    "itunesQuery": "LE SSERAFIM Smart",
    "itunesTrackId": 1728928913,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/d3/29/d4/d329d495-f621-3dc9-8330-456cc2879b0a/mzaf_2324066985438057196.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/22/0f/fd/220ffdbf-152c-5b65-d5af-01256c1328c2/196922796531_Cover.jpg/600x600bb.jpg"
  },
  {
    "id": "idol-8",
    "category": "인기 아이돌",
    "artist": "투어스",
    "artistEn": "TWS",
    "artistAliases": [
      "투어스",
      "TWS"
    ],
    "title": "첫 만남은 계획대로 되지 않아",
    "titleEn": "plot twist",
    "titleAliases": [
      "첫 만남은 계획대로 되지 않아",
      "첫만남은 계획대로 되지 않아",
      "첫만남",
      "plot twist"
    ],
    "koreanRead": "첫 만남은 계획대로 되지 않아",
    "releaseYear": "2024",
    "album": "Sparkling Blue - EP",
    "lyricHint": "첫 만남은 너무 어려워 / 계획대로 되는 게 없어서",
    "trivia": "2024년 멜론 연간 차트 1위를 차지하며 보이그룹 청량 신드롬을 일으킨 투어스의 데뷔곡입니다.",
    "itunesQuery": "TWS plot twist",
    "itunesTrackId": 1723932648,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/ac/8d/97/ac8d9717-2bbf-b1bf-b2e9-476feea6a480/mzaf_11615065500455071115.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/17/bb/d4/17bbd45f-fee7-a9dd-ff01-e7b174cc1462/196922759543_Cover.jpg/600x600bb.jpg"
  },
  {
    "id": "idol-9",
    "category": "인기 아이돌",
    "artist": "라이즈",
    "artistEn": "RIIZE",
    "artistAliases": [
      "라이즈",
      "RIIZE"
    ],
    "title": "Get A Guitar",
    "titleEn": "Get A Guitar",
    "titleAliases": [
      "Get A Guitar",
      "겟 어 기타",
      "겟어기타"
    ],
    "koreanRead": "겟 어 기타",
    "releaseYear": "2023",
    "album": "Get A Guitar - Single",
    "lyricHint": "Get, get, get, get a guitar / 리듬에 맞춰 발을 굴러",
    "trivia": "펑키한 레트로 기타 리프와 함께 이모셔널 팝(Emotional Pop) 장르를 선언한 라이즈의 데뷔곡입니다.",
    "itunesQuery": "RIIZE Get A Guitar",
    "itunesTrackId": 1715939316,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/d0/7e/99/d07e99d2-ee05-19b4-9d41-48e596cbd1bd/mzaf_11553314001417296216.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/00/06/8a/00068a27-d5f9-f7a3-c593-d564a8c0e709/888735944703.jpg/600x600bb.jpg"
  },
  {
    "id": "idol-10",
    "category": "인기 아이돌",
    "artist": "라이즈",
    "artistEn": "RIIZE",
    "artistAliases": [
      "라이즈",
      "RIIZE"
    ],
    "title": "Love 119",
    "titleEn": "Love 119",
    "titleAliases": [
      "Love 119",
      "러브 119",
      "러브119"
    ],
    "koreanRead": "러브 일일구",
    "releaseYear": "2024",
    "album": "Love 119 - Single",
    "lyricHint": "1-1-9, 1-1-9 Save my life, save my life / 응급실에 실려 갈 것 같은 첫사랑",
    "trivia": "밴드 izi의 명곡 <응급실>을 샘플링하여 아련한 겨울 감성과 힙합 비트를 조화시킨 히트곡입니다.",
    "itunesQuery": "RIIZE Love 119",
    "itunesTrackId": 1721420402,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/f2/f8/f7/f2f8f778-a22e-c229-6e25-7293a90ebd13/mzaf_4806842134580834593.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/75/ac/40/75ac4000-8db6-fa1d-e825-f5799959fc5a/196871708128.jpg/600x600bb.jpg"
  },
  {
    "id": "idol-11",
    "category": "인기 아이돌",
    "artist": "라이즈",
    "artistEn": "RIIZE",
    "artistAliases": [
      "라이즈",
      "RIIZE"
    ],
    "title": "Boom Boom Bass",
    "titleEn": "Boom Boom Bass",
    "titleAliases": [
      "Boom Boom Bass",
      "붐 붐 베이스",
      "붐붐베이스"
    ],
    "koreanRead": "붐 붐 베이스",
    "releaseYear": "2024",
    "album": "RIIZING - The 1st Mini Album",
    "lyricHint": "심장 끝까지 울리는 Boom Boom Bass / 베이스 라인을 따라",
    "trivia": "경쾌하고 두근거리는 슬랩 베이스 연주가 곡 전체를 이끌어가는 미니 1집 타이틀곡입니다.",
    "itunesQuery": "RIIZE Boom Boom Bass",
    "itunesTrackId": 1749589154,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/01/e2/06/01e20685-e5ca-adea-3e2f-e6f398d621f9/mzaf_16034371568655553441.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/25/3d/5d/253d5dd8-95fe-4d8d-20bc-969854a3bc9b/888735948015.jpg/600x600bb.jpg"
  },
  {
    "id": "idol-12",
    "category": "인기 아이돌",
    "artist": "키스오브라이프",
    "artistEn": "KISS OF LIFE",
    "artistAliases": [
      "키스오브라이프",
      "키오프",
      "KISS OF LIFE",
      "KIOF"
    ],
    "title": "Sticky",
    "titleEn": "Sticky",
    "titleAliases": [
      "Sticky",
      "스티키"
    ],
    "koreanRead": "스티키",
    "releaseYear": "2024",
    "album": "Sticky - Single",
    "lyricHint": "How long before we fall in love? / 여름밤 공기가 끈적하게 감겨와",
    "trivia": "청량한 아프로비트 리듬과 탄탄한 라이브 실력으로 2024년 여름 차트를 뜨겁게 달군 대표 서머송입니다.",
    "itunesQuery": "KISS OF LIFE Sticky",
    "itunesTrackId": 1753900853,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/46/18/9f/46189f37-d2a0-d9f9-163a-5770c8677ad6/mzaf_6146227575934427595.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/9b/00/c7/9b00c7e0-2e78-af06-bcfe-89d7a00e5a6d/cover_KM0019987_1.jpg/600x600bb.jpg"
  },
  {
    "id": "idol-13",
    "category": "인기 아이돌",
    "artist": "키스오브라이프",
    "artistEn": "KISS OF LIFE",
    "artistAliases": [
      "키스오브라이프",
      "키오프",
      "KISS OF LIFE",
      "KIOF"
    ],
    "title": "Igloo",
    "titleEn": "Igloo",
    "titleAliases": [
      "Igloo",
      "이글루"
    ],
    "koreanRead": "이글루",
    "releaseYear": "2024",
    "album": "Lose Yourself - EP",
    "lyricHint": "Imma melt your igloo / 선글라스를 쓰고 쿨하게 걸어",
    "trivia": "미니멀한 힙합 비트와 시크한 선글라스 안무로 수록곡임에도 차트 최상위권에 오른 화제곡입니다.",
    "itunesQuery": "KISS OF LIFE Igloo",
    "itunesTrackId": 1773345357,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/50/54/92/5054924b-e57d-eb22-ff9d-5549d67e7c62/mzaf_4552197013183434371.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/dd/70/86/dd70863e-2571-25cd-d1eb-c44a5cdba57f/cover_KM0020274_1.jpg/600x600bb.jpg"
  },
  {
    "id": "idol-14",
    "category": "인기 아이돌",
    "artist": "세븐틴",
    "artistEn": "SEVENTEEN",
    "artistAliases": [
      "세븐틴",
      "SEVENTEEN",
      "SVT"
    ],
    "title": "손오공",
    "titleEn": "Super",
    "titleAliases": [
      "손오공",
      "Super",
      "슈퍼"
    ],
    "koreanRead": "손오공",
    "releaseYear": "2023",
    "album": "SEVENTEEN 10th Mini Album ‘FML’",
    "lyricHint": "땅을 보고 계속 올랐지 정상까지 / 마하까지 발을 굴러 굴러",
    "trivia": "메가 크루와 함께한 압도적인 칼군무와 에너제틱한 사운드로 세븐틴의 커리어 하이를 이끈 대표곡입니다.",
    "itunesQuery": "SEVENTEEN Super",
    "itunesTrackId": 1681324047,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/76/9c/dd/769cdd57-1dc9-aff1-8af2-de134b7e0498/mzaf_9327909714451142276.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/d1/66/eb/d166eb7e-7210-b3ff-be39-638cd37bfc89/196922401282_Cover.jpg/600x600bb.jpg"
  },
  {
    "id": "idol-15",
    "category": "인기 아이돌",
    "artist": "세븐틴",
    "artistEn": "SEVENTEEN",
    "artistAliases": [
      "세븐틴",
      "SEVENTEEN",
      "SVT"
    ],
    "title": "아주 NICE",
    "titleEn": "VERY NICE",
    "titleAliases": [
      "아주 NICE",
      "아주 나이스",
      "아주나이스",
      "VERY NICE"
    ],
    "koreanRead": "아주 나이스",
    "releaseYear": "2016",
    "album": "Love&Letter Repackage Album",
    "lyricHint": "오늘 하루도 아주 NICE! / 기분 기분 기분 NICE!",
    "trivia": "예능 프로그램 단골 BGM이자 세븐틴 콘서트에서 끝나지 않는 무한 앙코르(\"무한 아나스\")로 유명한 곡입니다.",
    "itunesQuery": "SEVENTEEN VERY NICE",
    "itunesTrackId": 1130828898,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/9a/e9/7a/9ae97a20-1d23-7e32-6250-348bc30c24a5/mzaf_16842603062944248890.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/32/cb/c4/32cbc434-82b9-6b8e-8cc8-752b554b49f9/cover-.jpg/600x600bb.jpg"
  },
  {
    "id": "idol-16",
    "category": "인기 아이돌",
    "artist": "(여자)아이들",
    "artistEn": "(G)I-DLE",
    "artistAliases": [
      "(여자)아이들",
      "여자아이들",
      "아이들",
      "GIDLE",
      "(G)I-DLE"
    ],
    "title": "나는 아픈 건 딱 질색이니까",
    "titleEn": "Fate",
    "titleAliases": [
      "나는 아픈 건 딱 질색이니까",
      "아픈 건 딱 질색이니까",
      "아딱질",
      "Fate"
    ],
    "koreanRead": "나는 아픈 건 딱 질색이니까",
    "releaseYear": "2024",
    "album": "2 (Two)",
    "lyricHint": "오늘도 아침엔 입에 빵을 물고 / 똑같이 하루를 시작하고",
    "trivia": "청량한 밴드 사운드와 애니메이션 오프닝 같은 감성으로 수록곡 역주행 1위 신화를 쓴 곡입니다.",
    "itunesQuery": "(G)I-DLE Fate",
    "itunesTrackId": 1801725670,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/6f/b6/87/6fb687fd-2746-cf63-1b32-367ccacc6afa/mzaf_11746187873298504432.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/52/34/27/5234273c-5585-261b-4fc5-b10cfd9bbd71/8804775368240.jpg/600x600bb.jpg"
  },
  {
    "id": "idol-17",
    "category": "인기 아이돌",
    "artist": "(여자)아이들",
    "artistEn": "(G)I-DLE",
    "artistAliases": [
      "(여자)아이들",
      "여자아이들",
      "아이들",
      "GIDLE",
      "(G)I-DLE"
    ],
    "title": "퀸카 (Queencard)",
    "titleEn": "Queencard",
    "titleAliases": [
      "퀸카 (Queencard)",
      "퀸카",
      "Queencard"
    ],
    "koreanRead": "퀸카",
    "releaseYear": "2023",
    "album": "I feel - EP",
    "lyricHint": "I am a 퀸카, you wanna be the 퀸카 / My boob and booty is hot",
    "trivia": "2000년대 하이틴 로맨틱 코미디 감성과 유쾌한 당당함으로 전국적인 떼창 열풍을 일으킨 곡입니다.",
    "itunesQuery": "(G)I-DLE Queencard",
    "itunesTrackId": 1802620989,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/45/40/a5/4540a5a8-906d-718e-6681-86c8b4c0c019/mzaf_1989940222119268016.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/7b/59/56/7b59565a-c6bd-a615-9cc2-955cb8481dfb/8804775254703.jpg/600x600bb.jpg"
  },
  {
    "id": "chart-1",
    "category": "2026 차트",
    "artist": "로제",
    "artistEn": "ROSÉ & Bruno Mars",
    "artistAliases": [
      "로제",
      "ROSE",
      "ROSÉ",
      "로제 & 브루노 마스",
      "브루노 마스"
    ],
    "title": "APT.",
    "titleEn": "APT.",
    "titleAliases": [
      "APT.",
      "APT",
      "아파트"
    ],
    "koreanRead": "아파트",
    "releaseYear": "2024",
    "album": "rosie",
    "lyricHint": "채영이가 좋아하는 랜덤 게임! / 아파트 아파트 아파트 아파트",
    "trivia": "한국의 술자리 게임을 모티브로 브루노 마스와 협업해 전 세계 차트 1위를 석권한 글로벌 메가 히트곡입니다.",
    "itunesQuery": "ROSE Bruno Mars APT",
    "itunesTrackId": 1773452221,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/7a/15/38/7a1538f3-f41a-a2eb-0f24-8eb6712ee043/mzaf_7740628412097685267.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/2d/1a/7d/2d1a7d91-587e-0ceb-d434-327bd66d9e86/075679628312.jpg/600x600bb.jpg"
  },
  {
    "id": "chart-2",
    "category": "2026 차트",
    "artist": "지드래곤",
    "artistEn": "G-DRAGON",
    "artistAliases": [
      "지드래곤",
      "GD",
      "G-DRAGON",
      "권지용",
      "지디"
    ],
    "title": "HOME SWEET HOME",
    "titleEn": "HOME SWEET HOME (feat. TAEYANG & DAESUNG)",
    "titleAliases": [
      "HOME SWEET HOME",
      "홈 스윗 홈",
      "홈스윗홈"
    ],
    "koreanRead": "홈 스윗 홈",
    "releaseYear": "2024",
    "album": "Übermensch",
    "lyricHint": "Well I said I would be back / 너의 따뜻한 집으로 돌아왔어",
    "trivia": "태양·대성이 피처링으로 참여해 완전체 에너지를 보여주며 차트 장기 집권에 성공한 곡입니다.",
    "itunesQuery": "G-DRAGON HOME SWEET HOME",
    "itunesTrackId": 1780635199,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/58/a6/39/58a63960-f6b2-0ee2-ea8a-934b616bc0f3/mzaf_6916116820022345245.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/a4/e1/84/a4e1846a-6158-6a43-30c7-0297e891905e/197342826099_cover.jpg/600x600bb.jpg"
  },
  {
    "id": "chart-3",
    "category": "2026 차트",
    "artist": "지드래곤",
    "artistEn": "G-DRAGON",
    "artistAliases": [
      "지드래곤",
      "GD",
      "G-DRAGON",
      "권지용",
      "지디"
    ],
    "title": "TOO BAD",
    "titleEn": "TOO BAD (feat. Anderson .Paak)",
    "titleAliases": [
      "TOO BAD",
      "투 배드",
      "투배드"
    ],
    "koreanRead": "투 배드",
    "releaseYear": "2025",
    "album": "Übermensch",
    "lyricHint": "Too bad for me / 리드미컬한 펑크 그루브에 몸을 맡겨",
    "trivia": "앤더슨 팩(Anderson .Paak)과 협업한 정규 3집 <Übermensch>의 타이틀곡으로, 2025~2026 차트를 강타한 곡입니다.",
    "itunesQuery": "G-DRAGON TOO BAD",
    "itunesTrackId": 1794882504,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/77/73/ff/7773ffa9-fb24-88de-2e24-cde5f872e3f5/mzaf_18220580147462783180.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/99/9b/ef/999bef4b-91ba-8724-ee22-251396b48cd6/197342954327_cover.jpg/600x600bb.jpg"
  },
  {
    "id": "chart-4",
    "category": "2026 차트",
    "artist": "지드래곤",
    "artistEn": "G-DRAGON",
    "artistAliases": [
      "지드래곤",
      "GD",
      "G-DRAGON",
      "권지용",
      "지디"
    ],
    "title": "POWER",
    "titleEn": "POWER",
    "titleAliases": [
      "POWER",
      "파워"
    ],
    "koreanRead": "파워",
    "releaseYear": "2024",
    "album": "Übermensch",
    "lyricHint": "I got the power, the power power up power / 나는 나다울 때 가장 강해",
    "trivia": "7년 만의 솔로 컴백을 알린 선공개 싱글로, 지드래곤 특유의 위트 있는 라임과 스웨그가 돋보이는 곡입니다.",
    "itunesQuery": "G-DRAGON POWER",
    "itunesTrackId": 1776670342,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/16/52/16/16521669-d835-c2db-f3d0-f2d97f893a6e/mzaf_683883611835103898.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/36/fa/03/36fa0306-b040-b01b-36d3-181256366615/197342805353_cover.jpg/600x600bb.jpg"
  },
  {
    "id": "chart-5",
    "category": "2026 차트",
    "artist": "제니",
    "artistEn": "JENNIE",
    "artistAliases": [
      "제니",
      "JENNIE"
    ],
    "title": "like JENNIE",
    "titleEn": "like JENNIE",
    "titleAliases": [
      "like JENNIE",
      "라이크 제니",
      "라이크제니"
    ],
    "koreanRead": "라이크 제니",
    "releaseYear": "2025",
    "album": "Ruby",
    "lyricHint": "Who wanna rock with JENNIE? / 세상에 단 하나뿐인 제니처럼",
    "trivia": "제니의 첫 솔로 정규 앨범 <Ruby> 타이틀곡으로, 강렬한 힙합 비트와 퍼포먼스로 차트 정상을 차지했습니다.",
    "itunesQuery": "JENNIE like JENNIE",
    "itunesTrackId": 1800281048,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/42/dc/06/42dc069a-1683-2d2b-6442-b3655f2b2a97/mzaf_15363406353889961611.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/97/4d/0e/974d0ed9-0c7b-59da-da0f-7a22ebfc1479/196872953367.jpg/600x600bb.jpg"
  },
  {
    "id": "chart-6",
    "category": "2026 차트",
    "artist": "제니",
    "artistEn": "JENNIE",
    "artistAliases": [
      "제니",
      "JENNIE"
    ],
    "title": "Mantra",
    "titleEn": "Mantra",
    "titleAliases": [
      "Mantra",
      "만트라"
    ],
    "koreanRead": "만트라",
    "releaseYear": "2024",
    "album": "Ruby",
    "lyricHint": "This that pretty girl mantra / 당당하게 빛나는 주문",
    "trivia": "자신감을 불어넣는 경쾌하고 중독적인 베이스라인으로 글로벌 음원 차트를 휩쓴 곡입니다.",
    "itunesQuery": "JENNIE Mantra",
    "itunesTrackId": 1800281482,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/c2/43/1e/c2431e90-835a-e4f0-9910-aa87ef39ebeb/mzaf_58647991773334013.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/97/4d/0e/974d0ed9-0c7b-59da-da0f-7a22ebfc1479/196872953367.jpg/600x600bb.jpg"
  },
  {
    "id": "chart-7",
    "category": "2026 차트",
    "artist": "데이식스",
    "artistEn": "DAY6",
    "artistAliases": [
      "데이식스",
      "DAY6"
    ],
    "title": "HAPPY",
    "titleEn": "HAPPY",
    "titleAliases": [
      "HAPPY",
      "해피"
    ],
    "koreanRead": "해피",
    "releaseYear": "2024",
    "album": "Fourever",
    "lyricHint": "그런 날이 있을까요? 마냥 좋은 그런 날이요 / 내일 걱정 하나 없이 웃게 되는 그런 날이요",
    "trivia": "밝고 경쾌한 펑크 록 사운드 속에 \"행복해지고 싶다\"는 간절한 진심을 담아 전 세대의 공감을 얻은 1위 곡입니다.",
    "itunesQuery": "DAY6 HAPPY",
    "itunesTrackId": 1732319018,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/83/3e/6b/833e6baa-3767-5f1d-e651-8b27fc4c9a25/mzaf_6192446484966640638.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/9e/e8/6e/9ee86ed8-4dcf-ac99-e49a-95fb2151b4ac/8809928951515_Cover.jpg/600x600bb.jpg"
  },
  {
    "id": "chart-8",
    "category": "2026 차트",
    "artist": "데이식스",
    "artistEn": "DAY6",
    "artistAliases": [
      "데이식스",
      "DAY6"
    ],
    "title": "한 페이지가 될 수 있게",
    "titleEn": "Time of Our Life",
    "titleAliases": [
      "한 페이지가 될 수 있게",
      "한페이지가될수있게",
      "Time of Our Life"
    ],
    "koreanRead": "한 페이지가 될 수 있게",
    "releaseYear": "2019",
    "album": "The Book of Us : Gravity",
    "lyricHint": "아름다운 청춘의 한 장 함께 써내려 가자 / 너와의 추억들로 가득 채울래",
    "trivia": "청춘의 시작을 알리는 벅찬 드럼 인트로와 밴드 사운드로 발매 수년 뒤까지 차트 최상위권을 지키는 명곡입니다.",
    "itunesQuery": "DAY6 Time of Our Life",
    "itunesTrackId": 1689325541,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/d3/0a/16/d30a1693-6cfc-004d-7415-3a8a9ed0ef1d/mzaf_2368053571738456111.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/7c/51/b4/7c51b4a5-a049-ed9c-126f-2eac310060d1/738676857337_Cover.jpg/600x600bb.jpg"
  },
  {
    "id": "chart-9",
    "category": "2026 차트",
    "artist": "데이식스",
    "artistEn": "DAY6",
    "artistAliases": [
      "데이식스",
      "DAY6"
    ],
    "title": "Welcome to the Show",
    "titleEn": "Welcome to the Show",
    "titleAliases": [
      "Welcome to the Show",
      "웰컴 투 더 쇼",
      "웰컴투더쇼"
    ],
    "koreanRead": "웰컴 투 더 쇼",
    "releaseYear": "2024",
    "album": "Fourever",
    "lyricHint": "이젠 혼자가 아닐 무대 너무나 감격스러워 / 끝없는 가능성 중에 날 골라줘서 고마워",
    "trivia": "데이식스 완전체 복귀를 알린 타이틀곡으로, 스포츠 경기장과 콘서트장을 가득 채우는 웅장한 떼창곡입니다.",
    "itunesQuery": "DAY6 Welcome to the Show",
    "itunesTrackId": 1732319011,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/e2/d9/4b/e2d94b91-40b9-d593-763b-865408a1a8a2/mzaf_5679442959121899331.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/9e/e8/6e/9ee86ed8-4dcf-ac99-e49a-95fb2151b4ac/8809928951515_Cover.jpg/600x600bb.jpg"
  },
  {
    "id": "chart-10",
    "category": "2026 차트",
    "artist": "데이식스",
    "artistEn": "DAY6",
    "artistAliases": [
      "데이식스",
      "DAY6"
    ],
    "title": "예뻤어",
    "titleEn": "You Were Beautiful",
    "titleAliases": [
      "예뻤어",
      "You Were Beautiful"
    ],
    "koreanRead": "예뻤어",
    "releaseYear": "2017",
    "album": "Every DAY6 February",
    "lyricHint": "지금 이 말이 우리가 다시 시작하자는 건 아냐 / 그저 너의 남아있던 기억들이 떠올랐을 뿐야",
    "trivia": "지나간 사랑의 모든 순간이 예뻤다고 회상하는 아련한 가사로 K-밴드 역주행 열풍의 시초가 된 대표곡입니다.",
    "itunesQuery": "DAY6 You Were Beautiful",
    "itunesTrackId": 1689198306,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/d6/1a/a0/d61aa000-f06f-9303-f5e5-69777e37f52f/mzaf_4619040665706353488.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/b2/11/b3/b211b378-5de3-46e4-2344-c5eda8bc8276/738676856637_Cover.jpg/600x600bb.jpg"
  },
  {
    "id": "chart-11",
    "category": "2026 차트",
    "artist": "데이식스",
    "artistEn": "DAY6",
    "artistAliases": [
      "데이식스",
      "DAY6"
    ],
    "title": "녹아내려요",
    "titleEn": "Melt Down",
    "titleAliases": [
      "녹아내려요",
      "Melt Down"
    ],
    "koreanRead": "녹아내려요",
    "releaseYear": "2024",
    "album": "Band Aid",
    "lyricHint": "세상이 얼어붙어도 네가 웃어주면 / 다 녹아내려요",
    "trivia": "발매 직후 국내 주요 음원 차트 올킬을 달성하며 데이식스의 전성기를 증명한 경쾌한 밴드 곡입니다.",
    "itunesQuery": "DAY6 Melt Down",
    "itunesTrackId": 1764219756,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/9c/08/90/9c0890ce-29e3-03f0-8ab3-baa9b6571292/mzaf_8132143970198159308.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/fd/d8/f5/fdd8f5b8-5723-3d20-2b6f-6653046e4f05/8809928952529_Cover.jpg/600x600bb.jpg"
  },
  {
    "id": "chart-12",
    "category": "2026 차트",
    "artist": "QWER",
    "artistEn": "QWER",
    "artistAliases": [
      "QWER",
      "큐더블유이알"
    ],
    "title": "고민중독",
    "titleEn": "T.B.H",
    "titleAliases": [
      "고민중독",
      "고민 중독",
      "T.B.H"
    ],
    "koreanRead": "고민중독",
    "releaseYear": "2024",
    "album": "MANITO",
    "lyricHint": "하나 둘 셋 넷! / 거울 앞에서 또 연습해 본 고백",
    "trivia": "질주하는 듯한 경쾌한 J-Rock 스타일 밴드 사운드로 2024~2026 연간 차트 상위권을 휩쓴 히트곡입니다.",
    "itunesQuery": "QWER T.B.H",
    "itunesTrackId": 1737366585,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/ca/f2/aa/caf2aa58-40ef-8460-cf65-0f97848da839/mzaf_11004362433324424334.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/75/54/38/75543853-92c7-064c-fe26-2cbf5eecc6d8/cover_KM0019655_1.jpg/600x600bb.jpg"
  },
  {
    "id": "chart-13",
    "category": "2026 차트",
    "artist": "QWER",
    "artistEn": "QWER",
    "artistAliases": [
      "QWER",
      "큐더블유이알"
    ],
    "title": "내 이름 맑음",
    "titleEn": "My Name is Malguem",
    "titleAliases": [
      "내 이름 맑음",
      "내이름맑음"
    ],
    "koreanRead": "내 이름 맑음",
    "releaseYear": "2024",
    "album": "Algorithm's Blossom",
    "lyricHint": "비 내리던 날들도 이젠 안녕 / 내일 날씨는 내 이름 맑음",
    "trivia": "(여자)아이들 전소연이 작사·작곡에 참여해 서정적이면서도 벅차오르는 청춘 밴드 감성을 완성한 곡입니다.",
    "itunesQuery": "QWER 내 이름 맑음",
    "itunesTrackId": 1769572156,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/c5/e7/73/c5e77306-097a-0af7-0936-bff54a77ebc7/mzaf_5185468725080186784.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/15/00/62/150062e8-fd58-5dc2-bfea-f0e502e0957a/cover_KM0020310_1.jpg/600x600bb.jpg"
  },
  {
    "id": "chart-14",
    "category": "2026 차트",
    "artist": "우즈",
    "artistEn": "WOODZ",
    "artistAliases": [
      "우즈",
      "WOODZ",
      "조승연"
    ],
    "title": "Drowning",
    "titleEn": "Drowning",
    "titleAliases": [
      "Drowning",
      "드라우닝"
    ],
    "koreanRead": "드라우닝",
    "releaseYear": "2023",
    "album": "OO-LI",
    "lyricHint": "Oh I’m drowning / 비가 내리는 밤 그 속에 잠겨가",
    "trivia": "군 복무 중 폭발적인 성량의 라이브 영상이 화제를 모으며 발매 1년 반 만에 차트 1위 역주행을 달성한 록 명곡입니다.",
    "itunesQuery": "WOODZ Drowning",
    "itunesTrackId": 1683448656,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/a4/c5/cd/a4c5cd9d-656f-3da4-bcd7-09dc0d85dedd/mzaf_13926981520489315547.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/07/91/0d/07910df6-5ab5-0867-3be5-900cf9d11018/cover_KM0016894_1.jpg/600x600bb.jpg"
  },
  {
    "id": "chart-15",
    "category": "2026 차트",
    "artist": "황가람",
    "artistEn": "Hwang Karam",
    "artistAliases": [
      "황가람",
      "Hwang Karam"
    ],
    "title": "나는 반딧불",
    "titleEn": "I'm Firefly",
    "titleAliases": [
      "나는 반딧불",
      "나는반딧불",
      "반딧불"
    ],
    "koreanRead": "나는 반딧불",
    "releaseYear": "2024",
    "album": "나는 반딧불 - Single",
    "lyricHint": "나는 내가 빛나는 별인 줄 알았어요 / 한 번도 의심한 적 없었죠",
    "trivia": "인디밴드 중식이의 원곡을 허스키하고 깊은 감성으로 리메이크해 전국민 위로곡으로 등극한 차트 역주행 곡입니다.",
    "itunesQuery": "황가람 나는 반딧불",
    "itunesTrackId": 1773943442,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/68/5e/28/685e283d-59cf-0d5b-deec-a8fad9dec25f/mzaf_3645653479767884618.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/e6/1c/6d/e61c6d78-daa6-e319-78ae-660c4caee9df/cover_KM0020476_1.jpg/600x600bb.jpg"
  },
  {
    "id": "chart-16",
    "category": "2026 차트",
    "artist": "보이넥스트도어",
    "artistEn": "BOYNEXTDOOR",
    "artistAliases": [
      "보이넥스트도어",
      "보넥도",
      "BOYNEXTDOOR"
    ],
    "title": "오늘만 I LOVE YOU",
    "titleEn": "IF I SAY, I LOVE YOU",
    "titleAliases": [
      "오늘만 I LOVE YOU",
      "오늘만 아이러브유",
      "오늘만 사랑해",
      "IF I SAY I LOVE YOU"
    ],
    "koreanRead": "오늘만 아이 러브 유",
    "releaseYear": "2025",
    "album": "오늘만 I LOVE YOU - Single",
    "lyricHint": "그날 이후로 난 이렇게 살아요 / 오늘만 I LOVE YOU",
    "trivia": "2025~2026 음원 차트 최상위권을 휩쓸며 보이넥스트도어의 대표 메가 히트곡으로 자리 잡은 경쾌한 이별송입니다.",
    "itunesQuery": "BOYNEXTDOOR IF I SAY I LOVE YOU",
    "itunesTrackId": 1785637238,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/b0/29/da/b029da0d-f3cd-231a-dabc-0704776df26f/mzaf_4183191705776683622.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/8c/03/16/8c03163b-065d-5f3c-ba55-73c4603a3c05/198704289064_Cover.jpg/600x600bb.jpg"
  },
  {
    "id": "lesserafim-101",
    "category": "르세라핌",
    "artist": "르세라핌",
    "artistEn": "LE SSERAFIM",
    "artistAliases": [
      "르세라핌",
      "LE SSERAFIM"
    ],
    "title": "ANTIFRAGILE",
    "titleEn": "ANTIFRAGILE",
    "titleAliases": [
      "ANTIFRAGILE",
      "안티프래자일"
    ],
    "koreanRead": "안티프래자일",
    "releaseYear": "2022",
    "album": "ANTIFRAGILE - EP",
    "lyricHint": "가시밭길 위로 riding, you made me boost up / 다시 타올라",
    "trivia": "시련을 겪을수록 더 단단해진다는 메시지를 아프로라틴 리듬에 담아낸 메가 히트곡입니다.",
    "itunesQuery": "르세라핌 ANTIFRAGILE",
    "itunesTrackId": 1647830390,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/9c/5b/33/9c5b33cb-f6c0-1cf5-61c4-ac465bce2b7b/mzaf_16974808219393622487.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/c8/79/da/c879dadf-db1e-95a5-caf5-b18c7c81d2b6/192641874413_Cover.jpg/600x600bb.jpg"
  },
  {
    "id": "lesserafim-102",
    "category": "르세라핌",
    "artist": "르세라핌",
    "artistEn": "LE SSERAFIM",
    "artistAliases": [
      "르세라핌",
      "LE SSERAFIM"
    ],
    "title": "EASY",
    "titleEn": "EASY",
    "titleAliases": [
      "EASY",
      "이지"
    ],
    "koreanRead": "이지",
    "releaseYear": "2024",
    "album": "EASY - EP",
    "lyricHint": "쉽지 않음 내가 쉽게 easy / 날 수면 아래로 던져",
    "trivia": "트랩 힙합 장르를 매끄럽게 소화하며 르세라핌의 깊어진 내면과 노력을 담아낸 타이틀곡입니다.",
    "itunesQuery": "르세라핌 EASY",
    "itunesTrackId": 1728928754,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/19/f6/98/19f6985f-4633-0de9-6529-22e9c84e31be/mzaf_2983769807683393748.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/22/0f/fd/220ffdbf-152c-5b65-d5af-01256c1328c2/196922796531_Cover.jpg/600x600bb.jpg"
  },
  {
    "id": "lesserafim-103",
    "category": "르세라핌",
    "artist": "르세라핌",
    "artistEn": "LE SSERAFIM",
    "artistAliases": [
      "르세라핌",
      "LE SSERAFIM"
    ],
    "title": "UNFORGIVEN",
    "titleEn": "UNFORGIVEN (feat. Nile Rodgers)",
    "titleAliases": [
      "UNFORGIVEN",
      "언포기븐"
    ],
    "koreanRead": "언포기븐",
    "releaseYear": "2023",
    "album": "UNFORGIVEN",
    "lyricHint": "Unforgiven, I'm a villain, I'm a / 새 시대로 기억될 unforgiven",
    "trivia": "나일 로저스의 기타 피처링과 서부 영화 테마가 어우러진 정규 1집 타이틀곡입니다.",
    "itunesQuery": "르세라핌 UNFORGIVEN",
    "itunesTrackId": 1682502472,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/fd/05/0c/fd050c13-7a38-55fd-3d97-ca5f976915b1/mzaf_9965317674295586639.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/27/13/c3/2713c389-4f01-b5e7-59f5-3204b37cb594/196922444470_Cover.jpg/600x600bb.jpg"
  },
  {
    "id": "lesserafim-104",
    "category": "르세라핌",
    "artist": "르세라핌",
    "artistEn": "LE SSERAFIM",
    "artistAliases": [
      "르세라핌",
      "LE SSERAFIM"
    ],
    "title": "FEARLESS",
    "titleEn": "FEARLESS",
    "titleAliases": [
      "FEARLESS",
      "피어리스"
    ],
    "koreanRead": "피어리스",
    "releaseYear": "2022",
    "album": "FEARLESS - EP",
    "lyricHint": "내 흉터를 가리기 위한 가면 따윈 벗어던져 / I'm fearless",
    "trivia": "르세라핌의 화려한 데뷔를 알린 미니 1집 타이틀곡으로 볼드한 베이스 리프가 일품입니다.",
    "itunesQuery": "르세라핌 FEARLESS",
    "itunesTrackId": 1621089608,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/2e/e8/40/2ee84088-b80c-28bf-c277-9eaeaae0a8d5/mzaf_10950096593083239512.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/77/c9/7f/77c97fcc-e72d-13e9-2e41-d5c23ceb5e43/196922016622_Cover.jpg/600x600bb.jpg"
  },
  {
    "id": "lesserafim-105",
    "category": "르세라핌",
    "artist": "르세라핌",
    "artistEn": "LE SSERAFIM",
    "artistAliases": [
      "르세라핌",
      "LE SSERAFIM"
    ],
    "title": "이브, 프시케 그리고 푸른 수염의 아내",
    "titleEn": "Eve, Psyche & The Bluebeard's wife",
    "titleAliases": [
      "이브, 프시케 그리고 푸른 수염의 아내",
      "이프푸",
      "이브 프시케"
    ],
    "koreanRead": "이브 프시케 그리고 푸른 수염의 아내",
    "releaseYear": "2023",
    "album": "UNFORGIVEN",
    "lyricHint": "I'm a mess mess mess in distress / 열려라 참깨",
    "trivia": "금기를 깨고 나아가겠다는 당돌한 가사와 저지 클럽 리듬으로 챌린지를 강타한 인기곡입니다.",
    "itunesQuery": "르세라핌 이브, 프시케 그리고 푸른 수염의 아내",
    "itunesTrackId": 1682502483,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/58/b6/a4/58b6a479-4750-bc36-83ef-dc096e80e512/mzaf_7713972725375701992.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/27/13/c3/2713c389-4f01-b5e7-59f5-3204b37cb594/196922444470_Cover.jpg/600x600bb.jpg"
  },
  {
    "id": "lesserafim-107",
    "category": "르세라핌",
    "artist": "르세라핌",
    "artistEn": "LE SSERAFIM",
    "artistAliases": [
      "르세라핌",
      "LE SSERAFIM"
    ],
    "title": "Blue Flame",
    "titleEn": "Blue Flame",
    "titleAliases": [
      "Blue Flame",
      "블루 플레임"
    ],
    "koreanRead": "블루 플레임",
    "releaseYear": "2022",
    "album": "FEARLESS - EP",
    "lyricHint": "손끝에 닿은 그 푸른 불꽃 / 더 깊이 빠져들어",
    "trivia": "멤버 김채원과 허윤진이 작사에 참여한 세련되고 몽환적인 디스코 펑크 팝 트랙입니다.",
    "itunesQuery": "르세라핌 Blue Flame",
    "itunesTrackId": 1621089614,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/fa/4e/08/fa4e0891-6af1-50b5-ce52-847f10f0667a/mzaf_10390309336838114400.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/77/c9/7f/77c97fcc-e72d-13e9-2e41-d5c23ceb5e43/196922016622_Cover.jpg/600x600bb.jpg"
  },
  {
    "id": "lesserafim-108",
    "category": "르세라핌",
    "artist": "르세라핌",
    "artistEn": "LE SSERAFIM",
    "artistAliases": [
      "르세라핌",
      "LE SSERAFIM"
    ],
    "title": "Sour Grapes",
    "titleEn": "Sour Grapes",
    "titleAliases": [
      "Sour Grapes",
      "사워 그레이프"
    ],
    "koreanRead": "사워 그레이프",
    "releaseYear": "2022",
    "album": "FEARLESS - EP",
    "lyricHint": "Sour, sour, sour grapes / 달콤하지 않아도 돼",
    "trivia": "이솝우화 여우와 신포도 이야기에서 착안한 서정적이고 감미로운 R&B 발라드입니다.",
    "itunesQuery": "르세라핌 Sour Grapes",
    "itunesTrackId": 1621089856,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/08/b2/df/08b2dfa4-23bc-4992-8ce7-237f7c425135/mzaf_16072233407538250444.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/77/c9/7f/77c97fcc-e72d-13e9-2e41-d5c23ceb5e43/196922016622_Cover.jpg/600x600bb.jpg"
  },
  {
    "id": "lesserafim-109",
    "category": "르세라핌",
    "artist": "르세라핌",
    "artistEn": "LE SSERAFIM",
    "artistAliases": [
      "르세라핌",
      "LE SSERAFIM"
    ],
    "title": "Good Bones",
    "titleEn": "Good Bones",
    "titleAliases": [
      "Good Bones",
      "굿 본즈"
    ],
    "koreanRead": "굿 본즈",
    "releaseYear": "2024",
    "album": "EASY - EP",
    "lyricHint": "세상이 우리에게만 쉬운 적 있었어? / I'm resilient",
    "trivia": "강렬한 록 사운드 위에 3개 국어 내레이션이 돋보이는 미니 3집 인트로 명곡입니다.",
    "itunesQuery": "르세라핌 Good Bones",
    "itunesTrackId": 1728928731,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/fd/b2/f0/fdb2f0a7-b7d1-17ff-6849-8fda7d5fcbf3/mzaf_18022415058019514275.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/22/0f/fd/220ffdbf-152c-5b65-d5af-01256c1328c2/196922796531_Cover.jpg/600x600bb.jpg"
  },
  {
    "id": "lesserafim-111",
    "category": "르세라핌",
    "artist": "르세라핌",
    "artistEn": "LE SSERAFIM",
    "artistAliases": [
      "르세라핌",
      "LE SSERAFIM"
    ],
    "title": "HOT",
    "titleEn": "HOT",
    "titleAliases": [
      "HOT",
      "핫"
    ],
    "koreanRead": "핫",
    "releaseYear": "2024",
    "album": "CRAZY - EP",
    "lyricHint": "Too hot to handle / 불타오르는 열기 속으로",
    "trivia": "2025~2026 르세라핌 특유의 당당함과 폭발적인 에너지를 담아낸 트랙입니다.",
    "itunesQuery": "르세라핌 HOT",
    "itunesTrackId": 1763658330,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/d7/98/4a/d7984acc-ec3d-702a-b712-f24a492c380d/mzaf_8154997953251408819.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/38/95/ed/3895ed80-ba5b-7846-ce5b-b49805a818ef/198704101359_Cover.jpg/600x600bb.jpg"
  },
  {
    "id": "lesserafim-112",
    "category": "르세라핌",
    "artist": "르세라핌",
    "artistEn": "LE SSERAFIM",
    "artistAliases": [
      "르세라핌",
      "LE SSERAFIM"
    ],
    "title": "BOOMPALA",
    "titleEn": "BOOMPALA",
    "titleAliases": [
      "BOOMPALA",
      "붐팔라"
    ],
    "koreanRead": "붐팔라",
    "releaseYear": "2026",
    "album": "'PUREFLOW', Pt. 1",
    "lyricHint": "신나는 비트와 멈출 수 없는 에너지 / BOOMPALA",
    "trivia": "중독적인 리듬과 신선한 멜로디의 2026년 최신 화제 트랙입니다.",
    "itunesQuery": "르세라핌 BOOMPALA",
    "itunesTrackId": 1894802726,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/81/e9/67/81e96793-c88e-5be4-95f2-2c53ae1ef263/mzaf_11198696615091070328.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/b8/0c/98/b80c980c-52c6-a180-ff3e-2afaaab75fdd/823375107286_Cover.jpg/600x600bb.jpg"
  },
  {
    "id": "rescene-101",
    "category": "리센느",
    "artist": "리센느",
    "artistEn": "RESCENE",
    "artistAliases": [
      "리센느",
      "르센느",
      "RESCENE"
    ],
    "title": "LOVE ATTACK",
    "titleEn": "LOVE ATTACK",
    "titleAliases": [
      "LOVE ATTACK",
      "러브 어택"
    ],
    "koreanRead": "러브 어택",
    "releaseYear": "2024",
    "album": "SCENEDROME - EP",
    "lyricHint": "한순간에 퍼지는 너의 향기 / Love attack",
    "trivia": "향기를 테마로 한 리센느의 미니 1집 타이틀곡으로 청량한 보컬과 사랑스러운 멜로디가 돋보입니다.",
    "itunesQuery": "리센느 LOVE ATTACK",
    "itunesTrackId": 1764485170,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/6a/c5/ec/6ac5ecf5-6e26-e551-0b1d-d9f2fcb253a2/mzaf_18228858557779313654.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/43/0b/4c/430b4c8e-3cb8-da27-648f-435ec3b391a6/8804775334160.jpg/600x600bb.jpg"
  },
  {
    "id": "rescene-102",
    "category": "리센느",
    "artist": "리센느",
    "artistEn": "RESCENE",
    "artistAliases": [
      "리센느",
      "르센느",
      "RESCENE"
    ],
    "title": "YoYo",
    "titleEn": "YoYo",
    "titleAliases": [
      "YoYo",
      "요요"
    ],
    "koreanRead": "요요",
    "releaseYear": "2024",
    "album": "Re:Scene - Single",
    "lyricHint": "되감아봐도 너뿐인 걸 / Yo-yo spinning round",
    "trivia": "선공개 싱글로 리센느만의 독특하고 몽환적인 음악 세계를 세상에 처음 알린 곡입니다.",
    "itunesQuery": "리센느 YoYo",
    "itunesTrackId": 1737172694,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/37/e4/07/37e4079d-7170-7dd2-24d9-3f03629e208b/mzaf_1822415956970798402.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/f3/e6/7c/f3e67cb1-c445-6906-fa76-a16b8f7c9b17/8804775349089.jpg/600x600bb.jpg"
  },
  {
    "id": "rescene-103",
    "category": "리센느",
    "artist": "리센느",
    "artistEn": "RESCENE",
    "artistAliases": [
      "리센느",
      "르센느",
      "RESCENE"
    ],
    "title": "Pinball",
    "titleEn": "Pinball",
    "titleAliases": [
      "Pinball",
      "핀볼"
    ],
    "koreanRead": "핀볼",
    "releaseYear": "2024",
    "album": "SCENEDROME - EP",
    "lyricHint": "이리저리 튕기는 감정 / 마치 핀볼 게임 같아",
    "trivia": "통통 튀는 신스 사운드와 재치 있는 가사가 돋보이는 리센느의 매력적인 수록곡입니다.",
    "itunesQuery": "리센느 Pinball",
    "itunesTrackId": 1764485172,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/90/52/98/90529862-1dd3-ef47-80ab-dbf5fd4a893c/mzaf_16987686986345600516.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/43/0b/4c/430b4c8e-3cb8-da27-648f-435ec3b391a6/8804775334160.jpg/600x600bb.jpg"
  },
  {
    "id": "rescene-104",
    "category": "리센느",
    "artist": "리센느",
    "artistEn": "RESCENE",
    "artistAliases": [
      "리센느",
      "르센느",
      "RESCENE"
    ],
    "title": "Deja Vu",
    "titleEn": "Deja Vu",
    "titleAliases": [
      "Deja Vu",
      "데자뷰"
    ],
    "koreanRead": "데자뷰",
    "releaseYear": "2025",
    "album": "Dearest - Single",
    "lyricHint": "어딘가 익숙한 이 기시감 / Deja vu",
    "trivia": "2025년 발표되어 한층 더 성숙해진 리센느의 보컬 하모니를 증명한 인기곡입니다.",
    "itunesQuery": "리센느 Deja Vu",
    "itunesTrackId": 1822439986,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/08/47/ac/0847ac83-1c65-e840-bf12-f6530c2da6e8/mzaf_4114291550689561164.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/e3/4e/e4/e34ee4d9-47a3-8b51-b6cc-4d991508f0b5/cover_KM0023041_1.jpg/600x600bb.jpg"
  },
  {
    "id": "rescene-105",
    "category": "리센느",
    "artist": "리센느",
    "artistEn": "RESCENE",
    "artistAliases": [
      "리센느",
      "르센느",
      "RESCENE"
    ],
    "title": "Glow Up",
    "titleEn": "Glow Up",
    "titleAliases": [
      "Glow Up",
      "글로우 업"
    ],
    "koreanRead": "글로우 업",
    "releaseYear": "2025",
    "album": "Glow Up - EP",
    "lyricHint": "더 눈부시게 빛날 거야 / It's time to glow up",
    "trivia": "자신감 넘치는 메시지와 세련된 비트로 사랑받는 리센느의 대표 앨범 트랙입니다.",
    "itunesQuery": "리센느 Glow Up",
    "itunesTrackId": 1794040971,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/51/69/69/516969f0-35fb-b783-1f1f-30c3b0558df6/mzaf_9906892271786488150.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/b6/72/c9/b672c9d1-e8a1-4def-363e-dc0e86042761/cover_KM0020943_1.jpg/600x600bb.jpg"
  },
  {
    "id": "rescene-106",
    "category": "리센느",
    "artist": "리센느",
    "artistEn": "RESCENE",
    "artistAliases": [
      "리센느",
      "르센느",
      "RESCENE"
    ],
    "title": "Bloom",
    "titleEn": "Bloom",
    "titleAliases": [
      "Bloom",
      "블룸"
    ],
    "koreanRead": "블룸",
    "releaseYear": "2025",
    "album": "lip bomb - EP",
    "lyricHint": "꽃망울이 피어나듯 / 세상에 너를 피워내",
    "trivia": "꽃이 피어나는 순간의 향기를 표현한 서정적이고 아름다운 멜로디의 곡입니다.",
    "itunesQuery": "리센느 Bloom",
    "itunesTrackId": 1852644695,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/62/5e/55/625e5585-2a20-eb7e-e735-9ea0f8ed6361/mzaf_2826108569939178539.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/91/66/5a/91665a02-b5c1-8336-e973-88746539ab71/8804775401787.jpg/600x600bb.jpg"
  },
  {
    "id": "rescene-107",
    "category": "리센느",
    "artist": "리센느",
    "artistEn": "RESCENE",
    "artistAliases": [
      "리센느",
      "르센느",
      "RESCENE"
    ],
    "title": "Pretty Girl",
    "titleEn": "Pretty Girl",
    "titleAliases": [
      "Pretty Girl",
      "프리티 걸"
    ],
    "koreanRead": "프리티 걸",
    "releaseYear": "2026",
    "album": "Pretty Girl - Single",
    "lyricHint": "당당하고 자신감 넘치는 우리들의 이야기",
    "trivia": "2026년 리센느의 상큼하고 통통 튀는 매력이 극대화된 최신 인기곡입니다.",
    "itunesQuery": "리센느 Pretty Girl",
    "itunesTrackId": 6786111946,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/e4/df/9e/e4df9e2a-0671-503e-2e6e-107b424b78d5/mzaf_52784464605337022.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/44/70/65/44706599-2480-efab-7cfe-564b5e254b25/888272184075_Cover.jpg/600x600bb.jpg"
  },
  {
    "id": "rescene-108",
    "category": "리센느",
    "artist": "리센느",
    "artistEn": "RESCENE",
    "artistAliases": [
      "리센느",
      "르센느",
      "RESCENE"
    ],
    "title": "Runaway",
    "titleEn": "Runaway",
    "titleAliases": [
      "Runaway",
      "런어웨이"
    ],
    "koreanRead": "런어웨이",
    "releaseYear": "2026",
    "album": "Runaway - Single",
    "lyricHint": "어디든 좋아 함께라면 / Let's runaway",
    "trivia": "질주감 넘치는 신나는 드럼 비트와 청량한 보컬이 인상적인 2026년 최신곡입니다.",
    "itunesQuery": "리센느 Runaway",
    "itunesTrackId": 1889474652,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/8c/b8/2b/8cb82b16-a181-a4a6-c745-7187bcf20b64/mzaf_2745322250276907813.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/6c/94/62/6c946232-183b-9e28-01c8-d630b41ca3a8/888272179019_Cover.jpg/600x600bb.jpg"
  },
  {
    "id": "jannabi-101",
    "category": "잔나비",
    "artist": "잔나비",
    "artistEn": "JANNABI",
    "artistAliases": [
      "잔나비",
      "JANNABI"
    ],
    "title": "슬픔이여안녕",
    "titleEn": "good boy Twist",
    "titleAliases": [
      "슬픔이여안녕",
      "슬픔이여 안녕"
    ],
    "koreanRead": "슬픔이여 안녕",
    "releaseYear": "2018",
    "album": "Good Boy Twist - Single",
    "lyricHint": "슬픔이여 안녕 이제는 웃으며 손 흔들게",
    "trivia": "레트로 트위스트 리듬 위에 슬픔을 위트 있게 날려버리는 정규 3집 수록곡입니다.",
    "itunesQuery": "잔나비 슬픔이여안녕",
    "itunesTrackId": 1425784227,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/ab/af/4a/abaf4aae-43e9-7bf6-496b-b7f22b4b2bb6/mzaf_17723456627602793779.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music118/v4/f9/ce/26/f9ce26c0-1b29-3a92-29de-4edce3c4b293/cover-_DS.jpg/600x600bb.jpg"
  },
  {
    "id": "jannabi-102",
    "category": "잔나비",
    "artist": "잔나비",
    "artistEn": "JANNABI",
    "artistAliases": [
      "잔나비",
      "JANNABI"
    ],
    "title": "She",
    "titleEn": "She (Hidden Track No.V 1월 선정곡)",
    "titleAliases": [
      "She",
      "쉬"
    ],
    "koreanRead": "쉬",
    "releaseYear": "2017",
    "album": "She - Single",
    "lyricHint": "She is the moonlight in the shadow / 흩날리는 밤하늘 아래",
    "trivia": "네이버 히든트랙을 통해 공개된 후 수많은 팬들의 최애곡으로 꼽히는 잔나비의 서정 발라드입니다.",
    "itunesQuery": "잔나비 She",
    "itunesTrackId": 1281470015,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/1d/da/39/1dda39c0-908b-7eb7-6f75-ac107aa75a0c/mzaf_16231129250318181984.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music118/v4/4b/8c/0f/4b8c0f1e-472e-732b-8dd8-f4a690ef95db/cover-_DS.jpg/600x600bb.jpg"
  },
  {
    "id": "ive-102",
    "category": "아이브",
    "artist": "아이브",
    "artistEn": "IVE",
    "artistAliases": [
      "아이브",
      "IVE"
    ],
    "title": "Holy Moly",
    "titleEn": "Holy Moly",
    "titleAliases": [
      "Holy Moly",
      "홀리 몰리"
    ],
    "koreanRead": "홀리 몰리",
    "releaseYear": "2023",
    "album": "I'VE MINE - EP",
    "lyricHint": "Holy moly 말도 안 돼 / 마음을 뺏겨버린 순간",
    "trivia": "I'VE MINE 앨범 수록곡으로 통통 튀는 브라스 사운드가 매력적인 인기 수록곡입니다.",
    "itunesQuery": "아이브 Holy Moly",
    "itunesTrackId": 1709569476,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/e4/a9/bd/e4a9bdb8-e0fc-a487-e352-3d1ccaec5046/mzaf_12705680602776557343.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/2e/a2/87/2ea2870f-9700-bb4e-df68-abd2acfb5fb9/197189809583.jpg/600x600bb.jpg"
  },
  {
    "id": "ive-103",
    "category": "아이브",
    "artist": "아이브",
    "artistEn": "IVE",
    "artistAliases": [
      "아이브",
      "IVE"
    ],
    "title": "Lips",
    "titleEn": "Lips",
    "titleAliases": [
      "Lips",
      "립스"
    ],
    "koreanRead": "립스",
    "releaseYear": "2023",
    "album": "I've IVE",
    "lyricHint": "입술 끝에 맴도는 비밀 / 속삭여줄래",
    "trivia": "정규 1집 I've IVE에 수록되어 부드러운 R&B 팝 멜로디로 큰 사랑을 받은 트랙입니다.",
    "itunesQuery": "아이브 Lips",
    "itunesTrackId": 1680047542,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/72/7a/e8/727ae848-95c9-ce96-87f7-8bbeb163ad35/mzaf_16943777619710069669.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/3a/23/b7/3a23b7f4-0b43-df9d-b7e4-14f992443324/197188335663.jpg/600x600bb.jpg"
  },
  {
    "id": "aespa-101",
    "category": "에스파",
    "artist": "에스파",
    "artistEn": "aespa",
    "artistAliases": [
      "에스파",
      "aespa"
    ],
    "title": "Live My Life",
    "titleEn": "Live My Life",
    "titleAliases": [
      "Live My Life",
      "라이브 마이 라이프"
    ],
    "koreanRead": "라이브 마이 라이프",
    "releaseYear": "2024",
    "album": "Armageddon - The 1st Album",
    "lyricHint": "내 인생은 나의 것 / 후회 없이 소리쳐",
    "trivia": "정규 1집 수록곡으로 청량한 팝 록 사운드와 에스파의 시원한 고음이 돋보이는 힐링송입니다.",
    "itunesQuery": "에스파 Live My Life",
    "itunesTrackId": 1773694657,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/37/2e/87/372e8748-25cc-a921-cfc9-441a186a7753/mzaf_16352096618358419925.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/50/7e/e0/507ee09f-ccfd-1e3c-af90-ca5e92b1221b/00888735949869_Cover.jpg/600x600bb.jpg"
  },
  {
    "id": "aespa-102",
    "category": "에스파",
    "artist": "에스파",
    "artistEn": "aespa",
    "artistAliases": [
      "에스파",
      "aespa"
    ],
    "title": "Thirsty",
    "titleEn": "Thirsty",
    "titleAliases": [
      "Thirsty",
      "써스티"
    ],
    "koreanRead": "써스티",
    "releaseYear": "2023",
    "album": "MY WORLD - The 3rd Mini Album - EP",
    "lyricHint": "너란 오아시스에 목이 말라 / Deeply thirsty",
    "trivia": "미니 3집 MY WORLD 수록곡으로 트렌디한 R&B 비트 위에 달콤한 보컬이 어우러진 명곡입니다.",
    "itunesQuery": "에스파 Thirsty",
    "itunesTrackId": 1685400191,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/32/57/c2/3257c275-629e-1e88-3e19-f4d654a27f0b/mzaf_2840809668788078948.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/af/2c/6d/af2c6d62-0ebc-2dff-17b3-8eeb2b3986a0/888735943621.jpg/600x600bb.jpg"
  },
  {
    "id": "aespa-103",
    "category": "에스파",
    "artist": "에스파",
    "artistEn": "aespa",
    "artistAliases": [
      "에스파",
      "aespa"
    ],
    "title": "Illusion",
    "titleEn": "Illusion (도깨비불)",
    "titleAliases": [
      "Illusion",
      "도깨비불",
      "일루전"
    ],
    "koreanRead": "도깨비불",
    "releaseYear": "2022",
    "album": "Girls - The 2nd Mini Album (Apple Music Edition)",
    "lyricHint": "유혹하는 도깨비불을 따라 / Follow me",
    "trivia": "미니 2집 Girls 선공개곡으로 쫀득한 베이스와 독특한 도깨비불 테마가 인상적인 트랙입니다.",
    "itunesQuery": "에스파 Illusion",
    "itunesTrackId": 1626752986,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/88/56/bb/8856bb25-a7e1-93c9-801a-553c38206d78/mzaf_12921002806601753640.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/c9/7d/dd/c97ddd34-5962-8cf1-a55c-cf730d3069f5/888735941375.jpg/600x600bb.jpg"
  },
  {
    "id": "qwer-101",
    "category": "인기 아이돌",
    "artist": "QWER",
    "artistEn": "QWER",
    "artistAliases": [
      "QWER",
      "큐더블유이알"
    ],
    "title": "Discord",
    "titleEn": "Discord",
    "titleAliases": [
      "Discord",
      "디스코드"
    ],
    "koreanRead": "디스코드",
    "releaseYear": "2023",
    "album": "1st Single Album 'Harmony from Discord' - EP",
    "lyricHint": "우리의 불협화음도 특별한 음악이 돼 / Discord",
    "trivia": "QWER의 데뷔곡으로 유튜브와 숏폼을 뜨겁게 달구며 역주행 신화를 쓴 곡입니다.",
    "itunesQuery": "QWER Discord",
    "itunesTrackId": 1711740155,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/d1/47/54/d14754a4-05fc-eac8-3918-77352c77f395/mzaf_997215286308469551.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/57/1b/2b/571b2b61-77b0-03b4-fa64-fdfef50beaad/cover_KM0018677_1.jpg/600x600bb.jpg"
  },
  {
    "id": "qwer-102",
    "category": "인기 아이돌",
    "artist": "QWER",
    "artistEn": "QWER",
    "artistAliases": [
      "QWER",
      "큐더블유이알"
    ],
    "title": "가짜 아이돌",
    "titleEn": "Fake Idol",
    "titleAliases": [
      "가짜 아이돌"
    ],
    "koreanRead": "가짜 아이돌",
    "releaseYear": "2024",
    "album": "FAKE IDOL - Single",
    "lyricHint": "진짜든 가짜든 상관없어 / 내 마음을 노래할래",
    "trivia": "통통 튀는 펑크 록 사운드에 당찬 메시지를 담아낸 미니 2집 선공개곡입니다.",
    "itunesQuery": "QWER 가짜 아이돌",
    "itunesTrackId": 1765233147,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/0b/94/95/0b9495ef-2567-faec-15a0-33698c6b3ba7/mzaf_2678608963391552635.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/d0/a8/51/d0a851ab-061e-115c-7264-b198fa7f2e19/cover_KM0020310_1.jpg/600x600bb.jpg"
  },
  {
    "id": "newjeans-104",
    "category": "인기 아이돌",
    "artist": "뉴진스",
    "artistEn": "NewJeans",
    "artistAliases": [
      "뉴진스",
      "NewJeans"
    ],
    "title": "ETA",
    "titleEn": "ETA",
    "titleAliases": [
      "ETA",
      "이티에이"
    ],
    "koreanRead": "이티에이",
    "releaseYear": "2023",
    "album": "NewJeans 2nd EP 'Get Up'",
    "lyricHint": "낭비하지 마 네 시간은 은행 / What's your ETA?",
    "trivia": "아이폰으로 뮤직비디오를 촬영하고 브레이크비트의 속도감으로 귀를 사로잡은 트랙입니다.",
    "itunesQuery": "뉴진스 ETA",
    "itunesTrackId": 1695951900,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/fb/eb/dc/fbebdc04-d035-0b34-6df7-7c7e73e1c5ce/mzaf_1666920854414573023.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/d3/4b/7e/d34b7e1e-af3b-43b6-2949-7a8c652a1bc9/196922462726_Cover.jpg/600x600bb.jpg"
  },
  {
    "id": "newjeans-105",
    "category": "인기 아이돌",
    "artist": "뉴진스",
    "artistEn": "NewJeans",
    "artistAliases": [
      "뉴진스",
      "NewJeans"
    ],
    "title": "OMG",
    "titleEn": "OMG",
    "titleAliases": [
      "OMG",
      "오엠지"
    ],
    "koreanRead": "오엠지",
    "releaseYear": "2023",
    "album": "NewJeans 'OMG' - Single",
    "lyricHint": "Oh my oh my God 예상했어 나 / 정말 난 우연이라 생각 안 해",
    "trivia": "UK 개러지와 트랩 리듬이 섞인 중독성 넘치는 힙합 R&B 히트곡입니다.",
    "itunesQuery": "뉴진스 OMG",
    "itunesTrackId": 1659513445,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/a7/d4/4a/a7d44a6d-0044-36dc-4061-a90fb469c849/mzaf_14382190698601624004.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music113/v4/48/96/08/4896085e-b550-cb0a-3e5b-1f203521cb82/196922265464_Cover.jpg/600x600bb.jpg"
  },
  {
    "id": "newjeans-106",
    "category": "인기 아이돌",
    "artist": "뉴진스",
    "artistEn": "NewJeans",
    "artistAliases": [
      "뉴진스",
      "NewJeans"
    ],
    "title": "Bubble Gum",
    "titleEn": "Bubble Gum",
    "titleAliases": [
      "Bubble Gum",
      "버블 검"
    ],
    "koreanRead": "버블 검",
    "releaseYear": "2024",
    "album": "How Sweet - EP",
    "lyricHint": "달콤한 풍선껌을 불어 / 하늘 높이 날아올라",
    "trivia": "일본 데뷔 싱글 수록곡이자 시티팝 감성이 물씬 풍기는 청량한 힐링 트랙입니다.",
    "itunesQuery": "뉴진스 Bubble Gum",
    "itunesTrackId": 1744448549,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/94/d6/aa/94d6aab6-6654-5aca-dbf8-9874b7975bcd/mzaf_16231939766265640228.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/bf/68/ca/bf68ca64-4acd-543f-bc78-455f11f06105/196922889738_Cover.jpg/600x600bb.jpg"
  },
  {
    "id": "bss-109",
    "category": "인기 아이돌",
    "artist": "부석순 (SEVENTEEN)",
    "artistEn": "BSS",
    "artistAliases": [
      "부석순",
      "BSS",
      "세븐틴"
    ],
    "title": "파이팅 해야지",
    "titleEn": "Fighting (feat. Lee Young Ji)",
    "titleAliases": [
      "파이팅 해야지",
      "파이팅해야지"
    ],
    "koreanRead": "파이팅 해야지",
    "releaseYear": "2023",
    "album": "SECOND WIND",
    "lyricHint": "파이팅 해야지 힘내야지 / 걷다 보면 끝이 나겠지",
    "trivia": "이영지의 차진 랩과 부석순의 비타민 같은 에너지로 출근길 전국민을 응원한 국민 노동요입니다.",
    "itunesQuery": "부석순 (SEVENTEEN) 파이팅 해야지",
    "itunesTrackId": 1668145595,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/1e/d7/70/1ed770be-2291-1a32-4a96-3efc348738da/mzaf_3487491780203244552.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music123/v4/df/ec/37/dfec37b0-9c39-dfce-fefe-61cfd05e1680/196922266546_Cover.jpg/600x600bb.jpg"
  },
  {
    "id": "riize-110",
    "category": "인기 아이돌",
    "artist": "라이즈",
    "artistEn": "RIIZE",
    "artistAliases": [
      "라이즈",
      "RIIZE"
    ],
    "title": "Siren",
    "titleEn": "Siren",
    "titleAliases": [
      "Siren",
      "사이렌"
    ],
    "koreanRead": "사이렌",
    "releaseYear": "2024",
    "album": "Siren - Single",
    "lyricHint": "비상경보 사이렌을 울려라 / 압도적인 퍼포먼스",
    "trivia": "데뷔 전 퍼포먼스 비디오로 전 세계 K-POP 팬들에게 충격을 안겨준 고난도 안무의 곡입니다.",
    "itunesQuery": "라이즈 Siren",
    "itunesTrackId": 1737853820,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/3e/f6/de/3ef6de67-a44d-2e27-9d63-fe900d90cd3c/mzaf_1177420738761066409.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/5f/6b/7b/5f6b7bc8-46fd-5333-15e3-03fe8cfb5f9d/888735947322.jpg/600x600bb.jpg"
  },
  {
    "id": "tws-111",
    "category": "인기 아이돌",
    "artist": "TWS (투어스)",
    "artistEn": "TWS",
    "artistAliases": [
      "TWS",
      "투어스"
    ],
    "title": "내가 S면 넌 나의 N이 되어줘",
    "titleEn": "If I'm S, Can You Be My N?",
    "titleAliases": [
      "내가 S면 넌 나의 N이 되어줘"
    ],
    "koreanRead": "내가 에스면 넌 나의 엔이 되어줘",
    "releaseYear": "2026",
    "album": "SODA SODA - Single",
    "lyricHint": "자석처럼 서로에게 끌리는 우리 / S와 N",
    "trivia": "서로 다른 극이 만나 완성되는 특별한 인연을 청량하게 노래한 미니 2집 타이틀곡입니다.",
    "itunesQuery": "TWS (투어스) 내가 S면 넌 나의 N이 되어줘",
    "itunesTrackId": 6793458545,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/28/d8/87/28d88716-7965-ca46-1519-c36511d566bc/mzaf_3863140239834726902.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/89/e4/0c/89e40cb0-ba79-0890-d87f-c9c685891418/26UMGIM92720.rgb.jpg/600x600bb.jpg"
  },
  {
    "id": "tws-112",
    "category": "인기 아이돌",
    "artist": "TWS (투어스)",
    "artistEn": "TWS",
    "artistAliases": [
      "TWS",
      "투어스"
    ],
    "title": "마지막 축제",
    "titleEn": "Last Festival",
    "titleAliases": [
      "마지막 축제"
    ],
    "koreanRead": "마지막 축제",
    "releaseYear": "2024",
    "album": "Last Bell",
    "lyricHint": "이 밤이 끝나도 우리의 노래는 영원해",
    "trivia": "2024~2025년 겨울 투어스가 선보인 서정적이고 벅찬 감정선의 대표 싱글입니다.",
    "itunesQuery": "TWS (투어스) 마지막 축제",
    "itunesTrackId": 1779150394,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/0a/79/40/0a79406f-d5c6-5c1f-e416-c4dd8baf922c/mzaf_9480888549397134244.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/f4/4e/ba/f44ebacd-1e87-d3ec-79d5-f3dde10b9cab/198704208546_Cover.jpg/600x600bb.jpg"
  },
  {
    "id": "kissoflife-114",
    "category": "인기 아이돌",
    "artist": "키스오브라이프",
    "artistEn": "KISS OF LIFE",
    "artistAliases": [
      "키스오브라이프",
      "키오프",
      "KISS OF LIFE"
    ],
    "title": "Shhh",
    "titleEn": "Shhh",
    "titleAliases": [
      "Shhh",
      "쉬"
    ],
    "koreanRead": "쉬",
    "releaseYear": "2023",
    "album": "KISS OF LIFE - EP",
    "lyricHint": "쉿 비밀스러운 우리들만의 파티",
    "trivia": "키스오브라이프의 독보적인 라이브 보컬과 당당한 매력을 각인시킨 강렬한 데뷔곡입니다.",
    "itunesQuery": "키스오브라이프 Shhh",
    "itunesTrackId": 1694699907,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/88/d8/46/88d8463e-d392-9cc1-8a3e-a8c23c00306f/mzaf_3277561497758761979.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/da/29/02/da29023d-6e10-bdd2-7415-ffaa1d5bf481/cover_KM0017387_1.jpg/600x600bb.jpg"
  },
  {
    "id": "babymonster-115",
    "category": "인기 아이돌",
    "artist": "베이비몬스터",
    "artistEn": "BABYMONSTER",
    "artistAliases": [
      "베이비몬스터",
      "베몬",
      "BABYMONSTER"
    ],
    "title": "SHEESH",
    "titleEn": "SHEESH",
    "titleAliases": [
      "SHEESH",
      "쉬시"
    ],
    "koreanRead": "쉬시",
    "releaseYear": "2024",
    "album": "BABYMONS7ER - EP",
    "lyricHint": "B-A-B-Y-M-O-N / 쉬시 쉬시 쉬시 쉬",
    "trivia": "YG의 괴물 신인 베이비몬스터의 폭발적인 고음과 랩이 돋보이는 대표 히트곡입니다.",
    "itunesQuery": "베이비몬스터 SHEESH",
    "itunesTrackId": 1737962890,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/e8/0e/20/e80e2080-c1e6-f616-bec0-82fbd530da09/mzaf_402899695312688427.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/fb/68/85/fb68856f-4965-5d30-78ea-fe6bb261f4ff/3000px.jpg/600x600bb.jpg"
  },
  {
    "id": "babymonster-116",
    "category": "인기 아이돌",
    "artist": "베이비몬스터",
    "artistEn": "BABYMONSTER",
    "artistAliases": [
      "베이비몬스터",
      "베몬",
      "BABYMONSTER"
    ],
    "title": "DRIP",
    "titleEn": "DRIP",
    "titleAliases": [
      "DRIP",
      "드립"
    ],
    "koreanRead": "드립",
    "releaseYear": "2024",
    "album": "DRIP",
    "lyricHint": "지드래곤이 작곡에 참여한 트렌디하고 세련된 힙합 댄스 트랙입니다.",
    "trivia": "정규 1집 타이틀곡으로 지드래곤 특유의 그루브와 베몬의 스웨그가 만난 곡입니다.",
    "itunesQuery": "베이비몬스터 DRIP",
    "itunesTrackId": 1773262055,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/11/49/8d/11498d26-33f8-d33e-9641-0931f48c1530/mzaf_16154189721053536181.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/b9/e1/ef/b9e1ef3a-e3eb-8152-e91b-20aca0fc9ffd/BM_DRIP_Digital-Cover_4000.jpg/600x600bb.jpg"
  },
  {
    "id": "babymonster-117",
    "category": "인기 아이돌",
    "artist": "베이비몬스터",
    "artistEn": "BABYMONSTER",
    "artistAliases": [
      "베이비몬스터",
      "베몬",
      "BABYMONSTER"
    ],
    "title": "FOREVER",
    "titleEn": "FOREVER",
    "titleAliases": [
      "FOREVER",
      "포에버"
    ],
    "koreanRead": "포에버",
    "releaseYear": "2024",
    "album": "FOREVER - Single",
    "lyricHint": "눈부신 여름밤 영원히 꺼지지 않을 불꽃처럼",
    "trivia": "신스팝의 밝은 에너지와 시원한 가창력이 어우러진 여름 스페셜 싱글입니다.",
    "itunesQuery": "베이비몬스터 FOREVER",
    "itunesTrackId": 1753210716,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/d0/17/25/d0172580-1524-824c-7807-4c9e732b9c9b/mzaf_10594737550835540871.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/5b/2a/86/5b2a8611-2005-2287-1981-9edac10b795b/BABYMONSTER_FORVER.jpg/600x600bb.jpg"
  },
  {
    "id": "gidle-118",
    "category": "인기 아이돌",
    "artist": "(여자)아이들",
    "artistEn": "(G)I-DLE",
    "artistAliases": [
      "(여자)아이들",
      "아이들",
      "(G)I-DLE"
    ],
    "title": "클락션 (Klaxon)",
    "titleEn": "Klaxon",
    "titleAliases": [
      "클락션",
      "Klaxon"
    ],
    "koreanRead": "클락션",
    "releaseYear": "2024",
    "album": "I SWAY - EP",
    "lyricHint": "클락션을 울려 빵빵빵 / 내 마음을 고백할래",
    "trivia": "무더운 여름을 한 방에 날려버리는 시원한 브라스와 중독적인 후렴구의 서머 송입니다.",
    "itunesQuery": "(여자)아이들 클락션 (Klaxon)",
    "itunesTrackId": 1801934667,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/eb/0b/27/eb0b273d-119e-f800-4c0a-03880e500534/mzaf_2522507805052497508.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/ec/4e/ff/ec4eff34-d69a-b1c7-df76-5511c14b7fd4/198704037542.jpg/600x600bb.jpg"
  },
  {
    "id": "plave-119",
    "category": "인기 아이돌",
    "artist": "플레이브 (PLAVE)",
    "artistEn": "PLAVE",
    "artistAliases": [
      "플레이브",
      "PLAVE"
    ],
    "title": "WAY 4 LUV",
    "titleEn": "WAY 4 LUV",
    "titleAliases": [
      "WAY 4 LUV",
      "웨이 포 러브"
    ],
    "koreanRead": "웨이 포 러브",
    "releaseYear": "2024",
    "album": "ASTERUM : 134-1 - EP",
    "lyricHint": "사랑을 찾아 떠나는 우리들의 여정 / Way for love",
    "trivia": "버추얼 아이돌 최초로 공중파 음방 1위와 멜론 차트 정상을 정복한 플레이브의 명곡입니다.",
    "itunesQuery": "플레이브 (PLAVE) WAY 4 LUV",
    "itunesTrackId": 1732393370,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/55/0b/9a/550b9ad4-17f9-c17b-979c-68ada0ab2811/mzaf_3573603930208239944.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/97/09/40/970940a4-afc8-42a3-5fd1-ee003507fde6/Final_134-1_album_jacket_image.jpg/600x600bb.jpg"
  },
  {
    "id": "plave-120",
    "category": "인기 아이돌",
    "artist": "플레이브 (PLAVE)",
    "artistEn": "PLAVE",
    "artistAliases": [
      "플레이브",
      "PLAVE"
    ],
    "title": "펌프 업 더 볼륨!",
    "titleEn": "Pump Up The Volume!",
    "titleAliases": [
      "펌프 업 더 볼륨!",
      "펌프업더볼륨"
    ],
    "koreanRead": "펌프 업 더 볼륨",
    "releaseYear": "2024",
    "album": "Pump Up The Volume! - Single",
    "lyricHint": "볼륨을 더 높여봐 / 라디오 주파수에 실린 우리 사랑",
    "trivia": "아날로그 라디오 감성과 시원한 밴드 록 사운드로 멜론 1위를 차지한 서머 싱글입니다.",
    "itunesQuery": "플레이브 (PLAVE) 펌프 업 더 볼륨!",
    "itunesTrackId": 1762780956,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/eb/42/10/eb42108a-7240-1357-1efa-14109a4c06c3/mzaf_12163634898581150163.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/80/11/4b/80114b2d-78df-e4be-0559-54dccb3fb4be/8800261898086_cover.jpg/600x600bb.jpg"
  },
  {
    "id": "rosebrunomars-101",
    "category": "2026 차트",
    "artist": "로제 (ROSE) & 브루노 마스",
    "artistEn": "ROSE & Bruno Mars",
    "artistAliases": [
      "로제",
      "브루노 마스",
      "ROSE",
      "Bruno Mars"
    ],
    "title": "APT.",
    "titleEn": "APT.",
    "titleAliases": [
      "APT.",
      "아파트",
      "APT"
    ],
    "koreanRead": "아파트",
    "releaseYear": "2024",
    "album": "APT. - Single",
    "lyricHint": "아파트 아파트 / 아파트 아파트 / Uh, uh-huh, uh-huh",
    "trivia": "한국의 술자리 게임 아파트를 모티브로 전 세계 차트를 씹어먹은 세기의 글로벌 메가히트곡입니다.",
    "itunesQuery": "로제 (ROSE) & 브루노 마스 APT.",
    "itunesTrackId": 1773452221,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/7a/15/38/7a1538f3-f41a-a2eb-0f24-8eb6712ee043/mzaf_7740628412097685267.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/2d/1a/7d/2d1a7d91-587e-0ceb-d434-327bd66d9e86/075679628312.jpg/600x600bb.jpg"
  },
  {
    "id": "rose-102",
    "category": "2026 차트",
    "artist": "로제 (ROSE)",
    "artistEn": "ROSE",
    "artistAliases": [
      "로제",
      "ROSE"
    ],
    "title": "toxic till the end",
    "titleEn": "toxic till the end",
    "titleAliases": [
      "toxic till the end",
      "톡식 틸 디 엔드"
    ],
    "koreanRead": "톡식 틸 디 엔드",
    "releaseYear": "2024",
    "album": "rosie",
    "lyricHint": "지독하게 얽힌 사랑의 끝자락을 노래한 로제의 첫 정규 앨범 타이틀곡입니다.",
    "trivia": "솔직하고 대담한 노랫말과 감성적인 멜로디로 글로벌 차트를 점령한 트랙입니다.",
    "itunesQuery": "로제 (ROSE) toxic till the end",
    "itunesTrackId": 1771105929,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/45/15/49/451549d8-ddd7-dad4-0f3d-588a0c9d1b98/mzaf_17766988925119316702.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/2d/14/66/2d14661b-345b-d0f3-4e86-56ef626e68aa/075679629203.jpg/600x600bb.jpg"
  },
  {
    "id": "rose-103",
    "category": "2026 차트",
    "artist": "로제 (ROSE)",
    "artistEn": "ROSE",
    "artistAliases": [
      "로제",
      "ROSE"
    ],
    "title": "number one girl",
    "titleEn": "number one girl",
    "titleAliases": [
      "number one girl",
      "넘버 원 걸"
    ],
    "koreanRead": "넘버 원 걸",
    "releaseYear": "2024",
    "album": "rosie",
    "lyricHint": "너에게 오직 단 한 사람이고 싶어 / Your number one girl",
    "trivia": "로제가 팬들을 향한 진심 어린 고백을 담아 선공개한 어쿠스틱 감성 발라드입니다.",
    "itunesQuery": "로제 (ROSE) number one girl",
    "itunesTrackId": 1771105923,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/8e/9f/c0/8e9fc022-999c-1c16-51c0-f45ebddda026/mzaf_8590681836583902002.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/2d/14/66/2d14661b-345b-d0f3-4e86-56ef626e68aa/075679629203.jpg/600x600bb.jpg"
  },
  {
    "id": "zicojennie-104",
    "category": "2026 차트",
    "artist": "지코 (ZICO) & 제니",
    "artistEn": "ZICO & JENNIE",
    "artistAliases": [
      "지코",
      "제니",
      "ZICO",
      "JENNIE"
    ],
    "title": "SPOT!",
    "titleEn": "SPOT! (feat. JENNIE)",
    "titleAliases": [
      "SPOT!",
      "스팟"
    ],
    "koreanRead": "스팟",
    "releaseYear": "2024",
    "album": "SPOT! (feat. JENNIE) - Single",
    "lyricHint": "오늘 밤 우리 둘만의 특별한 자리 / Right on the spot",
    "trivia": "심플한 힙합 비트 위에 지코와 제니의 찰떡 케미스트리가 폭발한 2024년 국민 히트곡입니다.",
    "itunesQuery": "지코 (ZICO) & 제니 SPOT!",
    "itunesTrackId": 1742019076,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/6e/c5/04/6ec5043a-f032-9803-f6c2-55956d0da9f9/mzaf_7311793964113917388.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/2e/2c/9c/2e2c9cb1-7352-867a-013c-9c885a9f7f4e/196922944741_Cover.jpg/600x600bb.jpg"
  },
  {
    "id": "bibi-105",
    "category": "2026 차트",
    "artist": "비비 (BIBI)",
    "artistEn": "BIBI",
    "artistAliases": [
      "비비",
      "BIBI"
    ],
    "title": "밤양갱",
    "titleEn": "Bam Yang Gang",
    "titleAliases": [
      "밤양갱",
      "Bam Yang Gang"
    ],
    "koreanRead": "밤양갱",
    "releaseYear": "2024",
    "album": "Bam Yang Gang - Single",
    "lyricHint": "달디달고 달디달고 달디단 밤양갱 밤양갱",
    "trivia": "장기하가 작사 작곡하고 비비가 불러 대한민국에 양갱 열풍을 몰고 온 순수한 사랑 노래입니다.",
    "itunesQuery": "비비 (BIBI) 밤양갱",
    "itunesTrackId": 1729547611,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/b1/f5/5c/b1f55c57-76ee-524f-35b3-ba046034ac9e/mzaf_17010912782387954876.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/ba/31/d6/ba31d644-bb34-1e4c-5600-c403b83159ef/cover_KM0019491_1.png/600x600bb.jpg"
  },
  {
    "id": "bibi-106",
    "category": "2026 차트",
    "artist": "비비 (BIBI)",
    "artistEn": "BIBI",
    "artistAliases": [
      "비비",
      "BIBI"
    ],
    "title": "DERRE",
    "titleEn": "DERRE",
    "titleAliases": [
      "DERRE",
      "데레"
    ],
    "koreanRead": "데레",
    "releaseYear": "2024",
    "album": "Derre - Single",
    "lyricHint": "무심한 척 츤데레 같은 너의 태도 / DERRE",
    "trivia": "비비만의 몽환적이고 위트 있는 음색이 돋보이는 2024~2025 R&B 히트곡입니다.",
    "itunesQuery": "비비 (BIBI) DERRE",
    "itunesTrackId": 1778418692,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/90/a9/e8/90a9e855-7fb2-1c3a-1374-b80c3cd81b49/mzaf_4023063204682300078.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/f0/6e/9c/f06e9c54-debe-ee64-ae18-ca5ed7e1a83d/cover_KM0020590_1.jpg/600x600bb.jpg"
  },
  {
    "id": "eclipse-107",
    "category": "2026 차트",
    "artist": "이클립스 (ECLIPSE)",
    "artistEn": "ECLIPSE",
    "artistAliases": [
      "이클립스",
      "변우석",
      "ECLIPSE"
    ],
    "title": "소나기",
    "titleEn": "Sudden Shower",
    "titleAliases": [
      "소나기",
      "Sudden Shower"
    ],
    "koreanRead": "소나기",
    "releaseYear": "2024",
    "album": "Lovely Runner, Pt. 1 (Original Soundtrack)",
    "lyricHint": "그댄 선물 같은 소나기처럼 / 내 메마른 맘을 적셔주네요",
    "trivia": "드라마 <선재 업고 튀어>의 메인 테마곡으로 배우 변우석이 직접 불러 신드롬을 낳은 감성 록 발라드입니다.",
    "itunesQuery": "이클립스 (ECLIPSE) 소나기",
    "itunesTrackId": 1739750624,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/c1/7d/0e/c17d0eed-ff18-f551-46fc-5218bb7d390a/mzaf_16979871769398553272.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/41/84/09/418409b3-7485-6cc0-9533-584fb0eecfaf/888272132571_Cover.jpg/600x600bb.jpg"
  },
  {
    "id": "leemujin-108",
    "category": "2026 차트",
    "artist": "이무진",
    "artistEn": "Lee Mujin",
    "artistAliases": [
      "이무진"
    ],
    "title": "에피소드",
    "titleEn": "Episode",
    "titleAliases": [
      "에피소드",
      "Episode"
    ],
    "koreanRead": "에피소드",
    "releaseYear": "2023",
    "album": "Episode - Single",
    "lyricHint": "우리 참 좋았었는데 / 지나간 계절의 한 편의 에피소드처럼",
    "trivia": "찬란했던 사랑의 기억을 담백하면서도 애절하게 담아내 장기간 차트를 지킨 발라드입니다.",
    "itunesQuery": "이무진 에피소드",
    "itunesTrackId": 1786321555,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/f3/e2/46/f3e246ab-1b43-0209-729d-0d263b7a1901/mzaf_2636080177121459380.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/e4/9b/d3/e49bd30b-fbfb-71b1-d0aa-872aa6a0a278/8804775309342_cover.jpg/600x600bb.jpg"
  },
  {
    "id": "leemujin-110",
    "category": "2026 차트",
    "artist": "이무진",
    "artistEn": "Lee Mujin",
    "artistAliases": [
      "이무진"
    ],
    "title": "신호등",
    "titleEn": "Traffic light",
    "titleAliases": [
      "신호등",
      "Traffic light"
    ],
    "koreanRead": "신호등",
    "releaseYear": "2021",
    "album": "Traffic Light - Single",
    "lyricHint": "붉은색 푸른색 그 사이 3초 그 짧은 시간 / 노란색 빛을 내는 신호등",
    "trivia": "사회에 첫발을 디딘 청춘의 고뇌를 신호등에 빗대어 전 국민의 공감을 산 대표 메가히트곡입니다.",
    "itunesQuery": "이무진 신호등",
    "itunesTrackId": 1567544638,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/9c/b5/3a/9cb53a36-d58f-d9a8-b23c-5bc1d28ef431/mzaf_17732560313905705620.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/1b/d7/a3/1bd7a3bb-7c77-7a72-dd2e-dfb614c60182/cover-_ONLINE_COVER_0506.jpg/600x600bb.jpg"
  },
  {
    "id": "woody-111",
    "category": "2026 차트",
    "artist": "우디 (Woody)",
    "artistEn": "Woody",
    "artistAliases": [
      "우디",
      "Woody"
    ],
    "title": "사막에서 꽃을 피우듯",
    "titleEn": "Flower in the desert",
    "titleAliases": [
      "사막에서 꽃을 피우듯"
    ],
    "koreanRead": "사막에서 꽃을 피우듯",
    "releaseYear": "2023",
    "album": "Flower in the Desert - Single",
    "lyricHint": "척박한 삶 속에서도 널 향한 사랑은 꽃을 피워",
    "trivia": "호소력 짙은 보이스로 멜론 발라드 차트 최정상을 정복한 우디의 불후의 명곡입니다.",
    "itunesQuery": "우디 (Woody) 사막에서 꽃을 피우듯",
    "itunesTrackId": 1696860541,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/59/a4/48/59a44804-1f18-33c2-0e7b-dcac4abbf7c0/mzaf_18287784573593937173.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/b9/cc/4e/b9cc4ef9-50ab-7f27-b5c9-7770617df7c0/01..jpg/600x600bb.jpg"
  },
  {
    "id": "limyoungwoong-113",
    "category": "2026 차트",
    "artist": "임영웅",
    "artistEn": "Lim Young Woong",
    "artistAliases": [
      "임영웅",
      "Lim Young Woong"
    ],
    "title": "온기",
    "titleEn": "Warmth",
    "titleAliases": [
      "온기"
    ],
    "koreanRead": "온기",
    "releaseYear": "2024",
    "album": "Warmth - Single",
    "lyricHint": "추운 겨울밤 시린 발끝을 녹여주는 온기처럼",
    "trivia": "임영웅이 직접 작사 작곡에 참여해 단편영화와 함께 큰 감동을 선사한 자작곡입니다.",
    "itunesQuery": "임영웅 온기",
    "itunesTrackId": 1744529397,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/24/6b/95/246b950f-bcc8-a9df-4302-75d0324a7ed6/mzaf_4895633552019474992.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/df/e6/45/dfe64568-3dae-6a67-36b9-4276c7556c89/cover_KM0019842_1.jpg/600x600bb.jpg"
  },
  {
    "id": "limyoungwoong-114",
    "category": "2026 차트",
    "artist": "임영웅",
    "artistEn": "Lim Young Woong",
    "artistAliases": [
      "임영웅",
      "Lim Young Woong"
    ],
    "title": "Home",
    "titleEn": "Home",
    "titleAliases": [
      "Home",
      "홈"
    ],
    "koreanRead": "홈",
    "releaseYear": "2024",
    "album": "Warmth - Single",
    "lyricHint": "언제든 돌아와 쉴 수 있는 너만의 집이 될게",
    "trivia": "신나는 하우스 비트와 따스한 가사로 영웅시대와 온 국민에게 힐링을 선사한 곡입니다.",
    "itunesQuery": "임영웅 Home",
    "itunesTrackId": 1744529396,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/99/42/6b/99426b40-5dd6-cd33-f98c-31a22809a7a6/mzaf_11326912503857060753.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/df/e6/45/dfe64568-3dae-6a67-36b9-4276c7556c89/cover_KM0019842_1.jpg/600x600bb.jpg"
  },
  {
    "id": "limyoungwoong-115",
    "category": "2026 차트",
    "artist": "임영웅",
    "artistEn": "Lim Young Woong",
    "artistAliases": [
      "임영웅",
      "Lim Young Woong"
    ],
    "title": "모래 알갱이",
    "titleEn": "Grain of Sand",
    "titleAliases": [
      "모래 알갱이"
    ],
    "koreanRead": "모래 알갱이",
    "releaseYear": "2023",
    "album": "Grain of Sand - Single",
    "lyricHint": "나는 작은 모래 알갱이 / 바람 불면 날아가",
    "trivia": "임영웅의 감미로운 휘파람 소리와 서정적인 멜로디가 돋보이는 자작곡 명곡입니다.",
    "itunesQuery": "임영웅 모래 알갱이",
    "itunesTrackId": 1699189912,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview116/v4/0c/76/4d/0c764db0-1223-bda7-5ade-8fb1a6d3bb68/mzaf_6178280437461332450.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/3b/88/53/3b885365-bc05-3aca-96cc-02fb5b8e52fe/8809933236300.jpg/600x600bb.jpg"
  },
  {
    "id": "10cm-124",
    "category": "2026 차트",
    "artist": "10CM",
    "artistEn": "10CM",
    "artistAliases": [
      "10CM",
      "십센치"
    ],
    "title": "봄이 좋냐??",
    "titleEn": "What The Spring??",
    "titleAliases": [
      "봄이 좋냐??",
      "봄이 좋냐"
    ],
    "koreanRead": "봄이 좋냐",
    "releaseYear": "2016",
    "album": "3.2 - Single",
    "lyricHint": "봄이 그렇게도 좋냐 멍청이들아 / 벚꽃이 그렇게도 예쁘디 바보들아",
    "trivia": "봄마다 찾아오는 커플 저격 솔로 애국가로 전국민의 웃음과 공감을 유발하는 명곡입니다.",
    "itunesQuery": "10CM 봄이 좋냐??",
    "itunesTrackId": 1747833892,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/cc/4f/d1/cc4fd1c2-234a-9603-65a5-2b2734d98cf1/mzaf_11551298805648114696.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/e5/93/a3/e593a327-755a-0ac3-157a-800389822c0c/5056005043981.jpg/600x600bb.jpg"
  },
  {
    "id": "jungkook-130",
    "category": "2026 차트",
    "artist": "정국 (Jungkook)",
    "artistEn": "Jung Kook",
    "artistAliases": [
      "정국",
      "방탄소년단",
      "Jung Kook"
    ],
    "title": "Seven",
    "titleEn": "Seven (feat. Latto)",
    "titleAliases": [
      "Seven",
      "세븐"
    ],
    "koreanRead": "세븐",
    "releaseYear": "2023",
    "album": "GOLDEN",
    "lyricHint": "Monday Tuesday Wednesday Thursday Friday Saturday Sunday / 7 days a week",
    "trivia": "빌보드 핫100 1위와 전 세계 스트리밍 기록을 갈아치운 정국의 글로벌 메가팝 히트곡입니다.",
    "itunesQuery": "정국 (Jungkook) Seven",
    "itunesTrackId": 1709555102,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/87/fc/7c/87fc7ced-ace9-2ec4-2e8a-c9a64c841a15/mzaf_3965990725450677139.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/86/78/b4/8678b4b3-2341-7239-b6cb-bcfdaef0e4e0/196922656545_Cover.jpg/600x600bb.jpg"
  },
  {
    "id": "jungkook-131",
    "category": "2026 차트",
    "artist": "정국 (Jungkook)",
    "artistEn": "Jung Kook",
    "artistAliases": [
      "정국",
      "방탄소년단",
      "Jung Kook"
    ],
    "title": "Standing Next to You",
    "titleEn": "Standing Next to You",
    "titleAliases": [
      "Standing Next to You",
      "스탠딩 넥스트 투 유"
    ],
    "koreanRead": "스탠딩 넥스트 투 유",
    "releaseYear": "2023",
    "album": "GOLDEN",
    "lyricHint": "깊은 사랑의 결속을 마이클 잭슨 오마주 펑크 사운드로 승화시킨 역대급 퍼포먼스 곡입니다.",
    "trivia": "화려한 브라스와 압도적인 보컬로 빌보드를 강타한 솔로 정규 앨범 타이틀곡입니다.",
    "itunesQuery": "정국 (Jungkook) Standing Next to You",
    "itunesTrackId": 1709554997,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/17/e4/44/17e4443f-ccac-37e9-ae7e-c27652c8bb7c/mzaf_1611321858020850805.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/86/78/b4/8678b4b3-2341-7239-b6cb-bcfdaef0e4e0/196922656545_Cover.jpg/600x600bb.jpg"
  },
  {
    "id": "jannabi-105",
    "category": "잔나비",
    "artist": "잔나비",
    "artistEn": "JANNABI",
    "artistAliases": [
      "잔나비",
      "JANNABI"
    ],
    "title": "Wish",
    "titleEn": "Wish",
    "titleAliases": [
      "Wish",
      "위시"
    ],
    "koreanRead": "위시",
    "releaseYear": "2016",
    "album": "Monkey Hotel",
    "lyricHint": "마음 깊은 곳에서 피어나는 작은 소망 / Wish",
    "trivia": "잔나비 특유의 빈티지 아날로그 감성이 돋보이는 따뜻한 트랙입니다.",
    "itunesQuery": "잔나비 Wish",
    "itunesTrackId": 1140706731,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/79/c2/28/79c22882-d7f1-e0e4-9e78-10092551bee5/mzaf_12769544688894987974.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/30/d9/0b/30d90b00-84b7-4e9b-1452-823049e36d09/COVER-_JANNABI.jpg/600x600bb.jpg"
  },
  {
    "id": "aespa-105",
    "category": "에스파",
    "artist": "에스파",
    "artistEn": "aespa",
    "artistAliases": [
      "에스파",
      "aespa"
    ],
    "title": "Life's Too Short",
    "titleEn": "Life's Too Short (English Ver.)",
    "titleAliases": [
      "Life's Too Short",
      "라이프스 투 쇼트"
    ],
    "koreanRead": "라이프스 투 쇼트",
    "releaseYear": "2022",
    "album": "Girls - The 2nd Mini Album (Apple Music Edition)",
    "lyricHint": "한 번뿐인 인생 남의 시선에 얽매이지 말고 즐겨",
    "trivia": "경쾌한 기타 리프와 에스파 멤버들의 사랑스러운 보컬이 어우러진 힐링 팝송입니다.",
    "itunesQuery": "에스파 Life's Too Short",
    "itunesTrackId": 1626752998,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/79/73/d1/7973d187-1163-ff18-10e6-858916d27b22/mzaf_1347425210640906679.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/c9/7d/dd/c97ddd34-5962-8cf1-a55c-cf730d3069f5/888735941375.jpg/600x600bb.jpg"
  },
  {
    "id": "akmu-103",
    "category": "악뮤",
    "artist": "악뮤",
    "artistEn": "AKMU",
    "artistAliases": [
      "악뮤",
      "악동뮤지션",
      "AKMU"
    ],
    "title": "얼음들",
    "titleEn": "Melted",
    "titleAliases": [
      "얼음들",
      "Melted"
    ],
    "koreanRead": "얼음들",
    "releaseYear": "2014",
    "album": "PLAY",
    "lyricHint": "붉은 해가 저물 때쯤 세상에 남겨진 아이 / 얼음들이 녹아내리면",
    "trivia": "차갑고 어른스러운 세상을 얼음에 비유해 깊은 울림을 준 악뮤 정규 1집의 걸작 타이틀곡입니다.",
    "itunesQuery": "악뮤 얼음들",
    "itunesTrackId": 1316852698,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/01/00/a7/0100a73a-1b9b-78f7-a141-daa6b5b0075b/mzaf_4336070834637914798.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/0d/fc/aa/0dfcaa7f-c686-e945-85e1-73aece780869/AKMU-PLAY_DS_cover.jpg/600x600bb.jpg"
  },
  {
    "id": "riize-121",
    "category": "인기 아이돌",
    "artist": "라이즈",
    "artistEn": "RIIZE",
    "artistAliases": [
      "라이즈",
      "RIIZE"
    ],
    "title": "Impossible",
    "titleEn": "Impossible",
    "titleAliases": [
      "Impossible",
      "임파서블"
    ],
    "koreanRead": "임파서블",
    "releaseYear": "2024",
    "album": "Impossible - Single",
    "lyricHint": "불가능은 없어 함께 달리는 지금 / Impossible",
    "trivia": "하우스 댄스 비트 위에 라이즈의 고난도 브레이킹 풋워크 퍼포먼스가 빛나는 싱글입니다.",
    "itunesQuery": "라이즈 Impossible",
    "itunesTrackId": 1739807503,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/6a/49/6c/6a496c61-2969-8213-a68d-c40c1f9f33fc/mzaf_1932960499999738757.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/26/dd/35/26dd3596-341b-c40c-8a3d-7a2ab9e166aa/888735947346.jpg/600x600bb.jpg"
  },
  {
    "id": "tws-122",
    "category": "인기 아이돌",
    "artist": "TWS (투어스)",
    "artistEn": "TWS",
    "artistAliases": [
      "TWS",
      "투어스"
    ],
    "title": "hey! hey!",
    "titleEn": "hey! hey!",
    "titleAliases": [
      "hey! hey!",
      "헤이헤이"
    ],
    "koreanRead": "헤이 헤이",
    "releaseYear": "2024",
    "album": "hey! hey! - Single",
    "lyricHint": "심장을 두드리는 여름날의 질주 / Hey hey",
    "trivia": "청춘의 거침없는 에너지를 록 기타 사운드에 실어 보낸 미니 2집 선공개곡입니다.",
    "itunesQuery": "TWS (투어스) hey! hey!",
    "itunesTrackId": 1747783884,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/85/99/61/85996160-7ac7-3d12-8ef6-e4c3289cd621/mzaf_15977848521858499848.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/20/66/32/2066323d-435f-e6d7-5c32-907903719e36/196922975615_Cover.jpg/600x600bb.jpg"
  },
  {
    "id": "boynextdoor-123",
    "category": "인기 아이돌",
    "artist": "보이넥스트도어",
    "artistEn": "BOYNEXTDOOR",
    "artistAliases": [
      "보이넥스트도어",
      "보넥도",
      "BOYNEXTDOOR"
    ],
    "title": "Nice Guy",
    "titleEn": "Nice Guy",
    "titleAliases": [
      "Nice Guy",
      "나이스 가이"
    ],
    "koreanRead": "나이스 가이",
    "releaseYear": "2024",
    "album": "19.99",
    "lyricHint": "세상 사람 모두 날 좋아할 걸 / 난 꽤 괜찮은 나이스 가이",
    "trivia": "위트 넘치고 친근한 매력으로 멜론 차트를 강타한 미니 3집 19.99 타이틀곡입니다.",
    "itunesQuery": "보이넥스트도어 Nice Guy",
    "itunesTrackId": 1765199947,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/ab/04/c4/ab04c4c6-94de-c4a6-20f8-acda2135af96/mzaf_13993952372532911340.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/25/fe/7a/25fe7a3c-09c5-fedd-418e-42c8d03b115e/198704113956_Cover.jpg/600x600bb.jpg"
  },
  {
    "id": "boynextdoor-124",
    "category": "인기 아이돌",
    "artist": "보이넥스트도어",
    "artistEn": "BOYNEXTDOOR",
    "artistAliases": [
      "보이넥스트도어",
      "보넥도",
      "BOYNEXTDOOR"
    ],
    "title": "부모님 관람불가",
    "titleEn": "Dangerous",
    "titleAliases": [
      "부모님 관람불가",
      "Dangerous"
    ],
    "koreanRead": "부모님 관람불가",
    "releaseYear": "2024",
    "album": "19.99",
    "lyricHint": "한밤중 부모님 몰래 벌이는 장난스러운 일탈",
    "trivia": "재치 있는 가사와 강력한 비트로 Z세대의 큰 지지를 받은 선공개 트랙입니다.",
    "itunesQuery": "보이넥스트도어 부모님 관람불가",
    "itunesTrackId": 1765199816,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/e2/36/40/e23640b4-710e-2f51-c050-e61e6d90cfeb/mzaf_2683159328799596359.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/25/fe/7a/25fe7a3c-09c5-fedd-418e-42c8d03b115e/198704113956_Cover.jpg/600x600bb.jpg"
  },
  {
    "id": "nmixx-125",
    "category": "인기 아이돌",
    "artist": "엔믹스 (NMIXX)",
    "artistEn": "NMIXX",
    "artistAliases": [
      "엔믹스",
      "NMIXX"
    ],
    "title": "DICE",
    "titleEn": "DICE",
    "titleAliases": [
      "DICE",
      "다이스"
    ],
    "koreanRead": "다이스",
    "releaseYear": "2022",
    "album": "ENTWURF - EP",
    "lyricHint": "주사위를 던져 새로운 게임을 시작해 / Big wave",
    "trivia": "MIXX POP 장르의 정수를 보여준 엔믹스의 고난도 보컬과 랩이 돋보이는 곡입니다.",
    "itunesQuery": "엔믹스 (NMIXX) DICE",
    "itunesTrackId": 1688803369,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/17/fd/73/17fd73b6-dd64-3c49-dd9a-77295d828237/mzaf_11126041509939789163.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/86/27/38/86273818-e315-adec-fe27-c65bb5f9c982/738676860016_Cover.jpg/600x600bb.jpg"
  },
  {
    "id": "nmixx-126",
    "category": "인기 아이돌",
    "artist": "엔믹스 (NMIXX)",
    "artistEn": "NMIXX",
    "artistAliases": [
      "엔믹스",
      "NMIXX"
    ],
    "title": "Roller Coaster",
    "titleEn": "Roller Coaster",
    "titleAliases": [
      "Roller Coaster",
      "롤러코스터"
    ],
    "koreanRead": "롤러코스터",
    "releaseYear": "2023",
    "album": "Roller Coaster - Single",
    "lyricHint": "심장이 쿵 떨어지는 롤러코스터 같은 사랑",
    "trivia": "시원하고 몽환적인 신스팝 멜로디로 여름을 청량하게 물들인 선공개곡입니다.",
    "itunesQuery": "엔믹스 (NMIXX) Roller Coaster",
    "itunesTrackId": 1693911799,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/12/5d/aa/125daaff-28b5-6783-4da2-dff3496c6f45/mzaf_5219186873366998872.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/13/d8/26/13d826a9-7a4d-13ce-0ac6-50b308e98f79/738676860757_Cover.jpg/600x600bb.jpg"
  },
  {
    "id": "plave-128",
    "category": "인기 아이돌",
    "artist": "플레이브 (PLAVE)",
    "artistEn": "PLAVE",
    "artistAliases": [
      "플레이브",
      "PLAVE"
    ],
    "title": "기다릴게",
    "titleEn": "Wait For You",
    "titleAliases": [
      "기다릴게"
    ],
    "koreanRead": "기다릴게",
    "releaseYear": "2023",
    "album": "ASTERUM - Single",
    "lyricHint": "시간이 흘러도 난 여기서 널 기다릴게",
    "trivia": "버추얼 그룹 플레이브의 감동적인 시작을 알린 명곡 데뷔 타이틀곡입니다.",
    "itunesQuery": "플레이브 (PLAVE) 기다릴게",
    "itunesTrackId": 1676593845,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/5d/21/2d/5d212df6-9019-3118-3301-f7d6d47847de/mzaf_6866064467918947383.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/bb/da/78/bbda783a-b777-6a5c-d040-100090323307/Cover_PLAVE_ASTERUM.jpg/600x600bb.jpg"
  },
  {
    "id": "zerobaseone-129",
    "category": "인기 아이돌",
    "artist": "제로베이스원",
    "artistEn": "ZEROBASEONE",
    "artistAliases": [
      "제로베이스원",
      "제베원",
      "ZEROBASEONE",
      "ZB1"
    ],
    "title": "In Bloom",
    "titleEn": "In Bloom",
    "titleAliases": [
      "In Bloom",
      "인 블룸"
    ],
    "koreanRead": "인 블룸",
    "releaseYear": "2023",
    "album": "YOUTH IN THE SHADE - EP",
    "lyricHint": "찬란하게 피어나는 청춘의 꽃 / In bloom",
    "trivia": "A-ha의 Take On Me를 샘플링한 드럼 앤 베이스 비트의 화려한 데뷔곡입니다.",
    "itunesQuery": "제로베이스원 In Bloom",
    "itunesTrackId": 1694484118,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/b2/b4/31/b2b43189-00e6-1168-419c-a36ca503ab03/mzaf_15090784475278809828.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/88/54/86/88548618-63ed-4bf1-65dd-51fb0d4f2d57/888272119350_Cover.jpg/600x600bb.jpg"
  },
  {
    "id": "zerobaseone-130",
    "category": "인기 아이돌",
    "artist": "제로베이스원",
    "artistEn": "ZEROBASEONE",
    "artistAliases": [
      "제로베이스원",
      "제베원",
      "ZEROBASEONE",
      "ZB1"
    ],
    "title": "GOOD SO BAD",
    "titleEn": "GOOD SO BAD",
    "titleAliases": [
      "GOOD SO BAD",
      "굿 쏘 배드"
    ],
    "koreanRead": "굿 쏘 배드",
    "releaseYear": "2024",
    "album": "CINEMA PARADISE",
    "lyricHint": "놓칠 수 없는 찬란한 운명적 사랑",
    "trivia": "신스팝의 청량감과 켄지(KENZIE)의 프로듀싱이 빛나는 미니 4집 타이틀곡입니다.",
    "itunesQuery": "제로베이스원 GOOD SO BAD",
    "itunesTrackId": 1762581259,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/6f/87/a2/6f87a2f7-4b43-457e-8ab6-67d18f0d445a/mzaf_12606917803402962806.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/cd/f7/50/cdf75064-ce2e-5614-68f9-a577a3e7c793/198704105968_Cover.jpg/600x600bb.jpg"
  },
  {
    "id": "twice-131",
    "category": "인기 아이돌",
    "artist": "트와이스 (TWICE)",
    "artistEn": "TWICE",
    "artistAliases": [
      "트와이스",
      "TWICE"
    ],
    "title": "Talk that Talk",
    "titleEn": "Talk that Talk",
    "titleAliases": [
      "Talk that Talk",
      "톡댓톡"
    ],
    "koreanRead": "톡 댓 톡",
    "releaseYear": "2022",
    "album": "BETWEEN 1&2",
    "lyricHint": "밀고 당기지 말고 솔직하게 말해줘 / L-O-V-E",
    "trivia": "Y2K 감성의 경쾌한 비트와 트와이스의 사랑스러움이 담긴 대표 히트곡입니다.",
    "itunesQuery": "트와이스 (TWICE) Talk that Talk",
    "itunesTrackId": 1635656417,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/af/06/2d/af062de7-ce45-0e8f-d8b9-0ae4adf05bb4/mzaf_10856190615663409571.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/6d/80/45/6d8045ba-5b0e-c88a-0736-87fd14665e69/738676859874_Cover.jpg/600x600bb.jpg"
  },
  {
    "id": "nctdream-132",
    "category": "인기 아이돌",
    "artist": "NCT DREAM",
    "artistEn": "NCT DREAM",
    "artistAliases": [
      "NCT DREAM",
      "엔시티 드림"
    ],
    "title": "Smoothie",
    "titleEn": "Smoothie",
    "titleAliases": [
      "Smoothie",
      "스무디"
    ],
    "koreanRead": "스무디",
    "releaseYear": "2024",
    "album": "DREAM( )SCAPE - EP",
    "lyricHint": "세상의 부정적인 시선을 갈아 마셔버려 / Smoothie",
    "trivia": "808 베이스와 독특한 챈팅으로 음원 차트 1위를 차지한 NCT DREAM의 힙합 댄스곡입니다.",
    "itunesQuery": "NCT DREAM Smoothie",
    "itunesTrackId": 1766620528,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/1b/9f/55/1b9f5557-e0b3-43e1-e21e-ca858bb137a3/mzaf_4431400973122300170.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/48/92/f3/4892f356-56c2-d311-8638-3536c1d08706/00888735947056_Cover.jpg/600x600bb.jpg"
  },
  {
    "id": "nctdream-133",
    "category": "인기 아이돌",
    "artist": "NCT DREAM",
    "artistEn": "NCT DREAM",
    "artistAliases": [
      "NCT DREAM",
      "엔시티 드림"
    ],
    "title": "Candy",
    "titleEn": "Candy",
    "titleAliases": [
      "Candy",
      "캔디"
    ],
    "koreanRead": "캔디",
    "releaseYear": "2022",
    "album": "Candy - Winter Special Mini Album - EP",
    "lyricHint": "단지 널 사랑해 이렇게 말했지 / 머리 위에 눈송이",
    "trivia": "H.O.T.의 전설적인 국민 댄스곡을 현대적으로 재해석해 전국을 들썩이게 한 리메이크 명곡입니다.",
    "itunesQuery": "NCT DREAM Candy",
    "itunesTrackId": 1658222132,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/ae/c6/80/aec680cc-1eb1-f298-3a6a-9fd1040b3fe5/mzaf_2302057161762072219.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/41/0f/bd/410fbda4-aff9-9807-6014-f51bdd19fe3c/Digital_Cover_NCT_DREAM_Candy.jpg/600x600bb.jpg"
  },
  {
    "id": "babymonster-134",
    "category": "인기 아이돌",
    "artist": "베이비몬스터",
    "artistEn": "BABYMONSTER",
    "artistAliases": [
      "베이비몬스터",
      "베몬",
      "BABYMONSTER"
    ],
    "title": "CLIK CLAK",
    "titleEn": "CLIK CLAK",
    "titleAliases": [
      "CLIK CLAK",
      "클릭 클락"
    ],
    "koreanRead": "클릭 클락",
    "releaseYear": "2024",
    "album": "DRIP",
    "lyricHint": "멤버 전원이 랩에 참여한 힙하고 당당한 올드스쿨 힙합 트랙입니다.",
    "trivia": "정규 1집 더블 타이틀곡으로 베몬의 묵직한 스웨그를 보여준 곡입니다.",
    "itunesQuery": "베이비몬스터 CLIK CLAK",
    "itunesTrackId": 1773262054,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/68/23/cf/6823cf5d-d1e8-8594-e50f-a2c4e15d7e91/mzaf_871128485928153146.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/b9/e1/ef/b9e1ef3a-e3eb-8152-e91b-20aca0fc9ffd/BM_DRIP_Digital-Cover_4000.jpg/600x600bb.jpg"
  },
  {
    "id": "gidle-136",
    "category": "인기 아이돌",
    "artist": "(여자)아이들",
    "artistEn": "(G)I-DLE",
    "artistAliases": [
      "(여자)아이들",
      "아이들",
      "(G)I-DLE"
    ],
    "title": "Super Lady",
    "titleEn": "Super Lady",
    "titleAliases": [
      "Super Lady",
      "슈퍼 레이디"
    ],
    "koreanRead": "슈퍼 레이디",
    "releaseYear": "2024",
    "album": "2",
    "lyricHint": "Follow ladies / 온 세상 당당한 여성들을 향한 찬가",
    "trivia": "웅장한 드럼 비트와 소연의 폭발적인 인트로 샤우팅이 압도적인 곡입니다.",
    "itunesQuery": "(여자)아이들 Super Lady",
    "itunesTrackId": 1801725652,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/24/8b/af/248baf1c-0ec3-18e7-60f0-450e3fa75486/mzaf_16666085123936239867.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/52/34/27/5234273c-5585-261b-4fc5-b10cfd9bbd71/8804775368240.jpg/600x600bb.jpg"
  },
  {
    "id": "do-146",
    "category": "2026 차트",
    "artist": "디 오 (D.O.)",
    "artistEn": "D.O.",
    "artistAliases": [
      "디오",
      "도경수",
      "D.O."
    ],
    "title": "Popcorn",
    "titleEn": "Popcorn",
    "titleAliases": [
      "Popcorn",
      "팝콘"
    ],
    "koreanRead": "팝콘",
    "releaseYear": "2024",
    "album": "BLOSSOM - THE 3RD MINI ALBUM - EP",
    "lyricHint": "두근거리는 마음이 팝콘처럼 팡팡 터져",
    "trivia": "도경수의 달콤한 꿀보컬과 통통 튀는 어쿠스틱 팝 멜로디가 매력적인 인기곡입니다.",
    "itunesQuery": "디 오 (D.O.) Popcorn",
    "itunesTrackId": 1743749267,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/a8/42/0a/a8420a7e-d060-f908-d15c-bb57df421108/mzaf_14221130035911804642.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/c8/f8/7c/c8f87c57-f335-2faa-5260-5bd6de49cc9f/191953349695.jpg/600x600bb.jpg"
  },
  {
    "id": "jannabi-156",
    "category": "잔나비",
    "artist": "잔나비",
    "artistEn": "JANNABI",
    "artistAliases": [
      "잔나비",
      "JANNABI"
    ],
    "title": "환상의 나라",
    "titleEn": "The Land of Fantasy",
    "titleAliases": [
      "환상의 나라",
      "환상의나라"
    ],
    "koreanRead": "환상의 나라",
    "releaseYear": "2021",
    "album": "The Land of Fantasy",
    "lyricHint": "초록빛 언덕 너머 환상의 나라로 / 손잡고 걸어가요",
    "trivia": "한 편의 뮤지컬처럼 환상적인 오케스트레이션이 돋보이는 정규 3집 타이틀곡입니다.",
    "itunesQuery": "잔나비 환상의 나라",
    "itunesTrackId": 1578636384,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/58/d3/05/58d305b8-3ded-ba11-ecf1-0e693003a957/mzaf_2240474972401165509.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/2f/92/25/2f922513-0da1-5c2d-2ee2-c9cbca86457e/2.jpg/600x600bb.jpg"
  },
  {
    "id": "ive-157",
    "category": "아이브",
    "artist": "아이브",
    "artistEn": "IVE",
    "artistAliases": [
      "아이브",
      "IVE"
    ],
    "title": "All Night",
    "titleEn": "All Night (feat. Saweetie)",
    "titleAliases": [
      "All Night",
      "올 나이트"
    ],
    "koreanRead": "올 나이트",
    "releaseYear": "2026",
    "album": "Good Night Baby - White Noise for Peaceful Baby Sleep",
    "lyricHint": "We can do this all night / 춤추자 이 밤이 새도록",
    "trivia": "스웨덴 듀오 Icona Pop의 명곡을 아이브만의 화려한 보컬로 리메이크한 첫 영어 싱글입니다.",
    "itunesQuery": "아이브 All Night",
    "itunesTrackId": 6822183971,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/5e/e9/75/5ee9759f-0323-12d4-e837-e715b41a2a5b/mzaf_2389298820347987122.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/c1/a2/ce/c1a2ce12-bc78-85ea-9421-e9cab9c76442/4550795559314_cover.jpg/600x600bb.jpg"
  },
  {
    "id": "aespa-158",
    "category": "에스파",
    "artist": "에스파",
    "artistEn": "aespa",
    "artistAliases": [
      "에스파",
      "aespa"
    ],
    "title": "Forever",
    "titleEn": "Forever (약속)",
    "titleAliases": [
      "Forever",
      "포에버",
      "약속"
    ],
    "koreanRead": "포에버",
    "releaseYear": "1960",
    "album": "Forever - Single",
    "lyricHint": "영원히 네 곁을 지켜줄게 / 따뜻한 겨울의 약속",
    "trivia": "유영진의 원곡을 에스파의 맑은 음색과 어쿠스틱 발라드로 재해석한 감성적인 리메이크 곡입니다.",
    "itunesQuery": "에스파 Forever",
    "itunesTrackId": 1644992097,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/ed/84/ba/ed84ba09-34a4-44ad-9b37-4e9e0c686dd7/mzaf_16218783942392814943.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/b0/f3/65/b0f36597-900f-bfe0-a21f-9b3d42a3cf32/196925587570.jpg/600x600bb.jpg"
  },
  {
    "id": "day6-159",
    "category": "인기 아이돌",
    "artist": "DAY6",
    "artistEn": "DAY6",
    "artistAliases": [
      "DAY6",
      "데이식스"
    ],
    "title": "바래",
    "titleEn": "Wish",
    "titleAliases": [
      "바래"
    ],
    "koreanRead": "바래",
    "releaseYear": "2016",
    "album": "DAYDREAM - EP",
    "lyricHint": "너 하나만 내 곁에 있기를 간절히 바래",
    "trivia": "데이식스 특유의 짙은 감성과 시원한 밴드 연주가 돋보이는 콘서트 단골 트랙입니다.",
    "itunesQuery": "DAY6 바래",
    "itunesTrackId": 1689183518,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/34/1f/c5/341fc5d3-5b5a-5a8f-d37c-28af9c7830ba/mzaf_11837070976708811406.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/61/18/dd/6118ddc4-34fd-5e29-6f9e-9f29c3480e9a/738676856330_Cover.jpg/600x600bb.jpg"
  },
  {
    "id": "seventeen-160",
    "category": "인기 아이돌",
    "artist": "세븐틴",
    "artistEn": "SEVENTEEN",
    "artistAliases": [
      "세븐틴",
      "SEVENTEEN"
    ],
    "title": "음악의 신",
    "titleEn": "God of Music",
    "titleAliases": [
      "음악의 신"
    ],
    "koreanRead": "음악의 신",
    "releaseYear": "2023",
    "album": "God of Light Music - Single",
    "lyricHint": "쿵 치 팍 치 쿵 쿵 치 팍 치 예 / 음악의 신이 있다면 감사를",
    "trivia": "음악이 주는 행복과 축제를 소울 펑크 리듬에 담아 전 세계를 축제로 만든 힐링 찬가입니다.",
    "itunesQuery": "세븐틴 음악의 신",
    "itunesTrackId": 1721236863,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/bc/30/45/bc304502-5fa0-a95b-63b0-154575c04db8/mzaf_13621691845380995940.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/97/bb/26/97bb2659-8d2f-d574-191a-74f7b40648f6/196922762093_Cover.jpg/600x600bb.jpg"
  },
  {
    "id": "seventeen-161",
    "category": "인기 아이돌",
    "artist": "세븐틴",
    "artistEn": "SEVENTEEN",
    "artistAliases": [
      "세븐틴",
      "SEVENTEEN"
    ],
    "title": "MAESTRO",
    "titleEn": "MAESTRO",
    "titleAliases": [
      "MAESTRO",
      "마에스트로"
    ],
    "koreanRead": "마에스트로",
    "releaseYear": "2003",
    "album": "Para Siempre",
    "lyricHint": "지휘봉을 들고 세상을 리드해 / Maestro",
    "trivia": "세븐틴의 과거 명곡들을 오마주하며 음악 세계의 지휘자로 나선 베스트 앨범 타이틀곡입니다.",
    "itunesQuery": "세븐틴 MAESTRO",
    "itunesTrackId": 524664168,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/e8/02/df/e802dfd5-bae2-effe-8ec3-f22d1d0e2654/mzaf_4000855783182427273.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/f7/92/d7/f792d7a8-89c8-0827-b5d3-0ab40207ca5a/AVA-851699150725-Los_Telez_Para_Siempre_20_exitos.jpg/600x600bb.jpg"
  },
  {
    "id": "kissoflife-162",
    "category": "인기 아이돌",
    "artist": "키스오브라이프",
    "artistEn": "KISS OF LIFE",
    "artistAliases": [
      "키스오브라이프",
      "키오프",
      "KISS OF LIFE"
    ],
    "title": "Midas Touch",
    "titleEn": "Midas Touch",
    "titleAliases": [
      "Midas Touch",
      "마이더스 터치"
    ],
    "koreanRead": "마이더스 터치",
    "releaseYear": "1986",
    "album": "Headlines",
    "lyricHint": "손끝만 닿아도 온 세상이 금빛으로 변해",
    "trivia": "2000년대 정통 R&B 팝의 향수를 현대적으로 완벽하게 부활시킨 메가 히트곡입니다.",
    "itunesQuery": "키스오브라이프 Midas Touch",
    "itunesTrackId": 293070804,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/03/7d/ae/037daed0-890b-faa8-7887-ff9c9e8596c6/mzaf_8395644882693337099.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/e4/58/a5/e458a52e-1b35-e84b-4f35-93049a519b25/248.jpg/600x600bb.jpg"
  },
  {
    "id": "leemujin-163",
    "category": "2026 차트",
    "artist": "이무진",
    "artistEn": "Lee Mujin",
    "artistAliases": [
      "이무진"
    ],
    "title": "청혼하지 않을 이유를 못 찾았어",
    "titleEn": "Proposal",
    "titleAliases": [
      "청혼하지 않을 이유를 못 찾았어",
      "청혼이"
    ],
    "koreanRead": "청혼하지 않을 이유를 못 찾았어",
    "releaseYear": "2024",
    "album": "K-POP PIANO 12 - EP",
    "lyricHint": "너와 평생을 함께할 이유만이 내겐 가득해",
    "trivia": "축가 계의 새로운 역사를 쓰며 수많은 연인들의 사랑을 받은 이무진의 프러포즈 송입니다.",
    "itunesQuery": "이무진 청혼하지 않을 이유를 못 찾았어",
    "itunesTrackId": 1772637726,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/a9/72/32/a97232b5-633e-1e39-dcbd-278985fac04c/mzaf_3453165522134481579.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/10/7c/81/107c81c7-bb1f-0b04-7bd4-14a40ce5bbac/191953393124.jpg/600x600bb.jpg"
  },
  {
    "id": "woody-164",
    "category": "2026 차트",
    "artist": "우디 (Woody)",
    "artistEn": "Woody",
    "artistAliases": [
      "우디",
      "Woody"
    ],
    "title": "혹시 세상에 혼자 남겨진 것 같다면",
    "titleEn": "If you feel alone",
    "titleAliases": [
      "혹시 세상에 혼자 남겨진 것 같다면"
    ],
    "koreanRead": "혹시 세상에 혼자 남겨진 것 같다면",
    "releaseYear": "2024",
    "album": "K-POP PIANO 4 - EP",
    "lyricHint": "내가 네 곁에서 따뜻한 위로가 되어줄게",
    "trivia": "지친 일상에 깊은 온기를 불어넣으며 역주행 돌풍을 일으킨 힐링 발라드입니다.",
    "itunesQuery": "우디 (Woody) 혹시 세상에 혼자 남겨진 것 같다면",
    "itunesTrackId": 1748515075,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/35/f0/64/35f06434-8919-e52d-0a84-bc1e6b04c8aa/mzaf_6398041288249956242.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/6e/52/96/6e529672-299e-4979-c985-0f8b0a800b0f/191953367644.jpg/600x600bb.jpg"
  },
  {
    "id": "limyoungwoong-165",
    "category": "2026 차트",
    "artist": "임영웅",
    "artistEn": "Lim Young Woong",
    "artistAliases": [
      "임영웅",
      "Lim Young Woong"
    ],
    "title": "사랑은 늘 도망가",
    "titleEn": "Love Always Flees",
    "titleAliases": [
      "사랑은 늘 도망가"
    ],
    "koreanRead": "사랑은 늘 도망가",
    "releaseYear": "2010",
    "album": "욕망의 불꽃 (Music from the Original TV Series)",
    "lyricHint": "눈물이 나면 그냥 울어요 / 사랑은 늘 도망가니까",
    "trivia": "드라마 <신사와 아가씨> OST로 수년간 음원 차트 최상위권을 굳건히 지킨 국민 애창곡입니다.",
    "itunesQuery": "임영웅 사랑은 늘 도망가",
    "itunesTrackId": 1798401184,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/9a/70/91/9a7091e5-182c-2b1e-4acc-7f408b917c8f/mzaf_12537554281995175061.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/7e/05/7e/7e057ebd-dac6-e8b2-77fc-b958fc93d01b/888618222850.jpg/600x600bb.jpg"
  },
  {
    "id": "soonsoonheegitae-166",
    "category": "2026 차트",
    "artist": "순순희 (기태)",
    "artistEn": "SoonSoonHee (Gi Tae)",
    "artistAliases": [
      "순순희",
      "기태"
    ],
    "title": "그대가 내 안에 박혔다",
    "titleEn": "You embedded in me",
    "titleAliases": [
      "그대가 내 안에 박혔다",
      "그내박"
    ],
    "koreanRead": "그대가 내 안에 박혔다",
    "releaseYear": "2019",
    "album": "인기 MR 반주, Vol. 6",
    "lyricHint": "그대가 내 안에 깊이 박혀 / 지우려 해도 지워지지 않아",
    "trivia": "폭발적인 고음과 처절한 가창력으로 노래방 차트와 음원 차트를 휩쓴 발라드입니다.",
    "itunesQuery": "순순희 (기태) 그대가 내 안에 박혔다",
    "itunesTrackId": 1562380124,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview124/v4/a2/7d/31/a27d31e8-9ce3-cc12-f196-7b36b9d83d5f/mzaf_13453935127375070013.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music114/v4/eb/4d/f6/eb4df631-8662-7eea-4bc0-e69df011428f/3000.jpg/600x600bb.jpg"
  },
  {
    "id": "soonsoonheejihwan-167",
    "category": "2026 차트",
    "artist": "순순희 (지환)",
    "artistEn": "SoonSoonHee (Ji Hwan)",
    "artistAliases": [
      "순순희",
      "지환"
    ],
    "title": "슬픈 초대장",
    "titleEn": "Sad Invitation",
    "titleAliases": [
      "슬픈 초대장"
    ],
    "koreanRead": "슬픈 초대장",
    "releaseYear": "2003",
    "album": "Travel ∞ Directions",
    "lyricHint": "결혼식 청첩장을 받아 든 날의 아픈 심경을 노래한 순순희의 감성 발라드입니다.",
    "trivia": "이별 후 옛 연인의 결혼 소식을 접한 슬픔을 담백하게 그려낸 히트곡입니다.",
    "itunesQuery": "순순희 (지환) 슬픈 초대장",
    "itunesTrackId": 1448341091,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/fd/b2/94/fdb29476-feb6-456e-f5b7-9592e9050e83/mzaf_7228291417276804810.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music114/v4/77/f8/18/77f81811-d207-f732-6482-7d36913a0701/8809522711782.jpg/600x600bb.jpg"
  },
  {
    "id": "gyeongseoyejijeongunho-168",
    "category": "2026 차트",
    "artist": "경서예지 & 전건호",
    "artistEn": "GyeongseoYeji & Jeon Gunho",
    "artistAliases": [
      "경서예지",
      "전건호"
    ],
    "title": "다정히 내 이름을 부르면",
    "titleEn": "If you call my name gently",
    "titleAliases": [
      "다정히 내 이름을 부르면",
      "다정히내이름을부르면"
    ],
    "koreanRead": "다정히 내 이름을 부르면",
    "releaseYear": "2022",
    "album": "엠알 베스트 콜렉션 2022, Vol. 02",
    "lyricHint": "다정히 내 이름을 부르면 / 어디선가 널 향해 달려갈 텐데",
    "trivia": "달콤한 듀엣 하모니로 노래방과 음원 차트에서 수년간 롱런 중인 국민 듀엣송입니다.",
    "itunesQuery": "경서예지 & 전건호 다정히 내 이름을 부르면",
    "itunesTrackId": 1619235308,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview112/v4/c6/8c/86/c68c86af-02f1-357d-cc17-9b5257a30b44/mzaf_5783290385068637210.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/a9/93/8b/a9938bf8-2a64-4ddd-d45b-007db07e762e/asset.jpg/600x600bb.jpg"
  },
  {
    "id": "sungsikyungnaul-169",
    "category": "2026 차트",
    "artist": "성시경 & 나얼",
    "artistEn": "Sung Si Kyung & Naul",
    "artistAliases": [
      "성시경",
      "나얼"
    ],
    "title": "잠시라도 우리",
    "titleEn": "Even for a moment",
    "titleAliases": [
      "잠시라도 우리"
    ],
    "koreanRead": "잠시라도 우리",
    "releaseYear": "2024",
    "album": "잠시라도 우리 - Single",
    "lyricHint": "잠시라도 우리 다시 만날 수 있다면",
    "trivia": "발라드의 황제 성시경과 소울의 장인 나얼의 세기의 만남으로 차트 1위를 올킬한 정통 발라드입니다.",
    "itunesQuery": "성시경 & 나얼 잠시라도 우리",
    "itunesTrackId": 1733622311,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview112/v4/f2/b9/51/f2b95182-ea0c-2b9f-96c1-f996db7132e8/mzaf_12590004463100007684.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/bc/86/a3/bc86a315-1b27-5c0b-8540-fb2f531358ad/888618345962.png/600x600bb.jpg"
  },
  {
    "id": "melomance-170",
    "category": "2026 차트",
    "artist": "멜로망스",
    "artistEn": "MeloMance",
    "artistAliases": [
      "멜로망스",
      "MeloMance"
    ],
    "title": "사랑인가 봐",
    "titleEn": "Love, Maybe",
    "titleAliases": [
      "사랑인가 봐"
    ],
    "koreanRead": "사랑인가 봐",
    "releaseYear": "2022",
    "album": "Love, Maybe (A Business Proposal Original Soundtrack Special Track) - Single",
    "lyricHint": "너와 함께 있으면 모든 세상이 아름다워 / 사랑인가 봐",
    "trivia": "드라마 <사내맞선> OST로 국내외에서 메가 히트를 기록한 멜로망스의 달콤한 사랑 노래입니다.",
    "itunesQuery": "멜로망스 사랑인가 봐",
    "itunesTrackId": 1609910933,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/41/10/ee/4110ee0c-7e0b-b0c7-e6b3-1d5288dc377f/mzaf_1679421330560011573.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/50/f0/fc/50f0fcea-7360-47c0-37d6-4440e97e2862/cover_KM0014772_1.jpg/600x600bb.jpg"
  },
  {
    "id": "melomance-171",
    "category": "2026 차트",
    "artist": "멜로망스",
    "artistEn": "MeloMance",
    "artistAliases": [
      "멜로망스",
      "MeloMance"
    ],
    "title": "선물",
    "titleEn": "Gift",
    "titleAliases": [
      "선물"
    ],
    "koreanRead": "선물",
    "releaseYear": "2017",
    "album": "Moonlight - EP",
    "lyricHint": "빛이 되어준 너에게 / 내가 줄 수 있는 가장 큰 선물",
    "trivia": "김민석의 사이다 고음과 정동환의 유려한 피아노가 빚어낸 멜로망스의 불후의 역주행 명곡입니다.",
    "itunesQuery": "멜로망스 선물",
    "itunesTrackId": 1598710381,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/4f/dd/cc/4fddccff-52db-c28d-aa18-8ed3375c76f1/mzaf_13642041709941844693.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/cf/4a/a7/cf4aa700-fb5c-df67-4c8f-66d56d6f5c29/887928016876.jpg/600x600bb.jpg"
  },
  {
    "id": "10cm-172",
    "category": "2026 차트",
    "artist": "10CM",
    "artistEn": "10CM",
    "artistAliases": [
      "10CM",
      "십센치"
    ],
    "title": "그라데이션",
    "titleEn": "Gradation",
    "titleAliases": [
      "그라데이션"
    ],
    "koreanRead": "그라데이션",
    "releaseYear": "2022",
    "album": "5.3 (Gradation) - Single",
    "lyricHint": "달콤한 물감처럼 번져가는 너의 생각 / 그라데이션",
    "trivia": "여름날의 풋풋한 짝사랑을 시원한 팝 사운드로 그려내 차트를 강타한 10CM의 대표곡입니다.",
    "itunesQuery": "10CM 그라데이션",
    "itunesTrackId": 1836310463,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/5d/a5/e5/5da5e5ec-6594-f13f-d6f7-a4f9db7d9eee/mzaf_11604435796102988496.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/66/48/ec/6648ec7f-5c8e-88a3-1b1f-db7921480571/8804775229671.jpg/600x600bb.jpg"
  },
  {
    "id": "10cm-173",
    "category": "2026 차트",
    "artist": "10CM",
    "artistEn": "10CM",
    "artistAliases": [
      "10CM",
      "십센치"
    ],
    "title": "너랑 밤새고 싶어",
    "titleEn": "Want to stay up all night",
    "titleAliases": [
      "너랑 밤새고 싶어"
    ],
    "koreanRead": "너랑 밤새고 싶어",
    "releaseYear": "2024",
    "album": "K-POP PIANO 2 - EP",
    "lyricHint": "새벽이 와도 헤어지기 싫은 연인들의 마음을 담아낸 2024~2025 달달한 발라드입니다.",
    "trivia": "10CM 특유의 독보적인 꿀보이스가 귓가를 간지럽히는 설렘 가득한 트랙입니다.",
    "itunesQuery": "10CM 너랑 밤새고 싶어",
    "itunesTrackId": 1748520905,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/7e/b4/5c/7eb45ce8-b1cd-5422-0f53-4e79516c0af0/mzaf_6629492119633885930.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/de/bf/d8/debfd89a-0110-f309-5807-7632647919cb/191953367620.jpg/600x600bb.jpg"
  },
  {
    "id": "paulkim-174",
    "category": "2026 차트",
    "artist": "폴킴",
    "artistEn": "Paul Kim",
    "artistAliases": [
      "폴킴",
      "Paul Kim"
    ],
    "title": "모든 날 모든 순간",
    "titleEn": "Every day, Every Moment",
    "titleAliases": [
      "모든 날 모든 순간"
    ],
    "koreanRead": "모든 날 모든 순간",
    "releaseYear": "2018",
    "album": "Should We Kiss First? (Original Television Soundtrack), Pt. 3 - Single",
    "lyricHint": "모든 날 모든 순간 함께해 / 너의 모든 계절에 내가 있을게",
    "trivia": "축가 부동의 1위이자 수많은 이들의 인생곡으로 꼽히는 폴킴의 대표 발라드입니다.",
    "itunesQuery": "폴킴 모든 날 모든 순간",
    "itunesTrackId": 1360245440,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/fd/02/65/fd026582-acff-107b-657e-725e82ade606/mzaf_13214848125267621317.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/fb/45/a5/fb45a5f3-e172-f3c7-05df-733d16c8fc31/OST3_A_Fin.jpg/600x600bb.jpg"
  },
  {
    "id": "paulkim-175",
    "category": "2026 차트",
    "artist": "폴킴",
    "artistEn": "Paul Kim",
    "artistAliases": [
      "폴킴",
      "Paul Kim"
    ],
    "title": "너를 만나",
    "titleEn": "Me After You",
    "titleAliases": [
      "너를 만나"
    ],
    "koreanRead": "너를 만나",
    "releaseYear": "2018",
    "album": "Me After You - Single",
    "lyricHint": "너를 만나 참 행복했어 / 나 이토록 사랑할 수 있었던 건",
    "trivia": "진정한 사랑의 가치를 담백하고 진솔하게 노래해 음원 차트 1위를 올킬한 명곡입니다.",
    "itunesQuery": "폴킴 너를 만나",
    "itunesTrackId": 1732909766,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/10/3b/0d/103b0d88-91f7-8995-f53a-ecedcafedb7d/mzaf_12519402530741202598.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/a5/b2/8e/a5b28ea5-ca18-d328-dc68-87224279a84c/191953335933.jpg/600x600bb.jpg"
  },
  {
    "id": "younha-176",
    "category": "2026 차트",
    "artist": "윤하",
    "artistEn": "Younha",
    "artistAliases": [
      "윤하",
      "Younha"
    ],
    "title": "사건의 지평선",
    "titleEn": "Event Horizon",
    "titleAliases": [
      "사건의 지평선"
    ],
    "koreanRead": "사건의 지평선",
    "releaseYear": "2022",
    "album": "YOUNHA 6th Album Repackage 'END THEORY : Final Edition'",
    "lyricHint": "저기 사라진 별의 자리 / 아스라이 하얀 빛 / 사건의 지평선 너머로",
    "trivia": "우주 천문학적 모티브와 폭발적인 가창력으로 역사적인 차트 올킬 역주행을 쓴 역작입니다.",
    "itunesQuery": "윤하 사건의 지평선",
    "itunesTrackId": 1616649362,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/32/dd/f3/32ddf3ff-8170-bae6-043c-5a50d02705c4/mzaf_11074393104542524889.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/43/cd/c8/43cdc862-d91b-de64-9d21-e6f6a16fbf61/cover_KM0014976_1.jpg/600x600bb.jpg"
  },
  {
    "id": "choyongpil-177",
    "category": "2026 차트",
    "artist": "조용필",
    "artistEn": "Cho Yong Pil",
    "artistAliases": [
      "조용필"
    ],
    "title": "그래도 돼",
    "titleEn": "It's Okay",
    "titleAliases": [
      "그래도 돼"
    ],
    "koreanRead": "그래도 돼",
    "releaseYear": "2018",
    "album": "가끔, 그래도 돼 - Single",
    "lyricHint": "잠시 쉬어가도 돼 / 늦어도 돼 / 그래도 돼",
    "trivia": "가왕 조용필의 정규 20집 타이틀곡으로 모든 세대를 따뜻하게 안아준 국민 힐링송입니다.",
    "itunesQuery": "조용필 그래도 돼",
    "itunesTrackId": 1649992689,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview112/v4/e8/87/70/e8877067-67bc-b06c-41b0-6285de5992b7/mzaf_10787163443270550224.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/9c/fc/85/9cfc85b6-f8ee-f353-4720-ddb126944fd7/8809596433153_cover.jpg/600x600bb.jpg"
  },
  {
    "id": "jimin-178",
    "category": "2026 차트",
    "artist": "지민 (Jimin)",
    "artistEn": "Jimin",
    "artistAliases": [
      "지민",
      "방탄소년단",
      "Jimin"
    ],
    "title": "Who",
    "titleEn": "Who",
    "titleAliases": [
      "Who",
      "후"
    ],
    "koreanRead": "후",
    "releaseYear": "2024",
    "album": "MUSE",
    "lyricHint": "Where are you? Who is my heart waiting for? / 내 심장이 기다리는 진정한 사랑",
    "trivia": "2024년 발표되어 빌보드 핫100 상위권을 장기 집권한 지민의 감각적인 R&B 팝 트랙입니다.",
    "itunesQuery": "지민 (Jimin) Who",
    "itunesTrackId": 1751773093,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/e0/4c/2e/e04c2ec5-a0b7-931d-650b-88835b2581f7/mzaf_2267478480024914666.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/94/b5/84/94b58450-a0cd-ab97-2f30-0ed3608b5e24/196922987588_Cover.jpg/600x600bb.jpg"
  },
  {
    "id": "taeyeon-179",
    "category": "2026 차트",
    "artist": "태연 (TAEYEON)",
    "artistEn": "TAEYEON",
    "artistAliases": [
      "태연",
      "TAEYEON",
      "소녀시대"
    ],
    "title": "To. X",
    "titleEn": "To. X",
    "titleAliases": [
      "To. X",
      "투엑스"
    ],
    "koreanRead": "투 엑스",
    "releaseYear": "2023",
    "album": "To. X - The 5th Mini Album - EP",
    "lyricHint": "나를 조종하던 널 벗어나 / Good boy, bad girl, to my X",
    "trivia": "알앤비 비트 위에 이별의 후련함과 냉철한 감정을 담아내 롱런 1위를 달성한 히트곡입니다.",
    "itunesQuery": "태연 (TAEYEON) To. X",
    "itunesTrackId": 1717568642,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/1b/99/56/1b99563a-174b-5492-6502-3b6fba548ece/mzaf_14706015100369008640.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/c7/1b/47/c71b47c7-4ea1-4eb9-8825-cbe87f68b6fd/cover.jpg/600x600bb.jpg"
  },
  {
    "id": "taeyeon-180",
    "category": "2026 차트",
    "artist": "태연 (TAEYEON)",
    "artistEn": "TAEYEON",
    "artistAliases": [
      "태연",
      "TAEYEON",
      "소녀시대"
    ],
    "title": "Letter To Myself",
    "titleEn": "Letter To Myself",
    "titleAliases": [
      "Letter To Myself",
      "레터 투 마이셀프"
    ],
    "koreanRead": "레터 투 마이셀프",
    "releaseYear": "2026",
    "album": "Dear Diary: We Survived It",
    "lyricHint": "과거의 나에게 보내는 따뜻한 응원의 편지",
    "trivia": "2024년 말 발매되어 태연의 폭발적인 팝 록 가창력을 유감없이 발휘한 최신 명곡입니다.",
    "itunesQuery": "태연 (TAEYEON) Letter To Myself",
    "itunesTrackId": 6783927789,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/53/cf/f4/53cff474-f7a7-bdc2-d351-1e693d181c3f/mzaf_621000679285663422.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/ef/a7/ba/efa7ba39-210e-bb9d-3c8c-7c538f2ebd52/881392185656.png/600x600bb.jpg"
  },
  {
    "id": "taeyeon-181",
    "category": "2026 차트",
    "artist": "태연 (TAEYEON)",
    "artistEn": "TAEYEON",
    "artistAliases": [
      "태연",
      "TAEYEON",
      "소녀시대"
    ],
    "title": "사계",
    "titleEn": "Four Seasons",
    "titleAliases": [
      "사계",
      "Four Seasons"
    ],
    "koreanRead": "사계",
    "releaseYear": "2019",
    "album": "Four Seasons - Single",
    "lyricHint": "사계절이 지나도 우린 변해버렸네 / I gave you the world",
    "trivia": "어쿠스틱 기타와 태연의 매혹적인 보컬이 어우러져 사계절 내내 사랑받는 대표 발라드입니다.",
    "itunesQuery": "태연 (TAEYEON) 사계",
    "itunesTrackId": 1457283876,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/d6/63/94/d663943c-fd3d-7059-bc74-90face13b046/mzaf_2727666806646476786.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/c2/9b/bf/c29bbf3a-b9b2-c571-152e-b851784dc319/TAEYEON_Four_Seasons_Cover_Art.jpg/600x600bb.jpg"
  },
  {
    "id": "iu-182",
    "category": "2026 차트",
    "artist": "아이유 (IU)",
    "artistEn": "IU",
    "artistAliases": [
      "아이유",
      "IU"
    ],
    "title": "Love wins all",
    "titleEn": "Love wins all",
    "titleAliases": [
      "Love wins all",
      "러브 윈즈 올"
    ],
    "koreanRead": "러브 윈즈 올",
    "releaseYear": "2024",
    "album": "Love wins all - Single",
    "lyricHint": "험난한 세상에서도 결국 사랑이 모든 것을 이겨낸다 / Love wins all",
    "trivia": "뷔(V)와의 뮤직비디오로 화제를 모으며 2024년 차트 1위를 올킬한 웅장한 대서사 발라드입니다.",
    "itunesQuery": "아이유 (IU) Love wins all",
    "itunesTrackId": 1726888402,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/94/79/f5/9479f56a-ac54-6449-3603-0645090bb3c1/mzaf_7391528050042328078.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/e3/56/1e/e3561eb5-de12-790d-569b-53fa22e6b491/cover_KM0019422_1.jpg/600x600bb.jpg"
  },
  {
    "id": "iu-183",
    "category": "2026 차트",
    "artist": "아이유 (IU)",
    "artistEn": "IU",
    "artistAliases": [
      "아이유",
      "IU"
    ],
    "title": "홀씨",
    "titleEn": "Holssi",
    "titleAliases": [
      "홀씨"
    ],
    "koreanRead": "홀씨",
    "releaseYear": "2024",
    "album": "The Winning - EP",
    "lyricHint": "하늘로 날아오르는 작은 홀씨처럼 / 자유롭게 피어나",
    "trivia": "미니 6집 The Winning의 더블 타이틀곡으로 힙합 비트와 아이유의 다채로운 매력이 돋보이는 곡입니다.",
    "itunesQuery": "아이유 (IU) 홀씨",
    "itunesTrackId": 1731352615,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/b2/38/6f/b2386f32-3eed-a099-044a-2944430c1b5d/mzaf_8465968415111905068.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/3e/43/d2/3e43d2dc-acd4-5db6-9ae7-99299a044584/cover_KM0019422_1.jpg/600x600bb.jpg"
  },
  {
    "id": "iu-184",
    "category": "2026 차트",
    "artist": "아이유 (IU)",
    "artistEn": "IU",
    "artistAliases": [
      "아이유",
      "IU"
    ],
    "title": "밤편지",
    "titleEn": "Through the Night",
    "titleAliases": [
      "밤편지"
    ],
    "koreanRead": "밤편지",
    "releaseYear": "2017",
    "album": "Through the Night - Single",
    "lyricHint": "이 밤 그날의 반딧불을 당신의 창 가까이 보낼게요",
    "trivia": "한국 대중음악사에 길이 남을 서정성의 극치이자 아이유의 불후의 명곡입니다.",
    "itunesQuery": "아이유 (IU) 밤편지",
    "itunesTrackId": 1219218446,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/5a/43/d5/5a43d5c0-8b9a-2a91-dd9c-405bfd51b82f/mzaf_2888874735741039485.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music114/v4/dc/12/fe/dc12fe03-172b-a843-0d96-12819fa05b6c/cover-.jpg/600x600bb.jpg"
  },
  {
    "id": "iu-185",
    "category": "2026 차트",
    "artist": "아이유 (IU)",
    "artistEn": "IU",
    "artistAliases": [
      "아이유",
      "IU"
    ],
    "title": "에잇",
    "titleEn": "eight (Prod.&Feat. SUGA of BTS)",
    "titleAliases": [
      "에잇",
      "eight"
    ],
    "koreanRead": "에잇",
    "releaseYear": "2020",
    "album": "eight (feat. SUGA) - Single",
    "lyricHint": "우리는 오렌지 태양 아래 그림자 없이 함께 춤을 춰",
    "trivia": "방탄소년단 슈가와의 공동 작업으로 스물여덟 살의 찬란함과 상실을 팝 록으로 노래한 명곡입니다.",
    "itunesQuery": "아이유 (IU) 에잇",
    "itunesTrackId": 1511885178,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/b7/70/da/b770dac6-f957-d045-af12-ebff80578aa4/mzaf_13656583148299369335.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/6b/65/4d/6b654d71-ed85-c6c4-8fe2-ef3d8e9f2ee0/cover_-.jpg/600x600bb.jpg"
  },
  {
    "id": "iu-186",
    "category": "2026 차트",
    "artist": "아이유 (IU)",
    "artistEn": "IU",
    "artistAliases": [
      "아이유",
      "IU"
    ],
    "title": "좋은 날",
    "titleEn": "Good Day",
    "titleAliases": [
      "좋은 날"
    ],
    "koreanRead": "좋은 날",
    "releaseYear": "2010",
    "album": "Real",
    "lyricHint": "나는요 오빠가 좋은걸 어떡해 / 3단 고음의 전설",
    "trivia": "아이유를 국민 여동생 반열에 올려놓은 전설의 3단 고음 메가 히트곡입니다.",
    "itunesQuery": "아이유 (IU) 좋은 날",
    "itunesTrackId": 409076748,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/12/de/86/12de86be-3968-e309-f4da-3e624ec4ff49/mzaf_11516704482831655132.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/6d/2e/c9/6d2ec954-d8d8-b26a-1a8f-def6026815c5/mzi.orccormf.jpg/600x600bb.jpg"
  },
  {
    "id": "bts-187",
    "category": "2026 차트",
    "artist": "방탄소년단 (BTS)",
    "artistEn": "BTS",
    "artistAliases": [
      "방탄소년단",
      "BTS"
    ],
    "title": "봄날",
    "titleEn": "Spring Day",
    "titleAliases": [
      "봄날",
      "Spring Day"
    ],
    "koreanRead": "봄날",
    "releaseYear": "2017",
    "album": "YOU NEVER WALK ALONE",
    "lyricHint": "보고 싶다 이렇게 말하니까 더 보고 싶다 / 벚꽃이 피나 봐요",
    "trivia": "멜론 역사상 가장 오랫동안 차트에 머문 명실상부한 대한민국 국민 위로곡입니다.",
    "itunesQuery": "방탄소년단 (BTS) 봄날",
    "itunesTrackId": 1596529381,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/ba/76/d5/ba76d586-0dac-c800-f08d-467aef7dc9c0/mzaf_12707603572181808804.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/ce/fb/eb/cefbebd4-d53b-8d6c-33cf-2ee55408bd79/8804775077494_Cover.jpg/600x600bb.jpg"
  },
  {
    "id": "bts-188",
    "category": "2026 차트",
    "artist": "방탄소년단 (BTS)",
    "artistEn": "BTS",
    "artistAliases": [
      "방탄소년단",
      "BTS"
    ],
    "title": "Dynamite",
    "titleEn": "Dynamite",
    "titleAliases": [
      "Dynamite",
      "다이너마이트"
    ],
    "koreanRead": "다이너마이트",
    "releaseYear": "2020",
    "album": "BE",
    "lyricHint": "Light it up like dynamite / 디스코 팝의 활기찬 에너지",
    "trivia": "한국 가수 최초로 빌보드 핫100 1위를 차지하며 전 세계를 희망으로 물들인 역사적인 곡입니다.",
    "itunesQuery": "방탄소년단 (BTS) Dynamite",
    "itunesTrackId": 1596532400,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/a3/a0/a6/a3a0a6b5-4715-b872-1aff-21e42634d9cd/mzaf_7224423421767640589.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/22/f3/8f/22f38fb9-1690-326a-d891-7aa946c2b06f/195497623273_Cover.jpg/600x600bb.jpg"
  },
  {
    "id": "jannabi-189",
    "category": "잔나비",
    "artist": "잔나비",
    "artistEn": "JANNABI",
    "artistAliases": [
      "잔나비",
      "JANNABI"
    ],
    "title": "나의 기쁨 나의 노래",
    "titleEn": "Joy and Song",
    "titleAliases": [
      "나의 기쁨 나의 노래",
      "나기나노"
    ],
    "koreanRead": "나의 기쁨 나의 노래",
    "releaseYear": "2026",
    "album": "CCM for All Vol. 3 : Rhythms of Praise",
    "lyricHint": "내가 만약 지칠 때면 밤하늘의 별을 보며 / 나의 기쁨 나의 노래",
    "trivia": "정규 2집의 감동적인 소품집 트랙으로 팬들과 나눈 진심 어린 약속의 노래입니다.",
    "itunesQuery": "잔나비 나의 기쁨 나의 노래",
    "itunesTrackId": 1864853060,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/37/64/d2/3764d276-3b52-d7e7-0d70-eb9d6d4b720c/mzaf_4444156408265868060.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/04/d7/9d/04d79dfa-cde1-2197-3b9f-c0949624669b/8800334188953.jpg/600x600bb.jpg"
  },
  {
    "id": "ive-190",
    "category": "아이브",
    "artist": "아이브",
    "artistEn": "IVE",
    "artistAliases": [
      "아이브",
      "IVE"
    ],
    "title": "NOT YOUR GIRL",
    "titleEn": "NOT YOUR GIRL",
    "titleAliases": [
      "NOT YOUR GIRL",
      "낫 유어 걸"
    ],
    "koreanRead": "낫 유어 걸",
    "releaseYear": "2023",
    "album": "I've IVE",
    "lyricHint": "더 이상 너만의 소녀가 아니야 / 당당한 선언",
    "trivia": "정규 1집 수록곡으로 콘서트와 팬미팅에서 폭발적인 떼창을 이끌어낸 밝은 에너지의 곡입니다.",
    "itunesQuery": "아이브 NOT YOUR GIRL",
    "itunesTrackId": 1680048020,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/10/1d/6e/101d6e0d-1037-b82e-5c8d-dcb743164746/mzaf_927660043488076658.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/3a/23/b7/3a23b7f4-0b43-df9d-b7e4-14f992443324/197188335663.jpg/600x600bb.jpg"
  },
  {
    "id": "illit-191",
    "category": "아일릿",
    "artist": "아일릿",
    "artistEn": "ILLIT",
    "artistAliases": [
      "아일릿",
      "ILLIT"
    ],
    "title": "My World",
    "titleEn": "My World",
    "titleAliases": [
      "My World",
      "마이 월드"
    ],
    "koreanRead": "마이 월드",
    "releaseYear": "2024",
    "album": "SUPER REAL ME - EP",
    "lyricHint": "내 세상 속으로 너를 초대해 / 엉뚱하고 귀여운 상상",
    "trivia": "데뷔 앨범 SUPER REAL ME의 포문을 여는 톡톡 튀는 인트로 명곡입니다.",
    "itunesQuery": "아일릿 My World",
    "itunesTrackId": 1734500890,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/17/73/89/1773894e-27f5-8217-60ce-c27a63fcb7cf/mzaf_2444691776742617323.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/3e/49/1e/3e491e43-4961-21ab-2abe-37fb1c0feb40/196922879227_Cover.jpg/600x600bb.jpg"
  },
  {
    "id": "akmu-192",
    "category": "악뮤",
    "artist": "악뮤",
    "artistEn": "AKMU",
    "artistAliases": [
      "악뮤",
      "악동뮤지션",
      "AKMU"
    ],
    "title": "RE-BYE",
    "titleEn": "RE-BYE",
    "titleAliases": [
      "RE-BYE",
      "리바이"
    ],
    "koreanRead": "리바이",
    "releaseYear": "2016",
    "album": "SPRING - EP",
    "lyricHint": "익숙해진 이별에 상처받지 않으려 / Re-bye",
    "trivia": "재즈 팝 장르를 악뮤만의 천재적인 감각으로 풀어낸 사춘기 상(思春記 上) 타이틀곡입니다.",
    "itunesQuery": "악뮤 RE-BYE",
    "itunesTrackId": 1315910780,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/c4/41/0f/c4410f74-4d62-4ec2-becf-9ec964ce5643/mzaf_3371541112036836184.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/26/91/a5/2691a522-ccac-9eb4-e157-d58150175a38/160503_AKMU_DS.jpg/600x600bb.jpg"
  },
  {
    "id": "akmu-193",
    "category": "악뮤",
    "artist": "악뮤",
    "artistEn": "AKMU",
    "artistAliases": [
      "악뮤",
      "악동뮤지션",
      "AKMU"
    ],
    "title": "사람들이 움직이는 게",
    "titleEn": "How People Move",
    "titleAliases": [
      "사람들이 움직이는 게",
      "사움게"
    ],
    "koreanRead": "사람들이 움직이는 게",
    "releaseYear": "2016",
    "album": "SPRING - EP",
    "lyricHint": "사람들이 움직이는 게 신기해 / 팔다리가 척척",
    "trivia": "일상의 소소한 관찰을 재치 있고 펑키한 브라스 리듬으로 노래한 히트곡입니다.",
    "itunesQuery": "악뮤 사람들이 움직이는 게",
    "itunesTrackId": 1315910781,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/a8/4b/00/a84b00fd-e97d-4004-177c-d819881afea9/mzaf_3324737964558419680.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/26/91/a5/2691a522-ccac-9eb4-e157-d58150175a38/160503_AKMU_DS.jpg/600x600bb.jpg"
  },
  {
    "id": "plave-194",
    "category": "인기 아이돌",
    "artist": "플레이브 (PLAVE)",
    "artistEn": "PLAVE",
    "artistAliases": [
      "플레이브",
      "PLAVE"
    ],
    "title": "Merry PLLIstmas",
    "titleEn": "Merry PLLIstmas",
    "titleAliases": [
      "Merry PLLIstmas",
      "메리 플리스마스"
    ],
    "koreanRead": "메리 플리스마스",
    "releaseYear": "2023",
    "album": "Merry PLLIstmas - Single",
    "lyricHint": "하얀 눈이 내리는 날 너와 함께하는 크리스마스",
    "trivia": "플레이브가 팬들에게 선물한 따스하고 포근한 겨울 윈터 캐럴송입니다.",
    "itunesQuery": "플레이브 (PLAVE) Merry PLLIstmas",
    "itunesTrackId": 1720118406,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/24/d8/95/24d8957f-c9fa-3491-d368-47cfb8ed7144/mzaf_8841871379148731201.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/04/5c/ed/045ced05-3769-f0f3-fba0-9d2070b4db65/8809973507187_cover.jpg/600x600bb.jpg"
  },
  {
    "id": "kissoflife-195",
    "category": "인기 아이돌",
    "artist": "키스오브라이프",
    "artistEn": "KISS OF LIFE",
    "artistAliases": [
      "키스오브라이프",
      "키오프",
      "KISS OF LIFE"
    ],
    "title": "Get Loud",
    "titleEn": "Get Loud",
    "titleAliases": [
      "Get Loud",
      "겟 라우드"
    ],
    "koreanRead": "겟 라우드",
    "releaseYear": "1999",
    "album": "On The 6",
    "lyricHint": "목소리를 더 높여 세상에 외쳐봐 / Get loud",
    "trivia": "자신들의 진정한 목소리를 당당하게 표현한 미니 3집 타이틀곡입니다.",
    "itunesQuery": "키스오브라이프 Get Loud",
    "itunesTrackId": 265144078,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/83/67/b6/8367b6c9-409f-5715-297a-8ae487eb810b/mzaf_490135022279424240.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/c7/f4/6d/c7f46dbd-bc8d-7a7a-cf66-4b96dc59e105/888880316592.jpg/600x600bb.jpg"
  },
  {
    "id": "carthegarden-196",
    "category": "2026 차트",
    "artist": "카더가든",
    "artistEn": "Car, the garden",
    "artistAliases": [
      "카더가든",
      "차정원"
    ],
    "title": "가까운 듯 먼 그대여",
    "titleEn": "Closely far away",
    "titleAliases": [
      "가까운 듯 먼 그대여"
    ],
    "koreanRead": "가까운 듯 먼 그대여",
    "releaseYear": "2022",
    "album": "엠알 베스트 콜렉션 2021, Vol. 31",
    "lyricHint": "손닿을 듯하지만 닿지 않는 애절한 마음",
    "trivia": "카더가든 특유의 빈티지한 음색과 가슴을 후벼파는 멜로디의 롱런 차트 발라드입니다.",
    "itunesQuery": "카더가든 가까운 듯 먼 그대여",
    "itunesTrackId": 1621219806,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview116/v4/11/41/55/11415512-da4d-b24a-c552-f8ef0a3897a7/mzaf_9563147376205135001.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/3e/30/9e/3e309e7c-b327-6031-66e6-e1f48e18d666/asset.jpg/600x600bb.jpg"
  },
  {
    "id": "choiyuree-197",
    "category": "2026 차트",
    "artist": "최유리",
    "artistEn": "Choi Yu Ree",
    "artistAliases": [
      "최유리"
    ],
    "title": "숲",
    "titleEn": "Forest",
    "titleAliases": [
      "숲"
    ],
    "koreanRead": "숲",
    "releaseYear": "2012",
    "album": "숲 (Forest) - EP",
    "lyricHint": "내 맘속에 자라난 깊은 숲속으로",
    "trivia": "김수현 등이 추천하며 전국적인 힐링 역주행을 일으킨 담담하고 맑은 위로의 노래입니다.",
    "itunesQuery": "최유리 숲",
    "itunesTrackId": 581451082,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/a7/ec/2c/a7ec2cd3-dea6-6a79-1000-b85341481d7d/mzaf_3712931532132459271.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/9a/c9/4b/9ac94b75-b1bf-25f3-56ab-0248ed018e39/cover_KM0001844_1.jpg/600x600bb.jpg"
  },
  {
    "id": "kimminseok-198",
    "category": "2026 차트",
    "artist": "김민석 (멜로망스)",
    "artistEn": "Kim Minseok",
    "artistAliases": [
      "김민석",
      "멜로망스"
    ],
    "title": "취중고백",
    "titleEn": "Drunken Confession",
    "titleAliases": [
      "취중고백"
    ],
    "koreanRead": "취중고백",
    "releaseYear": "2009",
    "album": "New Beginning, Pt. 1 - EP",
    "lyricHint": "취기를 빌려 오늘 너에게 고백할게",
    "trivia": "필의 명곡을 김민석의 독보적인 고음과 감성으로 재해석해 1위를 장기 집권한 히트곡입니다.",
    "itunesQuery": "김민석 (멜로망스) 취중고백",
    "itunesTrackId": 1565365047,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/0d/44/1b/0d441b89-25c2-b423-7e33-1c84e18838d1/mzaf_5007522698136052671.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/96/37/0a/96370aa0-6367-2104-659b-716f0b8975b9/8806384506280.jpg/600x600bb.jpg"
  },
  {
    "id": "lesserafim-199",
    "category": "르세라핌",
    "artist": "르세라핌",
    "artistEn": "LE SSERAFIM",
    "artistAliases": [
      "르세라핌",
      "LE SSERAFIM"
    ],
    "title": "1-800-hot-n-fun",
    "titleEn": "1-800-hot-n-fun",
    "titleAliases": [
      "1-800-hot-n-fun",
      "핫앤펀"
    ],
    "koreanRead": "원 에이트 헌드레드 핫 앤 펀",
    "releaseYear": "2024",
    "album": "CRAZY - EP",
    "lyricHint": "Where the heck is Saki? / 1-800-hot-n-fun",
    "trivia": "코첼라 페스티벌에서 최초 공개되어 뜨거운 반응을 이끌어낸 록 감성의 신나는 트랙입니다.",
    "itunesQuery": "LE SSERAFIM 1-800-hot-n-fun",
    "itunesTrackId": 1763658330,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/d7/98/4a/d7984acc-ec3d-702a-b712-f24a492c380d/mzaf_8154997953251408819.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/38/95/ed/3895ed80-ba5b-7846-ce5b-b49805a818ef/198704101359_Cover.jpg/600x600bb.jpg"
  },
  {
    "id": "lesserafim-200",
    "category": "르세라핌",
    "artist": "르세라핌",
    "artistEn": "LE SSERAFIM",
    "artistAliases": [
      "르세라핌",
      "LE SSERAFIM"
    ],
    "title": "Swan Song",
    "titleEn": "Swan Song",
    "titleAliases": [
      "Swan Song",
      "스완 송",
      "스완송"
    ],
    "koreanRead": "스완 송",
    "releaseYear": "2024",
    "album": "EASY - EP",
    "lyricHint": "물 밑에선 발버둥 쳐도 / 우아하게 날아올라",
    "trivia": "백조의 호수를 모티브로 보이지 않는 곳에서의 치열한 노력을 감성적인 모던 트랩으로 풀어낸 명곡입니다.",
    "itunesQuery": "LE SSERAFIM Swan Song",
    "itunesTrackId": 1728928907,
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/cb/82/6f/cb826f2e-96b8-462e-a01e-a90470a7a43b/mzaf_10944003730126806103.plus.aac.p.m4a",
    "artworkUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/22/0f/fd/220ffdbf-152c-5b65-d5af-01256c1328c2/196922796531_Cover.jpg/600x600bb.jpg"
  }
];

// 초성 필드를 자동으로 채워서 SONGS 배열 완성




const SONGS = RAW_SONGS.map((song) => ({
  ...song,
  artistChoseong: makeTileChoseong(song.artist, song.artist),
  titleChoseong: makeTileChoseong(song.title, song.koreanRead),
  hintArtistChoseong: makeHintInitials(song.artist, song.artist),
  hintTitleChoseong: makeHintInitials(song.title, song.koreanRead)
}));
