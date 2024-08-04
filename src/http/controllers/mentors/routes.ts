import { verifyJWT } from "@/http/middlewares/verify-jwt";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { searchForAvailableSkills } from "./search-for-available-skills-user.controller";
import { searchAllMentorsUser } from "./search-all-mentors-user.controller";
import { getMentorProfile } from "./get-mentor-profile.controller";
import { updateMentor } from "./update-mentor.controller";
import { verifyRoleType } from "@/http/middlewares/verify-role-type";

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

    app
        .withTypeProvider<ZodTypeProvider>()
        .get('/mentor/profile/:userId', {
            schema: {
                summary: "Get Profile Mentor",
                tags: ["Mentors"],
                params: z.object({
                    userId: z.string()
                }),
                response: {
                    200: z.object({
                        mentor: z.object({
                            id: z.number(),
                            bio: z.string(),
                            skills: z.array(z.string()),
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
            },
        }, getMentorProfile)

    app
        .withTypeProvider<ZodTypeProvider>()
        .patch('/update/user/mentor/:mentorId', {
            schema: {
                summary: "Update mentor data",
                tags: ["Mentors"],
                params: z.object({
                    mentorId: z.string()
                }),
                body: z.object({
                    name: z.string(),
                    email: z.string(),
                    password: z.string(),
                    bio: z.string(),
                    skills: z.array(z.string())
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
                        }),
                        mentor: z.object({
                            id: z.number(),
                            bio: z.string(),
                            skills: z.array(z.string()),
                            userId: z.number()
                        })
                    })
                }
            },
            onRequest:[verifyRoleType('MENTOR')]
        }, updateMentor)
}