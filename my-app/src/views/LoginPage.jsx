import React, { useState } from "react";
import { useModal } from "../providers/ModalProvider";   // 既に導入済みの想定
import { useNavigate } from "react-router-dom";

export default function LoginPage(){
  const nav = useNavigate();
  const { openModal } = useModal();
  const [id, setId]   = useState("admin");
  const [pw, setPw]   = useState("demo");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if(!id || !pw){
      openModal("error", { title:"入力エラー", message:"ユーザーIDとパスワードを入力してください。" });
      return;
    }
    setLoading(true);
    await new Promise(r=>setTimeout(r, 400));  // 疑似認証
    if(id === "admin" && pw === "demo"){
      openModal("confirmNavigate", { title:"ログイン成功", message:"操作画面へ移動します。", to:"/operate" });
    }else{
      openModal("error", { title:"認証失敗", message:"ユーザーIDまたはパスワードが正しくありません。" });
    }
    setLoading(false);
  };

  const onForgot = () => {
    openModal("warning", { title:"パスワードを忘れた", message:"開発中のため未実装です。" });
  };

  return (
    <div className="login-wrap">
      <form className="login-card" onSubmit={submit}>
        <h1 className="login-title">ログイン</h1>

        <div>
          <div className="login-label">ユーザーID</div>
          <input className="login-input" value={id} onChange={e=>setId(e.target.value)} autoFocus />
        </div>

        <div>
          <div className="login-label">パスワード</div>
          <input className="login-input" type="password" value={pw} onChange={e=>setPw(e.target.value)} />
        </div>

        <button className="login-btn" type="submit" disabled={loading}>
          {loading ? "認証中..." : "ログイン"}
        </button>

        <div style={{display:"grid", gap:8}}>
          <button type="button" className="login-sub" onClick={onForgot}>パスワードを忘れた</button>
          <div className="login-help">ID: <b>admin</b> / PW: <b>demo</b>（デモ用）</div>
        </div>
      </form>
    </div>
  );
}