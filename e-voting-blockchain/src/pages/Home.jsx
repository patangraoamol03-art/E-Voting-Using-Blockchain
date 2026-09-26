import { useEffect } from "react";
import {
  useConnect,
  useConnection,
  useConnectors,
  useDisconnect,
} from "wagmi";
import { useNavigate } from "@tanstack/react-router";
import "./Home.css";

export default function Home() {
  const connection = useConnection();
  const { connect, status, error } = useConnect();
  const connectors = useConnectors();
  const { disconnect } = useDisconnect();
  const navigate = useNavigate();

//automatically goes to the role page if wallet is connected
	
  useEffect(() => {
    if (connection.status === "connected") {
      const t = setTimeout(() => navigate({ to: "/role" }), 600);
      return () => clearTimeout(t);
    }
  }, [connection.status, navigate]);

  return (
    <div className="home">
      <section className="home-hero">
        <span className="home-tag">Decentralized Voting</span>
        <h1 className="home-title">
          Transparent elections, <span className="home-accent">on-Blockchain</span>.
        </h1>
        <p className="home-sub">
          ChainVote is a simple blockchain based platform for Elections.
        </p>
      </section>

      <section className="card home-card">
        <h2 className="section-title">Wallet Connection</h2>
        <div className="home-conn-row">
          <span className="label">Status</span>
          <span
            className={`status-pill ${
              connection.status === "connected"
                ? "status-running"
                : "status-pending"
            }`}
          >
            {connection.status}
          </span>
        </div>
        <div className="home-conn-row">
          <span className="label">Address</span>
          <span className="home-addr">
            {connection.addresses?.[0] ?? "—"}
          </span>
        </div>
        <div className="home-conn-row">
          <span className="label">Chain ID</span>
          <span className="home-addr">{connection.chainId ?? "—"}</span>
        </div>

        {connection.status === "connected" ? (
          <div className="home-actions">
            <button className="btn-outline" onClick={() => disconnect()}>
              Disconnect
            </button>
            <button className="btn" onClick={() => navigate({ to: "/role" })}>
              Continue to App →
            </button>
          </div>
        ) : (
          <>
            <div className="home-connectors">
              {connectors.map((connector) => (
                <button
                  key={connector.uid}
                  className="btn"
                  onClick={() => connect({ connector })}
                  type="button"
                >
                  Connect {connector.name}
                </button>
              ))}
            </div>
            {status === "pending" && (
              <p className="home-hint">Waiting for wallet…</p>
            )}
            {error && <p className="home-error">{error.message}</p>}
          </>
        )}
      </section>

      <section className="home-features">
        <div className="card home-feature">
          <div className="home-feature-icon">🗳️</div>
          <h3>Vote</h3>
          <p>Cast a single, verifiable vote for your preferred candidate.</p>
        </div>
        <div className="card home-feature">
          <div className="home-feature-icon">⚙️</div>
          <h3>Administer</h3>
          <p>Create candidates and manage timing of the election.</p>
        </div>
        <div className="card home-feature">
          <div className="home-feature-icon">📊</div>
          <h3>Results</h3>
          <p>Live votes and a final, transparent winner announcement.</p>
        </div>
      </section>
    </div>
  );
}
