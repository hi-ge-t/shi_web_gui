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
    <div className="grid min-h-screen place-items-center bg-[#0f1220] text-slate-100 p-[calc(32px*var(--ui-scale))]">
      <Card className="w-[calc(560px*var(--ui-scale))] p-[calc(28px*var(--ui-scale))]">
        <h1 className="mb-2 text-[calc(26px*var(--ui-scale))] font-extrabold">ログイン</h1>

        <form onSubmit={submit} className="grid gap-4">
          <div>
            <div className="mb-1 text-[calc(15px*var(--ui-scale))] text-slate-400 font-medium">ユーザーID</div>
            <Input value={id} onChange={e=>setId(e.target.value)} autoFocus />
          </div>

          <div>
            <div className="mb-1 text-[calc(15px*var(--ui-scale))] text-slate-400 font-medium">パスワード</div>
            <Input type="password" value={pw} onChange={e=>setPw(e.target.value)} />
          </div>

          <Button variant="primary" disabled={loading}>
            {loading ? "認証中..." : "ログイン"}
          </Button>

          <div className="grid gap-2">
            <Button type="button" variant="ghost" onClick={() => openModal("warning", {title:"パスワードを忘れた", message:"開発中のため未実装です。"})}>
              パスワードを忘れた
            </Button>
            <div className="text-center text-[13px] text-slate-400">
              ID: <b>admin</b> / PW: <b>demo</b>（デモ用）
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
}