import { DM_Sans, Lora } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import Header from "@/components/Header";

const lora = Lora({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  variable: "--font-serif",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Prepty",
  description:
    "Prepare for your interviews with Prepty, the ultimate interview preparation platform.",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider
      appearance={{
        theme: dark,
      }}
    >
      {" "}
      <html lang="en" suppressHydrationWarning>
        <body className={`${dmSans.variable} ${lora.variable} font-sans `}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {/* Header */}
            <Header className="px-3" />
            <main className="min-h-screen"> {children}</main>

            {/* Footer */}
            <footer className="relative z-10 border-t border-white/7 py-12  mx-auto px-6 flex flex-wrap items-center justify-center text-stone-400">
              Made with ❤️ by Ishuklaji. All rights reserved.
            </footer>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
