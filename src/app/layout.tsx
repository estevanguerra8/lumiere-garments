import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { DataProvider } from '@/providers/DataProvider';
import { CartProvider } from '@/providers/CartProvider';
import Navbar from '@/components/layout/Navbar';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Lumiere Garments — A Database for Luxury Streetwear',
  description: 'CS/SE 4347 Database Systems Project Demo',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-ivory text-charcoal antialiased">
        <DataProvider>
          <CartProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <footer className="bg-charcoal text-gray-500 text-center py-4 text-xs tracking-wider">
              LUMIERE GARMENTS &mdash; CS/SE 4347 Database Systems Demo
            </footer>
          </CartProvider>
        </DataProvider>
      </body>
    </html>
  );
}
