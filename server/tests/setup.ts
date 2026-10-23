process.env.NODE_ENV = "test";
process.env.PORT = "5000";
process.env.MONGODB_URI = "mongodb://127.0.0.1:27017/edureach_test";
process.env.JWT_SECRET = "super_secret_test_key_at_least_32_characters_long_for_tests";
process.env.JWT_EXPIRES_IN = "1d";
process.env.CLIENT_URL = "http://localhost:5173";
process.env.GOOGLE_API_KEY = "test_google_api_key_for_testing";

if (process.platform === "win32" && process.cwd().toLowerCase().startsWith("d:")) {
  process.env.TEMP = "D:/temp";
  process.env.TMP = "D:/temp";
}
