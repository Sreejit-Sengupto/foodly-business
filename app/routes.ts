import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("/about", "routes/about.tsx"),
  route("/login", "routes/auth/login.tsx"),
  route("/signup", "routes/auth/register.tsx"),
  route("/verify-email", "routes/auth/verify-email.tsx"),
] satisfies RouteConfig;
