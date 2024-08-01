import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { registerUser } from './register-user.controller';

export async function usersRoutes(app: FastifyInstance) {
    app
        .withTypeProvider<ZodTypeProvider>()
        .post('/register/user', {
            schema: {
                summary: "Register a new user",
                tags: ['Users'],
                body: z.object({
                    name: z.string(),
                    email: z.string().email(),
                    password: z.string().min(6),
                    role: z.enum(["MENTEE", "MENTOR"]),
                    bio: z.string().optional(),
                    skills: z.array(z.string()).optional()
                }),
                response: {
                    201: z.object({
                        user: z.object({
                            id: z.number(),
                            name: z.string(),
                            email: z.string(),
                            role: z.enum(["MENTEE", "MENTOR"]),
                            bio: z.string().optional(),
                            skills: z.array(z.string()).optional(),
                        }),
                    })
                }
            }
        }, registerUser);
}
