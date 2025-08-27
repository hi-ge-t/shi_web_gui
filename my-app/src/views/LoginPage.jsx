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
        <form className="login-form form-horizontal" onSubmit={submit}>
          
          <div className="field">
            <label className="login-label">ユーザー名</label>
            <Input className="login-input" value={id} onChange={e=>setId(e.target.value)} autoFocus />
          </div>

          <div className="field">
            <label className="login-label">パスワード</label>
            <Input className="login-input" type="password" value={pw} onChange={e=>setPw(e.target.value)} />
          </div>

          <div className="login-actions">
            <Button className="login-btn" variant="primary" disabled={loading}>
              {loading ? "認証中..." : "ログイン"}
            </Button>
          </div>
          
          <div className="text-center text-[13px] text-slate-400">
            ID: <b>admin</b> / PW: <b>demo</b>（デモ用）
          </div>

        </form>
      </div>
    </div>
  );
}
