import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Providers from './providers';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'FoodBridge AI — Reduce Food Waste with AI',
  description:
    'AI-powered food waste management platform connecting restaurants, hotels, and households with NGOs for efficient food redistribution. Predict leftovers, detect freshness, optimize routes.',
  keywords: ['food waste', 'AI', 'NGO', 'sustainability', 'food redistribution', 'FoodBridge'],
  openGraph: {
    title: 'FoodBridge AI — Reduce Food Waste with AI',
    description: 'AI-powered food waste management platform',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
