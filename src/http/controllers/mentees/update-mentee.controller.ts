import { makeUpdateMenteeUseCase } from "@/domain/factories/mentee/make-update-mentee-use-case";
import { NotFoundMenteeError } from "@/domain/use-cases/_errors/mentee/not-found-mentee-error";
import { NotFoundUsersError } from "@/domain/use-cases/_errors/users/not-found-users-error";
import { NotPossibleUpdateUserError } from "@/domain/use-cases/_errors/users/not-possible-update-user-error";
import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

export async function updateMentee(request: FastifyRequest, reply: FastifyReply) {
    const updateMenteeQuery = z.object({
        menteeId: z.string().transform((menteeId) => parseInt(menteeId, 10))
    })
    
    const updateMenteeSchema = z.object({
        name: z.string(),
        email: z.string().email(),
        password: z.string()
    })

    const { menteeId } = updateMenteeQuery.parse(request.params)
    const { name, email, password } = updateMenteeSchema.parse(request.body)

    try {

        const updateMenteeUseCase = makeUpdateMenteeUseCase()

        const { user } = await updateMenteeUseCase.execute ({
            menteeId,
            name,
            email,
            password
        })

        const { password: _, ...userWithoutPassword } = user;

        return reply.status(200).send({
            user: userWithoutPassword
        })

    } catch (err) {
        if(err instanceof NotFoundMenteeError){
            return reply.status(404).send({message: err.message})

        } else if ( err instanceof NotFoundUsersError){
            return reply.status(404).send({ message: err.message})

        } else if (err instanceof z.ZodError){
            return reply.status(400).send({ message: "Invalid imput data.", errors: err.message })

        } else if (err instanceof NotPossibleUpdateUserError){
            console.log(err)
            return reply.status(500).send({ message: "Internal server error"})
        } else {
            console.log(err)
            return reply.status(500).send({ message: "Internal server error."})
        }
    }
}