import "./globals.css";

export const metadata = {
  title: "Lasse Nothelfer — Portfolio",
  description: "Software Developer · Zürich",
};

export default function RootLayout({ children }) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}
