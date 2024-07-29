import { Prisma, Mentee } from "@prisma/client";
import { MenteesRepository } from "../mentee-repository";

export class InMemoryMenteeRepository implements MenteesRepository {
    public items: Mentee[] = []

    async create(data: Prisma.MenteeCreateInput) {
        const newId = this.items.length + 1

        const mentee = {
            id: newId,
            userId: data.user.connect?.id ? data.user.connect?.id : 1
        }

        this.items.push(mentee)

        return mentee
    }
    
}