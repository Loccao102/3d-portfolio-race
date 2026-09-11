'use client';

import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

type Props = { children: React.ReactNode };
type State = { hasError: boolean; message?: string };

export class ExperienceErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('3D experience error', error, info);
  }

  private reload = () => window.location.reload();

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="absolute inset-0 z-40 flex items-center justify-center bg-[#05080d] px-6">
        <div className="w-full max-w-lg rounded-3xl border border-amber-300/20 bg-slate-950/90 p-6 text-center shadow-2xl backdrop-blur-xl">
          <AlertTriangle className="mx-auto h-8 w-8 text-amber-300" />
          <h2 className="mt-4 text-xl font-black text-white">Không thể khởi tạo trải nghiệm 3D</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-400">
            Trình duyệt hoặc GPU vừa gặp lỗi WebGL. Nội dung portfolio vẫn an toàn; bạn có thể tải lại trải nghiệm.
          </p>
          {this.state.message && (
            <div className="mt-4 rounded-xl bg-black/30 px-3 py-2 text-left text-[10px] text-slate-500">
              {this.state.message}
            </div>
          )}
          <button
            onClick={this.reload}
            className="mt-5 inline-flex items-center gap-2 rounded-2xl border border-cyan-300/20 bg-cyan-300/10 px-4 py-3 text-[10px] font-black uppercase tracking-[0.16em] text-cyan-100 transition hover:bg-cyan-300/20"
          >
            <RotateCcw className="h-4 w-4" /> Tải lại trải nghiệm
          </button>
        </div>
      </div>
    );
  }
}
