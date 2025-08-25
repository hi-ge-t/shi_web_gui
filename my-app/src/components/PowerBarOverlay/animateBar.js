// src/utils/animateBar.js
import gsap from "gsap";

/**
 * アニメーション付きのパワーバー更新処理
 * @param {object} ref - Reactのref（DOM参照）
 * @param {number} power - 0〜1の割合
 * @param {object} colors - { low, mid, high } 各パワー段階に応じたカラー
 */
export const animateBar = (ref, power, { low, mid, high }) => {
  const level = power * 100;
  gsap.killTweensOf(ref.current);

  // 高さアニメーション
  gsap.to(ref.current, {
    height: `${level}%`,
    duration: 0.2,
    ease: "power2.out"
  });

  // カラーとエフェクト
  if (power > 0.7) {
    gsap.to(ref.current, {
      backgroundColor: high,
      boxShadow: `0 0 12px ${high}, 0 0 20px white`,
      repeat: -1,
      yoyo: true,
      duration: 0.1
    });
  } else if (power > 0.5) {
    gsap.to(ref.current, {
      backgroundColor: mid,
      boxShadow: `0 0 8px ${mid}`,
      repeat: 0,
      duration: 0.2
    });
  } else {
    gsap.to(ref.current, {
      backgroundColor: low,
      boxShadow: "none",
      repeat: 0,
      duration: 0.2
    });
  }
};
