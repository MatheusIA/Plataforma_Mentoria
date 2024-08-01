import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { registerMentorship } from "./register-mentorship.controller";
import { google } from "googleapis";
import dotenv from 'dotenv';

dotenv.config();

const oAuth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  'http://localhost:3333/redirect'
);

oAuth2Client.setCredentials({
  access_token: process.env.GOOGLE_ACCESS_TOKEN,
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN
});

console.log('OAuth2 Client Credentials:', oAuth2Client.credentials);

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
                tags: ["Mentorship"],
                body: z.object({
                    mentorId: z.number(),
                    menteeId: z.number(),
                    topic: z.string(),
                    // date: z.string().refine(value => !isNaN(Date.parse(value)), {
                    //     message: "Invalid date format. Please use ISO 8601 format."
                    // }),
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
                            createdAt: z.date(),
                            updatedAt: z.date()
                        })
                        
                    })
                }
            }

        }, registerMentorship)
}