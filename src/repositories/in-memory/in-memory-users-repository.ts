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

    async update(data: User) {
        const userIndex = this.items.findIndex((item) => item.id === data.id);

            if(userIndex >= 0) {
                this.items[userIndex].name = data.name,
                this.items[userIndex].email = data.email,
                this.items[userIndex].password = data.password
            }

        return data
    }
        
    async findByEmail(email: string) {
        const user = this.items.find(item => item.email === email)

        if(!user) {
            return null
        }

        return user
    }

    async findById(userId: number) {
        const user = this.items.find(item => item.id === userId)

        if(!user){
            return null
        }

        return user
    }

    async searchAllUsers(page: number) {
        return this.items.slice((page - 1) * 20, page * 20)
    }
}