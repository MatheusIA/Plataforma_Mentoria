import { makeSearchAllMentorsUseCase } from "@/domain/factories/mentor/make-search-all-mentors-use-case";
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

    }
}