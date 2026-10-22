import { type ReactNode } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar.tsx";

export default function WithNavbar({ children }: { children?: ReactNode }) {
  return (
    <>
      <Navbar />
      {children || <Outlet />}
    </>
  );
}
