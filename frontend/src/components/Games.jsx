import { useEffect } from "react";

import doImg from "../assets/do.png";
import flImg from "../assets/fl.png";

export default function Games() {

  // Apply games page body class
  useEffect(() => {
    document.body.className = "games-page-body";

    return () => {
      document.body.className = "";
    };
  }, []);

  return (
    <main className="games-section">
      <h1 className="games-heading">Games</h1>
      <p className="games-tagline">
        Enjoy classic paper-and-pencil games
      </p>

      <div className="game-cards-grid">

        <a
          href="https://sagarchhetrii.github.io/dotify/"
          className="game-card image-only-card"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="game-card-media hover-blur">
            <img src={doImg} className="game-card-icon" />
            <div className="game-card-title-overlay">Dotify</div>
          </div>
        </a>

        <a
          href="https://sagarchhetrii.github.io/FlappyBird/"
          className="game-card image-only-card"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="game-card-media hover-blur">
            <img src={flImg} className="game-card-icon" />
            <div className="game-card-title-overlay">Flappy Bird</div>
          </div>
        </a>

      </div>

    </main>
  );
}

