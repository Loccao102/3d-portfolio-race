import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0c0f17] text-slate-200 font-mono p-6 select-none">
      <div className="p-8 bg-slate-950/90 border border-cyan-500/40 shadow-[0_0_25px_rgba(0,243,255,0.2)] text-center max-w-md">
        <h1 className="text-4xl font-bold text-cyan-400 mb-2">404</h1>
        <p className="text-xs text-slate-400 mb-6 tracking-widest uppercase">
          SECTOR NOT FOUND // SIGNAL LOST
        </p>
        <Link
          href="/"
          className="px-4 py-2 text-xs bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-400 text-cyan-300 uppercase tracking-wider transition-colors inline-block"
        >
          RETURN TO CITY
        </Link>
      </div>
    </div>
  );
}

