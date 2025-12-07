import React, { useState, useEffect } from "react";
import styles from "./CSS/Notes.module.css";

const Notes = () => {
  const [isActive, setIsActive] = useState(false);

  const [notes, setNotes] = useState(() => {
    try {
      const storedNotes = localStorage.getItem("notes");
      return storedNotes ? JSON.parse(storedNotes) : [];
    } catch (error) {
      console.error("Failed to parse notes from localStorage:", error);
      return [];
    }
  });
  const [currentNote, setCurrentNote] = useState("");

  useEffect(() => {
    try {
      localStorage.setItem("notes", JSON.stringify(notes));
    } catch (error) {
      console.error("Failed to save notes to localStorage:", error);
    }
  }, [notes]);

  const handleInputChange = (event) => {
    setCurrentNote(event.target.value);
  };

  const handleAddNote = () => {
    if (currentNote.trim() !== "") {
      setNotes([...notes, { id: Date.now(), text: currentNote.trim() }]);
      setCurrentNote("");
    }
  };

  const handleDeleteNote = (id) => {
    setNotes(notes.filter((note) => note.id !== id));
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      handleAddNote();
      event.preventDefault();
      
    }
  };

  const toggleMenu = () => {
    setIsActive(!isActive);
  };

  return (
    <>
      <button
        className={`${styles.ToggleBtn} ${isActive ? styles.Active : ""}`}
        onClick={toggleMenu}
        aria-label="Toggle links menu"
        aria-expanded={isActive}
      />
      <div
        className={`${styles.notesContainer} ${isActive ? styles.Active : ""}`}
      >
        <h2 className={styles.notesTitle}>My Notes</h2>
        <div className={styles.inputGroup}>
          <textarea
            className={styles.noteInput}
            value={currentNote}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Write a new note..."
            rows="3"
          />
          <button className={styles.addButton} onClick={handleAddNote}>
            Add Note
          </button>
        </div>
        <div className={styles.notesList}>
          {notes.length === 0 ? (
            <p className={styles.noNotesMessage}>
              Hold down "Shift" + "Enter" to add a new line in your note. Press
              "Enter" to save the note.
            </p>
          ) : (
            notes.map((note) => (
              <div key={note.id} className={styles.noteItem}>
                <p className={styles.noteText}>{note.text}</p>
                <button
                  className={styles.deleteButton}
                  onClick={() => handleDeleteNote(note.id)}
                >
                  &times;
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default Notes;
