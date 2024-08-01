import { FastifyReply, FastifyRequest } from 'fastify';
import { makeRegisterUserUseCase } from '@/domain/factories/user/make-register-use-case';
import { UserAlreadyExistsError } from '@/domain/use-cases/_errors/users/user-already-exists-error';
import z from 'zod';

export async function registerUser(request: FastifyRequest, reply: FastifyReply) {
    const registerUserSchema = z.object({
        name: z.string(),
        email: z.string().email(),
        password: z.string().min(6),
        role: z.enum(['MENTOR', 'MENTEE']),
        bio: z.string().optional(),
        skills: z.array(z.string()).optional()
    });

    try {
        const { name, email, password, role, bio, skills } = registerUserSchema.parse(request.body);

        const registerUserUseCase = makeRegisterUserUseCase();

        const { user } = await registerUserUseCase.execute({
            name,
            email,
            password,
            role,
            bio: bio ?? "",
            skills: skills ?? []
        });

        const { password: _, ...userWithoutPassword } = user;


        return reply.status(201).send({
            user: userWithoutPassword
        });

    } catch (err) {
        if (err instanceof UserAlreadyExistsError) {
            return reply.status(409).send({ message: err.message });
        } else if (err instanceof z.ZodError) {
            return reply.status(400).send({ message: 'Invalid input data', errors: err.errors });
        } else {
            console.log(err);
            return reply.status(500).send({ message: 'Internal Server Error' });
        }
    }
}