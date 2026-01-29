import doImg from "../assets/do.png";
import flImg from "../assets/fl.png";

export default function Games() {
  return (
    <main className="games-section">
      <h1>Games</h1>
      <p>Enjoy classic paper-and-pencil games</p>

      <div className="game-cards-grid">
        <a href="https://sagarchhetrii.github.io/dotify/" className="game-card">
          <img src={doImg} />
          <h3>Dotify</h3>
        </a>

        <a href="https://sagarchhetrii.github.io/FlappyBird/" className="game-card">
          <img src={flImg} />
          <h3>Flappy Bird</h3>
        </a>
      </div>
    </main>
  );
}
