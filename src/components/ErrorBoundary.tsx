import React, { Component, ErrorInfo, ReactNode } from "react";
import { ShieldAlert, RefreshCw, ArrowLeft, Home } from "lucide-react";

interface Props {
  children: ReactNode;
  theme?: "light" | "dark";
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
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log the error to your monitoring services/console silently for developers
    console.error("Uncaught error logged in ErrorBoundary:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.hash = "";
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      const isDark = this.props.theme !== "light";

      return (
        <div
          className={`min-h-screen flex flex-col items-center justify-center p-6 transition-colors duration-300 ${
            isDark ? "bg-[#121211] text-[#FAF9F6]" : "bg-[#FAF9F6] text-[#1A1A1A]"
          }`}
        >
          {/* Subtle background grid pattern */}
          <div className="absolute inset-0 pointer-events-none opacity-5 bg-[linear-gradient(to_right,rgba(128,128,128,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(128,128,128,0.06)_1px,transparent_1px)] [background-size:40px_40px]" />

          <div className="max-w-md w-full text-center space-y-6 relative z-10">
            {/* Elegant warning circle */}
            <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center ${
              isDark ? "bg-orange-500/10 text-orange-400 border border-orange-500/20" : "bg-orange-50 text-orange-600 border border-orange-200"
            }`}>
              <ShieldAlert className="w-8 h-8" />
            </div>

            {/* User Friendly Message */}
            <div className="space-y-2">
              <h1 className="text-xl font-bold font-sans tracking-tight">
                Something went wrong.
              </h1>
              <p className="text-sm opacity-75 leading-relaxed">
                We're unable to complete your request right now. We've logged this detail and are working to resolve it.
              </p>
            </div>

            {/* Action buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={this.handleReset}
                className="w-full sm:w-auto px-5 py-2.5 rounded-full text-xs font-semibold flex items-center justify-center gap-2 bg-[#F27D26] hover:bg-orange-600 active:scale-[0.98] transition text-white shadow-md cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Try Again</span>
              </button>
              
              <button
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                  window.location.hash = "";
                  if (window.location.pathname !== "/") {
                    window.location.href = "/";
                  }
                }}
                className={`w-full sm:w-auto px-5 py-2.5 rounded-full text-xs font-semibold flex items-center justify-center gap-2 border transition cursor-pointer ${
                  isDark
                    ? "bg-white/5 border-white/10 hover:bg-white/10 text-neutral-300"
                    : "bg-black/5 border-black/10 hover:bg-black/10 text-neutral-700"
                }`}
              >
                <Home className="w-3.5 h-3.5" />
                <span>Go to Home</span>
              </button>
            </div>

            {/* No technical details displayed to user, keeping it exceptionally clean */}
            <p className="text-[10px] opacity-40 font-mono mt-4">
              Error code: ERR_RENDER_BOUNDARY
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
