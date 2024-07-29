import { makeAuthenticateUseCase } from "@/domain/factories/authenticate/make-authenticate-use-case";
import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
    const authenticateSchema = z.object({
        email: z.string().email(),
        password: z.string()
    })

    try{
        const { email, password } = authenticateSchema.parse(request.body)

        const authenticateUseCase = makeAuthenticateUseCase()

        const { user } = await authenticateUseCase.execute({
            email,
            password
        })

        const token = await reply.jwtSign(
            {}, 
            {
                sign: {
                    sub: user.id.toString()
                },
            },
        )

        return reply.status(200).send({
            token
        })

    }catch (err) {

    }
}