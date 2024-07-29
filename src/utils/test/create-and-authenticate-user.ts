import request from "supertest"
import { FastifyInstance } from "fastify";

export async function createAndAuthenticateUser(app: FastifyInstance){
    await request(app.server)
    .post('/register/user')
        .send({
            name: "Jonh Doe",
            email: "jonhdoe@example.com",
            password: "123456",
            role: "MENTOR",
            bio: "Mentor with experience in NodeJS and JavaScript",
            skills: ["NodeJS", "JavaScript"]
        })

    const authResponse = await request(app.server)
    .post('/authenticate/sessions')
        .send({
            email: "jonhdoe@example.com",
            password: "123456"
        })
    
    const { token } = authResponse.body

    return {
        token
    }
}