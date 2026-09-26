import { createFileRoute } from "@tanstack/react-router";
import Result from "@/result/Result.jsx";

export const Route = createFileRoute("/result")({
  component: Result,
});
