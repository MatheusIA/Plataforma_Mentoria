import { Prisma, User } from "@prisma/client";
import { UsersRepository } from "../users-repository";
import { prisma } from "@/lib/prisma";

export class PrismaUsersRepository implements UsersRepository {
    async create(data: Prisma.UserCreateInput) {
        const user = await prisma.user.create({
            data
        })

        return user
    }

    async findByEmail(email: string) {
        const user = await prisma.user.findUnique({
            where: {
                email
            }
        })

        return user
    }

    async findById(userId: number){
        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        })

        if(!user){
            return null
        }

        return user
    }

    async update(data: User) {
        const user = await prisma.user.update({
            where: {
                id: data.id
            },
            data
        })

        return user
    }
    
    async searchAllUsers(page: number): Promise<User[] | null> {
        throw new Error("Method not implemented.");
    }
    
}