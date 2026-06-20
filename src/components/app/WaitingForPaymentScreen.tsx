import { useState } from "react";
import { CreditCard, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useServerFn } from "@tanstack/react-start";
import { markWorkspaceAsPaid } from "@/lib/data/workspace.functions";

interface Props {
  onPaid: () => void;
}

export function WaitingForPaymentScreen({ onPaid }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const markPaid = useServerFn(markWorkspaceAsPaid);

  const handleTestPay = async () => {
    setLoading(true);
    setError(null);
    try {
      await markPaid({});
      onPaid();
    } catch (e: any) {
      setError(e?.message ?? "Помилка");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background grid place-items-center">
      <div className="max-w-md w-full px-6 text-center space-y-6">
        <div className="size-20 rounded-3xl bg-gradient-violet grid place-items-center mx-auto shadow-pop">
          <CreditCard className="size-10 text-primary-foreground" />
        </div>
        <div>
          <h1 className="font-display text-3xl font-bold">Очікуємо підтвердження оплати</h1>
          <p className="mt-3 text-muted-foreground">
            Після оплати аналіз запуститься автоматично
          </p>
        </div>

        {error && (
          <div className="rounded-2xl bg-destructive/10 border border-destructive/30 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <div className="pt-2">
          <Button
            onClick={handleTestPay}
            disabled={loading}
            variant="outline"
            className="rounded-full h-11 px-6 border-dashed border-2 text-muted-foreground hover:text-foreground"
          >
            {loading ? (
              <><Loader2 className="size-4 mr-2 animate-spin" /> Обробляємо...</>
            ) : (
              "🛠 Позначити як оплачено (тест)"
            )}
          </Button>
          <p className="mt-2 text-xs text-muted-foreground">Тільки для тестування</p>
        </div>
      </div>
    </div>
  );
}
