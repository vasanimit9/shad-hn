import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";

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
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <AppSidebar />
          <div className="flex flex-col flex-1 bg-inherit overflow-y-hidden h-screen">
            <div className="flex text-xl border-b-2 top-0 left-0 w-full bg-inherit">
              <div className="flex max-w-screen-md p-3 md:px-0 w-full md:mx-auto">
                <div className="border border-gray-300 rounded mr-2">
                  <SidebarTrigger />
                </div>
                ShadHN
              </div>
            </div>
            {children}
          </div>
          <script
            dangerouslySetInnerHTML={{
              __html: `
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
          `,
            }}
          />
        </body>
      </html>
    </SidebarProvider>
  );
}
