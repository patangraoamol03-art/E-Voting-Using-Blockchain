import { createFileRoute } from "@tanstack/react-router";
import Role from "@/role/Role.jsx";

export const Route = createFileRoute("/role")({
  component: Role,
});
