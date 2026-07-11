import type { Metadata } from "next";
import { MessageModerationPage } from "@/src/components/admin/MessageModerationPage";

export const metadata: Metadata = {
  title: "메시지 관리자",
  description: "팬 메시지 승인과 거절을 관리하는 관리자 화면입니다.",
};

export default function AdminPage() {
  return <MessageModerationPage />;
}
