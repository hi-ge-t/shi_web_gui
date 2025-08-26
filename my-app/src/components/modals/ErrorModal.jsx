import React from "react";

export default function ErrorModal({ title="エラー", message="不明なエラーが発生しました。", onClose }) {
  return (
    <div>
      <h3 style={{marginTop:0}}>{title}</h3>
      <p style={{whiteSpace:"pre-wrap"}}>{message}</p>
      <div className="modal-actions">
        <button className="btn primary" onClick={onClose}>OK</button>
      </div>
    </div>
  );
}