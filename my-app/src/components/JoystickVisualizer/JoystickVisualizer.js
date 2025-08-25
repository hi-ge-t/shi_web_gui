import React, { useEffect, useRef } from "react";
import gsap from "gsap";

const JoystickVisualizer = ({ x = 0, y = 0, label = "", type = "left", pressed = false }) => {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  
  useEffect(() => {
    const max = 30;
    if (dotRef.current) {
        //gsap.killTweensOf(dotRef.current); // ← これで前のアニメを止めてから次を実行
        gsap.to(dotRef.current, {
            x: x * max,
            y: y * max,
            duration: 0.1,
            ease: "power2.out",
            overwrite: "auto", // ← 💡これで前の tween を自動キャンセルして滑らかに追従！
        });

        const magnitude = Math.sqrt(x * x + y * y);
        //gsap.killTweensOf(dotRef.current); // ← これで前のアニメを止めてから次を実行
        gsap.to(ringRef.current, {
            scale: magnitude > 0.1 ? 1.2 : 1,
            opacity: magnitude > 0.1 ? 0.5 : 0.2,
            duration: 0.1,
            ease: "power2.out",
            overwrite: "auto", // ← 💡これで前の tween を自動キャンセルして滑らかに追従！
        });
    }
  }, [x, y]);

  const baseColor = type === "left" ? "#ec4899" : "#3b82f6";

  return (
    <div style={{ textAlign: "center", margin: "0.5rem" }}>
      <div className="robot-status__item" style={{ color: "#999", marginBottom: "0.3rem", fontSize: "0.9rem" }}>{label}</div>

      <div
        style={{
          position: "relative",
          width: "90px",
          height: "90px",
          border: `2px solid ${baseColor}`,
          borderRadius: "50%",
          backgroundColor: "#000",
          overflow: "hidden",
          margin: "0 auto",
          boxShadow: pressed ? `0 0 12px ${baseColor}` : "none",
        }}
      >
        <div
          ref={ringRef}
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            border: `2px solid ${baseColor}`,
            opacity: 0.2,
            transform: "scale(1)",
            transition: "opacity 0.2s ease",
          }}
        />
        <div
          ref={dotRef}
          style={{
            width: "12px",
            height: "12px",
            backgroundColor: baseColor,
            borderRadius: "50%",
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            boxShadow: pressed ? `0 0 8px ${baseColor}` : "none",
          }}
        />
      </div>

      {/* 🔢 数値表示（フォントclassを適用） */}
      <p className="robot-status__item" style={{ marginTop: "0.3rem", fontSize: "0.6rem" }}>
        x: {x.toFixed(2)} / y: {y.toFixed(2)}
      </p>
    </div>
  );
};

export default JoystickVisualizer;
