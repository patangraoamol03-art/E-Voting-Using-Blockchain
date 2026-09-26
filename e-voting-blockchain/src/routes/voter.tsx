import { createFileRoute } from "@tanstack/react-router";
import Voter from "@/voter/Voter.jsx";

export const Route = createFileRoute("/voter")({
  component: Voter,
});
