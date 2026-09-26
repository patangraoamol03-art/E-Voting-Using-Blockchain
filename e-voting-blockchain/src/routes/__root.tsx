import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { WagmiProvider } from "wagmi";

import { wagmiConfig } from "@/lib/wagmi";
import { ElectionProvider } from "@/lib/ElectionContext.jsx";
import Navbar from "@/components/Navbar.jsx";

import indexCss from "../index.css?url";
import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0b0f14", color: "#e6edf3" }}>
      <div style={{ textAlign: "center" }}>
        <h1 style={{ fontSize: 64, color: "#fff" }}>404</h1>
        <p style={{ color: "#8b97a3", marginTop: 8 }}>Page not found</p>
        <a href="/" style={{ display: "inline-block", marginTop: 16, color: "#00d68f", fontWeight: 600 }}>Go home</a>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0b0f14", color: "#e6edf3", padding: 20 }}>
      <div style={{ textAlign: "center", maxWidth: 480 }}>
        <h1 style={{ color: "#fff" }}>Something went wrong</h1>
        <p style={{ color: "#8b97a3", marginTop: 8, fontSize: 14 }}>{error.message}</p>
        <button
          onClick={() => { router.invalidate(); reset(); }}
          style={{ marginTop: 16, background: "#00d68f", color: "#062014", border: "none", padding: "10px 18px", borderRadius: 8, fontWeight: 600, cursor: "pointer" }}
        >
          Try again
        </button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "ChainVote — Web3 E-Voting" },
      { name: "description", content: "Decentralized e-voting platform built on Web3." },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "stylesheet", href: indexCss },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <ElectionProvider>
          <Navbar />
          <div className="app-container">
            <Outlet />
          </div>
        </ElectionProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
