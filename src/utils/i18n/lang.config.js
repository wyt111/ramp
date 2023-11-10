export const languageList = [
  {
    name: "English(US)",
    value: "en-US",
    icon: require("@/assets/images/slices/English(US).png"),
    state: true,
  },
  {
    name: "繁體中文",
    value: "zh-HK",
    icon: require("@/assets/images/slices/CHN.png"),
    state: false,
  },
  {
    name: "Español",
    value: "es",
    icon: require("@/assets/images/slices/sepea.png"),
    state: false,
  },
  {
    name: "Bahasa Indonesia",
    value: "id",
    icon: require("@/assets/images/slices/id.png"),
    state: false,
  },
  {
    name: "Tiếng Việt",
    value: "vi",
    icon: require("@/assets/images/slices/vi.png"),
    state: false,
  },
];

export const messages = {
  "en-US": require("./language/en-US"),
  "zh-HK": require("./language/zh-HK"),
  es: require("./language/es"),
  id: require("./language/id"),
  vi: require("./language/vi"),
};

export const languageKey = ["en-US", "zh-HK", "es", "id", "vi"];

export const defaultLang = "en-US";
