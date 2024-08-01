import request from "supertest"
import { app } from "@/app";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

describe("Register User (e2e)", () => {
    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

    it('should be able to register a mentor', async () => {
        const response = await request(app.server)
        .post('/register/user')
        .send({
            name: "Jonh Doe",
            email: "jonhdoe1@example.com",
            password: "123456",
            role: "MENTOR",
            bio: "Mentor with experience in NodeJS and JavaScript",
            skills: ["NodeJS", "JavaScript"]
        })

        expect(response.statusCode).toEqual(201)
        expect(response.body.user).toEqual(expect.objectContaining({
            id: 1,
            name: "Jonh Doe",
            email: "jonhdoe1@example.com",
            role: "MENTOR"
        }))
    })

    it('should be able to register a mentee', async () => {
        const response = await request(app.server)
        .post('/register/user')
        .send({
            name: "Jonh Doe",
            email: "jonhdoementee@example.com",
            password: "123456",
            role: "MENTEE",
            bio: "",
            skills: []
        })
        
        expect(response.statusCode).toEqual(201)
        expect(response.body.user).toEqual(expect.objectContaining({
            id: 2,
            name: "Jonh Doe",
            email: "jonhdoementee@example.com",
            role: "MENTEE"
        }))
    })
})