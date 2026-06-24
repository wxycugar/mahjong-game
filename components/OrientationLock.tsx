'use client';

import React, { useEffect, useState } from 'react';

/**
 * 强制横屏引导遮罩组件
 * - 仅在移动端（宽度 < 768px）竖屏时显示
 * - 旋转为横屏或宽度 >= 768px 时自动隐藏
 */
export default function OrientationLock() {
  const [showOverlay, setShowOverlay] = useState(false);

  useEffect(() => {
    const checkOrientation = () => {
      const isMobile = window.innerWidth < 768;
      const isPortrait = window.innerHeight > window.innerWidth;
      setShowOverlay(isMobile && isPortrait);
    };

    // 初始检查
    checkOrientation();

    // 监听 resize（宽度变化）和 orientationchange（旋转事件）
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', () => {
      // orientationchange 触发时尺寸尚未更新，延迟到 resize
      setTimeout(checkOrientation, 200);
    });

    // 部分浏览器支持 screen.orientation change
    const orientation = (window.screen as any).orientation;
    if (orientation && typeof orientation.addEventListener === 'function') {
      orientation.addEventListener('change', checkOrientation);
    }

    return () => {
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
      if (orientation && typeof orientation.removeEventListener === 'function') {
        orientation.removeEventListener('change', checkOrientation);
      }
    };
  }, []);

  if (!showOverlay) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/95 flex flex-col items-center justify-center px-8"
      style={{ touchAction: 'none' }}
    >
      {/* 旋转图标动画 */}
      <div className="mb-12 animate-bounce">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="80"
          height="80"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#22c55e"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="animate-[spin_2s_ease-in-out_infinite]"
          style={{ animationDirection: 'alternate' }}
        >
          <path d="M1 4v6h6" />
          <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
        </svg>
      </div>

      {/* 提示文字 */}
      <p className="text-emerald-400 text-2xl md:hidden font-black text-center leading-relaxed drop-shadow-[0_0_20px_rgba(34,197,94,0.5)] max-w-sm">
        为了最佳对局体验
        <br />
        请解锁屏幕旋转
        <br />
        将手机<strong className="text-yellow-300">横向</strong>握持
      </p>

      {/* 小提示 */}
      <p className="mt-8 text-white/20 text-xs text-center">
        旋转手机后自动进入游戏
      </p>
    </div>
  );
}