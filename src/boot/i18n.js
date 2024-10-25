import { boot } from "quasar/wrappers";
import { createI18n } from "vue-i18n";
import messages from "src/i18n";

const isChinese =
  navigator.language.toLowerCase() === "zh-cn" ||
  navigator.language.toLowerCase() === "zh";

let lang = localStorage.getItem("lang")
  ? localStorage.getItem("lang")
  : isChinese
  ? "zh"
  : "en";
localStorage.setItem("lang", lang);
export default boot(({ app }) => {
  const i18n = createI18n({
    locale: lang,
    globalInjection: true,
    messages,
    missing: (locale, key, vm) => {
      // 处理未找到的翻译，返回括号内的字符串
      console.log("key", key);
      return key;
    },
  });

  // Set i18n instance on app
  app.use(i18n);
});
