import { useNavigate } from "@tanstack/react-router";
import "./Role.css";

export default function Role() {
  const navigate = useNavigate();

  return (
    <div className="role">
      <div className="role-header">
        <h1>Select Your Role</h1>
        <p>Choose how you want to interact with the election.</p>
      </div>

      <div className="role-grid">
        <button
          className="role-card"
          onClick={() => navigate({ to: "/voter" })}
        >
          <div className="role-icon">🗳️</div>
          <h2>Voter Panel</h2>
          <p>Cast your vote for your preferred candidate in the active election.</p>
          <span className="role-go">Enter as Voter →</span>
        </button>

        <button
          className="role-card"
          onClick={() => navigate({ to: "/admin" })}
        >
          <div className="role-icon">⚙️</div>
          <h2>Admin Panel</h2>
          <p>Manage candidates, configure timing, and run the election.</p>
          <span className="role-go">Enter as Admin →</span>
        </button>
      </div>
    </div>
  );
}
