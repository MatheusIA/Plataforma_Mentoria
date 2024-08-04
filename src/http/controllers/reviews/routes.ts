import { verifyJWT } from "@/http/middlewares/verify-jwt";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { registerReviews } from "./register-review.controller";
import { getReviewByMentorId } from "./get-review-by-mentor-id.controller";

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

    app
        .withTypeProvider<ZodTypeProvider>()
        .get('/review/by/mentorId/:mentorId', {
            schema: {
                summary: "Get all reviews by mentor id",
                tags: ["Reviews"],
                params: z.object({
                    mentorId: z.string()
                }),
                response: {
                    200: z.object({
                        review: z.array(
                            z.object({
                                id: z.number(),
                                rating: z.number(),
                                comment: z.string().nullable(),
                                createdAt: z.date(),
                                updatedAt: z.date(),
                                mentorshipId: z.number(),
                                mentorship: z.object({
                                    id: z.number(),
                                    topic: z.string(),
                                    date: z.date(),
                                    mentee: z.object({
                                        user: z.object({
                                        name: z.string(),
                                        email: z.string()
                                    })
                                    })
                                    
                                })
                            })
                        )
                    })
                }
            }
        }, getReviewByMentorId)
}