import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { registerMentorship } from "./register-mentorship.controller";
import { google } from "googleapis";
import dotenv from 'dotenv';
import { updateMentorship } from "./update-mentorship.controller";
import { getMentorshipMentorId } from "./get-mentorships-mentor-id.controller";
import { verifyRoleType } from "@/http/middlewares/verify-role-type";
import { getMentorshipMenteeId } from "./get-mentorship-mentee-id.controller";


export async function mentorshipRoutes(app: FastifyInstance){
    app.setErrorHandler((error, request, reply) => {
        console.error('Error:', error);
        reply.status(500).send({ message: 'Internal server error.' });
    });

    app
        .withTypeProvider<ZodTypeProvider>()
        .post('/register/mentorship', {
            schema: {
                summary: "Register a new Mentorship",
                tags: ["Mentorships"],
                body: z.object({
                    mentorId: z.number(),
                    menteeId: z.number(),
                    topic: z.string(),
                    date: z.string(),
                    dateGoogle: z.string().refine(value => !isNaN(Date.parse(value)), {
                        message: "Invalid date format. Please use ISO 8601 format."
                    }),
                }),
                response: {
                    201: z.object({
                        mentorship: z.object({
                            id: z.number(),
                            mentorId: z.number(),
                            menteeId: z.number(),
                            topic: z.string(),
                            date: z.date(),
                            googleEventId: z.string(), 
                            createdAt: z.date(),
                            updatedAt: z.date()
                        })
                        
                    })
                }
            }

        }, registerMentorship)

    app
        .withTypeProvider<ZodTypeProvider>()
        .put('/update/mentorship/:id', {
            schema: {
                summary: "Update Mentorship",
                tags: ['Mentorships'],
                params: z.object({
                    id: z.string()
                }),
                body: z.object({
                    mentorId: z.number(),
                    menteeId: z.number(),
                    topic: z.string(),
                    date: z.string(),
                    dateGoogle: z.string().refine(value => !isNaN(Date.parse(value)), {
                        message: "Invalid date format. Please use ISO 8601 format."
                    }),
                    googleEventId: z.string()
                }),
                response: {
                    201: z.object({
                        mentorship: z.object({
                            id: z.number(),
                            mentorId: z.number(),
                            menteeId: z.number(),
                            topic: z.string(),
                            date: z.date(),
                            googleEventId: z.string(), 
                            createdAt: z.date(),
                            updatedAt: z.date()
                        })
                        
                    })
                }
            }
        }, updateMentorship)

    app
        .withTypeProvider<ZodTypeProvider>()
        .get('/get/mentorship/mentorId/:mentorId', {
            schema: {
                summary: "Get mentorships by mentor id",
                tags: ["Mentorships"],
                params: z.object({
                    mentorId: z.string()
                }),
                response: {
                    200: z.object({
                        mentorship: z.array(
                            z.object({
                                id: z.number(),
                                mentorId: z.number(),
                                menteeId: z.number(),
                                topic: z.string(),
                                date: z.date(),
                                googleEventId: z.string(),
                                createdAt: z.date(),
                                updatedAt: z.date(),
                                mentee: z.object({
                                    id: z.number(),
                                    userId: z.number(),
                                    user: z.object({
                                        name: z.string(),
                                        email: z.string()
                                    })
                                }),
                                mentor: z.object({
                                    id: z.number(),
                                    bio: z.string(),
                                    skills: z.array(z.string()),
                                    userId: z.number(),
                                    user: z.object({
                                        name: z.string(),
                                        email: z.string()
                                    })
                                })
                            })
                        )
                    })
                }
            }

        }, getMentorshipMentorId)

    app
        .withTypeProvider<ZodTypeProvider>()
        .get('/get/mentorship/menteeId/:menteeId', {
            schema: {
                summary: "Get mentorships by mentee id",
                tags: ["Mentorships"],
                params: z.object({
                    menteeId: z.string()
                }),
                response: {
                    200: z.object({
                        mentorship: z.array(
                            z.object({
                                id: z.number(),
                                mentorId: z.number(),
                                menteeId: z.number(),
                                topic: z.string(),
                                date: z.date(),
                                googleEventId: z.string(),
                                createdAt: z.date(),
                                updatedAt: z.date(),
                                mentor: z.object({
                                    id: z.number(),
                                    bio: z.string(),
                                    skills: z.array(z.string()),
                                    userId: z.number(),
                                    user: z.object({
                                        name: z.string(),
                                        email: z.string()
                                    })
                                })
                            })
                        )
                    })
                }
            }

        }, getMentorshipMenteeId)
}