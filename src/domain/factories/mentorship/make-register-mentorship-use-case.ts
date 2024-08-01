import { RegisterMentorshipUseCase } from "@/domain/use-cases/mentorship/register-mentorship";
import { PrismaMenteeRepository } from "@/repositories/prisma/prisma-mentee-repository";
import { PrismaMentorRepository } from "@/repositories/prisma/prisma-mentor-repository";
import { PrismaMentorShipRepository } from "@/repositories/prisma/prisma-mentorship-repository";
import { Prisma } from "@prisma/client";

export function makeRegisterMentorShipUseCase(){
    const mentorShipRepository = new PrismaMentorShipRepository()
    const mentorsRepository = new PrismaMentorRepository()
    const menteesRepository = new PrismaMenteeRepository()
    
    const useCase = new RegisterMentorshipUseCase(
        mentorShipRepository,
        mentorsRepository,
        menteesRepository
    )

    return useCase

}