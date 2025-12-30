
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface ErrorBoundaryProps {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

/**
 * Standard React Error Boundary component.
 * Ensures the platform remains stable by containing localized runtime errors.
 */
// Fix: Explicitly use Component from react to ensure inheritance of setState and props is recognized
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  // Correctly initialize state with type safety
  state: ErrorBoundaryState = {
    hasError: false,
    error: undefined
  };

  // Standard static lifecycle method for error boundaries.
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  // Standard lifecycle method for logging errors.
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Critical System Interruption:", error, errorInfo);
  }

  // Fix: handleRetry as an arrow function correctly maintains 'this' context and allows calling setState inherited from base class
  public handleRetry = () => {
    /* Calling setState which is inherited from Component */
    this.setState({ hasError: false, error: undefined });
  };

  private handleReload = () => {
    window.location.reload();
  };

  render(): ReactNode {
    // Fix: Access state and props which are inherited from base Component class
    const { hasError, error } = this.state;
    const { children, fallback } = this.props;

    if (hasError) {
      if (fallback) {
        return fallback as ReactNode;
      }

      return (
        <div className="flex flex-col items-center justify-center h-full min-h-[400px] p-8 text-center bg-slate-900/50 rounded-3xl border border-red-500/20 backdrop-blur-sm animate-fade-in font-sans">
          <div className="p-5 bg-red-500/10 rounded-full mb-6 border border-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.2)]">
            <AlertTriangle className="w-12 h-12 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Module Protocol Interrupted</h2>
          <p className="text-gray-400 mb-8 max-w-md text-sm leading-relaxed">
            Intelligence Orchestrator detected a logic anomaly. The localized component has been suspended to protect the system kernel.
          </p>
          <div className="flex gap-4">
            <button
              onClick={this.handleRetry}
              className="flex items-center gap-2 px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-bold transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              Re-mount Module
            </button>
            <button
              onClick={this.handleReload}
              className="flex items-center gap-2 px-6 py-2.5 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-xl text-bold transition-all"
            >
              <Home className="w-4 h-4" />
              Kernel Reboot
            </button>
          </div>
          {error && (
             <div className="mt-10 p-5 bg-black/60 rounded-xl border border-white/5 text-left w-full max-w-lg overflow-auto max-h-40 shadow-inner">
                 <div className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-2">Error_Dump_v15</div>
                 <code className="text-[11px] font-mono text-red-300 leading-relaxed">
                     {error.toString()}
                 </code>
             </div>
          )}
        </div>
      );
    }

    return (children as ReactNode) || null;
  }
}
