# IP 제한 투표 API

`당신의 최민정` 투표는 클라이언트가 IP나 해시를 직접 보내지 않고, 서버/API가 요청 IP를 읽어 해시한 뒤 저장하는 방식으로 제한한다.

## 프론트엔드 계약

환경변수:

```env
NEXT_PUBLIC_POLL_API_URL=https://your-project.supabase.co/functions/v1/poll-vote
```

GitHub Pages 정적 빌드에서는 저장소 Variables에 `VITE_POLL_API_URL`을 등록한다.

요청:

```http
POST /poll-vote
Content-Type: application/json

{
  "pollId": "poll-1",
  "optionId": "option-1"
}
```

응답:

```json
{ "status": "recorded", "message": "투표가 기록되었습니다." }
```

같은 IP가 같은 투표에 다시 참여하면 `409` 또는 아래 응답을 반환한다.

```json
{ "status": "duplicate", "message": "이미 이 IP에서 투표가 기록되었습니다." }
```

## 서버 구현 원칙

1. `x-forwarded-for`, `cf-connecting-ip`, `x-real-ip` 같은 신뢰 가능한 프록시 헤더에서 IP를 읽는다.
2. IP 원문은 저장하지 않는다.
3. `pollId`, IP, 비밀 salt를 합쳐 SHA-256 해시를 만든다.
4. 투표가 활성 상태인지, 선택지가 해당 투표에 속하는지 검증한다.
5. `poll_votes`에 `poll_id`, `option_id`, `voter_hash`를 저장한다.
6. `unique (poll_id, voter_hash)` 충돌은 중복 투표로 처리한다.

## Supabase Edge Function 예시

Supabase Edge Function은 서버 측 TypeScript 함수이므로 IP 제한 투표 API를 두기에 적합하다. 아래 예시는 서비스 역할 키를 사용하는 서버 전용 코드이며, 클라이언트 코드에 포함하면 안 된다.

```ts
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const encoder = new TextEncoder();

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function firstIp(value: string | null) {
  return value?.split(",")[0]?.trim() || "";
}

async function sha256(value: string) {
  const digest = await crypto.subtle.digest("SHA-256", encoder.encode(value));
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  const { pollId, optionId } = await request.json().catch(() => ({}));

  if (!pollId || !optionId) {
    return json({ error: "pollId and optionId are required." }, 400);
  }

  const ip =
    firstIp(request.headers.get("x-forwarded-for")) ||
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-real-ip") ||
    "unknown";
  const salt = Deno.env.get("POLL_IP_HASH_SALT");
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!salt || !supabaseUrl || !serviceRoleKey) {
    return json({ error: "Server is not configured." }, 500);
  }

  const authHeaders = {
    apikey: serviceRoleKey,
    Authorization: `Bearer ${serviceRoleKey}`,
  };
  const [pollResponse, optionResponse] = await Promise.all([
    fetch(
      `${supabaseUrl}/rest/v1/polls?select=id&id=eq.${encodeURIComponent(pollId)}&is_active=eq.true`,
      { headers: authHeaders },
    ),
    fetch(
      `${supabaseUrl}/rest/v1/poll_options?select=id&id=eq.${encodeURIComponent(optionId)}&poll_id=eq.${encodeURIComponent(pollId)}`,
      { headers: authHeaders },
    ),
  ]);

  if (!pollResponse.ok || !optionResponse.ok) {
    return json({ error: "Could not validate poll." }, 500);
  }

  const [polls, options] = await Promise.all([
    pollResponse.json(),
    optionResponse.json(),
  ]);

  if (polls.length === 0 || options.length === 0) {
    return json({ error: "Poll or option is not available." }, 400);
  }

  const voterHash = await sha256(`${pollId}:${ip}:${salt}`);
  const response = await fetch(`${supabaseUrl}/rest/v1/poll_votes`, {
    method: "POST",
    headers: {
      ...authHeaders,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify({
      poll_id: pollId,
      option_id: optionId,
      voter_hash: voterHash,
    }),
  });

  if (response.status === 409) {
    return json(
      { status: "duplicate", message: "이미 이 IP에서 투표가 기록되었습니다." },
      409,
    );
  }

  if (!response.ok) {
    return json({ error: await response.text() }, response.status);
  }

  return json({
    status: "recorded",
    message: "투표가 기록되었습니다. 같은 IP에서는 다시 투표할 수 없습니다.",
  });
});
```

## Supabase 설정

`docs/supabase-schema.sql`을 적용한 뒤 Edge Function에 아래 secret을 등록한다.

```env
POLL_IP_HASH_SALT=충분히_긴_랜덤_문자열
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=service-role-key
```
