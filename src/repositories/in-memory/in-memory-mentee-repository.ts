import { Prisma, Mentee, User, Role } from "@prisma/client";
import { MenteesRepository } from "../mentee-repository";

export class InMemoryMenteeRepository implements MenteesRepository {
    public items: (Mentee & { user: User})[] = []
    private userIdCounter = 1;

    async create(data: Prisma.MenteeCreateInput) {
        const user = {
            id: this.userIdCounter++,
            name: "Jonh Doe",
            email: "jonhDoe@example.com",
            password: "123456",
            role: Role.MENTOR,
            createdAt: new Date(),
            updatedAt: new Date(),
          };

        const mentee = {
            id: this.items.length + 1,
            userId: user.id,
            user
        }

        this.items.push(mentee)

        return mentee
    }

    async findMenteeById(menteeId: number) {
        const mentee = this.items.find(item => item.id === menteeId)

        if(!mentee){
            return null
        }

        return mentee
    }
    
}