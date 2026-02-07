import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: 'SkillPilot — From Classroom to Career',
  description: 'AI-powered experiential learning platform that simulates real industry workflows',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white">
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#212529',
              color: '#fff',
              fontSize: '14px',
              borderRadius: '10px',
            },
          }}
        />
      </body>
    </html>
  );
}
