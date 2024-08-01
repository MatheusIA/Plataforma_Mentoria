import { makeRegisterMentorShipUseCase } from "@/domain/factories/mentorship/make-register-mentorship-use-case";
import { error } from "console";
import { formatInTimeZone } from "date-fns-tz";
import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

export async  function registerMentorship(request: FastifyRequest, reply: FastifyReply) {
    const registerMentorshipSchema = z.object({
        mentorId: z.number(),
        menteeId: z.number(),
        topic: z.string(),
        date: z.string(),
        dateGoogle: z.string().refine(value => !isNaN(Date.parse(value)), {
            message: "Invalid date format. Please use ISO 8601 format."
        }),
    })

    try {
        const { mentorId, menteeId, topic, date, dateGoogle:googleString  } = registerMentorshipSchema.parse(request.body)
        
        const timeZone = 'America/Sao_Paulo';
        const formattedDate2 = formatInTimeZone(date, timeZone,"yyyy-MM-dd'T'HH:mm:ssXXX");
        const dateGoogle = new Date(googleString)

        console.log("Date HTPP: ", formattedDate2)
        const registerMentorshipUseCase = makeRegisterMentorShipUseCase()

        const { mentorship } = await registerMentorshipUseCase.execute({
            mentorId,
            menteeId,
            topic,
            date: formattedDate2,
            dateGoogle
        })

        const response = {
            id: mentorship.id,
            mentorId: mentorship.mentorId,
            menteeId: mentorship.menteeId,
            topic: mentorship.topic,
            date: mentorship.date, 
            createdAt: mentorship.createdAt,
            updatedAt: mentorship.updatedAt
        };

        return reply.status(201).send({
            mentorship: response
        })

    } catch (err) {
        if (err instanceof z.ZodError) {
            return reply.status(400).send({ message: "Invalid input data", error: err.message });
        }
        console.error('Error in registerMentorship:', err);
        return reply.status(500).send({ message: 'Internal server error.' });
    }
}