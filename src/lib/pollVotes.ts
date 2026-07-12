export type PollVoteStatus = "recorded" | "duplicate";

export type PollVoteResult = {
  status: PollVoteStatus;
  message?: string;
};

type PublicEnv = Record<string, string | undefined>;

const nodePublicEnv: PublicEnv =
  typeof process !== "undefined" && process.env ? process.env : {};

const vitePublicEnv: PublicEnv =
  typeof import.meta !== "undefined" && "env" in import.meta
    ? ((import.meta as ImportMeta & { env?: PublicEnv }).env ?? {})
    : {};

const pollApiUrl =
  nodePublicEnv.NEXT_PUBLIC_POLL_API_URL ||
  nodePublicEnv.VITE_POLL_API_URL ||
  vitePublicEnv.NEXT_PUBLIC_POLL_API_URL ||
  vitePublicEnv.VITE_POLL_API_URL ||
  "";

export const isPollApiConfigured = Boolean(pollApiUrl);

type PollApiPayload = {
  status?: PollVoteStatus;
  message?: string;
  error?: string;
};

async function readPollResponse(response: Response): Promise<PollApiPayload> {
  try {
    return (await response.json()) as PollApiPayload;
  } catch {
    return {};
  }
}

export async function submitPollVote(input: {
  pollId: string;
  optionId: string;
}): Promise<PollVoteResult> {
  if (!input.pollId || !input.optionId) {
    throw new Error("투표할 항목을 선택해 주세요.");
  }

  if (!isPollApiConfigured) {
    return {
      status: "recorded",
      message:
        "투표가 기록되었습니다. 실제 공개 환경에서는 IP 제한 API가 적용됩니다.",
    };
  }

  const response = await fetch(pollApiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });
  const payload = await readPollResponse(response);

  if (response.status === 409 || payload.status === "duplicate") {
    return {
      status: "duplicate",
      message: payload.message || "이미 이 IP에서 투표가 기록되었습니다.",
    };
  }

  if (!response.ok) {
    throw new Error(
      payload.error ||
        payload.message ||
        `투표를 기록하지 못했습니다. 잠시 후 다시 시도해 주세요. (${response.status})`,
    );
  }

  return {
    status: "recorded",
    message:
      payload.message || "투표가 기록되었습니다. 같은 IP에서는 다시 투표할 수 없습니다.",
  };
}
