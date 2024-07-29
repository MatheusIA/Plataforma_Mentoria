import request from "supertest"
import { app } from "@/app";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";

describe("Search for available skills (e2e)", () => {
    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

    it("should return unique skills from mentors", async () => {
        const { token } = await createAndAuthenticateUser(app)
        
        await request(app.server)
        .post('/register/user')
        .send({
            name: "Jonh Doe 2",
            email: "jonhdoe2@example.com",
            password: "123456",
            role: "MENTOR",
            bio: "Mentor with experience in NodeJS and JavaScript",
            skills: ["C#", ".NET"]
        })

        await request(app.server)
        .post('/register/user')
        .send({
            name: "Jonh Doe 3",
            email: "jonhdoe3@example.com",
            password: "123456",
            role: "MENTOR",
            bio: "Mentor with experience in NodeJS, TypeScript and JavaScript",
            skills: ["NodeJS","TypeScript", "JavaScript"]
        })

        const response = await request(app.server)
        .get('/search/available/skills')
        .set("Authorization", `Bearer ${token}`)

        expect(response.statusCode).toEqual(200)
        expect(response.body.mentors).toHaveLength(5)
    })
})