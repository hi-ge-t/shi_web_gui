import React from "react";

export default function WarningModal({ title="警告", message="この操作を続行しますか？", onClose, onConfirm }) {
  return (
    <div>
      <h3 style={{marginTop:0}}>{title}</h3>
      <p style={{whiteSpace:"pre-wrap"}}>{message}</p>
      <div className="modal-actions">
        <button className="btn" onClick={onClose}>キャンセル</button>
        <button className="btn primary" onClick={()=>{ onConfirm?.(); onClose(); }}>続行</button>
      </div>
    </div>
  );
}