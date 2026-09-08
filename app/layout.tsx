import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Runnable Answer",
  description: "可操作答案原型",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
