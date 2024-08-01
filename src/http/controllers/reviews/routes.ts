import { verifyJWT } from "@/http/middlewares/verify-jwt";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { registerReviews } from "./register-review.controller";

export async function reviewRoutes(app: FastifyInstance){
    app.addHook('onRequest', verifyJWT)

    app
        .withTypeProvider<ZodTypeProvider>()
        .post('/register/review', {
            schema: {
                summary: 'Register a review',
                tags: ['Reviews'],
                body: z.object({
                    mentorshipId: z.number(),
                    rating: z.number(),
                    comment: z.string()
                }),
                response: {
                    200: z.object({
                        review: z.object({
                            id: z.number(),
                            rating: z.number(),
                            comment: z.string(),
                            createdAt: z.date(),
                            updatedAt: z.date(),
                            mentorshipId: z.number()
                        })
                    })
                }
            }
        }, registerReviews)
}