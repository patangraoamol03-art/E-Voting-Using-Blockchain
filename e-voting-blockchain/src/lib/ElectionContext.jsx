import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const ElectionContext =
  createContext();

export function ElectionProvider({
  children,
}) {
  const [candidates, setCandidates] =
    useState([]);

  const [startTime, setStartTime] =
    useState(null);

  const [endTime, setEndTime] =
    useState(null);

  const [status, setStatus] =
    useState("Not Started");

  function addCandidate(
    name,
    party
  ) {
    setCandidates((old) => [
      ...old,
      {
        id: Date.now(),
        name: name,
        party: party,
        votes: 0,
      },
    ]);
  }

  function removeCandidate(id) {
    setCandidates((old) =>
      old.filter(
        (item) => item.id !== id
      )
    );
  }

  function voteCandidate(id) {
    if (status !== "Running")
      return;

    setCandidates((old) =>
      old.map((item) =>
        item.id === id
          ? {
              ...item,
              votes:
                item.votes + 1,
            }
          : item
      )
    );
  }

  function startElection() {
    if (!startTime || !endTime)
      return;

    setStatus("Running");
  }

  function endElection() {
    setStatus("Ended");
  }

  function resetElection() {
    setCandidates([]);
    setStartTime(null);
    setEndTime(null);
    setStatus("Not Started");
  }

  useEffect(() => {
    if (
      !startTime ||
      !endTime ||
      status !== "Not Started"
    )
      return;

    const interval =
      setInterval(() => {
        const now = Date.now();

        if (
          now >= startTime &&
          now < endTime
        ) {
          setStatus("Running");
          clearInterval(
            interval
          );
        }
      }, 1000);

    return () =>
      clearInterval(interval);
  }, [startTime, endTime, status]);

  useEffect(() => {
    if (
      status !== "Running" ||
      !endTime
    )
      return;

    const interval =
      setInterval(() => {
        if (
          Date.now() >= endTime
        ) {
          setStatus("Ended");
          clearInterval(
            interval
          );
        }
      }, 1000);

    return () =>
      clearInterval(interval);
  }, [status, endTime]);

  let totalVotes = 0;

  for (
    let i = 0;
    i < candidates.length;
    i++
  ) {
    totalVotes +=
      candidates[i].votes;
  }

  return (
    <ElectionContext.Provider
      value={{
        candidates,
        addCandidate,
        removeCandidate,
        voteCandidate,
        startTime,
        setStartTime,
        endTime,
        setEndTime,
        status,
        startElection,
        endElection,
        resetElection,
        totalVotes,
      }}
    >
      {children}
    </ElectionContext.Provider>
  );
}

export function useElection() {
  return useContext(
    ElectionContext
  );
}

export function useCountdown(
  endTime
) {
  const [timeLeft, setTimeLeft] =
    useState("");

  useEffect(() => {
    const interval =
      setInterval(() => {
        if (!endTime) {
          setTimeLeft("--");
          return;
        }

        const diff =
          endTime - Date.now();

        if (diff <= 0) {
          setTimeLeft(
            "00:00:00"
          );
          return;
        }

        const hours =
          Math.floor(
            diff /
              (1000 *
                60 *
                60)
          );

        const minutes =
          Math.floor(
            (diff %
              (1000 *
                60 *
                60)) /
              (1000 * 60)
          );

        const seconds =
          Math.floor(
            (diff %
              (1000 * 60)) /
              1000
          );

        setTimeLeft(
          `${String(hours).padStart(
            2,
            "0"
          )}:${String(
            minutes
          ).padStart(
            2,
            "0"
          )}:${String(
            seconds
          ).padStart(2, "0")}`
        );
      }, 1000);

    return () =>
      clearInterval(interval);
  }, [endTime]);

  return timeLeft;
}
