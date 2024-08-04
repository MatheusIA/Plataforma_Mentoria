import { makeAuthenticateUseCase } from "@/domain/factories/authenticate/make-authenticate-use-case";
import { InvalidCredentialsError } from "@/domain/use-cases/_errors/authenticate/invalid-credentials-error";
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
            {
                role: user.role
            }, 
            {
                sign: {
                    sub: user.id.toString()
                },
            },
        )

        const refreshtoken = await reply.jwtSign(
            {
                user_type: user.role,
                email: user.email
            },            
            {
                sign: {
                    sub:user.id.toString(),
                    expiresIn: '7d'                    
                },
            },
        )

        return reply
            .setCookie('refreshToken', refreshtoken, {
                path: '/',
                secure: true,
                sameSite: true,
                httpOnly: true
            })
            .status(200).send({
                token
            })

    }catch (err) {
        if (err instanceof InvalidCredentialsError) {
            return reply.status(400).send({ message: err.message })
        }
        throw err
    }
}