import React from "react";
import ChatIcon from "@material-ui/icons/Chat";
import "./Header.css";
import { useStateValue } from "./StateProvider";

function Header() {
  const [{ user }, dispatch] = useStateValue();

  return (
    <nav className="header">
      <div className="whiteText">Hello {user ? user : "Guest"}</div>
    </nav>
  );
}

export default Header;
