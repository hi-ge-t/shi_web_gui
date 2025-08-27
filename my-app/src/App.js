// src/App.js
import React from "react";
import { Routes, Route, Navigate, Link, useLocation } from "react-router-dom";
import RobotControl from "./components/RobotDashboard/RobotDashboard";   // 操作ページ用
import Settings from "./components/Settings/Settings";                   // 開発者ページで流用
import ThemeToggle from "./components/ThemeToggle/ThemeToggle";

import StatusBar from "./components/StatusBar";
import LoginPage from "./views/LoginPage";
import OperatePage from "./views/OperatePage";
import DetailPage from "./views/DetailPage";
import DevPage from "./views/DevPage";
import { ModalProvider } from "./providers/ModalProvider";
import ModalRoot from "./components/ModalRoot/ModalRoot";

import { MockRobotStatusProvider } from "./contexts/RobotStatusContext";

// 簡易ナビ（右上ボタンの位置を再利用）
function Nav() {
  const { pathname } = useLocation();
  const A = ({to, children}) => (
    <Link
      to={to}
      style={{
        padding:"8px 12px",
        borderRadius:8,
        textDecoration:"none",
        color: pathname===to ? "#fff" : "#e6e9f2",
        background: pathname===to ? "#5b8cff" : "transparent",
        marginRight:8
      }}
    >
      {children}
    </Link>
  );
  return (
    <div className="top-right-buttons" style={{gap:8}}>
      <A to="/login">ログイン</A>
      <A to="/operate">操作</A>
      <A to="/details">詳細</A>
      <A to="/dev">開発者</A>
      <ThemeToggle />
    </div>
  );
}

export default function App() {
  return (
    <MockRobotStatusProvider tick>
      <ModalProvider>
        <div className="app-container">
          {/* 画面上部にバーを1回だけ表示 */}
          <StatusBar />

          {/* 共通ナビゲーション（右上） */}
          {/* <Nav /> */}

          {/* ページルーティング */}
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/operate" element={<OperatePage />} />
            <Route path="/details" element={<DetailPage />} />
            <Route path="/dev" element={<DevPage />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>

        {/* モーダルは全ページで使えるようにルートに配置 */}
        <ModalRoot />
      </ModalProvider>
    </MockRobotStatusProvider>
  );
}