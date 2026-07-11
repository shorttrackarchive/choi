import type { Metadata } from "next";
import { TributeApp } from "@/src/components/tribute/TributeApp";
import { tributeData } from "@/src/data/tributeData";

export const metadata: Metadata = {
  title: "최민정 은퇴 헌정 페이지",
  description:
    "대한민국 쇼트트랙 선수 최민정의 은퇴를 기리는 독립형 디지털 헌정 웹앱입니다.",
};

export default function Home() {
  return <TributeApp data={tributeData} />;
}
