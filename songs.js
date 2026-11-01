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
    "category": "인기 아이돌",
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
    "category": "인기 아이돌",
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
    "category": "인기 아이돌",
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
