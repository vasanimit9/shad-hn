"use client";

import dynamic from "next/dynamic";

// Ionic React components are Stencil web components that ReactDOMServer cannot
// render, so the whole Ionic tree must be client-only. The `ssr: false` dynamic
// import is only allowed inside a Client Component, hence this wrapper.
const IonicApp = dynamic(() => import("@/ionic/IonicApp"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--ion-background-color, #fff)",
        color: "#8e8e93",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      Loading…
    </div>
  ),
});

export default function IonicEntry() {
  return <IonicApp />;
}
