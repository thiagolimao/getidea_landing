const globals = require("globals");
const js = require("@eslint/js");

module.exports = {
  languageOptions: {
    globals: {
      ...globals.browser,
      ...globals.node,
      gsap: "readonly",
      ScrollTrigger: "readonly",
      Swiper: "readonly",
      document: "readonly",
    },
    ecmaVersion: 2022,
    sourceType: "module",
  },
  rules: {
    ...js.configs.recommended.rules,
    "no-unused-vars": "warn",
    "no-console": "off",
  },
  ignores: ["node_modules/", "dist/", "*.min.js"],
};
