import React, { useState } from "react";
import "./Settings.css";

const Settings = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="settings-container">
      {/* 設定ボタン */}
      <div className="settings-icon" onClick={() => setIsOpen(true)}>
        ⚙️
      </div>

      {/* モーダル（中央配置） */}
      {isOpen && (
        <div className="settings-modal-background" onClick={() => setIsOpen(false)}>
          <div className="settings-modal" onClick={(e) => e.stopPropagation()}>
            <span className="modal-close" onClick={() => setIsOpen(false)}>✖</span>
            <h2>Settings</h2>
            <p>Adjust your preferences here.</p>
            <button onClick={() => setIsOpen(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
