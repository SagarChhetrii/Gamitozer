import { Link } from "react-router-dom";
import logo from "../assets/desktoppprr.png";

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="logo">
        <img src={logo} className="logo-icon" />
        <span>Gamitozer</span>
      </div>
      
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/games">Games</Link></li>
          <li><a href="#">Profile</a></li>
        </ul>
      </nav>
    </header>
  );
}
