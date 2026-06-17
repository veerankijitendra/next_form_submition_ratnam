import type { Metadata } from "next";
import { Inter, Roboto } from "next/font/google";
import "./globals.css";
import { FormProvider } from "@/context/FormContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const roboto = Roboto({
  weight: ['400', '500', '700'],
  variable: "--font-roboto",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "My Clothing Stall",
  description: "Customer Form and Admin Portal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${roboto.variable} h-full antialiased`}
    >
      <body className="min-h-screen bg-[#F1EFE8] text-[#2C2C2A] flex flex-col font-roboto">
        <FormProvider>
          <nav className="w-full bg-[#0F6E56] px-4 sm:px-6 py-3.5 flex items-center justify-between shadow-sm">
            <span className="text-white text-base sm:text-[17px] font-semibold tracking-[0.3px] font-inter">🛍️ My Clothing Stall</span>
            <div className="flex gap-2">
              <a href="/" className="border-[1.5px] border-white/40 bg-transparent text-white px-3 sm:px-4 py-1.5 rounded-md cursor-pointer text-xs sm:text-[13px] transition-colors hover:bg-white/20 font-inter">
                Customer Form
              </a>
              <a href="/admin" className="border-[1.5px] border-white/40 bg-transparent text-white px-3 sm:px-4 py-1.5 rounded-md cursor-pointer text-xs sm:text-[13px] transition-colors hover:bg-white/20 font-inter">
                Admin Portal
              </a>
            </div>
          </nav>
          <main className="flex-1 flex flex-col items-center p-4 w-full">
            <div className="w-full py-4 sm:py-8">
              {children}
            </div>
          </main>
        </FormProvider>
      </body>
    </html>
  );
}
