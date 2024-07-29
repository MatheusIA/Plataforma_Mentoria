import { Prisma, User } from "@prisma/client";
import { UsersRepository } from "../users-repository";

export class InMemoryUsersRepository implements UsersRepository {
    public items: User[] = []

    async create(data: Prisma.UserCreateInput) {
        const newId = this.items.length + 1

        const user = {
            id: newId,
            name: data.name,
            email: data.email,
            password: data.password,
            role: data.role,
            createdAt: new Date(),
            updatedAt: new Date()
        }

        this.items.push(user)

        return user
    }
    
    async findByEmail(email: string) {
        const user = this.items.find(item => item.email === email)

        if(!user) {
            return null
        }

        return user
    }
}