import React from "react";
import { useNavigate } from "react-router-dom";

export default function ConfirmNavigate({ to="/operate", title="画面遷移", message="この画面を離れます。よろしいですか？", onClose }) {
  const nav = useNavigate();
  return (
    <div>
      <h3 style={{marginTop:0}}>{title}</h3>
      <p style={{whiteSpace:"pre-wrap"}}>{message}</p>
      <div className="modal-actions">
        <button className="btn" onClick={onClose}>キャンセル</button>
        <button className="btn primary" onClick={()=>{ onClose(); nav(to); }}>移動する</button>
      </div>
    </div>
  );
}