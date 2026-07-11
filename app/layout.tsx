import type { Metadata } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "최민정 은퇴 헌정 페이지",
    template: "%s · 최민정 은퇴 헌정 페이지",
  },
  description:
    "사진, 기록, 목소리, 팬의 인사를 한 흐름으로 담는 최민정 선수 은퇴 헌정 웹앱입니다.",
  openGraph: {
    title: "최민정 은퇴 헌정 페이지",
    description:
      "대한민국 쇼트트랙 선수 최민정의 은퇴를 기리는 독립형 디지털 헌정 웹앱입니다.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "최민정 은퇴 헌정 페이지",
    description:
      "대한민국 쇼트트랙 선수 최민정의 은퇴를 기리는 독립형 디지털 헌정 웹앱입니다.",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
