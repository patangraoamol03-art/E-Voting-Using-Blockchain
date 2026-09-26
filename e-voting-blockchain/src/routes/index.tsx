import { createFileRoute } from "@tanstack/react-router";
import Home from "@/pages/Home.jsx";

export const Route = createFileRoute("/")({
  component: Home,
});
