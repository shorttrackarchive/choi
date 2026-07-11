"use client";

import { useState } from "react";
import {
  fetchMessagesForAdmin,
  isSupabaseConfigured,
  signInAdmin,
  updateMessageStatus,
  type AdminSession,
  type FanMessage,
  type FanMessageStatus,
} from "@/src/lib/supabaseRest";

const filters: Array<FanMessageStatus | "all"> = [
  "pending",
  "approved",
  "rejected",
  "all",
];

export function MessageModerationPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [session, setSession] = useState<AdminSession | null>(null);
  const [messages, setMessages] = useState<FanMessage[]>([]);
  const [filter, setFilter] = useState<FanMessageStatus | "all">("pending");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState("");

  async function loadMessages(
    selectedFilter = filter,
    activeSession = session,
  ) {
    if (!activeSession) return;
    setStatus("loading");
    setError("");

    try {
      const rows = await fetchMessagesForAdmin(
        selectedFilter,
        activeSession.access_token,
      );
      setMessages(rows);
      setStatus("idle");
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "메시지를 불러오지 못했습니다.",
      );
      setStatus("error");
    }
  }

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setError("");

    try {
      const nextSession = await signInAdmin(email, password);
      setSession(nextSession);
      await loadMessages(filter, nextSession);
      setPassword("");
    } catch (loginError) {
      setError(
        loginError instanceof Error
          ? loginError.message
          : "로그인하지 못했습니다.",
      );
      setStatus("error");
    }
  }

  async function moderate(id: string, nextStatus: FanMessageStatus) {
    if (!session) return;
    await updateMessageStatus(id, nextStatus, session.access_token);
    await loadMessages();
  }

  const visibleMessages = messages.filter((message) => {
    const query = search.trim().toLowerCase();
    if (!query) return true;
    return (
      message.nickname.toLowerCase().includes(query) ||
      message.message.toLowerCase().includes(query)
    );
  });

  return (
    <main className="admin-shell">
      <section className="admin-hero">
        <p>Fan Message Moderation</p>
        <h1>메시지 관리자</h1>
        <span>
          Supabase Auth로 로그인한 관리자만 승인 대기 메시지를 확인하고 공개
          상태를 변경합니다.
        </span>
      </section>

      {!isSupabaseConfigured ? (
        <section className="admin-panel">
          <h2>Supabase 연결 대기</h2>
          <p>
            환경변수가 설정되면 이 화면에서 실제 승인 대기 메시지를 불러올 수
            있습니다. 지금은 구조 확인용 화면입니다.
          </p>
        </section>
      ) : null}

      {!session ? (
        <form className="admin-panel admin-login" onSubmit={handleLogin}>
          <div>
            <label htmlFor="admin-email">관리자 이메일</label>
            <input
              id="admin-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="admin-password">비밀번호</label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>
          <button type="submit" disabled={status === "loading"}>
            {status === "loading" ? "확인 중" : "로그인"}
          </button>
          {error ? <span className="form-error">{error}</span> : null}
        </form>
      ) : (
        <section className="admin-panel">
          <div className="admin-toolbar">
            <div className="filter-row" role="tablist" aria-label="메시지 상태">
              {filters.map((item) => (
                <button
                  type="button"
                  role="tab"
                  aria-selected={filter === item}
                  className={filter === item ? "is-selected" : ""}
                  key={item}
                  onClick={() => {
                    setFilter(item);
                    loadMessages(item);
                  }}
                >
                  {statusLabel(item)}
                </button>
              ))}
            </div>
            <label>
              <span>검색</span>
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </label>
          </div>

          <div className="moderation-list">
            {visibleMessages.length === 0 ? (
              <p className="moderation-empty">표시할 메시지가 없습니다.</p>
            ) : (
              visibleMessages.map((message) => (
                <article key={message.id} className="moderation-item">
                  <div>
                    <span>{statusLabel(message.status)}</span>
                    <h2>{message.nickname}</h2>
                    <p>{message.message}</p>
                    <time>
                      {new Date(message.created_at).toLocaleString("ko-KR")}
                    </time>
                  </div>
                  <div className="moderation-actions">
                    <button
                      type="button"
                      onClick={() => moderate(message.id, "approved")}
                      disabled={message.status === "approved"}
                    >
                      승인
                    </button>
                    <button
                      type="button"
                      onClick={() => moderate(message.id, "rejected")}
                      disabled={message.status === "rejected"}
                    >
                      거절
                    </button>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>
      )}
    </main>
  );
}

function statusLabel(status: FanMessageStatus | "all") {
  const labels = {
    pending: "승인 대기",
    approved: "승인됨",
    rejected: "거절됨",
    all: "전체",
  } as const;

  return labels[status];
}
