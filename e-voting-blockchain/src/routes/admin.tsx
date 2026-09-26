import { createFileRoute } from "@tanstack/react-router";
import Admin from "@/admin/Admin.jsx";

export const Route = createFileRoute("/admin")({
  component: Admin,
});
