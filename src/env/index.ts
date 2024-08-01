import "dotenv/config"
import z from "zod"

const envSchema = z.object({
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    JWT_SECRET: z.string(),
    PORT: z.coerce.number().default(3333),
    GOOGLE_CLIENT_ID: z.string(),
    GOOGLE_CLIENT_SECRET: z.string(),
    GOOGLE_ACCESS_TOKEN: z.string(),
    GOOGLE_REFRESH_TOKEN: z.string()
})

const _env = envSchema.safeParse(process.env)

if(_env.success === false) {
    console.log("Invalid environment variables !", _env.error.format())

    throw new Error("Invalid environment variables.")
}

export const env = _env.data