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
import { InvalidDateError } from "../_errors/mentorship/invalid-date-error";

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

        const now = new Date();
        const utcStartDateTime = toZonedTime(dateGoogle, 'America/Sao_Paulo');
        const utcEndDateTime = new Date(utcStartDateTime.getTime() + 60 * 60 * 1000)

        if (utcStartDateTime < now) {
            throw new InvalidDateError();
        }
        
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

        let eventId: string | undefined | null;

        try {
            const { data } = await calendar.events.insert({
                calendarId: 'primary',
                requestBody: event
            });

            eventId = data.id

        } catch (error) {
            console.error('Error creating event:', error);
        }

         if (!eventId) {
            throw new Error('Failed to retrieve Google Calendar event ID');
        }
            
        const mentorship = await this.mentorShipRepository.create({
            mentor: { connect: {id: mentorId}},
            mentee: { connect: {id: mentee.id}},
            topic,
            date,
            googleEventId: eventId
        })

        console.log("Register Mentorship UseCase: ", mentorship)
        return {
            mentorship
        }
    }
}