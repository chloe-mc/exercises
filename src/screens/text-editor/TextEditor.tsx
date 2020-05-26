import React, { useState } from "react";
import "./TextEditor.scss";

const TextEditor: React.FC = () => {
  const [history, setHistory] = useState<string[]>([]);
  const [undoHistory, setUndoHistory] = useState<string[]>([]);
  const [text, setText] = useState<string>("");

  const undo = () => {
    const undone = history.pop() || "";
    undone && setUndoHistory([...undoHistory, undone]);
    history.length ? setText(history[history.length - 1]) : setText("");
  };

  const redo = () => {
    const redone = undoHistory.pop() || "";
    redone && setHistory([...history, redone]);
    history.length && setText(history[history.length - 1]);
  };

  return (
    <div className="text-editor__container">
      <header className="text-editor__header">
        <h1>Text Editor</h1>
      </header>
      <div className="text-editor__editor">
        <textarea
          className="text-editor__editor-textarea"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            history.push(e.target.value);
          }}
        />
        <div className="text-editor__buttons__container">
          <button onClick={() => undo()}>Undo</button>
          <button onClick={() => redo()}>Redo</button>
        </div>
      </div>
    </div>
  );
};

export { TextEditor };
