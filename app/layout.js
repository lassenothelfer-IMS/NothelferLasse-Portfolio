import "./globals.css";

export const metadata = {
  title: "Lasse Nothelfer — Portfolio",
  description: "Software Developer · Zürich",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}
