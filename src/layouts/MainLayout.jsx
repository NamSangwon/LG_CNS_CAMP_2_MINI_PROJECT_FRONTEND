import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import "./mainLayout.css";

export default function MainLayout() {
  return (
    <div className="main_layout_wrapper">
      <Header />
      <div className="main_wrapper">
        <Outlet />
      </div>
    </div>
  );
}
