import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Athletic Diagnostic System — Biomechanical Evaluation",
  description:
    "Pure client-side, zero-AI deterministic athletic diagnostic engine and 6-week periodized calisthenics & running programmer.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isProd = process.env.NODE_ENV === "production";
  const cspContent = isProd
    ? "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; connect-src 'none'; font-src 'self' data:;"
    : "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; connect-src 'self' ws: wss: http://localhost:* http://127.0.0.1:*; font-src 'self' data:;";

  return (
    <html lang="en" className="dark">
      <head>
        {/* Strict Content Security Policy: Completely air-gapped in production export */}
        <meta httpEquiv="Content-Security-Policy" content={cspContent} />
      </head>
      <body className="bg-[#09090b] text-zinc-100 antialiased selection:bg-sky-500/30 selection:text-sky-200">
        {children}
      </body>
    </html>
  );
}
