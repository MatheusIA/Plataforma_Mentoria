import { makeSearchAllMenteessUseCase } from "@/domain/factories/mentee/make-search-all-mentees-use-case";
import { NotFoundMenteeError } from "@/domain/use-cases/_errors/mentee/not-found-mentee-error";
import { FastifyReply, FastifyRequest } from "fastify";
import z, { number } from "zod";

export async function searchAllMenteesUser(request: FastifyRequest, reply: FastifyReply){
    const searchAllMenteeSchema = z.object({
        page: z.coerce.number().min(1).default(1)
    })

    const { page } = searchAllMenteeSchema.parse(request.query)

    try {

        const searchAllMenteeUseCase = makeSearchAllMenteessUseCase()

        const { mentees } = await searchAllMenteeUseCase.execute({
            page
        })

        return reply.status(200).send({
            mentees
        })

    } catch(err){
        if(err instanceof NotFoundMenteeError) {
            return reply.status(404).send({ message: err.message})

        } else if(err instanceof z.ZodError) {
            return reply.status(400).send({ message: "Invalid imput data.", errors: err.message})
        
        } else {
            console.log(err)
            return reply.send(500).send({ message: "Internal Server Error."})
        }
    }


}