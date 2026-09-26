import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";

import {
  usePublicClient,
  useReadContract,
} from "wagmi";

import abi from "../../abi.json";

import "./Result.css";

function fmt(ts) {
  if (!ts) return "—";

  return new Date(
    Number(ts) * 1000
  ).toLocaleString();
}

export default function Result() {
  const navigate = useNavigate();

  const publicClient = usePublicClient();

  const CONTRACT_ADDRESS =
    import.meta.env.VITE_CONTRACT_ADDRESS;

  const [candidates, setCandidates] =
    useState([]);

  

  const { data: status } =
    useReadContract({
      address: CONTRACT_ADDRESS,
      abi,
      functionName: "status",
    });

  const { data: candidateCount } =
    useReadContract({
      address: CONTRACT_ADDRESS,
      abi,
      functionName: "candidateCount",
    });

  const { data: startTime } =
    useReadContract({
      address: CONTRACT_ADDRESS,
      abi,
      functionName: "startTime",
    });

  const { data: endTime } =
    useReadContract({
      address: CONTRACT_ADDRESS,
      abi,
      functionName: "endTime",
    });

  

  useEffect(() => {
    async function loadCandidates() {
      if (
        candidateCount === undefined ||
        candidateCount === null
      )
        return;

      const arr = [];

      for (
        let i = 0;
        i < Number(candidateCount);
        i++
      ) {
        try {
          const res =
            await publicClient.readContract({
              address: CONTRACT_ADDRESS,
              abi,
              functionName: "getCandidate",
              args: [i],
            });

          
          if (!res[1]) continue;

          arr.push({
            id: Number(res[0]),
            name: res[1],
            party: res[2],
            votes: Number(res[3]),
          });
        } catch (err) {
          console.error(
            "Error loading candidate:",
            err
          );
        }
      }

      setCandidates(arr);
    }

    loadCandidates();
  }, [
    candidateCount,
    status,
    publicClient,
    CONTRACT_ADDRESS,
  ]);

  

  if (Number(status) !== 2) {
    return (
      <div className="result">
        <div className="card result-empty">
          <h1>No Results Yet</h1>

          <p>
            The election has not ended
            yet.
          </p>

          <button
            className="btn"
            onClick={() =>
              navigate({ to: "/" })
            }
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  

  const ranked = [...candidates].sort(
    (a, b) => b.votes - a.votes
  );

  const winner = ranked[0];

  return (
    <div className="result">
      <div className="result-header">
        <span className="result-badge">
          Election Completed
        </span>

        <h1>Final Results</h1>

        <p className="result-dates">
          {fmt(startTime)} →{" "}
          {fmt(endTime)}
        </p>
      </div>

      

      {winner && (
        <div className="card result-winner">
          <div className="result-trophy">
            🏆
          </div>

          <div>
            <span className="label">
              Winner
            </span>

            <h2>{winner.name}</h2>

            <p className="result-winner-party">
              {winner.party}
            </p>

            <p className="result-winner-votes">
              {winner.votes} votes
            </p>
          </div>
        </div>
      )}

      

      <h2
        className="section-title"
        style={{ marginTop: 30 }}
      >
        All Candidates
      </h2>

      {ranked.length === 0 ? (
        <div className="card result-empty">
          No candidates found.
        </div>
      ) : (
        <div className="result-grid">
          {ranked.map((c, i) => (
            <div
              key={c.id}
              className={`card result-cand ${
                i === 0
                  ? "result-cand-win"
                  : ""
              }`}
            >
              <div className="result-rank">
                #{i + 1}
              </div>

              <h3>{c.name}</h3>

              <p>{c.party}</p>

              <div className="result-votes">
                {c.votes} votes
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
