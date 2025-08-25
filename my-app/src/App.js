// src/App.js
import React from "react";
import { Routes, Route, Navigate, Link, useLocation } from "react-router-dom";
import RobotControl from "./components/RobotDashboard/RobotDashboard";   // 操作ページ用
import RobotStatusView from "./views/RobotStatusView";                   // 詳細ページ用
import Settings from "./components/Settings/Settings";                   // 開発者ページで流用
import ThemeToggle from "./components/ThemeToggle/ThemeToggle";
import RobotStatusProvider from "./providers/RobotStatusProvider";
import "./styles/global.css";

// 仮のログインページ（まずは遷移だけ）
function LoginPage() {
  return (
    <div style={{padding:24}}>
      <h2>ログイン</h2>
      <p>（仮）ボタンで操作ページへ遷移します。</p>
      <button onClick={() => (window.location.href = "/operate")}>ログイン</button>
    </div>
  );
}

// 開発者ページ（当面は Settings を丸ごと表示）
function DevPage() {
  return (
    <div style={{padding:24}}>
      <h2>開発者</h2>
      <Settings />
    </div>
  );
}

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
    <RobotStatusProvider>
      <div className="app-container">
        <Nav />
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/operate" element={<RobotControl />} />
          <Route path="/details" element={<RobotStatusView />} />
          <Route path="/dev" element={<DevPage />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </RobotStatusProvider>
  );
}