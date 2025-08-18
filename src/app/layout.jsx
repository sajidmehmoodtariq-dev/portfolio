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
  title: "Sajid Mehmood Tariq | Portfolio",
  description:
    "Personal portfolio of Sajid Mehmood Tariq – Computer Science student, full-stack developer, and problem solver. Showcasing projects, skills, and contributions.",
  keywords: [
    "Sajid Mehmood Tariq",
    "Portfolio",
    "Full Stack Developer",
    "MERN",
    "Next.js",
    "Computer Science Student",
    "Projects",
    "Open Source",
    "CS50 Certificate",
  ],
  authors: [{ name: "Sajid Mehmood Tariq" }],
  creator: "Sajid Mehmood Tariq",
  metadataBase: new URL("https://sajidmehmoodtariq.me"),

  openGraph: {
    title: "Sajid Mehmood Tariq | Portfolio",
    description:
      "Explore the portfolio of Sajid Mehmood Tariq – showcasing unique projects, technical expertise, and open-source contributions.",
    url: "https://sajidmehmoodtariq.me",
    siteName: "Sajid Mehmood Tariq",
    images: [
      {
        url: "/logo.png", // in public/logo.png
        width: 1200,
        height: 630,
        alt: "Sajid Portfolio Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  github: {
    title: "Sajid Mehmood Tariq | Portfolio",
    description:
      "Official portfolio of Sajid Mehmood Tariq – Computer Science student, full-stack developer, and CS50 certified.",
    images: ["/logo.png"],
    url: "https://github.com/sajidmehmoodtariq-dev",
  },
};



export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "name": "Sajid Mehmood Tariq",
              "url": "https://sajidmehmoodtariq.me",
              "image": "https://sajidmehmoodtariq.me/me.jpg",
              "sameAs": [
                "https://www.linkedin.com/in/sajidmehmoodtariq",
                "https://github.com/sajidmehmoodtariq-dev",
                "https://cs50.harvard.edu/certificates/f5aa59ca-26eb-4289-af0e-ccf00f4feb78" // replace with your real CS50 cert URL
              ],
              "jobTitle": "Full Stack Developer",
              "worksFor": {
                "@type": "Organization",
                "name": "Independent Projects"
              },
              "alumniOf": {
                "@type": "EducationalOrganization",
                "name": "CS50 by Harvard University"
              }
            }),
          }}
        />

      </head>
      <body
        className={`${inter.variable} ${roboto.variable} antialiased bg-gray-900 text-white font-sans`}
      >
        {children}
      </body>
    </html>
  );
}
