import { Link } from "@tanstack/react-router";
import { useConnection, useDisconnect } from "wagmi";
import "./Navbar.css";

//for switching between pages

export default function Navbar() {
  const connection = useConnection();
  const { disconnect } = useDisconnect();
  const addr = connection.addresses?.[0];
  const short = addr ? `${addr.slice(0, 6)}…${addr.slice(-4)}` : null;

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <span className="navbar-logo">⬢</span> ChainVote
      </Link>
      <div className="navbar-links">
        <Link to="/role" className="navbar-link">Role</Link>
        <Link to="/voter" className="navbar-link">Voter</Link>
        <Link to="/admin" className="navbar-link">Admin</Link>
        <Link to="/result" className="navbar-link">Result</Link>
        {short && (
          <>
            <span className="navbar-addr">{short}</span>
            <button className="btn-outline" onClick={() => disconnect()}>
              Disconnect
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
