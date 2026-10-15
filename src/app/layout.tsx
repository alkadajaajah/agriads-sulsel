import "./globals.css";

export const metadata = {
  title: "AgriAds Sulsel",
  description: "Platform Direktori Komoditas Pertanian, Peternakan, dan Perkebunan Sulsel",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
