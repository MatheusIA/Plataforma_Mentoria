import { MentorsRepository } from "@/repositories/mentor-repository"
import { MentorshipRepository } from "@/repositories/mentorship-repository"
import { NotFoundMentorshipError } from "../_errors/mentorship/not-found-mentorship-error"
import { toZonedTime } from "date-fns-tz"
import { InvalidDateError } from "../_errors/mentorship/invalid-date-error"
import { google } from "googleapis"
import { oAuth2Client } from "googleClient"
import { Mentorship, PrismaClient } from "@prisma/client"

interface UpdateMentorshipRequest {
    id: number,
    mentorId: number,
    menteeId: number,
    topic: string,
    date: string
    dateGoogle: Date,
    googleEventId: string
}

interface UpdateMentorshipResponse {
    mentorship: Mentorship
}

export class UpdateMentorshipUseCase {
    constructor(
        private mentorshipRepository: MentorshipRepository,
        private prisma: PrismaClient
    ){}

    async execute({
        id,
        mentorId,
        menteeId,
        topic,
        date,
        dateGoogle,
        googleEventId
    }: UpdateMentorshipRequest): Promise<UpdateMentorshipResponse> {
        const mentorshhip = await this.mentorshipRepository.findById(id)

        if(!mentorshhip){
            throw new NotFoundMentorshipError()
        }

        if(date) {
            const now = new Date()
            const utcDate = toZonedTime(date, 'America/Sao_Paulo');

            if(utcDate < now) {
                throw new InvalidDateError()
            }
        }

        const transactionResult = await this.prisma.$transaction(async (transactionPrisma) => {
            const updatedMentorship = await this.mentorshipRepository.update(id, {
                mentor: { connect: { id: mentorId }},
                mentee: { connect: { id: menteeId }},
                topic,
                date
            }, transactionPrisma);

            if (googleEventId) {
                const calendar = google.calendar({
                    version: 'v3',
                    auth: oAuth2Client
                });

                const utcStartDateTime = toZonedTime(dateGoogle, 'America/Sao_Paulo');
                const utcEndDateTime = new Date(utcStartDateTime.getTime() + 60 * 60 * 1000);

                const event = {
                    summary: `Mentoria: ${topic}`,
                    start: { dateTime: utcStartDateTime.toISOString() },
                    end: { dateTime: utcEndDateTime.toISOString() }
                };

                await calendar.events.patch({
                    calendarId: 'primary',
                    eventId: googleEventId,
                    requestBody: event
                });
            }

            return updatedMentorship;
        });

        if (!transactionResult) {
            throw new Error("Erro ao atualizar a mentoria.");
        }


        return {
            mentorship: transactionResult
        }
    }
}