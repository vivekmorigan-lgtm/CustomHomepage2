import "bootstrap-icons/font/bootstrap-icons.css";
import styles from "./CSS/App.module.css";
import "./CSS/Global.css";
import Clock from "./Clock";
import Links from "./Links.jsx";
import Notes from "./Notes.jsx";
import Panel from "./Panel.jsx";
import Particles from "./Particles.jsx";
import Timer from "./Timer.jsx";

const url = `https://picsum.photos/1920/1080?random=${Math.random()}`;

function applyRandomOnlineBackground() {
  document.body.style.backgroundImage = `url("${url}")`;
}
applyRandomOnlineBackground();

function App() {
  return (
    <Panel>
      <Particles />
      <button
        className={styles.reloadButton}
        onClick={() => window.location.reload()}
      >
        <i className="bi bi-arrow-clockwise"></i>
      </button>
      <Clock />
      <Links />
      <Notes />
      <Timer />
    </Panel>
  );
}

export default App;
