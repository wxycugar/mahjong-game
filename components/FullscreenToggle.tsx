'use client';

import React, { useEffect, useState, useCallback } from 'react';

export default function FullscreenToggle() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const syncState = useCallback(() => {
    setIsFullscreen(!!(
      document.fullscreenElement ||
      (document as any).webkitFullscreenElement ||
      (document as any).mozFullScreenElement ||
      (document as any).msFullscreenElement
    ));
  }, []);

  useEffect(() => {
    syncState();
    document.addEventListener('fullscreenchange', syncState);
    document.addEventListener('webkitfullscreenchange', syncState);
    document.addEventListener('mozfullscreenchange', syncState);
    document.addEventListener('MSFullscreenChange', syncState);
    return () => {
      document.removeEventListener('fullscreenchange', syncState);
      document.removeEventListener('webkitfullscreenchange', syncState);
      document.removeEventListener('mozfullscreenchange', syncState);
      document.removeEventListener('MSFullscreenChange', syncState);
    };
  }, [syncState]);

  const handleToggle = async () => {
    try {
      if (isFullscreen) {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if ((document as any).webkitExitFullscreen) {
          await (document as any).webkitExitFullscreen();
        } else if ((document as any).mozCancelFullScreen) {
          await (document as any).mozCancelFullScreen();
        } else if ((document as any).msExitFullscreen) {
          await (document as any).msExitFullscreen();
        }
      } else {
        const el = document.documentElement;
        if (el.requestFullscreen) {
          await el.requestFullscreen();
        } else if ((el as any).webkitRequestFullscreen) {
          await (el as any).webkitRequestFullscreen();
        } else if ((el as any).mozRequestFullScreen) {
          await (el as any).mozRequestFullScreen();
        } else if ((el as any).msRequestFullscreen) {
          await (el as any).msRequestFullscreen();
        }
      }
    } catch {
      // 某些浏览器/环境可能拒绝全屏请求，静默忽略
    }
  };

  return (
    <button
      onClick={handleToggle}
      className="absolute top-1 right-1 md:top-2 md:right-2 z-[999] px-2 md:px-3 py-1 md:py-1.5 rounded-lg md:rounded-xl text-[10px] md:text-xs font-black uppercase tracking-wider border transition-all duration-200 shrink-0
        bg-white/10 border-white/20 text-white/80 hover:bg-white/20 hover:text-white active:scale-90"
      title={isFullscreen ? '退出全屏' : '全屏模式'}
    >
      {isFullscreen ? (
        <span className="flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3 md:w-4 md:h-4">
            <polyline points="4 14 10 14 10 20" />
            <polyline points="20 10 14 10 14 4" />
            <line x1="14" y1="10" x2="21" y2="3" />
            <line x1="3" y1="21" x2="10" y2="14" />
          </svg>
          <span className="hidden md:inline">退出全屏</span>
        </span>
      ) : (
        <span className="flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3 md:w-4 md:h-4">
            <polyline points="15 3 21 3 21 9" />
            <polyline points="9 21 3 21 3 15" />
            <line x1="21" y1="3" x2="14" y2="10" />
            <line x1="3" y1="21" x2="10" y2="14" />
          </svg>
          <span className="hidden md:inline">全屏</span>
        </span>
      )}
    </button>
  );
}