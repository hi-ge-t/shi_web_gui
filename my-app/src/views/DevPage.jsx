import React from "react";
import Settings from "../components/Settings/Settings";
import ThemeToggle from "../components/ThemeToggle/ThemeToggle";

export default function DevPage() {
  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ marginBottom: 12 }}>開発者ページ</h1>
      <div style={{ marginBottom: 12 }}>
        <ThemeToggle />
      </div>
      <Settings />
    </div>
  );
}