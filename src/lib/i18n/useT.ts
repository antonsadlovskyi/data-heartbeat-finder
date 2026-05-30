import { useUiLang } from "./ui-language-store";
import { dictionaries, type TranslationKey } from "./dictionaries";

export function useT() {
  const lang = useUiLang((s) => s.lang);
  return (key: TranslationKey, params?: Record<string, string | number>): string => {
    const dict = dictionaries[lang] ?? dictionaries.en;
    let str = dict[key] ?? dictionaries.en[key] ?? key;
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        str = str.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
      }
    }
    return str;
  };
}
