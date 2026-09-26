import { useEffect, useState } from "react";
import "./Admin.css";

import {
  useConnection,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
  usePublicClient,
} from "wagmi";

import abi from "../../abi.json";

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;

export default function Admin() {
  const connection = useConnection();

  const [isAdmin, setIsAdmin] = useState(null);

  const { data } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi,
    functionName: "admin",
  });

  useEffect(() => {
    const currentAddress = connection.address;

    if (!data || !currentAddress) return;

    setIsAdmin(data.toLowerCase() === currentAddress.toLowerCase());
  }, [data, connection.address]);

  if (isAdmin === null) return <h1>Authorizing...</h1>;

  if (!isAdmin) return <h1>Not authorized</h1>;

  return <AdminPanel />;
}

function AdminPanel() {
  const publicClient = usePublicClient();

  const [candidates, setCandidates] = useState([]);

  const [name, setName] = useState("");

  const [party, setParty] = useState("");

  const [voterName, setVoterName] = useState("");

  const [voterAddress, setVoterAddress] = useState("");

  const [startTimeInput, setStartTimeInput] = useState("");

  const [endTimeInput, setEndTimeInput] = useState("");
  const [address, setAddress] = useState();
  const { data: candidateCount, refetch: refetchCandidateCount } =
    useReadContract({
      address: CONTRACT_ADDRESS,
      abi,
      functionName: "candidateCount",
    });

  const { data: totalVotes } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi,
    functionName: "totalVotes",
  });

  const { data: status } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi,
    functionName: "status",
  });

  useEffect(() => {
    async function loadCandidates() {
      if (Number(candidateCount) === 0) {
        setCandidates([]);
        return;
      }

      let temp = [];

      for (let i = 0; i < Number(candidateCount); i++) {
        const res = await publicClient.readContract({
          address: CONTRACT_ADDRESS,
          abi,
          functionName: "getCandidate",
          args: [i],
        });

        if (!res[4]) continue;

        temp.push({
          id: Number(res[0]),
          name: res[1],
          party: res[2],
          votes: Number(res[3]),
        });
      }

      setCandidates(temp);
    }

    loadCandidates();
  }, [candidateCount]);

  const { data: hash, writeContract } = useWriteContract();

  const { isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  useEffect(() => {
    if (isSuccess) {
      refetchCandidateCount();
      window.location.reload();
    }
  }, [isSuccess]);

  function handleAdd(e) {
    e.preventDefault();

    if (!name || !party || !address) return;

    writeContract({
      address: CONTRACT_ADDRESS,
      abi,
      functionName: "addCandidate",
      args: [name, party, address],
    });

    setName("");
    setParty("");
  }

  function handleAddVoter(e) {
    e.preventDefault();

    if (!voterName || !voterAddress) return;
    console.log("handle function ran", voterName, voterAddress);
    writeContract({
      address: CONTRACT_ADDRESS,
      abi,
      functionName: "addVoter",
      args: [voterAddress, voterName],
    });

    setVoterName("");
    setVoterAddress("");
  }

  function handleRemoveCandidate(id) {
    writeContract({
      address: CONTRACT_ADDRESS,
      abi,
      functionName: "removeCandidate",
      args: [id],
    });
  }

  function handleStartElection() {
    const start = Math.floor(new Date(startTimeInput).getTime() / 1000);

    const end = Math.floor(new Date(endTimeInput).getTime() / 1000);

    writeContract({
      address: CONTRACT_ADDRESS,
      abi,
      functionName: "startElection",
      args: [start, end],
    });
  }

  function handleEndElection() {
    writeContract({
      address: CONTRACT_ADDRESS,
      abi,
      functionName: "endElection",
    });
  }

  function handleResetElection() {
    writeContract({
      address: CONTRACT_ADDRESS,
      abi,
      functionName: "resetElection",
    });
  }

  return (
    <div className="admin">
      <h1 className="section-title">Admin Panel</h1>

      <div className="admin-grid-top">
        <div className="card">
          <span className="label">Status</span>

          <p className="admin-stat">
            {status == 0 ? "Not Started" : status == 1 ? "Running" : "Ended"}
          </p>
        </div>

        <div className="card">
          <span className="label">Total Votes</span>

          <p className="admin-stat">{totalVotes?.toString()}</p>
        </div>

        <div className="card">
          <span className="label">Candidates</span>

          <p className="admin-stat">{candidates.length}</p>
        </div>
      </div>

      <div className="card admin-section">
        <h2 className="section-title">Election Timing</h2>

        <div className="admin-time-row">
          <div>
            <label className="label">Start date & time</label>

            <input
              type="datetime-local"
              className="input"
              value={startTimeInput}
              onChange={(e) => setStartTimeInput(e.target.value)}
            />
          </div>

          <div>
            <label className="label">End date & time</label>

            <input
              type="datetime-local"
              className="input"
              value={endTimeInput}
              onChange={(e) => setEndTimeInput(e.target.value)}
            />
          </div>
        </div>

        <div className="admin-actions">
          <button className="btn" onClick={handleStartElection}>
            Start Election
          </button>

          <button className="btn-danger" onClick={handleEndElection}>
            End Election
          </button>

          <button className="btn-danger" onClick={handleResetElection}>
            Reset Election
          </button>
        </div>
      </div>

      <div className="card admin-section">
        <h2 className="section-title">Add Voter</h2>

        <form className="admin-form" onSubmit={handleAddVoter}>
          <div>
            <label className="label">Voter Name</label>

            <input
              className="input"
              value={voterName}
              onChange={(e) => setVoterName(e.target.value)}
            />
          </div>

          <div>
            <label className="label">Wallet Address</label>

            <input
              className="input"
              value={voterAddress}
              onChange={(e) => setVoterAddress(e.target.value)}
            />
          </div>

          <button className="btn" type="submit">
            Add Voter
          </button>
        </form>
      </div>

      <div className="card admin-section">
        <h2 className="section-title">Add Candidate</h2>

        <form className="admin-form" onSubmit={handleAdd}>
          <div>
            <label className="label">Candidate Name</label>

            <input
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="label">Party Name</label>

            <input
              className="input"
              value={party}
              onChange={(e) => setParty(e.target.value)}
            />
          </div>

          <div>
            <label className="label">Candidate wallet address</label>

            <input
              className="input"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <button className="btn" type="submit">
            Add Candidate
          </button>
        </form>

        <div className="admin-section">
          <h2 className="section-title">Candidates</h2>

          {candidates.map((c) => (
            <div key={c.id} className="card admin-cand">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <div style={{ flex: 1 }}>
                  <h3>{c.name}</h3>

                  <p>{c.party}</p>

                  <span className="admin-votes">Votes: {c.votes}</span>
                </div>

                <button
                  className="btn-danger"
                  onClick={() => handleRemoveCandidate(c.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
