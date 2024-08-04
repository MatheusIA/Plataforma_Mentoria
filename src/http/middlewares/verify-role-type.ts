import { User } from "@prisma/client";
import { FastifyReply, FastifyRequest } from "fastify";

export function verifyRoleType(roleTypeVerify: 'MENTOR' | 'MENTEE') {
    return async (request: FastifyRequest, reply: FastifyReply) => {
        const { role } = request.user
        console.log("Role: ", role)
        
        if( role !== roleTypeVerify) {
            return reply.status(401).send({ message: 'Unauthorized'})
        }
    }
}