import React, { useState } from "react";
import Button from "../ui/Button";
import Input from "../ui/Input";
import { Card } from "../ui/Card";
import { useModal } from "../providers/ModalProvider";

export default function LoginPage(){
  const { openModal } = useModal();
  const [id, setId] = useState("admin");
  const [pw, setPw] = useState("demo");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if(!id || !pw){
      openModal("error", { title:"入力エラー", message:"ユーザーIDとパスワードを入力してください。" });
      return;
    }
    setLoading(true);
    await new Promise(r=>setTimeout(r, 400));
    if(id==="admin" && pw==="demo"){
      openModal("confirmNavigate", { title:"ログイン成功", message:"操作画面へ移動します。", to:"/operate" });
    }else{
      openModal("error", { title:"認証失敗", message:"ユーザーIDまたはパスワードが正しくありません。" });
    }
    setLoading(false);
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="login-title">ログイン画面</h1>
        <form className="login-form form-horizontal">
          <div className="field">
            <label className="login-label">ユーザー名</label>
            <input type="text" className="login-input" placeholder="your name" />
          </div>
          <div className="field">
            <label className="login-label">パスワード</label>
            <input type="password" className="login-input" placeholder="••••••" />
          </div>
          <div className="login-actions">
            <button type="submit" className="login-btn">ログイン</button>
          </div>
        </form>
      </div>
    </div>
  );
}