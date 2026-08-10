import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import * as Sentry from '@sentry/react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in SubStellar component:', error, errorInfo);
    Sentry.captureException(error, { extra: { componentStack: errorInfo.componentStack } });
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 text-white font-inter">
          <div className="glass-panel p-8 md:p-12 rounded-2xl max-w-lg w-full text-center border border-white/10 space-y-6 shadow-2xl relative overflow-hidden">
            <div className="absolute -top-10 -left-10 w-32 h-32 bg-[#FF5733]/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="w-16 h-16 bg-[#FF5733]/10 rounded-xl flex items-center justify-center mx-auto text-[#FF5733] border border-[#FF5733]/20">
              <AlertTriangle size={32} />
            </div>

            <div className="space-y-2">
              <h2 className="font-bebas text-4xl tracking-wider text-white">System Anomaly Detected</h2>
              <p className="text-gray-400 text-sm font-light">
                An unexpected exception occurred while rendering the application state. The error has been captured for diagnostics.
              </p>
            </div>

            {this.state.error && (
              <div className="bg-white/5 border border-white/10 rounded-lg p-4 text-left overflow-x-auto text-xs text-red-400 font-mono">
                {this.state.error.message || 'Unknown Error'}
              </div>
            )}

            <button
              onClick={this.handleReload}
              className="bg-[#FF5733] hover:bg-[#E04C2C] text-white text-[11px] font-bold tracking-[0.1em] px-7 py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 mx-auto uppercase"
            >
              <RefreshCw size={14} /> Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
