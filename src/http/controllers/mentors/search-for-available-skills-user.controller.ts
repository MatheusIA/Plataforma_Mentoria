import { makeSearchForAvailableSkillsUseCase } from "@/domain/factories/mentor/make-search-for-available-skills-use-case";
import { NotFoundAvailableSkillsError } from "@/domain/use-cases/_errors/users/not-found-available-skills-error";
import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

export async function searchForAvailableSkills(request: FastifyRequest, reply: FastifyReply) {
    try {
        const searchForAvailableSkillsUseCase = makeSearchForAvailableSkillsUseCase()

        const { mentors } = await searchForAvailableSkillsUseCase.execute()

        return reply.status(200).send({ 
            mentors
        })

    } catch (err) {
        if(err instanceof NotFoundAvailableSkillsError){
            return reply.status(409).send({ message: err.message})

        } else if (err instanceof z.ZodError) {
            return reply.status(400).send({ message: 'Invalid input data', errors: err.message})
        } else {
            console.log(err)
            return reply.status(500).send({ message: 'Internal Server Error'})
        }
    } 
}