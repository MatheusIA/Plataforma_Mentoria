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
            createdAt: new Date(),
            updatedAt: new Date()
        }

        this.items.push(mentorship)

        return mentorship
    }

    async findById(mentorshipId: number) {
        const mentorship = this.items.find((item) => item.id === mentorshipId)

        if(!mentorship){
            return null
        }

        return mentorship
    }
    
}