#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$DIR"

LOCAL_IP=$(ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null || echo "127.0.0.1")
PORT=8088

echo ""
echo "================================================================"
echo "🎧 K-POP & 가요 듣고 맞추기 퀴즈 (iTunes Search API)"
echo "================================================================"
echo ""
echo "💻 [Mac 브라우저 접속]   👉 http://localhost:${PORT}"
echo "📱 [아이패드/폰 접속]    👉 http://${LOCAL_IP}:${PORT} (동일 Wi-Fi)"
echo ""
echo "서버를 종료하려면 Ctrl + C 를 누르세요."
echo "================================================================"
echo ""

python3 -m http.server ${PORT}
