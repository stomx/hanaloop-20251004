import type { Metadata } from "next";
import "./globals.css";

// Pretendard 웹폰트 사용

export const metadata: Metadata = {
  title: "탄소 배출 대시보드",
  description: "기업의 탄소 배출량을 시각화하고 관리하는 대시보드",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          as="style"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css"
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
