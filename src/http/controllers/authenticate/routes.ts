import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { authenticate } from "./authenticate";

export async function authenticateRoutes(app: FastifyInstance) {
    app
        .withTypeProvider<ZodTypeProvider>()
        .post('/authenticate/sessions', {
            schema: {
                summary: "Authenticate",
                tags: ["Authenticate"],
                body: z.object({
                    email: z.string().email(),
                    password: z.string().min(6)
                }),
                response: {
                    200: z.object({
                        token: z.string()
                    })
                }
            }
        }, authenticate)
}