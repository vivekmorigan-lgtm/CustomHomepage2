import { useState, useEffect, useContext } from "react";
import { PanelContext } from "./Panel";
import "bootstrap-icons/font/bootstrap-icons.css";
import styles from "./CSS/Links.module.css";

const defaultLinks = [
  { href: "https://github.com", icon: "bi-github", label: "GitHub" },
  {
    href: "https://discord.com/channels/@me",
    icon: "bi-discord",
    label: "Discord",
  },
  { href: "https://youtube.com", icon: "bi-youtube", label: "YouTube" },
  {
    href: "https://music.youtube.com/",
    icon: "bi-music-note-beamed",
    label: "YouTube Music",
  },
  { href: "https://chat.openai.com/", icon: "bi-openai", label: "ChatGPT" },
  {
    href: "https://www.instagram.com/",
    icon: "bi-instagram",
    label: "Instagram",
  },
];

function Links() {
  const { showRemoveLinks, setShowRemoveLinks } = useContext(PanelContext);
  const [links, setLinks] = useState(() => {
    const saved = localStorage.getItem("customLinks");
    return saved ? JSON.parse(saved) : defaultLinks;
  });

  const [showModal, setShowModal] = useState(false);
  const [newLink, setNewLink] = useState({ href: "", label: "" });
  const [popup, setPopup] = useState({ visible: false, text: "", x: 0, y: 0 });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewLink((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    localStorage.setItem("customLinks", JSON.stringify(links));
  }, [links]);

  const addLink = (e) => {
    e.preventDefault();
    if (newLink.href && newLink.label) {
      const getLogoChar = (href) => {
        try {
          const cleaned = href
            .replace(/^https?:\/\//, "")
            .replace(/^www\./, "");
          return cleaned.charAt(0).toUpperCase() || "?";
        } catch (err) {
          return "?";
        }
      };

      const logo = getLogoChar(newLink.href);
      const linkToAdd = { ...newLink, icon: logo };
      setLinks([...links, linkToAdd]);
      setNewLink({ href: "", label: "" });
      setShowModal(false);
    }
  };

  const removeLink = (index) => {
    setLinks(links.filter((_, i) => i !== index));
  };

  return (
    <>
      <div className={styles.Container}>
        {links.map((link, index) => (
          <div
            key={index}
            className={styles.LinkItemWrapper}
            onMouseEnter={() =>
              setPopup({ visible: true, text: link.label, x: 0, y: 0 })
            }
            onMouseMove={(e) =>
              setPopup((p) => ({
                ...p,
                x: e.clientX + 40,
                y: e.clientY + 40,
              }))
            }
            onMouseLeave={() => setPopup((p) => ({ ...p, visible: false }))}
          >
            <a
              href={link.href}
              rel="noopener noreferrer"
              className={styles.LinkItem}
              aria-label={link.label}
            >
              {typeof link.icon === "string" && link.icon.startsWith("bi-") ? (
                <i className={`bi ${link.icon}`}></i>
              ) : (
                <div className={styles.CharLogo}>{link.icon}</div>
              )}
            </a>
            <button
              className={styles.RemoveLink}
              aria-label={`Remove ${link.label}`}
              onClick={() => {
                removeLink(index);
                setShowRemoveLinks(false);
              }}
              style={{
                visibility: showRemoveLinks ? "visible" : "hidden",
                pointerEvents: showRemoveLinks ? "auto" : "none",
              }}
            >
              <i className="bi bi-x-lg"></i>
            </button>
          </div>
        ))}
        <button
          className={styles.AddLink}
          aria-label="Add Link"
          onClick={() => setShowModal(true)}
        >
          <i className="bi bi-plus-lg"></i>
        </button>
      </div>

      <div
        className={styles.HoverPopup}
        style={{
          left: popup.x,
          top: popup.y,
          opacity: popup.visible ? 1 : 0,
        }}
      >
        {popup.text}
      </div>

      {showModal && (
        <div className={styles.ModalOverlay}>
          <div className={styles.Modal}>
            <h3>Add New Link</h3>
            <form onSubmit={addLink}>
              <input
                type="text"
                name="href"
                placeholder="Link URL"
                value={newLink.href}
                onChange={handleInputChange}
                required
                className={styles.ModalInput}
              />
              <input
                type="text"
                name="label"
                placeholder="Label"
                value={newLink.label}
                onChange={handleInputChange}
                required
                className={styles.ModalInput}
              />
              <div className={styles.ModalActions}>
                <button type="submit" className={styles.PopAddLink}>
                  Add
                </button>
                <button
                  type="button"
                  className={styles.ModalCancelBtn}
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default Links;
