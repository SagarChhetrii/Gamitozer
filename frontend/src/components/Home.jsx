import { Link } from "react-router-dom";

import a from "../assets/a.png";
import b from "../assets/b.png";
import c from "../assets/c.png";
import d from "../assets/de.png";
import e from "../assets/e.png";
import f from "../assets/f.png";
import g from "../assets/g.png";
import h from "../assets/h.png";
import i from "../assets/i.png";

export default function Home() {
  return (
    <main className="homepage-hero">
      <div className="hero-content">
        <h1>Play And Add Your Own Games</h1>
        <p className="tagline">
          Your portal to classic paper-and-pencil games anytime, anywhere.
        </p>

        <Link to="/games" className="button view-games-button">
          View Games
        </Link>
      </div>

      <div className="illustrations">
        <img src={a} className="illustration" />
        <img src={b} className="illustration" />
        <img src={c} className="illustration" />
        <img src={d} className="illustration" />
      </div>

      <img src={e} className="doodle" />
      <img src={f} className="doodle" />
      <img src={g} className="doodle" />
      <img src={h} className="doodle" />
      <img src={i} className="doodle" />
    </main>
  );
}
