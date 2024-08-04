import { Prisma, User } from "@prisma/client";

export interface UsersRepository {
    create(data: Prisma.UserCreateInput): Promise<User>
    update(data: User): Promise<User>
    findByEmail(email: string): Promise<User | null>
    findById(userId: number): Promise<User | null>
    searchAllUsers(page: number): Promise<User[] | null>
}