import { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[ErrorBoundary]", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[60vh] flex items-center justify-center p-6">
          <div className="max-w-md w-full rounded-3xl border border-destructive/30 bg-destructive/5 p-10 text-center space-y-4">
            <div className="size-14 rounded-2xl bg-destructive/15 border border-destructive/30 grid place-items-center mx-auto">
              <AlertTriangle className="size-7 text-destructive" />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold">Щось пішло не так</h2>
              <p className="text-sm text-muted-foreground mt-2">
                Сталася помилка під час відображення цієї сторінки.
              </p>
              {this.state.error?.message && (
                <p className="text-xs text-muted-foreground/60 mt-2 font-mono break-all">
                  {this.state.error.message}
                </p>
              )}
            </div>
            <Button
              variant="outline"
              className="rounded-full"
              onClick={() => this.setState({ hasError: false, error: null })}
            >
              <RefreshCw className="size-3.5 mr-1.5" /> Спробувати знову
            </Button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
