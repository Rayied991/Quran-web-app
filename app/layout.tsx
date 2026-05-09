import type { Metadata } from "next";
import "./globals.css";
import { SettingsProvider } from "./lib/settings-context";

export const metadata: Metadata = {
  title: "Quran Web App",
  description: "Read the Holy Quran with translations",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr">
    <head>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
  <link
    href="https://fonts.googleapis.com/css2?family=Amiri+Quran&family=Noto+Naskh+Arabic:wght@400;700&family=Noto+Nastaliq+Urdu:wght@400;700&family=Scheherazade+New:wght@400;700&family=Amiri:ital,wght@0,400;0,700;1,400;1,700&family=Nunito:wght@400;600;700&display=swap"
    rel="stylesheet"
  />
  <style>{`
    @font-face {
      font-family: 'Traditional Arabic';
      src: local('Arial'), local('Segoe UI'), local('Verdana');
    }
  `}</style>
</head>
      <body className="antialiased">
        <SettingsProvider>
          {children}
        </SettingsProvider>
      </body>
    </html>
  );
}
