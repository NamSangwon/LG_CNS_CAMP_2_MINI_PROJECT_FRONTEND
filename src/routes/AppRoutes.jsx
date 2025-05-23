import { BrowserRouter, useRoutes } from "react-router-dom";
import { routes } from "./RouteConfig";

function RoutesWrapper() {
  const element = useRoutes(routes);
  return element;
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <RoutesWrapper />
    </BrowserRouter>
  );
}
