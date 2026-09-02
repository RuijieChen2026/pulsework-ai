import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'PulseWork · 企业通用 AI 工作助手',
  description: '基于企业上下文的 Agent 协作与 RAG 知识问答产品作品集。',
  openGraph: {
    title: 'PulseWork · 企业通用 AI 工作助手',
    description: '让企业系统，会理解，会行动。',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'PulseWork 产品作品集' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PulseWork · 企业通用 AI 工作助手',
    description: '让企业系统，会理解，会行动。',
    images: ['/og.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
