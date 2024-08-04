import { Prisma, Mentee, User, Role } from "@prisma/client";
import { MenteesRepository } from "../mentee-repository";

export class InMemoryMenteeRepository implements MenteesRepository {
    public items: (Mentee & { user: User})[] = []

    async create(data: Prisma.MenteeCreateInput) {
        const newId = this.items.length + 1;

        const user = {
            id: newId,
            name: `Jonh Doe ${newId}`,
            email: `jonhDoe${newId}@example.com`,
            password: "123456",
            role: Role.MENTEE,
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

    async update(userId: number, data: Prisma.MenteeUpdateInput) {
        const menteeIndex = this.items.findIndex((item) => item.userId === userId)

        if(menteeIndex >= 0) {
            const mentee = this.items[menteeIndex];

            const updateUser = {
                ...mentee.user,
                ...data,
                updateAt: new Date()
            }
            
            this.items[menteeIndex] = {
                ...mentee,
                user: updateUser
            }

            return this.items[menteeIndex]
        }

        return null
    }

    async findMenteeById(menteeId: number) {
        const mentee = this.items.find(item => item.id === menteeId)

        if(!mentee){
            return null
        }

        return mentee
    }

    async findMenteeByUserId(userId: number) {
        const mentee = this.items.find(item => item.id === userId) 
        
        if(!mentee){
            return null
        }

        return mentee

    }


    async searchAllMentee(page: number) {
        return this.items.slice((page - 1) * 20, page * 20)
    }

    
    
}