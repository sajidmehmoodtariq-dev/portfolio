import { Inter, Roboto } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});


const roboto = Roboto({
  weights: ["400"],
  subsets: ["latin"],
  variable: "--font-serif",
});

export const metadata = {
  title: "Sajid Mehmood",
  description: "Portfolio developed by Sajid Mehmood",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${roboto.variable} antialiased bg-gray-900 text-white font-sans`}
      >
        {children}
      </body>
    </html>
  );
}
