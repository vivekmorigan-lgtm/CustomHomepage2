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
  const [newLink, setNewLink] = useState({ href: "", icon: "", label: "" });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewLink((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    localStorage.setItem("customLinks", JSON.stringify(links));
  }, [links]);

  const addLink = (e) => {
    e.preventDefault();
    if (newLink.href && newLink.icon && newLink.label) {
      setLinks([...links, newLink]);
      setNewLink({ href: "", icon: "", label: "" });
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
          <div key={index} className={styles.LinkItemWrapper}>
            <a
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.LinkItem}
              aria-label={link.label}
            >
              <i className={`bi ${link.icon}`}></i>
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
                name="icon"
                placeholder="Bootstrap Icon (e.g. bi-github)"
                value={newLink.icon}
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
