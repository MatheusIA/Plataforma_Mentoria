import { verifyJWT } from "@/http/middlewares/verify-jwt";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z, { ZodType } from "zod";
import { searchAllMenteesUser } from "./search-all-mentees-user.controller";
import { getMenteeProfile } from "./get-mentee-profile.controller";
import { updateMentee } from "./update-mentee.controller";

export async function menteeRoutes(app: FastifyInstance){
    app.addHook('onRequest', verifyJWT)
    
    app
        .withTypeProvider<ZodTypeProvider>()
        .get('/search/all/mentees', {
            schema: {
                summary: 'Search all mentees',
                tags: ["Mentees"],
                response: {
                    200: z.object({
                            mentees: z.array(
                                z.object({
                                    id: z.number(),
                                    userId: z.number(),
                                    user: z.object({
                                      name: z.string(),
                                      email: z.string().email(),
                                    }),
                                  })
                            )
                    })
                }
            },

        }, searchAllMenteesUser)

    app
        .withTypeProvider<ZodTypeProvider>()
        .get('/mentee/profile/:userId', {
            schema: {
                summary: "Get Profile Mentee",
                tags: ["Mentees"],
                params: z.object({
                    userId: z.string()
                }),
                response:{
                    200: z.object({
                        mentee: z.object({
                            id: z.number(),
                            userId: z.number(),
                            user: z.object({
                                id: z.number(),
                                name: z.string(),
                                email: z.string(),
                                role: z.string(),
                                createdAt: z.date(),
                                updatedAt: z.date()
                            })
                        })
                    })
                }
            }
        }, getMenteeProfile)

    app
        .withTypeProvider<ZodTypeProvider>()
        .patch('/update/user/mentee/:menteeId',{
            schema: {
                summary: "Update mentee data",
                tags: ["Mentees"],
                params: z.object({
                    menteeId: z.string()
                }),
                body: z.object({
                    name: z.string(),
                    email: z.string().email(),
                    password: z.string()
                }),
                response: {
                    200: z.object({
                        user: z.object({
                            id: z.number(),
                            name: z.string(),
                            email: z.string(),
                            role: z.string(),
                            createdAt: z.date(),
                            updatedAt: z.date()
                        })
                    })
                }
            }
        }, updateMentee)
}