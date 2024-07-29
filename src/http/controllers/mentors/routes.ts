import { verifyJWT } from "@/http/middlewares/verify-jwt";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { searchForAvailableSkills } from "./search-for-available-skills-user.controller";
import { searchAllMentorsUser } from "./search-all-mentors-user.controller";

export async function mentorsRoute(app: FastifyInstance) {
    app.addHook('onRequest', verifyJWT)

    app
        .withTypeProvider<ZodTypeProvider>()
        .get('/search/available/skills', {
            schema: {
                summary: 'Search for available skills',
                tags: ['Mentors'],
                response: {
                    200: z.object({
                        mentors: z.array(z.string())
                    })
                }
            }
        }, searchForAvailableSkills)

    app
        .withTypeProvider<ZodTypeProvider>()
        .get('/search/all/mentors', {
            schema: {
                summary: "Search all mentors",
                tags: ['Mentors'],
                response: {
                    200: z.object({
                        mentors: z.array(
                            z.object({
                                id: z.number(),
                                bio: z.string(),
                                skills: z.array(z.string()),
                                userId: z.number(),
                                user: z.object({
                                    name: z.string(),
                                    email: z.string()
                                })
                            }))
                    })
                }
            }
        }, searchAllMentorsUser)
}