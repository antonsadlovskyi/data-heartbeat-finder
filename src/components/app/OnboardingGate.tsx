import { useWorkspace } from "@/lib/hooks/use-workspace";
import { WaitingForPaymentScreen } from "./WaitingForPaymentScreen";
import { AnalysisProgressScreen } from "./AnalysisProgressScreen";

interface Props {
  children: React.ReactNode;
}

function isReady(status: string | null): boolean {
  return !status || status === "completed" || status === "ready";
}

export function OnboardingGate({ children }: Props) {
  const { onboardingStatus, isLoading, refetch } = useWorkspace();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-muted-foreground">
        Loading…
      </div>
    );
  }

  if (onboardingStatus === "waiting_for_payment" || onboardingStatus === "pending") {
    return <WaitingForPaymentScreen onPaid={() => refetch()} />;
  }

  if (onboardingStatus === "analysis_starting") {
    return <AnalysisProgressScreen />;
  }

  if (isReady(onboardingStatus)) {
    return <>{children}</>;
  }

  // unknown status — show cabinet (safe fallback)
  return <>{children}</>;
}
