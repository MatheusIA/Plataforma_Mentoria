import { MentorshipRepository } from "@/repositories/mentorship-repository";
import { Mentorship } from "@prisma/client";
import { google } from "googleapis";
import { oAuth2Client } from "googleClient";
import { MentorsRepository } from "@/repositories/mentor-repository";
import { MenteesRepository } from "@/repositories/mentee-repository";
import { NotFoundMentorError } from "../_errors/mentors/not-found-mentor-error";
import { NotFoundMenteeError } from "../_errors/mentee/not-found-mentee-error";
import { toZonedTime } from 'date-fns-tz';
import { checkAvailability } from "@/domain/googleAPI/google-calendar";
import { AvailableTimeError } from "../_errors/mentorship/available-time-error";

interface RegisterMentorshipRequest {
    mentorId: number
    menteeId: number
    topic: string
    date: string
    dateGoogle: Date
} 

interface RegisterMentorshipResponse {
    mentorship: Mentorship
}

export class RegisterMentorshipUseCase {
    constructor(
        private mentorShipRepository: MentorshipRepository,
        private mentorsRepository: MentorsRepository,
        private menteeRepository: MenteesRepository
    ){}

    async execute({
        mentorId,
        menteeId,
        topic,
        date,
        dateGoogle
    }: RegisterMentorshipRequest): Promise<RegisterMentorshipResponse> {
        const mentor = await this.mentorsRepository.findMentorById(mentorId)
        
        if(!mentor){
            throw new NotFoundMentorError()
        } 

        const mentee = await this.menteeRepository.findMenteeById(menteeId)

        if(!mentee){
            throw new NotFoundMenteeError()
        }

        const utcStartDateTime = toZonedTime(dateGoogle, 'America/Sao_Paulo');
        const utcEndDateTime = new Date(utcStartDateTime.getTime() + 60 * 60 * 1000)

        const isAvailable = await checkAvailability(utcStartDateTime, utcEndDateTime)

        if(!isAvailable){
            throw new AvailableTimeError()
        }

        const calendar = google.calendar({
            version: 'v3',
            auth: oAuth2Client
        })

        const event = {
            summary: `Mentoria: ${topic}`,
            start: { dateTime: utcStartDateTime.toISOString()},
            end: { dateTime: utcEndDateTime.toISOString()},
            attendees: [
                { email: mentor.user.email},
                { email: mentee.user.email}
            ]
        }

        try {
            const { data } = await calendar.events.insert({
                calendarId: 'primary',
                requestBody: event
            });

            console.log("Data: ", data);

            } catch (error) {
                console.error('Error creating event:', error);
            }

        console.log("Date Caso de Uso: ", date)
        const mentorship = await this.mentorShipRepository.create({
            mentor: { connect: {id: mentorId}},
            mentee: { connect: {id: mentee.id}},
            topic,
            date
        })

        return {
            mentorship
        }
    }
}