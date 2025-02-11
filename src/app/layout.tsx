import './globals.css';

export const metadata = {
  title: 'Google OAuth2 Integration',
  description: 'Integration with Google OAuth2 using Next.js and Node.js',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'Arial, sans-serif' }}>{children}</body>
    </html>
  );
}
