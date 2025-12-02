import { useState } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import styles from "./CSS/Links.module.css";

export default function Links() {
  const [isActive, setIsActive] = useState(false);

  const toggleMenu = () => {
    setIsActive(!isActive);
  };

  const links = [
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
    { href: "https://chatgpt.com/", icon: "bi-openai", label: "ChatGPT" },
    {
      href: "https://onedrive.live.com/?login_hint=vivek%2Emorigan%40gmail%2Ecom&view=1",
      icon: "bi-cloud-fill",
      label: "OneDrive",
    },
    {
      href: "https://www.instagram.com/",
      icon: "bi-instagram",
      label: "Instagram",
    },
    {
      href: "https://id.supercell.com/en/clashofclans/",
      icon: "bi-controller",
      label: "Clash of Clans",
    },
    {
      href: "https://coc-tracker.pages.dev/",
      icon: "bi-hourglass-split",
      label: "COC Tracker",
    },
    {
      href: "https://chrome.google.com/webstore",
      icon: "bi-shop",
      label: "Webstore",
    },
  ];

  return (
    <>
      <button
        className={`${styles.ToggleBtn} ${isActive ? styles.Active : ""}`}
        onClick={toggleMenu}
        aria-label="Toggle links menu"
        aria-expanded={isActive}
      />

      <div className={`${styles.Container} ${isActive ? styles.Active : ""}`}>
        {links.map((link, index) => (
          <a
            key={index}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.LinkItem}
            aria-label={link.label}
          >
            <i className={`bi ${link.icon}`}></i>
          </a>
        ))}
      </div>
    </>
  );
}
