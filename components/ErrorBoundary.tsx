import React, { Component, ErrorInfo, ReactNode } from 'react';
import { RefreshCw, Terminal, ShieldAlert, Cpu, Search } from 'lucide-react';

interface ErrorBoundaryProps {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

/**
 * 萬能錯誤攔截內核 (Universal Error Interceptor)
 * 遵循「天使號令」穩定性支柱，隔離組件級別的邏輯熵增。
 */
/* Fix: Explicitly importing and extending Component ensures state, props, and setState are correctly inherited from React */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    // Fix: line 25/26 - Initialize state inherited from Component
    this.state = {
      hasError: false,
      error: undefined,
      errorInfo: undefined
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  /* Handle component errors and update state */
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Critical System Interruption Captured:", error, errorInfo);
    // Fix: line 40 - Standard setState from React.Component
    this.setState({ errorInfo });
  }

  /* Reset error boundary state to attempt re-mounting */
  public handleRetry = (): void => {
    // Fix: line 46 - setState is a method provided by the Component base class
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  private handleReload = (): void => {
    window.location.reload();
  };

  render(): ReactNode {
    // Fix: lines 55-56 - Accessing state and props inherited from Component
    const { hasError, error, errorInfo } = this.state;
    const { children, fallback } = this.props;

    if (hasError) {
      if (fallback) return fallback;

      return (
        <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center bg-[#020617] animate-fade-in font-sans relative overflow-hidden">
          {/* 背景背景特效 */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(239,68,68,0.05)_0%,transparent_70%)] pointer-events-none" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

          <div className="relative z-10 max-w-2xl w-full">
            <div className="p-8 bg-rose-500/10 rounded-[3rem] mb-10 border border-rose-500/30 shadow-[0_0_50px_rgba(239,68,68,0.1)] inline-block relative">
              <div className="absolute inset-0 bg-rose-500 blur-2xl opacity-20 animate-pulse rounded-full" />
              <ShieldAlert className="w-20 h-20 text-rose-500 relative z-10" />
            </div>
            
            <h2 className="text-4xl font-black text-white mb-6 uppercase tracking-tighter leading-tight">
              Module Protocol <br/> <span className="text-rose-500">Interrupted</span>
            </h2>
            
            <p className="text-gray-400 mb-12 text-base leading-relaxed max-w-md mx-auto font-light">
              Intelligence Orchestrator detected a logic anomaly in the current execution thread. 
              The module has been isolated to prevent cascading kernel failure.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <button
                onClick={this.handleRetry}
                className="flex items-center justify-center gap-3 px-10 py-4 bg-white text-black rounded-2xl font-black transition-all hover:scale-105 active:scale-95 shadow-xl uppercase tracking-widest text-xs"
              >
                <RefreshCw className="w-4 h-4" />
                Re-mount Module
              </button>
              <button
                onClick={this.handleReload}
                className="flex items-center justify-center gap-3 px-10 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-white font-black transition-all uppercase tracking-widest text-xs"
              >
                <Cpu className="w-4 h-4" />
                Kernel Reboot
              </button>
            </div>
            
            {/* 診斷日誌區塊 */}
            <div className="text-left w-full">
                <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-t-2xl border-x border-t border-white/10 w-fit ml-6">
                    <Terminal className="w-3 h-3 text-gray-500" />
                    <span className="text-[9px] text-gray-500 font-black uppercase tracking-widest">Diagnostic_Trace_0xBF32</span>
                </div>
                <div className="p-8 bg-black/60 rounded-[2.5rem] border border-white/5 overflow-hidden shadow-inner backdrop-blur-md">
                    <div className="max-h-40 overflow-y-auto no-scrollbar">
                        <code className="text-[11px] font-mono text-rose-300/80 leading-relaxed block mb-6 border-b border-white/5 pb-4">
                           [LOG_FAULT]: {error?.toString() || 'Unknown Logic Breach'}
                        </code>
                        {errorInfo && (
                            <pre className="text-[9px] font-mono text-gray-600 leading-tight whitespace-pre-wrap opacity-60">
                                {errorInfo.componentStack}
                            </pre>
                        )}
                    </div>
                    <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-[8px] text-gray-700 font-mono uppercase tracking-[0.2em]">
                        <div className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-rose-500" /> Integrity compromised</div>
                        <div className="flex items-center gap-2"><Search className="w-3 h-3" /> Awaiting Correction</div>
                    </div>
                </div>
            </div>
          </div>
        </div>
      );
    }

    return children || null;
  }
}
