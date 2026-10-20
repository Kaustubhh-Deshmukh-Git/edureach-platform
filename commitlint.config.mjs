export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "scope-enum": [2, "always", ["server", "client", "auth", "ai", "voice", "ci", "docs", "deps"]],
  },
};
