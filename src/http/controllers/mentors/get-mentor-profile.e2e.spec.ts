import request from "supertest"
import { app } from "@/app";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

describe("Get mentor profile (e2e)", () => {
    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

    it("should be able to get mentor profile", async () => {
        const { token } = await createAndAuthenticateUser(app)

        const user2 = await request(app.server)
        .post('/register/user')
        .send({
            name: "Jonh Doe 2",
            email: "jonhdoementor1@example.com",
            password: "123456",
            role: "MENTOR",
            bio: "Mentoring in JavaScript, NodeJS and React",
            skills: ["JavaScript", "NodeJS", "React"],
        })

        const user3 = await request(app.server)
        .post('/register/user')
        .send({
            name: "Jonh Doe 3",
            email: "jonhdoementor2@example.com",
            password: "123456",
            role: "MENTOR",
            bio: "Mentoring in C#, Angular and React",
            skills: ["C#", "Angular", "React"],
        })

        const response = await request(app.server)
        .get('/mentor/profile/')
        .query({ userId: user3.body.user.id})
        .set("Authorization", `Bearer ${token}`)
        
        expect(response.status).toBe(200)
    })
})