import { useNavio } from "../store";
import { dictionaries, type TranslationKey } from "./dictionaries";

export function useT() {
  const lang = useNavio((s) => s.language);
  return (key: TranslationKey): string => {
    const dict = dictionaries[lang] as Record<string, string>;
    return dict[key] ?? dictionaries.en[key] ?? key;
  };
}
