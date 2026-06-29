import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { cookies } from "next/headers";
import "./globals.css";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import IonicEntry from "@/components/IonicEntry";
import ThemeToggle from "@/components/ThemeToggle";
import { UI_MODE_COOKIE, normalizeUiMode } from "@/lib/ui-mode";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Shad HN",
  description:
    "A modern Hacker News reader built with Next.js, shadcn/ui, and Tailwind CSS. Browse top stories, best stories, and newest posts from Hacker News.",
};

const serviceWorkerScript = `
  window.addEventListener("load", function () {
    navigator.serviceWorker
      .register("/service_worker.js")
      .then(
        function (registration) {
          console.log("Worker registration successful", registration.scope);
        },
        function (err) {
          console.log("Worker registration failed", err);
        }
      )
      .catch(function (err) {
        console.log(err);
      });
  });
`;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const mode = normalizeUiMode(cookieStore.get(UI_MODE_COOKIE)?.value);

  // iOS theme: hand the whole viewport to the client-only Ionic app, which owns
  // routing/rendering from the URL. `children` (the matched Next page) is ignored.
  if (mode === "ios") {
    return (
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable}`}>
          <IonicEntry />
          <script dangerouslySetInnerHTML={{ __html: serviceWorkerScript }} />
        </body>
      </html>
    );
  }

  // Classic (shadcn) theme: unchanged, still server-rendered.
  return (
    <SidebarProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <AppSidebar />
          <div className="flex flex-col flex-1 bg-inherit overflow-hidden h-screen">
            <div className="flex text-xl border-b top-0 left-0 w-full bg-inherit min-h-[60px]">
              <div className="flex max-w-screen-md p-4 md:px-0 w-full md:mx-auto items-center gap-3">
                <SidebarTrigger className="flex-shrink-0" />
                <span className="font-semibold">ShadHN</span>
                <div className="ml-auto">
                  <ThemeToggle />
                </div>
              </div>
            </div>
            {children}
          </div>
          <script dangerouslySetInnerHTML={{ __html: serviceWorkerScript }} />
        </body>
      </html>
    </SidebarProvider>
  );
}
