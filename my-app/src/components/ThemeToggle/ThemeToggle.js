import React, { useState, useEffect } from "react";
import "../../styles/global.css"; // ✅ ここで `global.css` を確実に適用する

const ThemeToggle = () => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark-theme");

  useEffect(() => {
    document.body.className = theme; // ✅ テーマをbodyに適用
    localStorage.setItem("theme", theme); // ✅ 記憶する
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "dark-theme" ? "light-theme" : "dark-theme"));
  };

  return (
    <button className="theme-toggle" onClick={toggleTheme}>
      {theme === "dark-theme" ? "🌞 Light Mode" : "🌙 Dark Mode"}
    </button>
  );
};

export default ThemeToggle;
