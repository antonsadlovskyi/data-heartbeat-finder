import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useWorkspace } from "@/lib/hooks/use-workspace";

export function AnalysisProgressScreen() {
  const { onboardingStatus, refetch } = useWorkspace();
  const queryClient = useQueryClient();

  useEffect(() => {
    const id = setInterval(async () => {
      await refetch();
    }, 5000);
    return () => clearInterval(id);
  }, [refetch]);

  // when status flips to ready/completed, invalidate so OnboardingGate re-renders
  useEffect(() => {
    if (onboardingStatus === "ready" || onboardingStatus === "completed") {
      queryClient.invalidateQueries({ queryKey: ["my-workspace"] });
    }
  }, [onboardingStatus, queryClient]);

  return (
    <div className="min-h-screen bg-background grid place-items-center relative overflow-hidden">
      <div className="absolute -top-40 -right-40 size-[500px] rounded-full bg-gradient-violet opacity-20 blur-3xl" />
      <div className="absolute -bottom-40 -left-40 size-[500px] rounded-full bg-gradient-lime opacity-20 blur-3xl" />

      <div className="relative text-center max-w-md px-6 space-y-6">
        <motion.div
          className="size-24 rounded-3xl bg-gradient-violet grid place-items-center mx-auto shadow-glow"
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        >
          <Sparkles className="size-12 text-primary-foreground" />
        </motion.div>

        <div>
          <h1 className="font-display text-3xl font-bold">Аналіз запущено</h1>
          <p className="mt-3 text-muted-foreground">
            Готуємо твій кабінет. Зазвичай займає 2–5 хвилин.
          </p>
        </div>

        <div className="w-full bg-border rounded-full h-1.5 overflow-hidden">
          <motion.div
            className="h-full bg-primary rounded-full"
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        <p className="text-xs text-muted-foreground">
          Перевіряємо статус кожні 5 секунд…
        </p>
      </div>
    </div>
  );
}
