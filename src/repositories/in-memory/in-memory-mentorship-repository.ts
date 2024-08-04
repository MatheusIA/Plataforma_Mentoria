import { Mentorship, Prisma } from "@prisma/client";
import { MentorshipRepository } from "../mentorship-repository";

export class InMemoryMentorshipRepository implements MentorshipRepository {
    public items: Mentorship[] = []

    async create(data: Prisma.MentorshipCreateInput) {
        const newId = this.items.length + 1

        const mentorship = {
            id: newId,
            mentorId: data.mentor.connect?.id ? data.mentor.connect.id : 1,
            menteeId: data.mentee.connect?.id ? data.mentee.connect.id : 1,
            topic: data.topic,
            date: new Date(data.date),
            googleEventId: data.googleEventId ? data.googleEventId : '',
            createdAt: new Date(),
            updatedAt: new Date()
        }

        this.items.push(mentorship)

        return mentorship
    }

    async update(id: number, data: Prisma.MentorshipUpdateInput) {
        const mentorshipIndex = this.items.findIndex((item) => item.id === id)
        
        if(!mentorshipIndex) {
            return null
        }

        const updatedMentorship = {
            ...this.items[mentorshipIndex],
            ...data,
            mentorId: data.mentor?.connect?.id || this.items[mentorshipIndex].mentorId,
            menteeId: data.mentee?.connect?.id || this.items[mentorshipIndex].menteeId,
            topic: typeof data.topic === 'string' ? data.topic : this.items[mentorshipIndex].topic,
            date: data.date instanceof Date ? data.date : this.items[mentorshipIndex].date,
            googleEventId: typeof data.googleEventId === 'string' ? data.googleEventId : this.items[mentorshipIndex].googleEventId,
            createdAt: this.items[mentorshipIndex].createdAt,  // mantendo o valor original
            updatedAt: new Date(),
        }

        this.items[mentorshipIndex] = updatedMentorship as Mentorship

        return updatedMentorship
    }

    async findById(mentorshipId: number) {
        const mentorship = this.items.find((item) => item.id === mentorshipId)

        if(!mentorship){
            return null
        }

        return mentorship
    }

    async findMentorshipMentorId(mentorId: number) {
        const mentorship = this.items.filter((item) => item.mentorId === mentorId)

        if(mentorship.length < 0){
            return null
        }

        return mentorship
    }

    async findMentorshipMenteeId(menteeId: number) {
        const mentorship = this.items.filter((item) => item.menteeId === menteeId)

        if(mentorship.length < 0) {
            return null
        }

        return mentorship
    }

    getPrismaTransaction(): Promise<Prisma.TransactionClient> {
        throw new Error("Method not implemented.");
    }
    
}