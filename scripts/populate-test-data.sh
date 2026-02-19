#!/bin/bash

# ==============================================================================
# GitChat API テストデータ投入テンプレート (自動履歴構築版)
# ==============================================================================

# 1. 共通設定
BASE_URL="http://localhost:3000"
USER_ID="user_2t1aaaaaaaaaaaaaaaaaaaaaa"

COMMON_ARGS=(
  -s
  -H "Content-Type: application/json"
  -H "X-Test-User-Id: ${USER_ID}"
)

# ユーティリティ: 特定のブランチの履歴を取得する
get_history() {
  local BRANCH_ID=$1
  # 先ほど作成したHistory APIを叩いて、JSONの.history配列部分だけを抽出する
  curl -s -X GET "${BASE_URL}/api/internal/branch/${BRANCH_ID}/history" \
    -H "X-Test-User-Id: ${USER_ID}" | grep -o '"history":\[.*\]' | sed 's/"history"://'
}

echo "=== Data Population Started ==="

# ------------------------------------------------------------------------------
# テンプレート B: 新規チャットの開始
# ------------------------------------------------------------------------------
echo "[1] Creating New Chat..."
CHAT_ID="e01726ca-9730-4be6-a36c-2f9876251bd4"
BRANCH_ID="d28a3036-74fc-4b8c-b631-419b786c5720"

curl -X POST "${BASE_URL}/api/internal/chat/init" \
  "${COMMON_ARGS[@]}" \
  -d "{
    \"chat_id\": \"${CHAT_ID}\",
    \"branch_id\": \"${BRANCH_ID}\",
    \"block_id\": \"23af6c61-05bf-4099-b13c-074402633002\",
    \"message\": \"TypeScriptの型のメリットを教えて\"
  }"
echo -e "\n"

# ------------------------------------------------------------------------------
# テンプレート C: メッセージの送信 (履歴を自動取得して送信)
# ------------------------------------------------------------------------------
echo "[2] Sending Message with Auto-History..."

# 前の会話内容をAPIから取得
HISTORY=$(get_history "${BRANCH_ID}")
if [ -z "$HISTORY" ]; then HISTORY="[]"; fi

curl -X POST "${BASE_URL}/api/internal/message/send" \
  "${COMMON_ARGS[@]}" \
  -d "{
    \"chat_id\": \"${CHAT_ID}\",
    \"branch_id\": \"${BRANCH_ID}\",
    \"block_id\": \"$(cat /proc/sys/kernel/random/uuid 2>/dev/null || echo "b6b9074c-47ea-4df2-bc8e-171b305e5595")\",
    \"message\": \"インターフェースと型の違いについても教えて\",
    \"history\": ${HISTORY}
  }"
echo -e "\n"

echo "=== All Done ==="
