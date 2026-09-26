import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";

import {
  useAccount,
  usePublicClient,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";

import abi from "../../abi.json";

import "./Voter.css";

function fmt(ts) {
  if (!ts) return "—";

  return new Date(Number(ts) * 1000).toLocaleString();
}

export default function Voter() {

  const navigate = useNavigate();

  const publicClient = usePublicClient();

  const { address } = useAccount();

  const CONTRACT_ADDRESS =
    import.meta.env.VITE_CONTRACT_ADDRESS;

  const [candidates, setCandidates] =
    useState([]);

  const [votingId, setVotingId] =
    useState(null);

  

  const { data: candidateCount } =
    useReadContract({
      address: CONTRACT_ADDRESS,
      abi,
      functionName: "candidateCount",
    });

  const { data: totalVotes } =
    useReadContract({
      address: CONTRACT_ADDRESS,
      abi,
      functionName: "totalVotes",
    });

  const { data: status } =
    useReadContract({
      address: CONTRACT_ADDRESS,
      abi,
      functionName: "status",
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

  const { data: electionId } =
    useReadContract({
      address: CONTRACT_ADDRESS,
      abi,
      functionName: "electionId",
    });

    const { data: voterData } =
  useReadContract({
    address: CONTRACT_ADDRESS,
    abi,
    functionName: "voters",
    args: [address],
    query: {
      enabled: !!address,
    },
  });

  const isRegistered =
  voterData?.[1] || false;

  const { data: hasVoted } =
    useReadContract({
      address: CONTRACT_ADDRESS,
      abi,
      functionName: "hasVoted",
      args: [electionId, address],
      query: {
        enabled:
          electionId !== undefined &&
          !!address,
      },
    });

  

  useEffect(() => {

    async function loadCandidates() {

      if (
        candidateCount === undefined ||
        candidateCount === null
      ) {
        return;
      }

      let arr = [];

      for (
        let i = 0;
        i < Number(candidateCount);
        i++
      ) {

        try {

          const data =
            await publicClient.readContract({
              address: CONTRACT_ADDRESS,
              abi,
              functionName: "getCandidate",
              args: [i],
            });

          if (!data[1]) continue;

          arr.push({
            id: Number(data[0]),
            name: data[1],
            party: data[2],
            votes: Number(data[3]),
          });

        } catch (error) {

          console.log(error);

        }
      }

      setCandidates(arr);
    }

    loadCandidates();

  }, [
    candidateCount,
    status,
  ]);

  

  const {
    data: hash,
    writeContract,
  } = useWriteContract();

  const {
    isSuccess,
    isLoading,
  } =
    useWaitForTransactionReceipt({
      hash,
    });

  

  useEffect(() => {

    if (isSuccess) {
      window.location.reload();
    }

  }, [isSuccess]);

  

  useEffect(() => {

    if (Number(status) === 2) {

      const timer = setTimeout(() => {

        navigate({
          to: "/result",
        });

      }, 1500);

      return () => clearTimeout(timer);
    }

  }, [status]);

  

  function vote(id) {

    setVotingId(id);

    writeContract({
      address: CONTRACT_ADDRESS,
      abi,
      functionName: "vote",
      args: [id],
    });
  }

  let statusText = "";

  if (Number(status) === 0) {
    statusText = "Not Started";
  }
  else if (Number(status) === 1) {
    statusText = "Running";
  }
  else {
    statusText = "Ended";
  }

  const statusClass =
    statusText === "Running"
      ? "status-running"
      : statusText === "Ended"
      ? "status-ended"
      : "status-pending";

  return (

    <div className="voter">

      <h1 className="section-title">
        Voter Panel
      </h1>

      

      <div className="card voter-status">

        <div className="voter-status-grid">

          <div>
            <span className="label">
              Status
            </span>

            <span
              className={`status-pill ${statusClass}`}
            >
              {statusText}
            </span>
          </div>

          <div>
            <span className="label">
              Start Time
            </span>

            <p className="voter-time">
              {fmt(startTime)}
            </p>
          </div>

          <div>
            <span className="label">
              End Time
            </span>

            <p className="voter-time">
              {fmt(endTime)}
            </p>
          </div>

        </div>

        {
          hasVoted &&
          statusText === "Running" && (
            <div className="voter-voted">
              You already voted
            </div>
          )
        }
            {
        !isRegistered &&
        address && (
        <div
          className="voter-voted"
             style={{
              background: "#ffefef",
            color: "#c00",
          }}
      >
            You are not registered
            to vote
          </div>
        )
      }


      </div>

      

      <h2
        className="section-title"
        style={{ marginTop: 30 }}
      >
        Candidates
      </h2>

      {
        candidates.length === 0 ? (

          <div className="card voter-empty">
            No Candidates Found
          </div>

        ) : (

          <div className="voter-grid">

            {
              candidates.map((c) => (

                <div
                  key={c.id}
                  className="card voter-card"
                >

                  <div className="voter-avatar">
                    {c.name.charAt(0).toUpperCase()}
                  </div>

                  <h3>{c.name}</h3>

                  <p className="voter-party">
                    {c.party}
                  </p>

                  <div className="voter-votes">

                    <span>Votes</span>

                    <strong>
                      {c.votes}
                    </strong>

                  </div>

                  <button
                    className="btn"
                    disabled={
                    hasVoted ||
                      !isRegistered ||
                     statusText !== "Running" ||
                    isLoading
                    }
                    onClick={() => vote(c.id)}
                  >

                    {
                    isLoading &&
                    votingId === c.id
                      ? "Voting..."
                       : !isRegistered
                       ? "Not Registered"
                      : hasVoted
                       ? "Voted"
                      : "Vote"
                      }

                  </button>

                </div>

              ))
            }

          </div>

        )
      }

      

      <h2
        className="section-title"
        style={{ marginTop: 30 }}
      >
        Live Vote Count
      </h2>

      <div className="card">

        <p className="voter-total">

          Total Votes :
          <strong>
            {" "}
            {totalVotes?.toString()}
          </strong>

        </p>

        <div className="voter-live">

          {
            candidates.map((c) => {

              const pct =
                totalVotes &&
                Number(totalVotes) > 0
                  ? (
                      c.votes /
                      Number(totalVotes)
                    ) * 100
                  : 0;

              return (

                <div
                  key={c.id}
                  className="voter-bar-row"
                >

                  <div className="voter-bar-label">

                    <span>
                      {c.name}
                    </span>

                    <span>
                      {c.votes}
                    </span>

                  </div>

                  <div className="voter-bar">

                    <div
                      className="voter-bar-fill"
                      style={{
                        width: `${pct}%`,
                      }}
                    />

                  </div>

                </div>

              );
            })
          }

        </div>

      </div>

    </div>
  );
}
