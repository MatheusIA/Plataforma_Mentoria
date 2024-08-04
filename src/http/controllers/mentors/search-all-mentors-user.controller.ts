import { makeSearchAllMentorsUseCase } from "@/domain/factories/mentor/make-search-all-mentors-use-case";
import { NotFoundUsersError } from "@/domain/use-cases/_errors/users/not-found-users-error";
import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

export async function searchAllMentorsUser(request: FastifyRequest, reply: FastifyReply){
    const searchAllMentorsUser= z.object({
        page: z.coerce.number().min(1).default(1)
    })

    const { page } = searchAllMentorsUser.parse(request.query)

    try {

        const searchAllMentorsUserUseCase = makeSearchAllMentorsUseCase()

        const { mentors } = await searchAllMentorsUserUseCase.execute({
            page
        })

        return reply.status(200).send({
            mentors
        })

    } catch (err) {
        if(err instanceof NotFoundUsersError){
            return reply.status(404).send({message: err.message})

        } else if (err instanceof z.ZodError){
            return reply.status(400).send({message: "Invalid imput data.", errros: err.message})

        } else {
            return reply.status(500).send({ message: "Internal Server Error"})
        }
    }
}