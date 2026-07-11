import { MAX_FAN_MESSAGE_LENGTH } from "@/src/data/tributeData";

export type FanMessageStatus = "pending" | "approved" | "rejected";

export type FanMessage = {
  id: string;
  nickname: string;
  message: string;
  status: FanMessageStatus;
  created_at: string;
  approved_at?: string | null;
};

export type AdminSession = {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
  user?: {
    id: string;
    email?: string;
  };
};

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY ||
  "";

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

const headers = (token = supabaseAnonKey) => ({
  apikey: supabaseAnonKey,
  Authorization: `Bearer ${token}`,
  "Content-Type": "application/json",
});

async function supabaseRequest<T>(
  path: string,
  init: RequestInit = {},
  token?: string,
): Promise<T> {
  if (!isSupabaseConfigured) {
    throw new Error("Supabase environment variables are not configured.");
  }

  const response = await fetch(`${supabaseUrl}${path}`, {
    ...init,
    headers: {
      ...headers(token),
      ...(init.headers || {}),
    },
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Supabase request failed: ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export async function submitFanMessage(input: {
  nickname: string;
  message: string;
}): Promise<FanMessage> {
  const nickname = input.nickname.trim();
  const message = input.message.trim();

  if (!nickname || !message) {
    throw new Error("닉네임과 메시지를 모두 입력해 주세요.");
  }

  if (message.length > MAX_FAN_MESSAGE_LENGTH) {
    throw new Error(`메시지는 ${MAX_FAN_MESSAGE_LENGTH}자 이내로 입력해 주세요.`);
  }

  if (!isSupabaseConfigured) {
    return {
      id: `demo-${Date.now()}`,
      nickname,
      message,
      status: "pending",
      created_at: new Date().toISOString(),
      approved_at: null,
    };
  }

  const rows = await supabaseRequest<FanMessage[]>("/rest/v1/fan_messages", {
    method: "POST",
    headers: {
      Prefer: "return=representation",
    },
    body: JSON.stringify({
      nickname,
      message,
      status: "pending",
    }),
  });

  return rows[0];
}

export async function fetchApprovedMessages(): Promise<FanMessage[]> {
  if (!isSupabaseConfigured) {
    return [];
  }

  return supabaseRequest<FanMessage[]>(
    "/rest/v1/fan_messages?select=id,nickname,message,status,created_at,approved_at&status=eq.approved&order=approved_at.desc",
  );
}

export async function signInAdmin(
  email: string,
  password: string,
): Promise<AdminSession> {
  return supabaseRequest<AdminSession>("/auth/v1/token?grant_type=password", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function fetchMessagesForAdmin(
  status: FanMessageStatus | "all",
  token: string,
): Promise<FanMessage[]> {
  const statusFilter = status === "all" ? "" : `&status=eq.${status}`;

  return supabaseRequest<FanMessage[]>(
    `/rest/v1/fan_messages?select=id,nickname,message,status,created_at,approved_at${statusFilter}&order=created_at.desc`,
    {},
    token,
  );
}

export async function updateMessageStatus(
  id: string,
  status: FanMessageStatus,
  token: string,
): Promise<void> {
  const body =
    status === "approved"
      ? { status, approved_at: new Date().toISOString() }
      : { status };

  await supabaseRequest<void>(
    `/rest/v1/fan_messages?id=eq.${encodeURIComponent(id)}`,
    {
      method: "PATCH",
      headers: {
        Prefer: "return=minimal",
      },
      body: JSON.stringify(body),
    },
    token,
  );
}
