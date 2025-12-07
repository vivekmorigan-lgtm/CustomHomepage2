import { useEffect, useRef, useState, createContext } from "react";
import styles from "./CSS/Panel.module.css";

export const PanelContext = createContext();

const Panel = ({ children }) => {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [showRemoveLinks, setShowRemoveLinks] = useState(false);
  const panelRef = useRef(null);

  useEffect(() => {
    const handleContextMenu = (e) => {
      e.preventDefault();
      setPosition({ x: e.clientX, y: e.clientY });
      setVisible(true);
    };

    const handleClick = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setVisible(false);
      }
    };

    const handleEscape = (e) => {
      if (e.key === "Escape") setVisible(false);
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const ResetToDefault = () => {
    localStorage.removeItem("customLinks");
    localStorage.removeItem("Notes");
    window.location.reload();
  };

  const RemoveLinks = () => {
    setShowRemoveLinks(true);
    setVisible(false);
    console.log("Remove Links Clicked");
  };

  return (
    <PanelContext.Provider value={{ showRemoveLinks, setShowRemoveLinks }}>
      {children}
      {visible && (
        <div
          id="settings-panel"
          ref={panelRef}
          style={{
            position: "fixed",
            top: position.y,
            left: position.x,
          }}
          className={styles.Panel}
        >
          <div className={styles.PanelContent}>
            <button
              className={`${styles.btn}`}
              onClick={() => window.location.reload()}
            >
              <i className="bi bi-arrow-clockwise"></i>
              <span>Reload</span>
            </button>

            <button className={`${styles.btn}`} onClick={RemoveLinks}>
              <i className="bi bi-link-45deg-slash"></i>
              <span>Remove Links</span>
            </button>

            <button
              className={`${styles.btn} ${styles.danger}`}
              onClick={ResetToDefault}
            >
              <i className="bi bi-x-circle"></i>
              <span>Reset to Default</span>
            </button>
            <div className={styles.LinksCont}>
              <a
                href="https://github.com/vivekmorigan-lgtm"
                target="_blank"
                rel="noopener noreferrer"
                className={`${styles.links}`}
              >
                <i className="bi bi-github"></i>
              </a>
              <a
                href="https://contact015.pages.dev"
                target="_blank"
                rel="noopener noreferrer"
                className={`${styles.links}`}
              >
                <i className="bi bi-envelope"></i>
              </a>
            </div>
          </div>
        </div>
      )}
    </PanelContext.Provider>
  );
};

export default Panel;
