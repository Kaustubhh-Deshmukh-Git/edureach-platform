import { z } from "zod";

export const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z
    .string()
    .default("5000")
    .transform((val) => {
      const port = parseInt(val, 10);
      if (isNaN(port) || port <= 0 || port > 65535) {
        throw new Error("PORT must be a valid port number (1-65535)");
      }
      return port;
    }),
  MONGODB_URI: z.string().min(1, "MONGODB_URI is required"),
  JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters long"),
  JWT_EXPIRES_IN: z.string().default("7d"),
  CLIENT_URL: z.string().url("CLIENT_URL must be a valid URL"),
});

export type Env = z.infer<typeof envSchema>;

export function parseEnv(rawEnv: NodeJS.ProcessEnv): Env {
  const result = envSchema.safeParse(rawEnv);
  if (!result.success) {
    console.error("❌ Environment validation error:");
    for (const issue of result.error.issues) {
      console.error(`   - ${issue.path.join(".")}: ${issue.message}`);
    }
    if (rawEnv["NODE_ENV"] !== "test") {
      process.exit(1);
    }
    throw new Error("Invalid environment configuration");
  }
  return result.data;
}

export const env: Env = parseEnv(process.env);
