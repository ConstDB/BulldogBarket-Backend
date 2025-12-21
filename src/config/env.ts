import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]),
  PORT: z.string().default("3000").transform(Number),
  CORS_ORIGINS: z
    .string()
    .optional()
    .transform((val) => val?.split(",") ?? []),
  JWT_SECRET: z.string(),
  JWT_EXPIRES_IN: z.string().default("3d"),
  DATABASE_URI: z.string(),
  DB_PASSWORD: z.string(),
});

export const env = envSchema.parse(process.env);
